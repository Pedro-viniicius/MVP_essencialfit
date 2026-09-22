import { and, eq, isNull } from "drizzle-orm";
import { DatabaseError } from "pg";
import { db } from "@/lib/db";
import { consentimentos, leads, vendedores } from "@/lib/db/schema";
import { FINALIDADES } from "@/lib/domain";
import { registrarAuditoria } from "@/lib/admin/audit";
import { gerarCupom } from "@/lib/coupon";
import { log } from "@/lib/logger";
import { USAR_MOCKS } from "@/lib/mock/config";
import { verificarLimite } from "@/lib/security/rate-limit";
import type { LeadParsed } from "@/lib/validation/lead";

type Evento = { id: string; slug: string; politicaVersao: string };

export type ResultadoCriacao =
  | { status: "criado"; leadId: string; cupom: string }
  | { status: "repetido"; leadId: string; cupom: string }
  | { status: "duplicado"; cupom: string | null }
  | { status: "limitado" };

const UNIQUE_VIOLATION = "23505";
const TENTATIVAS_CUPOM = 3;

/**
 * Persists a lead and its three consent rows in one transaction.
 *
 * - Same chave_idempotencia again → returns the original (client retries).
 * - Same phone for the same event → "duplicado", with the existing coupon so
 *   the person can still take part; tapping two cards is normal behaviour.
 * - Coupon collision → new suffix, retried a few times.
 * - Unknown/inactive seller code → vendedor_id NULL + auditoria row, so a
 *   mis-written card is visible on event day instead of silently unattributed.
 * - Too many leads from one IP hash → "limitado", nothing written. Checked
 *   after the idempotency lookup so a retry of a saved lead is never blocked.
 */
export async function criarLead(
  evento: Evento,
  dados: LeadParsed,
  contexto: { ipHash: string | null; userAgent: string | null },
): Promise<ResultadoCriacao> {
  // Modo de teste: as mesmas regras (idempotência, telefone repetido, ponto
  // desconhecido), gravadas em memória em vez de no Postgres. Ver MOCKS.md.
  if (USAR_MOCKS) return (await import("@/lib/mock/loja")).criarLead(evento, dados, contexto);

  const repetido = await buscarPorChave(dados.chaveIdempotencia);
  if (repetido) return { status: "repetido", ...repetido };

  const limite = await verificarLimite(contexto.ipHash);
  if (limite) {
    log.warn("limite de cadastros por ip atingido", { evento: evento.slug, origem: dados.origem, ...limite });
    return { status: "limitado" };
  }

  const vendedor = dados.vendedorCodigo ? await buscarVendedor(dados.vendedorCodigo) : null;

  let cupom = dados.cupom;
  for (let tentativa = 1; tentativa <= TENTATIVAS_CUPOM; tentativa++) {
    try {
      return await db.transaction(async (tx) => {
        const [lead] = await tx
          .insert(leads)
          .values({
            eventoId: evento.id,
            vendedorId: vendedor?.id ?? null,
            origem: dados.origem,
            nome: dados.nome,
            telefone: dados.telefone,
            email: dados.email,
            modeloInteresse: dados.modeloInteresse,
            prazoCompra: dados.prazoCompra,
            cupom,
            ipHash: contexto.ipHash,
            userAgent: contexto.userAgent,
            chaveIdempotencia: dados.chaveIdempotencia,
          })
          .returning({ id: leads.id, cupom: leads.cupom });

        await tx.insert(consentimentos).values(
          FINALIDADES.map((finalidade) => ({
            leadId: lead.id,
            finalidade,
            concedido: dados.consentimentos[finalidade],
            textoVersao: evento.politicaVersao,
          })),
        );

        if (dados.vendedorCodigo && !vendedor) {
          await registrarAuditoria(tx, {
            acao: "vendedor_desconhecido",
            entidade: "lead",
            entidadeId: lead.id,
            metadados: { codigo: dados.vendedorCodigo, evento: evento.slug, origem: dados.origem },
          });
        }

        return { status: "criado" as const, leadId: lead.id, cupom: lead.cupom };
      });
    } catch (err) {
      const violacao = unique(err);
      if (violacao === "leads_evento_telefone_uk") {
        const existente = await buscarPorTelefone(evento.id, dados.telefone);
        return { status: "duplicado", cupom: existente?.cupom ?? null };
      }
      if (violacao === "leads_chave_idempotencia_unique") {
        // Two retries of the same submission raced; the first one won.
        const original = await buscarPorChave(dados.chaveIdempotencia);
        if (original) return { status: "repetido", ...original };
      }
      if (violacao === "leads_cupom_unique" && tentativa < TENTATIVAS_CUPOM) {
        cupom = gerarCupom(evento.slug);
        log.warn("colisão de cupom, gerando outro", { evento: evento.slug, tentativa });
        continue;
      }
      throw err;
    }
  }
  throw new Error("não foi possível gerar um cupom único");
}

function unique(err: unknown): string | null {
  const causa = err instanceof DatabaseError ? err : (err as { cause?: unknown })?.cause;
  if (causa instanceof DatabaseError && causa.code === UNIQUE_VIOLATION) {
    return causa.constraint ?? "";
  }
  return null;
}

async function buscarPorChave(chave: string) {
  const [lead] = await db
    .select({ leadId: leads.id, cupom: leads.cupom })
    .from(leads)
    .where(eq(leads.chaveIdempotencia, chave))
    .limit(1);
  return lead ?? null;
}

async function buscarPorTelefone(eventoId: string, telefone: string) {
  const [lead] = await db
    .select({ cupom: leads.cupom })
    .from(leads)
    .where(and(eq(leads.eventoId, eventoId), eq(leads.telefone, telefone), isNull(leads.anonimizadoEm)))
    .limit(1);
  return lead ?? null;
}

async function buscarVendedor(codigo: string) {
  const [vendedor] = await db
    .select({ id: vendedores.id })
    .from(vendedores)
    .where(and(eq(vendedores.codigo, codigo), eq(vendedores.ativo, true)))
    .limit(1);
  return vendedor ?? null;
}

import { and, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { USAR_MOCKS } from "@/lib/mock/config";
import { auditoria, consentimentos, eventos, leads, vendedores } from "@/lib/db/schema";
import type { Finalidade } from "@/lib/domain";
import { DEMO_SLUG } from "./constantes";
import { mascararEmail, mascararNome, mascararTelefone } from "./mascara";

/**
 * Every query here takes the demo event id resolved from DEMO_SLUG and
 * filters on it. The page never receives an event from the URL, so real
 * leads cannot reach this screen whatever the query string says.
 *
 * Com o modo de teste ligado cada função desvia para `src/lib/mock/loja.ts`,
 * que responde o mesmo formato lendo dados fictícios em memória. O SQL abaixo
 * continua sendo o caminho de produção — ver MOCKS.md.
 */
const FUSO = "America/Sao_Paulo";
export const TAMANHO_PAGINA = 20;
export const PRAZOS_ATE_3_MESES = ["Hoje", "Nos próximos 30 dias"];

/** Carregada só quando a flag está ligada; fora do modo de teste nem entra no bundle. */
const emMemoria = () => import("@/lib/mock/loja");

export async function eventoDemo() {
  if (USAR_MOCKS) return (await emMemoria()).eventoDemo();
  const [e] = await db
    .select({ id: eventos.id, nome: eventos.nome, inicio: eventos.inicio, retencaoMeses: eventos.retencaoMeses, ativo: eventos.ativo })
    .from(eventos)
    .where(eq(eventos.slug, DEMO_SLUG))
    .limit(1);
  return e ?? null;
}

export async function resumo(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).resumo(eventoId);
  const [r] = await db
    .select({
      total: count(),
      ate3Meses: sql<number>`count(*) filter (where ${leads.prazoCompra} in ('Hoje', 'Nos próximos 30 dias'))`.mapWith(Number),
      comVendedor: sql<number>`count(*) filter (where ${leads.vendedorId} is not null)`.mapWith(Number),
      vendedores: sql<number>`count(distinct ${leads.vendedorId})`.mapWith(Number),
    })
    .from(leads)
    .where(eq(leads.eventoId, eventoId));
  const [m] = await db
    .select({
      sim: sql<number>`count(*) filter (where ${consentimentos.concedido})`.mapWith(Number),
      total: count(),
    })
    .from(consentimentos)
    .innerJoin(leads, eq(leads.id, consentimentos.leadId))
    .where(and(eq(leads.eventoId, eventoId), eq(consentimentos.finalidade, "marketing")));
  return {
    total: r.total,
    ate3Meses: r.ate3Meses,
    mediaPorVendedor: r.vendedores ? r.comVendedor / r.vendedores : 0,
    taxaMarketing: m.total ? m.sim / m.total : 0,
    comMarketing: m.sim,
    semMarketing: m.total - m.sim,
  };
}

export async function porHora(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).porHora(eventoId);
  // Literal timezone: a bound parameter would make GROUP BY and SELECT differ ($1 vs $2).
  const hora = sql<number>`extract(hour from ${leads.criadoEm} at time zone ${sql.raw(`'${FUSO}'`)})`.mapWith(Number);
  return db
    .select({ hora, total: count() })
    .from(leads)
    .where(eq(leads.eventoId, eventoId))
    .groupBy(hora)
    .orderBy(hora);
}

export async function porVendedor(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).porVendedor(eventoId);
  return db
    .select({ id: vendedores.id, nome: vendedores.nome, total: count() })
    .from(leads)
    .leftJoin(vendedores, eq(vendedores.id, leads.vendedorId))
    .where(eq(leads.eventoId, eventoId))
    .groupBy(vendedores.id, vendedores.nome)
    .orderBy(desc(count()));
}

export async function porModelo(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).porModelo(eventoId);
  return db
    .select({ rotulo: leads.modeloInteresse, total: count() })
    .from(leads)
    .where(eq(leads.eventoId, eventoId))
    .groupBy(leads.modeloInteresse)
    .orderBy(desc(count()));
}

export async function porPrazo(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).porPrazo(eventoId);
  return db
    .select({ rotulo: leads.prazoCompra, total: count() })
    .from(leads)
    .where(eq(leads.eventoId, eventoId))
    .groupBy(leads.prazoCompra)
    .orderBy(desc(count()));
}

export async function porOrigem(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).porOrigem(eventoId);
  return db
    .select({ rotulo: leads.origem, total: count() })
    .from(leads)
    .where(eq(leads.eventoId, eventoId))
    .groupBy(leads.origem)
    .orderBy(desc(count()));
}

export async function revelacoesHoje() {
  if (USAR_MOCKS) return (await emMemoria()).revelacoesHoje();
  const [r] = await db
    .select({ total: count() })
    .from(auditoria)
    .where(
      and(
        eq(auditoria.acao, "dado_revelado"),
        sql`${auditoria.metadados}->>'evento' = ${DEMO_SLUG}`,
        sql`${auditoria.criadoEm} >= date_trunc('day', now() at time zone ${FUSO}) at time zone ${FUSO}`,
      ),
    );
  return r.total;
}

export type Filtros = {
  vendedor?: string; // vendedor id or "sem"
  modelo?: string;
  prazo?: string;
  consentimento?: "marketing";
  pagina: number;
};

function condicoes(eventoId: string, f: Filtros) {
  const c = [eq(leads.eventoId, eventoId)];
  if (f.vendedor === "sem") c.push(isNull(leads.vendedorId));
  else if (f.vendedor) c.push(eq(leads.vendedorId, f.vendedor));
  if (f.modelo) c.push(eq(leads.modeloInteresse, f.modelo));
  if (f.prazo) c.push(eq(leads.prazoCompra, f.prazo));
  if (f.consentimento === "marketing") c.push(consentiu("marketing"));
  return and(...c);
}

function consentiu(finalidade: Finalidade) {
  return sql`exists (select 1 from ${consentimentos} c where c.lead_id = ${leads.id} and c.finalidade = ${finalidade} and c.concedido)`;
}

export type LinhaLista = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  modelo: string | null;
  prazo: string | null;
  vendedor: string | null;
  origem: string;
  criadoEm: Date;
  consentimentos: Record<Finalidade, boolean>;
  suspeito: boolean;
};

export async function listar(eventoId: string, f: Filtros) {
  if (USAR_MOCKS) return (await emMemoria()).listar(eventoId, f);
  const onde = condicoes(eventoId, f);
  const [{ total }] = await db.select({ total: count() }).from(leads).where(onde);
  const linhas = await db
    .select({
      id: leads.id,
      nome: leads.nome,
      telefone: leads.telefone,
      email: leads.email,
      modelo: leads.modeloInteresse,
      prazo: leads.prazoCompra,
      vendedor: vendedores.nome,
      origem: leads.origem,
      criadoEm: leads.criadoEm,
    })
    .from(leads)
    .leftJoin(vendedores, eq(vendedores.id, leads.vendedorId))
    .where(onde)
    .orderBy(desc(leads.criadoEm))
    .limit(TAMANHO_PAGINA)
    .offset((f.pagina - 1) * TAMANHO_PAGINA);

  const ids = linhas.map((l) => l.id);
  const cons = ids.length
    ? await db
        .select({ leadId: consentimentos.leadId, finalidade: consentimentos.finalidade, concedido: consentimentos.concedido })
        .from(consentimentos)
        .where(inArray(consentimentos.leadId, ids))
    : [];
  const suspeitos = ids.length
    ? await db
        .select({ id: auditoria.entidadeId })
        .from(auditoria)
        .where(and(eq(auditoria.acao, "lead_suspeito"), inArray(auditoria.entidadeId, ids)))
    : [];
  const suspeitoSet = new Set(suspeitos.map((s) => s.id));

  const itens: LinhaLista[] = linhas.map((l) => {
    const c = { contato_comercial: false, promocao: false, marketing: false };
    for (const x of cons) if (x.leadId === l.id) c[x.finalidade] = x.concedido;
    return {
      ...l,
      // Masked at the source: the client never receives the full value.
      nome: mascararNome(l.nome),
      telefone: mascararTelefone(l.telefone),
      email: mascararEmail(l.email),
      consentimentos: c,
      suspeito: suspeitoSet.has(l.id),
    };
  });
  return { itens, total, paginas: Math.max(1, Math.ceil(total / TAMANHO_PAGINA)) };
}

/** Full values of one demo lead, for the "Revelar" action; caller writes the audit row. */
export async function buscarCompleto(eventoId: string, leadId: string) {
  if (USAR_MOCKS) return (await emMemoria()).buscarCompleto(eventoId, leadId);
  const [l] = await db
    .select({ id: leads.id, nome: leads.nome, telefone: leads.telefone, email: leads.email })
    .from(leads)
    .where(and(eq(leads.eventoId, eventoId), eq(leads.id, leadId)))
    .limit(1);
  return l ?? null;
}

/** Rows for the CSV. By default only people who consented to marketing. */
export async function paraExportacao(eventoId: string, incluirSemConsentimento: boolean) {
  if (USAR_MOCKS) return (await emMemoria()).paraExportacao(eventoId, incluirSemConsentimento);
  const onde = incluirSemConsentimento
    ? eq(leads.eventoId, eventoId)
    : and(eq(leads.eventoId, eventoId), consentiu("marketing"));
  return db
    .select({
      nome: leads.nome,
      telefone: leads.telefone,
      email: leads.email,
      modelo: leads.modeloInteresse,
      prazo: leads.prazoCompra,
      vendedor: vendedores.nome,
      origem: leads.origem,
      criadoEm: leads.criadoEm,
      marketing: sql<boolean>`${consentiu("marketing")}`,
      promocao: sql<boolean>`${consentiu("promocao")}`,
    })
    .from(leads)
    .leftJoin(vendedores, eq(vendedores.id, leads.vendedorId))
    .where(onde)
    .orderBy(leads.criadoEm);
}

export async function opcoesFiltro(eventoId: string) {
  if (USAR_MOCKS) return (await emMemoria()).opcoesFiltro(eventoId);
  const [vs, ms, ps] = await Promise.all([porVendedor(eventoId), porModelo(eventoId), porPrazo(eventoId)]);
  return {
    vendedores: vs.filter((v) => v.id).map((v) => ({ id: v.id!, nome: v.nome! })),
    modelos: ms.map((m) => m.rotulo).filter((x): x is string => !!x),
    prazos: ps.map((p) => p.rotulo).filter((x): x is string => !!x),
  };
}

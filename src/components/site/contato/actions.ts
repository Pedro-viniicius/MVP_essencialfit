"use server";

import { headers } from "next/headers";
import { CONTATO } from "@/lib/site/conteudo";
import { log } from "@/lib/logger";
import { USAR_MOCKS } from "@/lib/mock/config";
import { extrairIp, hashIp } from "@/lib/security/ip-hash";
import { contatoSchema, lerContato, type CampoContato, type ContatoInput } from "@/lib/validation/contato";

const POR_HORA = 3;
// Um campo invisível preenchido só por robôs; humanos nunca o veem.
const CAMPO_ISCA = "site";

export type EstadoContato =
  | { status: "inicial" }
  | { status: "enviado" }
  // `valores` echoes what was typed: React resets the form after an action.
  | { status: "erro"; valores: ContatoInput; campos?: Partial<Record<CampoContato, string>>; geral?: string };

export async function enviarSolicitacao(_anterior: EstadoContato, form: FormData): Promise<EstadoContato> {
  // Robô: fingimos sucesso e não gravamos nada.
  if (String(form.get(CAMPO_ISCA) ?? "") !== "") return { status: "enviado" };

  const valores = lerContato(form);
  const parsed = contatoSchema.safeParse(valores);
  if (!parsed.success) {
    const campos: Partial<Record<CampoContato, string>> = {};
    for (const issue of parsed.error.issues) {
      const campo = issue.path[0] as CampoContato | undefined;
      if (campo && !campos[campo]) campos[campo] = issue.message;
    }
    return { status: "erro", valores, campos };
  }

  const h = await headers();
  const ipHash = hashIp(extrairIp(h));
  const userAgent = h.get("user-agent")?.slice(0, 300) ?? null;

  // Modo de teste: o pedido fica em memória e a tela de sucesso aparece igual,
  // sem banco nenhum por trás. Ver MOCKS.md.
  if (USAR_MOCKS) {
    const memoria = await import("@/lib/mock/loja");
    await memoria.gravarSolicitacaoContato({
      ...parsed.data,
      consentimentoVersao: CONTATO.consentimentoVersao,
      ipHash,
      userAgent,
    });
    log.info("solicitação de contato recebida (modo de teste)");
    return { status: "enviado" };
  }

  try {
    // Importado aqui para que a landing renderize sem DATABASE_URL configurada.
    const [{ db }, { solicitacoesContato }, { and, count, eq, gt }] = await Promise.all([
      import("@/lib/db"),
      import("@/lib/db/schema"),
      import("drizzle-orm"),
    ]);

    if (ipHash) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(solicitacoesContato)
        .where(and(eq(solicitacoesContato.ipHash, ipHash), gt(solicitacoesContato.criadoEm, new Date(Date.now() - 60 * 60_000))));
      if (total >= POR_HORA) {
        log.warn("limite de solicitações de contato por ip atingido", { total, maximo: POR_HORA });
        return { status: "erro", valores, geral: CONTATO.erros.limite };
      }
    }

    await db.insert(solicitacoesContato).values({
      ...parsed.data,
      consentimentoVersao: CONTATO.consentimentoVersao,
      ipHash,
      userAgent,
    });
    log.info("solicitação de contato recebida");
    return { status: "enviado" };
  } catch (erro) {
    log.error("falha ao gravar solicitação de contato", { erro: String(erro) });
    return { status: "erro", valores, geral: CONTATO.erros.generico };
  }
}

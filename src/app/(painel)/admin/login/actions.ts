"use server";

import { timingSafeEqual } from "node:crypto";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auditoria } from "@/lib/db/schema";
import { registrarAuditoria } from "@/lib/admin/audit";
import { descreverProblemas, validarConfigAdmin } from "@/lib/admin/config";
import { apagarCookieSessao, criarTokenSessao, destinoSeguro, gravarCookieSessao, sessaoAtual } from "@/lib/admin/session";
import { verificarTotp } from "@/lib/admin/totp";
import { log } from "@/lib/logger";
import { USAR_MOCKS } from "@/lib/mock/config";
import { extrairIp, hashIp } from "@/lib/security/ip-hash";
import { A } from "@/lib/texts/admin";

export type EstadoLogin = { erro?: string };

// Brute-force brake, counted from the audit trail itself (no extra store):
// after this many failures in the window, every attempt is refused.
const JANELA_MIN = 15;
const MAX_FALHAS_POR_IP = 10;
const MAX_FALHAS_GLOBAL = 50;
const ATRASO_FALHA_MS = 800;

function iguais(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function falhasRecentes(ipHash: string | null): Promise<number> {
  const desde = new Date(Date.now() - JANELA_MIN * 60_000);
  if (USAR_MOCKS) return (await import("@/lib/mock/loja")).falhasDeLogin(ipHash, desde);
  const porIp = ipHash ? sql`${auditoria.metadados}->>'ipHash' = ${ipHash}` : sql`true`;
  const [{ total }] = await db
    .select({ total: count() })
    .from(auditoria)
    .where(and(eq(auditoria.acao, "login_falhou"), gt(auditoria.criadoEm, desde), porIp));
  return total;
}

export async function entrarAction(_estado: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  const senha = String(form.get("senha") ?? "");
  const codigo = String(form.get("codigo") ?? "").replace(/\s+/g, "");
  const next = destinoSeguro(String(form.get("next") ?? ""));
  const ipHash = hashIp(extrairIp(await headers()));

  // Fail closed: with anything missing the login never even compares.
  const validacao = validarConfigAdmin();
  if (!validacao.ok) {
    log.error("login do admin bloqueado: configuração incompleta", { problemas: descreverProblemas(validacao.problemas) });
    return { erro: A.login.naoConfigurado };
  }
  const { senha: senhaEsperada, segredoTotp } = validacao.config;

  const falhas = await falhasRecentes(ipHash);
  if (falhas >= (ipHash ? MAX_FALHAS_POR_IP : MAX_FALHAS_GLOBAL)) {
    await registrarAuditoria(db, { acao: "login_bloqueado", entidade: "admin", metadados: { ipHash, falhas, janelaMin: JANELA_MIN } });
    log.warn("login do admin bloqueado por excesso de tentativas", { ipHash, falhas });
    return { erro: A.login.bloqueado(JANELA_MIN) };
  }

  // Modo de teste: os segredos são marcadores, não valores reais — conferir
  // não provaria nada. Qualquer senha e qualquer código entram.
  if (USAR_MOCKS) return abrirSessao(next, ipHash);

  // Both checks always run, so timing does not tell which one failed.
  const senhaOk = iguais(senha, senhaEsperada);
  const codigoOk = verificarTotp(segredoTotp, codigo);
  if (!senhaOk || !codigoOk) {
    await new Promise((r) => setTimeout(r, ATRASO_FALHA_MS));
    await registrarAuditoria(db, { acao: "login_falhou", entidade: "admin", metadados: { ipHash } });
    log.warn("login do admin falhou", { ipHash });
    return { erro: A.login.erro };
  }

  return abrirSessao(next, ipHash);
}

/** Cria o cookie assinado, deixa a linha de auditoria e leva ao destino. */
async function abrirSessao(next: string, ipHash: string | null): Promise<never> {
  const { token, sessao } = criarTokenSessao();
  await registrarAuditoria(db, { acao: "login_ok", entidade: "admin", usuarioId: sessao.id, metadados: { ipHash } });
  await gravarCookieSessao(token);
  redirect(next);
}

/**
 * Só existe com o modo de teste ligado (`src/lib/mock/config.ts`): abre o
 * painel sem senha e sem autenticador, para conferir as telas. Com a flag
 * desligada a ação recusa e devolve o visitante ao login normal.
 */
export async function entrarComoTesteAction(form: FormData): Promise<void> {
  if (!USAR_MOCKS) redirect("/admin/login");
  await abrirSessao(destinoSeguro(String(form.get("next") ?? "")), null);
}

export async function sairAction() {
  const sessao = await sessaoAtual();
  if (sessao) await registrarAuditoria(db, { acao: "logout", entidade: "admin", usuarioId: sessao.id });
  await apagarCookieSessao();
  redirect("/admin/login");
}

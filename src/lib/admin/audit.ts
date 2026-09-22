import type { Db, Tx } from "@/lib/db";
import { auditoria } from "@/lib/db/schema";
import { USAR_MOCKS } from "@/lib/mock/config";

type Entrada = {
  acao: string;
  entidade?: string;
  entidadeId?: string;
  usuarioId?: string | null;
  metadados?: Record<string, unknown>;
};

/** Append-only audit trail; accepts a transaction so it commits with the change. */
export async function registrarAuditoria(exec: Db | Tx, entrada: Entrada) {
  // Modo de teste: a trilha existe do mesmo jeito, em memória. Sem transação
  // para participar, o `exec` não é usado.
  if (USAR_MOCKS) return (await import("@/lib/mock/loja")).registrarAuditoria(entrada);

  await exec.insert(auditoria).values({
    acao: entrada.acao,
    entidade: entrada.entidade ?? null,
    entidadeId: entrada.entidadeId ?? null,
    usuarioId: entrada.usuarioId ?? null,
    metadados: entrada.metadados ?? null,
  });
}

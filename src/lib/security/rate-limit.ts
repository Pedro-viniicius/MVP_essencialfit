import { and, count, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { USAR_MOCKS } from "@/lib/mock/config";

/**
 * Rate limit by hashed IP, counted straight from `leads` — no extra store,
 * nothing to expire, survives cold starts. Only successful inserts count, so
 * a duplicate phone or a validation error never costs the visitor a slot.
 *
 * Defaults: 5 per minute, 30 per hour. Overridable through env for event day
 * (a kiosk tablet or a carrier's CGNAT shares one IP across many visitors).
 */
const POR_MINUTO = inteiro(process.env.LIMITE_POR_MINUTO, 5);
const POR_HORA = inteiro(process.env.LIMITE_POR_HORA, 30);

export type Limite = { janela: "minuto" | "hora"; total: number; maximo: number };

/** Returns the limit that was hit, or null when the request may proceed. */
export async function verificarLimite(ipHash: string | null): Promise<Limite | null> {
  // Modo de teste: nada de freio. Quem está conferindo as telas envia o mesmo
  // formulário muitas vezes seguidas e não pode ficar trancado por uma hora.
  if (USAR_MOCKS) return null;
  // No hash (no salt configured): nothing to key on, let it through.
  if (!ipHash) return null;
  const agora = Date.now();
  const ultimaHora = await contar(ipHash, new Date(agora - 60 * 60_000));
  if (ultimaHora >= POR_HORA) return { janela: "hora", total: ultimaHora, maximo: POR_HORA };
  const ultimoMinuto = await contar(ipHash, new Date(agora - 60_000));
  if (ultimoMinuto >= POR_MINUTO) return { janela: "minuto", total: ultimoMinuto, maximo: POR_MINUTO };
  return null;
}

async function contar(ipHash: string, desde: Date): Promise<number> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(leads)
    .where(and(eq(leads.ipHash, ipHash), gt(leads.criadoEm, desde)));
  return total;
}

function inteiro(valor: string | undefined, padrao: number): number {
  const n = Number.parseInt(valor ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : padrao;
}

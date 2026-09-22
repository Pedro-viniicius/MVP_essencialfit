import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import { log } from "@/lib/logger";
import { hostDoBanco } from "./host";
import { createPool } from "./pool";
import * as schema from "./schema";

// The app talks to Neon's pooled endpoint (PgBouncer, transaction mode):
// one connection per function instance, no session-level prepared statements.
// Scripts and migrations use DATABASE_URL_UNPOOLED (see drizzle.config.ts).

const globalForDb = globalThis as unknown as { pgPool?: Pool; drizzleDb?: Conexao };

function abrir(pool: Pool) {
  return drizzle(pool, { schema });
}

type Conexao = ReturnType<typeof abrir>;

/**
 * A conexão é aberta no primeiro uso, não no import.
 *
 * Era um `throw` no topo do módulo: sem DATABASE_URL, qualquer página que
 * importasse algo desta pasta quebrava antes de renderizar. Adiando para a
 * primeira consulta, o modo de teste (`src/lib/mock/config.ts`) roda sem
 * variável nenhuma — e quem realmente consulta o banco continua recebendo o
 * mesmo erro, só que na hora da consulta.
 */
function conectar(): Conexao {
  if (globalForDb.drizzleDb) return globalForDb.drizzleDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não definida");
  }

  const pool = globalForDb.pgPool ?? createPool(connectionString);

  // Logged once per instance so "which database is the live site on?" can be
  // answered from the Vercel logs (hostname only, never credentials).
  if (!globalForDb.pgPool) {
    log.info("banco de dados", { host: hostDoBanco(connectionString) });
  }

  const conexao = abrir(pool);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.pgPool = pool;
    globalForDb.drizzleDb = conexao;
  }
  return conexao;
}

/** Mesma API do drizzle; só a abertura da conexão é que ficou preguiçosa. */
export const db: Conexao = new Proxy({} as Conexao, {
  get(_alvo, prop) {
    const real = conectar();
    const valor = Reflect.get(real as object, prop, real);
    return typeof valor === "function" ? valor.bind(real) : valor;
  },
});

export type Db = Conexao;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export { schema };

import { aplicarAmbienteDeTeste, USAR_MOCKS } from "@/lib/mock/config";
import { log } from "@/lib/logger";

/**
 * Roda uma vez, antes da primeira rota. Serve para o modo de teste preencher
 * o que falta em process.env mesmo antes de qualquer página importar a
 * configuração, e para o aviso aparecer logo no `pnpm dev`.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  aplicarAmbienteDeTeste();
  if (USAR_MOCKS) {
    log.info("modo de teste ligado: dados fictícios, sem banco e sem .env", {
      desligar: "USAR_MOCKS=false ou PADRAO = false em src/lib/mock/config.ts",
    });
  }
}

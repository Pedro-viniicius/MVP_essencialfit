/**
 * Interruptor único do modo de teste.
 *
 * Ligado, o projeto sobe sem .env e sem depender de serviço externo nenhum:
 * banco, sessão do admin e gravações passam a ser atendidos em memória por
 * `src/lib/mock/loja.ts`. O código de integração real continua exatamente
 * onde estava — só é desviado enquanto esta flag estiver ligada.
 *
 * Para voltar aos serviços reais: troque PADRAO para false (ou exporte
 * USAR_MOCKS=false) e preencha o .env.local. Ver MOCKS.md.
 */

/** ↓↓↓ É AQUI QUE SE LIGA E DESLIGA O MODO DE TESTE ↓↓↓ */
const PADRAO = true;

function ligado(valor: string): boolean {
  return valor !== "false" && valor !== "0" && valor !== "off";
}

const escolha = process.env.USAR_MOCKS;

/**
 * Vale em `dev`, `build` e `start` — o padrão acima decide sozinho, sem .env.
 * A única exceção é um deploy na Vercel: lá os mocks ficam desligados mesmo com
 * PADRAO = true, para um deploy distraído nunca abrir o /admin sem senha. Para
 * qualquer outro ambiente, USAR_MOCKS=false no servidor manda mais que o padrão.
 */
export const USAR_MOCKS =
  escolha !== undefined && escolha !== "" ? ligado(escolha) : PADRAO && !process.env.VERCEL;

/**
 * O mínimo que o app exige para subir. Não são segredos: são marcadores de
 * desenvolvimento, usados só com o modo de teste ligado. Com a flag desligada
 * nada aqui é lido e tudo volta a vir do .env.
 */
const PADROES: Record<string, string> = {
  IP_HASH_SALT: "modo-de-teste-sem-segredo-0000000000000000000000",
  SESSION_SECRET: "modo-de-teste-sem-segredo-0000000000000000000000",
  ADMIN_PASSWORD: "modo-de-teste-sem-senha-real",
  ADMIN_TOTP_SECRET: "MODODETESTE234567MODODETESTE",
};

let aplicado = false;

/**
 * Preenche o que falta em process.env. Nunca sobrescreve o que já existe, então
 * um .env.local parcial continua mandando naquilo que ele definiu.
 */
export function aplicarAmbienteDeTeste(): void {
  if (!USAR_MOCKS || aplicado) return;
  aplicado = true;
  for (const [chave, valor] of Object.entries(PADROES)) {
    if (!process.env[chave]) process.env[chave] = valor;
  }
}

aplicarAmbienteDeTeste();

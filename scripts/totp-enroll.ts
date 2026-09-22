/**
 * Creates the TOTP key for the admin login and shows how to enrol it.
 *
 *   pnpm totp:enroll              # only when ADMIN_TOTP_SECRET is not set yet
 *   pnpm totp:enroll -- --rotate  # deliberately replace an existing key
 *
 * Never writes to any file: the operator copies the key to .env and to
 * Vercel by hand, so nothing rotates by accident. Reads ENV_FILE (.env by
 * default) only to find out whether a key already exists.
 */
import "./lib/env";
import qrcode from "qrcode-terminal";
import { gerarSegredoBase32, uriOtpauth } from "../src/lib/admin/totp";

const rotate = process.argv.includes("--rotate");
const existente = (process.env.ADMIN_TOTP_SECRET ?? "").trim();

console.log("\nConfiguração TOTP — Essencial Fit\n");

if (existente && !rotate) {
  console.log("ADMIN_TOTP_SECRET já está configurado neste ambiente (" + (process.env.ENV_FILE ?? ".env") + ").\n");
  console.log("Nenhuma chave foi alterada.\n");
  console.log("Para cadastrar um novo celular com a MESMA chave, digite o valor atual de");
  console.log("ADMIN_TOTP_SECRET no aplicativo autenticador (veja docs/admin-acesso.md).\n");
  console.log("Para gerar uma nova chave conscientemente, execute:\n");
  console.log("  pnpm totp:enroll -- --rotate\n");
  process.exit(0);
}

if (rotate && existente) {
  console.log("ATENÇÃO: já existe ADMIN_TOTP_SECRET configurado. Uma nova chave será gerada.");
  console.log("Os códigos do autenticador atualmente cadastrado deixarão de funcionar assim");
  console.log("que a nova chave for aplicada. Atualize .env, Vercel e o aplicativo juntos.\n");
} else {
  console.log("Uma nova chave será gerada.\n");
}

const segredo = gerarSegredoBase32();
const uri = uriOtpauth(segredo, "admin", "Essencial Fit");

console.log("Chave (ADMIN_TOTP_SECRET):\n" + segredo + "\n");
console.log("URI TOTP:\n" + uri + "\n");
console.log("QR Code:");
qrcode.generate(uri, { small: true }, (qr: string) => {
  console.log(qr);
  console.log("Próximos passos:\n");
  console.log("1. Escaneie o QR Code no aplicativo autenticador (ou digite a chave acima).");
  console.log("2. Atualize ADMIN_TOTP_SECRET no .env local.");
  console.log("3. Atualize ADMIN_TOTP_SECRET na Vercel (Production).");
  console.log("4. Faça um novo deploy (variáveis só valem em deploy novo).");
  console.log("5. Teste o login antes de encerrar esta sessão: pnpm totp:code mostra o código atual.\n");
});

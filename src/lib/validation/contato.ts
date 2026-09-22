import * as z from "zod/mini";
import { CONTATO } from "@/lib/site/conteudo";
import { normalizarTelefone } from "./phone";

/**
 * Formulário comercial da landing. Compartilhado entre o cliente (validação
 * inline) e a server action, que nunca confia no cliente e roda o mesmo schema.
 */
export const contatoSchema = z.object({
  nome: z.string().check(z.trim(), z.minLength(2, CONTATO.erros.nome), z.maxLength(120, CONTATO.erros.nome)),
  empresa: z.string().check(z.trim(), z.minLength(2, CONTATO.erros.empresa), z.maxLength(120, CONTATO.erros.empresa)),
  // Um único campo: telefone brasileiro (vira E.164) ou e-mail (vira minúsculo).
  contato: z.pipe(
    z.string().check(z.trim(), z.maxLength(160, CONTATO.erros.contato)),
    z.transform((v, ctx) => {
      const telefone = normalizarTelefone(v);
      if (telefone) return telefone;
      const email = v.toLowerCase();
      if (z.safeParse(z.email(), email).success) return email;
      ctx.issues.push({ code: "custom", message: CONTATO.erros.contato, input: v });
      return z.NEVER;
    }),
  ),
  mensagem: z.string().check(z.trim(), z.minLength(10, CONTATO.erros.mensagem), z.maxLength(2000, CONTATO.erros.mensagem)),
});

export type ContatoInput = z.input<typeof contatoSchema>;
export type ContatoParsed = z.output<typeof contatoSchema>;
export type CampoContato = keyof ContatoInput;

export function lerContato(form: FormData): ContatoInput {
  const texto = (k: CampoContato) => String(form.get(k) ?? "");
  return { nome: texto("nome"), empresa: texto("empresa"), contato: texto("contato"), mensagem: texto("mensagem") };
}

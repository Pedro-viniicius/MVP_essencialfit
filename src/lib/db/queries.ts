import { eq } from "drizzle-orm";
import { USAR_MOCKS } from "@/lib/mock/config";
import { db } from "./index";
import { eventos } from "./schema";

/** Only what the public form needs; never leaks retention or internal ids. */
export async function buscarEventoPorSlug(slug: string) {
  // Modo de teste: mesma resposta, vinda da loja em memória (ver MOCKS.md).
  if (USAR_MOCKS) return (await import("@/lib/mock/loja")).buscarEventoPorSlug(slug);
  const [evento] = await db
    .select({
      id: eventos.id,
      slug: eventos.slug,
      nome: eventos.nome,
      ativo: eventos.ativo,
      politicaVersao: eventos.politicaVersao,
      modelos: eventos.modelos,
    })
    .from(eventos)
    .where(eq(eventos.slug, slug))
    .limit(1);
  return evento ?? null;
}

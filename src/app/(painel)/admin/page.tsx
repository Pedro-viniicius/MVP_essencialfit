import Link from "next/link";
import { Container, EstadoVazio } from "@/components/painel/primitivos";
import { Topo } from "@/components/painel/topo";
import { buttonVariants } from "@/components/ui/button";
import { exigirAdmin } from "@/lib/admin/session";
import { A } from "@/lib/texts/admin";

export const dynamic = "force-dynamic";

// Placeholder until the real-event panel (rest of step 7) lands.
export default async function AdminPage() {
  await exigirAdmin("/admin");
  return (
    <>
      <Topo atual="painel" />
      <main id="conteudo" className="flex-1 py-8 sm:py-12">
        <Container className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{A.painel.titulo}</h1>
          <p className="mt-1 text-muted-foreground">{A.painel.subtitulo}</p>
          <div className="mt-8">
            <EstadoVazio titulo={A.painel.vazio.titulo} descricao={A.painel.vazio.descricao}>
              <Link href="/demo" className={buttonVariants({ size: "lg" })}>
                {A.painel.demo}
              </Link>
            </EstadoVazio>
          </div>
        </Container>
      </main>
    </>
  );
}

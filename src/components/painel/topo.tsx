import Link from "next/link";
import { sairAction } from "@/app/(painel)/admin/login/actions";
import { Marca } from "@/components/marca";
import { Button } from "@/components/ui/button";
import { A } from "@/lib/texts/admin";
import { cn } from "@/lib/utils";
import { Container } from "./primitivos";

/**
 * Barra do painel: marca, as duas áreas e a saída. Fica no topo de todas as
 * telas internas para que nenhuma delas seja um beco sem saída.
 */
export function Topo({ atual }: { atual: "painel" | "demo" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-2">
        <Link
          href="/admin"
          aria-label={A.nav.inicio}
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Marca claro compacta />
        </Link>
        <nav aria-label={A.nav.areas} className="ml-auto flex items-center gap-1">
          <Item href="/admin" ativo={atual === "painel"}>
            {A.nav.painel}
          </Item>
          <Item href="/demo" ativo={atual === "demo"}>
            {A.nav.demo}
          </Item>
        </nav>
        <form action={sairAction}>
          <Button type="submit" variant="ghost" size="sm" className="font-medium text-muted-foreground">
            {A.sair}
          </Button>
        </form>
      </Container>
    </header>
  );
}

/** A área atual é marcada por peso, fundo e aria-current — nunca só por cor. */
function Item({ href, ativo, children }: { href: string; ativo: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center rounded-lg px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-3",
        ativo ? "bg-muted font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

import { NAV, SITE } from "@/lib/site/conteudo";
import { BotaoLink, Container, Marca } from "./primitivos";
import { MenuMobile } from "./menu-mobile";

/** Barra fixa e translúcida. Os links são âncoras: a landing é uma página só. */
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-linha/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#inicio" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={`${SITE.nome}, início`}>
          <Marca />
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {NAV.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-tinta focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {l.rotulo}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <BotaoLink href="#contato" className="hidden min-h-10 px-5 text-sm sm:inline-flex">
            {NAV.cta}
          </BotaoLink>
          <MenuMobile />
        </div>
      </Container>
    </header>
  );
}

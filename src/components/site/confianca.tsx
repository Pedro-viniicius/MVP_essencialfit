import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { FAQ, PRECO, PRIVACIDADE, RODAPE, SITE } from "@/lib/site/conteudo";
import { BotaoLink, Cabecalho, Container, Marca, Secao } from "./primitivos";

/* --- Privacidade ---------------------------------------------------------- */

export function Privacidade() {
  return (
    <Secao id="privacidade">
      <Cabecalho titulo={PRIVACIDADE.titulo} subtitulo={PRIVACIDADE.subtitulo} />
      <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRIVACIDADE.itens.map((i) => (
          <li key={i.titulo} className="border-t border-linha pt-4">
            <h3 className="font-semibold">{i.titulo}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{i.descricao}</p>
          </li>
        ))}
      </ul>
    </Secao>
  );
}

/* --- Preço ---------------------------------------------------------------- */

export function Preco() {
  return (
    <Secao id="preco" tom="superficie">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Cabecalho titulo={PRECO.titulo} subtitulo={PRECO.subtitulo} />
        <div className="rounded-2xl border border-linha bg-white p-6 shadow-sm sm:p-8">
          <p className="text-lg font-semibold">{SITE.nome}</p>
          <p className="mt-4 text-sm text-muted-foreground">{PRECO.rotuloAPartir}</p>
          <p className="text-3xl font-semibold tracking-tight text-balance tabular-nums sm:text-4xl">{PRECO.valor}</p>
          <p className="mt-6 text-sm font-medium">{PRECO.descricao}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {PRECO.inclui.map((t) => (
              <li key={t} className="flex gap-2 text-sm leading-snug">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-linha pt-4 text-sm leading-relaxed text-muted-foreground">{PRECO.observacao}</p>
          <BotaoLink href="#contato" className="mt-6 w-full sm:w-auto">
            {PRECO.cta}
          </BotaoLink>
        </div>
      </div>
    </Secao>
  );
}

/* --- FAQ ------------------------------------------------------------------ */

/** Acordeão nativo (<details>): sem JavaScript, acessível por teclado. */
export function Faq() {
  return (
    <Secao id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Cabecalho titulo={FAQ.titulo} />
        <div className="divide-y divide-linha border-y border-linha">
          {FAQ.itens.map((i) => (
            <details key={i.pergunta} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-3 focus-visible:ring-ring/50">
                {i.pergunta}
                <ChevronDownIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-5 leading-relaxed text-muted-foreground">{i.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </Secao>
  );
}

/* --- Rodapé --------------------------------------------------------------- */

export function Rodape() {
  return (
    <footer className="border-t border-linha bg-white py-12">
      <Container className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Marca />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{RODAPE.descricao}</p>
        </div>
        {RODAPE.colunas.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo}>
            <h2 className="text-sm font-semibold">{c.titulo}</h2>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-tinta">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="mt-10 flex flex-col gap-2 border-t border-linha pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.nome} · {RODAPE.principio}
        </p>
        <p>{RODAPE.legal}</p>
      </Container>
    </footer>
  );
}

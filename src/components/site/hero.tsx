import { HERO } from "@/lib/site/conteudo";
import { BotaoLink, Container, Selo } from "./primitivos";
import { HeroDemo } from "./hero-demo";

export function Hero() {
  return (
    <section id="inicio" className="pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
        <div className="max-w-2xl">
          <Selo>{HERO.selo}</Selo>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:leading-[1.1]">{HERO.titulo}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">{HERO.subtitulo}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoLink href="#contato" tamanho="grande">
              {HERO.ctaPrimario}
            </BotaoLink>
            <BotaoLink href="#fluxo" variante="secundario" tamanho="grande">
              {HERO.ctaSecundario}
            </BotaoLink>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{HERO.nota}</p>
        </div>
        <HeroDemo />
      </Container>
    </section>
  );
}

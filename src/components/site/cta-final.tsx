import { CONTATO, CTA_FINAL } from "@/lib/site/conteudo";
import { BotaoLink, Cabecalho, Secao } from "./primitivos";
import { FormularioContato } from "./contato/formulario-contato";

/** Fecho + formulário na mesma seção: o CTA leva direto ao pedido de contato. */
export function CtaFinal() {
  return (
    <Secao id="contato" tom="tinta" className="malha-clara relative">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{CTA_FINAL.titulo}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-white/70">{CTA_FINAL.subtitulo}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BotaoLink href="#formulario-contato" tamanho="grande">
              {CTA_FINAL.cta}
            </BotaoLink>
            <p className="text-sm font-medium text-white/60">{CTA_FINAL.nota}</p>
          </div>
          <div className="mt-10 hidden border-t border-white/10 pt-8 lg:block">
            <Cabecalho titulo={CONTATO.titulo} subtitulo={CONTATO.subtitulo} claro className="[&_h2]:text-xl [&_p]:mt-2 [&_p]:text-base" />
          </div>
        </div>
        <div id="formulario-contato" className="text-tinta">
          <FormularioContato />
        </div>
      </div>
    </Secao>
  );
}

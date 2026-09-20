"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Gaveta } from "../componentes/gaveta/gaveta";
import { PONTOS_DE_QUEBRA } from "../tokens/pontos-de-quebra";
import { BarraInferior } from "./barra-inferior";
import { CabecalhoAplicacao, type CabecalhoAplicacaoProps } from "./cabecalho-aplicacao";
import estilos from "./casca-aplicacao.module.css";
import { NAVEGACAO_APOIO, type GrupoDeMenu } from "./mapa-navegacao";
import { NavegacaoLateral } from "./navegacao-lateral";

export interface CascaAplicacaoProps {
  readonly cabecalho: CabecalhoAplicacaoProps;
  /** Grupos ja filtrados pelas permissoes do usuario (`navegacaoVisivel`). */
  readonly grupos: readonly GrupoDeMenu[];
  readonly contadores?: Readonly<Record<string, number>>;
  readonly children: ReactNode;
}

const ROTAS_BARRA_INFERIOR = ["/inicio", "/contas-pagar", "/contas-receber"] as const;

/**
 * Casca do sistema: cabecalho + barra lateral + conteudo (docs/ux/navegacao.md,
 * secao 1). Em celular, a barra lateral vira painel deslizante aberto pelo
 * item "Mais" da barra inferior (docs/ux/responsividade.md).
 *
 * A casca nao conhece sessao nem banco: recebe tudo pronto de `app/`.
 */
export function CascaAplicacao({ cabecalho, grupos, contadores, children }: CascaAplicacaoProps) {
  const rotaAtual = usePathname();
  // O painel guarda a rota em que foi aberto: ao navegar, ele ja cumpriu o
  // papel dele e conta como fechado sem precisar de efeito.
  const [painel, setPainel] = useState({ aberto: false, rota: rotaAtual });
  const painelAberto = painel.aberto && painel.rota === rotaAtual;
  const abrirPainel = () => setPainel({ aberto: true, rota: rotaAtual });
  const fecharPainel = () => setPainel({ aberto: false, rota: rotaAtual });

  // Se a janela crescer ate o desktop com o painel aberto, a barra lateral fixa
  // reaparece; fechamos o painel para nao haver duas navegacoes ao mesmo tempo.
  useEffect(() => {
    const consulta = window.matchMedia(`(min-width: ${PONTOS_DE_QUEBRA.tablet}px)`);
    const aoMudar = (evento: MediaQueryListEvent) => {
      if (evento.matches) setPainel((atual) => ({ ...atual, aberto: false }));
    };
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  const itensBarraInferior = grupos
    .flatMap((grupo) => grupo.itens)
    .filter((item) => (ROTAS_BARRA_INFERIOR as readonly string[]).includes(item.rota));

  return (
    <div className={estilos.casca}>
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <CabecalhoAplicacao {...cabecalho} />
      <div className={estilos.corpo}>
        <NavegacaoLateral grupos={grupos} {...(contadores ? { contadores } : {})} />
        <main id="conteudo" className={estilos.conteudo} tabIndex={-1}>
          {children}
        </main>
      </div>

      <BarraInferior itens={itensBarraInferior} aoAbrirMais={abrirPainel} />
      <Gaveta aberta={painelAberto} titulo="Navegação" aoFechar={fecharPainel}>
        <NavegacaoLateral
          grupos={grupos}
          itensDeApoio={NAVEGACAO_APOIO}
          {...(contadores ? { contadores } : {})}
          variante="painel"
        />
      </Gaveta>
    </div>
  );
}

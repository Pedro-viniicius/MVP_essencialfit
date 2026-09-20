"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Gaveta } from "../componentes/gaveta/gaveta";
import { PONTOS_DE_QUEBRA } from "../tokens/pontos-de-quebra";
import { BarraInferior } from "./barra-inferior";
import { CabecalhoDemonstracao } from "./cabecalho-demonstracao";
import estilos from "./casca-demonstracao.module.css";
import {
  APOIO_DEMONSTRACAO,
  NAVEGACAO_DEMONSTRACAO,
  ROTAS_BARRA_INFERIOR_DEMONSTRACAO,
} from "./mapa-navegacao-demonstracao";
import { NavegacaoLateral } from "./navegacao-lateral";

export interface CascaDemonstracaoProps {
  readonly unidade: string;
  readonly contadores?: Readonly<Record<string, number>>;
  readonly children: ReactNode;
}

/**
 * Casca da area de demonstracao: mesmo esqueleto da casca do sistema
 * (cabecalho + barra lateral + barra inferior no celular), com a navegacao da
 * marca e sem nenhuma dependencia de sessao ou banco de dados — a vitrine
 * precisa abrir em qualquer maquina, na hora da apresentacao.
 */
export function CascaDemonstracao({ unidade, contadores, children }: CascaDemonstracaoProps) {
  const rotaAtual = usePathname();
  const [painel, definirPainel] = useState({ aberto: false, rota: rotaAtual });
  const painelAberto = painel.aberto && painel.rota === rotaAtual;

  useEffect(() => {
    const consulta = window.matchMedia(`(min-width: ${PONTOS_DE_QUEBRA.tablet}px)`);
    const aoMudar = (evento: MediaQueryListEvent) => {
      if (evento.matches) definirPainel((atual) => ({ ...atual, aberto: false }));
    };
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  const itensBarraInferior = NAVEGACAO_DEMONSTRACAO.flatMap((grupo) => grupo.itens).filter((item) =>
    ROTAS_BARRA_INFERIOR_DEMONSTRACAO.includes(item.rota),
  );

  return (
    <div className={estilos.casca}>
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <CabecalhoDemonstracao unidade={unidade} />

      <div className={estilos.corpo}>
        <NavegacaoLateral
          grupos={NAVEGACAO_DEMONSTRACAO}
          itensDeApoio={APOIO_DEMONSTRACAO}
          {...(contadores ? { contadores } : {})}
        />
        <main id="conteudo" className={estilos.conteudo} tabIndex={-1}>
          {children}
        </main>
      </div>

      <BarraInferior
        itens={itensBarraInferior}
        aoAbrirMais={() => definirPainel({ aberto: true, rota: rotaAtual })}
      />
      <Gaveta
        aberta={painelAberto}
        titulo="Navegação"
        aoFechar={() => definirPainel({ aberto: false, rota: rotaAtual })}
      >
        <NavegacaoLateral
          grupos={NAVEGACAO_DEMONSTRACAO}
          itensDeApoio={APOIO_DEMONSTRACAO}
          {...(contadores ? { contadores } : {})}
          variante="painel"
        />
      </Gaveta>
    </div>
  );
}

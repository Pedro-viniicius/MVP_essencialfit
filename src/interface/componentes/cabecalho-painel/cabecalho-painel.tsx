import type { ReactNode } from "react";

import estilos from "./cabecalho-painel.module.css";

export interface CabecalhoPainelProps {
  /** Nome curto da area ("Painel de produtos"). */
  readonly etiqueta: string;
  /** A pergunta que este painel responde. E o titulo da pagina (h1). */
  readonly pergunta: string;
  /** A resposta curta, em uma ou duas frases, ANTES de qualquer numero. */
  readonly resposta: string;
  /** Periodo ou recorte considerado ("Setembro de 2026"). */
  readonly periodo?: string;
  /** Acoes de contexto (ex.: gerar ideias para este painel). */
  readonly acoes?: ReactNode;
}

/**
 * Topo de um painel: pergunta, resposta e so entao os numeros.
 *
 * E a aplicacao literal da hierarquia de docs/ux/dashboard.md: quem abre a
 * tela precisa entender o significado antes de precisar entender a metrica.
 */
export function CabecalhoPainel({ etiqueta, pergunta, resposta, periodo, acoes }: CabecalhoPainelProps) {
  return (
    <header className={estilos.painel}>
      <p className={estilos.etiqueta}>{etiqueta}</p>
      <h1 className={estilos.pergunta}>{pergunta}</h1>
      <p className={estilos.resposta}>{resposta}</p>
      {periodo || acoes ? (
        <div className={estilos.rodape}>
          {periodo ? (
            <span className={estilos.periodo}>
              <span aria-hidden="true">•</span> {periodo}
            </span>
          ) : null}
          {acoes}
        </div>
      ) : null}
    </header>
  );
}

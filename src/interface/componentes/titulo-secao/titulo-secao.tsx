import type { ReactNode } from "react";

import estilos from "./titulo-secao.module.css";

export interface TituloSecaoProps {
  /** Titulo em linguagem de negocio, nunca o nome do calculo. */
  readonly titulo: string;
  /** Uma linha que diz por que esta secao existe. */
  readonly explicacao?: string;
  /** Acao opcional a direita (um link ou botao). */
  readonly acao?: ReactNode;
  /** Nivel do titulo no documento. Padrao: h2. */
  readonly nivel?: 2 | 3;
}

/** Cabecalho de uma secao dentro da pagina: da hierarquia sem pesar a tela. */
export function TituloSecao({ titulo, explicacao, acao, nivel = 2 }: TituloSecaoProps) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <div className={estilos.secao}>
      <div className={estilos.textos}>
        <Titulo className={estilos.titulo}>{titulo}</Titulo>
        {explicacao ? <p className={estilos.explicacao}>{explicacao}</p> : null}
      </div>
      {acao ? <div className={estilos.acao}>{acao}</div> : null}
    </div>
  );
}

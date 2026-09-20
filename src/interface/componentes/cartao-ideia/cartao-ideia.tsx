import type { ReactNode } from "react";

import estilos from "./cartao-ideia.module.css";

export interface CartaoIdeiaProps {
  /** Titulo curto e concreto ("Monte um combo"). */
  readonly titulo: string;
  /** Assunto da ideia ("Estoque", "Clientes", "Preço"). */
  readonly etiqueta?: string;
  /** Camada 1 — o sinal encontrado nos dados. */
  readonly oQuePercebemos: string;
  /** Camada 2 — o que fazer com esse sinal. */
  readonly ideia: string;
  /** Camada 3 — por que isso pode funcionar (o raciocinio, sem jargao). */
  readonly porQuePodeFuncionar: string;
  /** Camada 4 — como testar de forma pequena e reversivel. */
  readonly comoTestar?: string;
  /**
   * Resposta a "Por que a IA sugeriu isso?": quais informacoes entraram na
   * conta. Sem promessa de numero que o sistema nao tem como saber.
   */
  readonly baseDaSugestao: string;
  /** Acao principal ("Transformar em teste", "Ver produtos"). */
  readonly acao?: ReactNode;
}

/**
 * Cartao de ideia da IA — sempre explicavel.
 *
 * Toda ideia tem quatro camadas visiveis (o que percebemos, a ideia, por que
 * pode funcionar, como testar) e uma quinta sob demanda: a base da sugestao.
 * Recomendacao sem explicacao nao entra no produto.
 */
export function CartaoIdeia({
  titulo,
  etiqueta,
  oQuePercebemos,
  ideia,
  porQuePodeFuncionar,
  comoTestar,
  baseDaSugestao,
  acao,
}: CartaoIdeiaProps) {
  return (
    <article className={estilos.cartao}>
      <div className={estilos.topo}>
        <h3 className={estilos.titulo}>{titulo}</h3>
        {etiqueta ? <span className={estilos.etiqueta}>{etiqueta}</span> : null}
      </div>

      <dl className={estilos.camadas}>
        <div>
          <dt className={estilos.rotulo}>O que percebemos</dt>
          <dd className={estilos.texto}>{oQuePercebemos}</dd>
        </div>
        <div>
          <dt className={estilos.rotulo}>Ideia</dt>
          <dd className={estilos.texto}>{ideia}</dd>
        </div>
        <div>
          <dt className={estilos.rotulo}>Por que isso pode funcionar</dt>
          <dd className={estilos.texto}>{porQuePodeFuncionar}</dd>
        </div>
        {comoTestar ? (
          <div>
            <dt className={estilos.rotulo}>Como testar</dt>
            <dd className={estilos.texto}>{comoTestar}</dd>
          </div>
        ) : null}
      </dl>

      <details className={estilos.porque}>
        <summary className={estilos.resumoPorque}>Por que a IA sugeriu isso?</summary>
        <p className={estilos.explicacao}>{baseDaSugestao}</p>
      </details>

      {acao ? <div className={estilos.acoes}>{acao}</div> : null}
    </article>
  );
}

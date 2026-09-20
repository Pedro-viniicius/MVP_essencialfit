import type { ReactNode } from "react";

import type { TomSemantico } from "../selo-situacao/selo-situacao";

import estilos from "./cartao-insight.module.css";

/** Um numero que sustenta a conclusao. Fica escondido ate o usuario pedir. */
export interface NumeroDeApoio {
  readonly rotulo: string;
  /** Ja formatado para leitura ("R$ 4.310,00", "12 clientes"). */
  readonly valor: string;
}

export interface CartaoInsightProps {
  /**
   * A conclusao em linguagem humana. Esta e a frase que o dono do negocio le
   * primeiro: "Alguns produtos estão ficando tempo demais na prateleira."
   */
  readonly mensagem: string;
  /** Uma linha de contexto, ainda sem jargao. */
  readonly contexto?: string;
  readonly tom?: TomSemantico;
  /** Numeros que sustentam a conclusao; aparecem so quando o usuario abre. */
  readonly numeros?: readonly NumeroDeApoio[];
  /** Texto do botao que revela os numeros. */
  readonly rotuloDetalhe?: string;
  /** Proximo passo possivel (link ou botao). */
  readonly acao?: ReactNode;
}

/**
 * Cartao de leitura do negocio (divulgacao progressiva).
 *
 * Primeiro a conclusao em portugues claro; o numero fica a um clique de
 * distancia, para quem quiser conferir. O contrario — numero primeiro,
 * significado depois — e o que faz um ERP parecer uma planilha.
 */
export function CartaoInsight({
  mensagem,
  contexto,
  tom = "informacao",
  numeros,
  rotuloDetalhe = "Ver os números",
  acao,
}: CartaoInsightProps) {
  return (
    <section className={`${estilos.cartao} ${estilos[tom]}`}>
      <p className={estilos.mensagem}>{mensagem}</p>
      {contexto ? <p className={estilos.contexto}>{contexto}</p> : null}

      {numeros && numeros.length > 0 ? (
        <details className={estilos.detalhe}>
          <summary className={estilos.resumo}>{rotuloDetalhe}</summary>
          <div className={estilos.numeros}>
            {numeros.map((numero) => (
              <div key={numero.rotulo} className={estilos.numero}>
                <span className={estilos.rotuloNumero}>{numero.rotulo}</span>
                <span className={estilos.valorNumero}>{numero.valor}</span>
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {acao ? <div className={estilos.acao}>{acao}</div> : null}
    </section>
  );
}

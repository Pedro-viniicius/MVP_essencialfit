import estilos from "./barra-proporcao.module.css";

export interface ItemDeProporcao {
  readonly rotulo: string;
  /** Participacao de 0 a 100, ja calculada. */
  readonly percentual: number;
  /** Valor ja formatado, exibido a direita. */
  readonly valor: string;
  /** Linha de apoio opcional ("38 unidades no mês"). */
  readonly apoio?: string;
}

export interface BarraProporcaoProps {
  /** Nome da lista, lido por leitores de tela. */
  readonly titulo: string;
  readonly itens: readonly ItemDeProporcao[];
}

/**
 * Participacao de cada item no total (categorias, produtos, formas de
 * pagamento). Cada linha e rotulada diretamente: nao ha legenda de cores nem
 * grafico de pizza — comparar comprimento e mais facil do que comparar fatia.
 */
export function BarraProporcao({ titulo, itens }: BarraProporcaoProps) {
  return (
    <dl className={estilos.lista} aria-label={titulo}>
      {itens.map((item, indice) => (
        <div key={item.rotulo} className={`${estilos.linha} ${indice === 0 ? estilos.primeira : ""}`}>
          <dt className={estilos.rotulo}>{item.rotulo}</dt>
          <dd className={estilos.valor}>{item.valor}</dd>
          <div className={estilos.trilho}>
            <div
              className={estilos.preenchimento}
              style={{ width: `${Math.max(0, Math.min(100, item.percentual))}%` }}
            />
          </div>
          <p className={estilos.apoio}>
            {item.percentual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do total
            {item.apoio ? ` · ${item.apoio}` : ""}
          </p>
        </div>
      ))}
    </dl>
  );
}

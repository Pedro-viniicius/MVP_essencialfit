import estilos from "./grafico-barras.module.css";

export interface BarraDoGrafico {
  /** Periodo ou categoria ("abr", "mai"). */
  readonly rotulo: string;
  /** Altura relativa; use a mesma unidade em todas as barras. */
  readonly quantidade: number;
  /** Valor ja formatado, usado no rotulo e na tabela acessivel ("R$ 16.180,00"). */
  readonly valor: string;
  /** Marca a barra do periodo atual. */
  readonly destaque?: boolean;
}

export interface GraficoBarrasProps {
  /** Descreve o que o grafico mostra. Substitui a legenda (serie unica). */
  readonly titulo: string;
  readonly barras: readonly BarraDoGrafico[];
  /** Frase de leitura do grafico, abaixo dele. */
  readonly leitura?: string;
}

/**
 * Evolucao de uma unica serie, em barras.
 *
 * Decisoes: serie unica nao usa legenda (o titulo ja a nomeia); so a barra em
 * destaque recebe rotulo numerico direto — numero em toda barra vira ruido; o
 * mesmo conteudo existe como tabela para leitores de tela.
 */
export function GraficoBarras({ titulo, barras, leitura }: GraficoBarrasProps) {
  const maior = barras.reduce((maximo, barra) => Math.max(maximo, barra.quantidade), 0);

  return (
    <figure className={estilos.figura}>
      <div className={estilos.grafico} role="presentation">
        {barras.map((barra) => {
          const altura = maior === 0 ? 0 : Math.round((barra.quantidade / maior) * 100);
          return (
            <div key={barra.rotulo} className={estilos.coluna}>
              {barra.destaque ? <span className={estilos.valorDireto}>{barra.valor}</span> : null}
              <span
                className={`${estilos.barra} ${barra.destaque ? estilos.emDestaque : ""}`}
                style={{ height: `${Math.max(altura, 2)}%` }}
                title={`${barra.rotulo}: ${barra.valor}`}
              />
            </div>
          );
        })}
      </div>

      <div className={estilos.rotulos} aria-hidden="true">
        {barras.map((barra) => (
          <span key={barra.rotulo} className={`${estilos.rotulo} ${barra.destaque ? estilos.rotuloDestaque : ""}`}>
            {barra.rotulo}
          </span>
        ))}
      </div>

      {leitura ? <figcaption className={estilos.legenda}>{leitura}</figcaption> : null}

      <table className="apenas-leitor-de-tela">
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th scope="col">Período</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {barras.map((barra) => (
            <tr key={barra.rotulo}>
              <th scope="row">{barra.rotulo}</th>
              <td>{barra.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

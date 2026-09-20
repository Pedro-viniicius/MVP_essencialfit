import estilos from "./cartao-indicador.module.css";

/** Direcao da variacao entre periodos, ja decidida por quem prepara os dados. */
export type DirecaoVariacao = "subiu" | "caiu" | "estavel";

export interface CartaoIndicadorProps {
  /** O que este numero e, em linguagem de negocio ("Vendas do mês"). */
  readonly titulo: string;
  /** Valor ja formatado ("R$ 18.420,00", "143", "R$ 128,81"). */
  readonly valor: string;
  /** Comparacao com o periodo anterior ("+12,4% que agosto"). */
  readonly variacao?: string;
  readonly direcao?: DirecaoVariacao;
  /** A leitura humana do numero: o que ele significa para quem decide. */
  readonly leitura?: string;
  /** Indicador principal da tela. Use em no maximo um cartao por bloco. */
  readonly destaque?: boolean;
}

/** Simbolo textual da variacao: a direcao nunca depende so da cor. */
const SIMBOLOS: Record<DirecaoVariacao, string> = {
  subiu: "▲",
  caiu: "▼",
  estavel: "＝",
};

const LEITURA_ACESSIVEL: Record<DirecaoVariacao, string> = {
  subiu: "em alta",
  caiu: "em queda",
  estavel: "estável",
};

/**
 * Numero com significado: titulo, valor, comparacao e a frase que explica o
 * que ele quer dizer. Sem a frase, o cartao vira planilha.
 */
export function CartaoIndicador({
  titulo,
  valor,
  variacao,
  direcao = "estavel",
  leitura,
  destaque = false,
}: CartaoIndicadorProps) {
  return (
    <section className={`${estilos.cartao} ${destaque ? `${estilos.destaque} ${estilos.grande}` : ""}`}>
      <p className={estilos.titulo}>{titulo}</p>
      <p className={estilos.valor}>{valor}</p>
      {variacao ? (
        <p className={`${estilos.variacao} ${estilos[direcao]}`}>
          <span aria-hidden="true">{SIMBOLOS[direcao]}</span>
          {variacao}
          <span className="apenas-leitor-de-tela"> ({LEITURA_ACESSIVEL[direcao]})</span>
        </p>
      ) : null}
      {leitura ? <p className={estilos.leitura}>{leitura}</p> : null}
    </section>
  );
}

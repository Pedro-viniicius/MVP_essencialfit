import estilos from "./matriz-giro-margem.module.css";

export interface ProdutoNaMatriz {
  readonly nome: string;
  /** Quanto sai, de 0 a 100 (ja normalizado por quem prepara os dados). */
  readonly giro: number;
  /** Quanto sobra, de 0 a 100. */
  readonly margem: number;
  /** A frase que explica a posicao: "Vende muito, mas deixa pouca margem." */
  readonly leitura: string;
}

export interface MatrizGiroMargemProps {
  readonly produtos: readonly ProdutoNaMatriz[];
}

const LARGURA = 440;
const ALTURA = 320;
/* As margens reservam faixas para os nomes dos quadrantes e para os eixos,
 * de modo que nenhum ponto caia em cima de um rotulo. */
const MARGEM_ESQUERDA = 44;
const MARGEM_DIREITA = 20;
const MARGEM_TOPO = 44;
const MARGEM_BAIXO = 52;

/**
 * Relacao entre o quanto um produto sai (giro) e o quanto ele deixa (margem).
 *
 * Os quatro cantos tem nome em portugues comum, nao em termos de consultoria.
 * Os pontos sao numerados e a lista abaixo diz quem e quem: assim nenhum
 * rotulo se sobrepoe e a informacao continua legivel no celular e sem cor.
 */
export function MatrizGiroMargem({ produtos }: MatrizGiroMargemProps) {
  const x = (giro: number) => MARGEM_ESQUERDA + (giro / 100) * (LARGURA - MARGEM_ESQUERDA - MARGEM_DIREITA);
  const y = (margem: number) => ALTURA - MARGEM_BAIXO - (margem / 100) * (ALTURA - MARGEM_TOPO - MARGEM_BAIXO);
  const meioX = x(50);
  const meioY = y(50);

  return (
    <figure className={estilos.figura}>
      <svg
        className={estilos.quadro}
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        role="img"
        aria-label="Relação entre quanto cada produto vende e quanto cada produto deixa de margem"
      >
        {/* Quadrantes: canto bom em verde suave, canto de dinheiro parado em amarelo suave. */}
        <rect x={meioX} y={MARGEM_TOPO} width={x(100) - meioX} height={meioY - MARGEM_TOPO} className={estilos.fundoBom} />
        <rect x={MARGEM_ESQUERDA} y={meioY} width={meioX - MARGEM_ESQUERDA} height={y(0) - meioY} className={estilos.fundoAtencao} />

        <line x1={meioX} y1={MARGEM_TOPO} x2={meioX} y2={y(0)} className={estilos.divisao} />
        <line x1={MARGEM_ESQUERDA} y1={meioY} x2={x(100)} y2={meioY} className={estilos.divisao} />

        <line x1={MARGEM_ESQUERDA} y1={y(0)} x2={x(100)} y2={y(0)} className={estilos.eixo} />
        <line x1={MARGEM_ESQUERDA} y1={MARGEM_TOPO} x2={MARGEM_ESQUERDA} y2={y(0)} className={estilos.eixo} />

        {/* Os nomes dos quadrantes ficam FORA da area de dados, acima e abaixo. */}
        <text x={MARGEM_ESQUERDA} y={MARGEM_TOPO - 12} className={estilos.nomeQuadrante}>
          Boa margem, pouca saída
        </text>
        <text x={x(100)} y={MARGEM_TOPO - 12} className={estilos.nomeQuadrante} textAnchor="end">
          Puxam o resultado
        </text>
        <text x={MARGEM_ESQUERDA} y={y(0) + 18} className={estilos.nomeQuadrante}>
          Dinheiro parado
        </text>
        <text x={x(100)} y={y(0) + 18} className={estilos.nomeQuadrante} textAnchor="end">
          Vendem muito, deixam pouco
        </text>

        <text x={x(100)} y={ALTURA - 8} className={estilos.rotuloEixo} textAnchor="end">
          Sai mais →
        </text>
        <text
          x={16}
          y={(MARGEM_TOPO + y(0)) / 2}
          className={estilos.rotuloEixo}
          textAnchor="middle"
          transform={`rotate(-90 16 ${(MARGEM_TOPO + y(0)) / 2})`}
        >
          Deixa mais →
        </text>

        {produtos.map((produto, indice) => (
          <g key={produto.nome}>
            <circle cx={x(produto.giro)} cy={y(produto.margem)} r={10} className={estilos.ponto}>
              <title>{`${produto.nome}: ${produto.leitura}`}</title>
            </circle>
            <text x={x(produto.giro)} y={y(produto.margem) + 3.5} className={estilos.numeroPonto} aria-hidden="true">
              {indice + 1}
            </text>
          </g>
        ))}
      </svg>

      <ol className={estilos.legenda}>
        {produtos.map((produto, indice) => (
          <li key={produto.nome} className={estilos.itemLegenda}>
            <span className={estilos.numero} aria-hidden="true">
              {indice + 1}
            </span>
            <span>
              <span className={estilos.nomeLegenda}>{produto.nome}</span>{" "}
              <span className={estilos.leituraLegenda}>— {produto.leitura}</span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

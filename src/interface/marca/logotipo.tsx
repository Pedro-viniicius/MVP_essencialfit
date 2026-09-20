import { MARCA } from "./identidade";
import estilos from "./logotipo.module.css";

export interface LogotipoProps {
  readonly tamanho?: "pequeno" | "normal" | "grande";
  /** Mostra a assinatura da marca abaixo do nome. */
  readonly comAssinatura?: boolean;
}

const MEDIDAS: Record<NonNullable<LogotipoProps["tamanho"]>, number> = {
  pequeno: 22,
  normal: 28,
  grande: 40,
};

/**
 * Simbolo + nome da marca.
 *
 * O simbolo e um SVG inline (sem arquivo externo, sem dependencia nova): uma
 * folha que tambem e um movimento ascendente — saude e evolucao. As cores vem
 * dos tokens da marca, entao ele acompanha automaticamente uma troca de tema.
 */
export function Logotipo({ tamanho = "normal", comAssinatura = false }: LogotipoProps) {
  const medida = MEDIDAS[tamanho];

  return (
    <span className={`${estilos.logotipo} ${estilos[tamanho]}`}>
      <svg
        className={estilos.simbolo}
        width={medida}
        height={medida}
        viewBox="0 0 40 40"
        role="img"
        aria-label={`Símbolo da ${MARCA.nome}`}
      >
        <rect width="40" height="40" rx="12" fill="var(--cor-marca-forte)" />
        <path
          d="M11 27c0-7.2 5.6-13 12.6-13H29c0 7.2-5.6 13-12.6 13H11Z"
          fill="var(--cor-acento-grafico)"
          opacity="0.9"
        />
        <path
          d="M11 29c3.4-6.2 8.2-10.6 14.4-13.4"
          stroke="var(--cor-marca-contraste)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className={estilos.textos}>
        <span className={estilos.nome}>{MARCA.nome}</span>
        {comAssinatura ? <span className={estilos.assinatura}>{MARCA.assinatura}</span> : null}
      </span>
    </span>
  );
}

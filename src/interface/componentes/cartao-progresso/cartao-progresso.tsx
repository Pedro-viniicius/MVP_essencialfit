import estilos from "./cartao-progresso.module.css";

export interface CartaoProgressoProps {
  /** "Meta do mês", "Reposição planejada". */
  readonly titulo: string;
  /** Percentual ja calculado, de 0 a 100. Valores acima de 100 sao aparados na barra. */
  readonly percentual: number;
  /** A frase que traduz o percentual: "Você já percorreu 72% da meta do mês." */
  readonly frase: string;
  /** Valor alcancado, ja formatado. */
  readonly alcancado?: string;
  /** Valor da meta, ja formatado. */
  readonly meta?: string;
}

/**
 * Progresso em relacao a uma meta.
 *
 * O percentual aparece, mas quem manda e a frase: "72%" nao diz nada sozinho;
 * "Você já percorreu 72% da meta do mês" diz.
 */
export function CartaoProgresso({ titulo, percentual, frase, alcancado, meta }: CartaoProgressoProps) {
  const largura = Math.max(0, Math.min(100, percentual));
  const inteiro = Math.round(percentual);

  return (
    <section className={estilos.cartao}>
      <div className={estilos.topo}>
        <p className={estilos.titulo}>{titulo}</p>
        <p className={estilos.percentual}>{inteiro}%</p>
      </div>
      <div
        className={estilos.trilho}
        role="progressbar"
        aria-valuenow={inteiro}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={titulo}
      >
        <div className={estilos.preenchimento} style={{ width: `${largura}%` }} />
      </div>
      <p className={estilos.frase}>{frase}</p>
      {alcancado && meta ? (
        <p className={estilos.valores}>
          <span>Alcançado: {alcancado}</span>
          <span>Meta: {meta}</span>
        </p>
      ) : null}
    </section>
  );
}

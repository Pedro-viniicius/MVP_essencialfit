import type { ReactNode } from "react";

import estilos from "./cartao-registro.module.css";

/** Um par rotulo/valor mostrado no corpo do cartao. */
export interface DadoDoRegistro {
  readonly rotulo: string;
  /** Ja formatado para leitura. */
  readonly valor: string;
}

export interface CartaoRegistroProps {
  /** Nome do cliente, do produto ou do registro. */
  readonly nome: string;
  /** Linha de apoio: categoria, telefone, SKU. */
  readonly complemento?: string;
  /** Situacao (use `SeloSituacao`). */
  readonly situacao?: ReactNode;
  readonly dados?: readonly DadoDoRegistro[];
  /** Frase livre: a leitura do registro em linguagem simples. */
  readonly observacao?: string;
  readonly acoes?: ReactNode;
  /** Quando falso, o circulo com a inicial nao aparece (produtos, por exemplo). */
  readonly comInicial?: boolean;
}

/**
 * Cartao de um registro (cliente, produto, venda).
 *
 * Serve de par responsivo das tabelas: no celular, uma tabela densa vira uma
 * lista destes cartoes, sem rolagem horizontal (docs/ux/responsividade.md).
 */
export function CartaoRegistro({
  nome,
  complemento,
  situacao,
  dados = [],
  observacao,
  acoes,
  comInicial = true,
}: CartaoRegistroProps) {
  return (
    <article className={estilos.cartao}>
      <div className={estilos.topo}>
        <div className={estilos.identificacao}>
          {comInicial ? (
            <span className={estilos.inicial} aria-hidden="true">
              {primeiraLetra(nome)}
            </span>
          ) : null}
          <div>
            <p className={estilos.nome}>{nome}</p>
            {complemento ? <p className={estilos.complemento}>{complemento}</p> : null}
          </div>
        </div>
        {situacao}
      </div>

      {dados.length > 0 ? (
        <dl className={estilos.dados}>
          {dados.map((dado) => (
            <div key={dado.rotulo}>
              <dt className={estilos.rotulo}>{dado.rotulo}</dt>
              <dd className={estilos.valor}>{dado.valor}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {observacao ? <p className={estilos.observacao}>{observacao}</p> : null}
      {acoes ? <div className={estilos.acoes}>{acoes}</div> : null}
    </article>
  );
}

function primeiraLetra(nome: string): string {
  return nome.trim().charAt(0).toUpperCase();
}

import Link from "next/link";

import estilos from "./acao-rapida.module.css";

export interface AcaoRapidaProps {
  /** Titulo da acao, em verbo ("Registrar uma venda"). */
  readonly titulo: string;
  /** O que o usuario ganha ao entrar aqui. */
  readonly descricao: string;
  readonly rota: string;
  /** Texto do link no rodape do cartao. */
  readonly chamada?: string;
  /** Uma ou duas letras/simbolo que ajudam a reconhecer o cartao de relance. */
  readonly marca?: string;
  /** Cartao em destaque (usado para a entrada principal de cada area). */
  readonly destaque?: boolean;
}

/**
 * Cartao-atalho: leva a uma tela, explicando antes o que ha nela.
 *
 * E um <Link> inteiro — nao uma <div> com onClick — para funcionar no teclado,
 * no leitor de tela e no "abrir em nova aba".
 */
export function AcaoRapida({ titulo, descricao, rota, chamada = "Abrir", marca, destaque = false }: AcaoRapidaProps) {
  return (
    <Link href={rota} className={`${estilos.acao} ${destaque ? estilos.destaque : ""}`}>
      {marca ? (
        <span className={estilos.marca} aria-hidden="true">
          {marca}
        </span>
      ) : null}
      <span className={estilos.titulo}>{titulo}</span>
      <span className={estilos.descricao}>{descricao}</span>
      <span className={estilos.chamada}>{chamada}</span>
    </Link>
  );
}

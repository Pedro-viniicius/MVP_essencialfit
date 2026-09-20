import Link from "next/link";

import { Logotipo } from "../marca/logotipo";
import estilos from "./cabecalho-demonstracao.module.css";

export interface CabecalhoDemonstracaoProps {
  /** Unidade/loja exibida ao lado da marca ("Loja Centro"). */
  readonly unidade: string;
  /** Rota do botao de destaque. */
  readonly rotaIdeias?: string;
}

/**
 * Cabecalho da area de demonstracao.
 *
 * Diferencas em relacao ao cabecalho do sistema: nao ha sessao nem troca de
 * empresa, e existe um selo dizendo com todas as letras que os dados sao de
 * exemplo. Demonstracao honesta e demonstracao que diz o que e.
 */
export function CabecalhoDemonstracao({ unidade, rotaIdeias = "/ideias" }: CabecalhoDemonstracaoProps) {
  return (
    <header className={estilos.cabecalho}>
      <Link href="/demonstracoes/inicio" className={estilos.marca} aria-label="Ir para o início">
        <Logotipo comAssinatura />
      </Link>

      <div className={estilos.unidade}>
        <span className={estilos.rotuloUnidade}>Unidade</span>
        <span className={estilos.nomeUnidade}>{unidade}</span>
      </div>

      <div className={estilos.busca}>
        <label className="apenas-leitor-de-tela" htmlFor="busca-demonstracao">
          Buscar cliente, produto ou venda
        </label>
        <input
          id="busca-demonstracao"
          type="search"
          className={estilos.campoBusca}
          placeholder="Buscar cliente, produto ou venda"
        />
      </div>

      <div className={estilos.direita}>
        <span className={estilos.selo}>
          <span aria-hidden="true">•</span> Demonstração com dados de exemplo
        </span>
        <Link href={rotaIdeias} className={estilos.ideias}>
          Ideias IA
        </Link>
        <Link href="/entrar" className={estilos.entrar}>
          Entrar no sistema
        </Link>
      </div>
    </header>
  );
}

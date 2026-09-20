"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NAVEGACAO_APOIO,
  rotaAtiva,
  type GrupoDeMenu,
  type ItemDeMenu,
} from "./mapa-navegacao";
import estilos from "./navegacao-lateral.module.css";

export interface NavegacaoLateralProps {
  /** Grupos ja filtrados pelas permissoes do usuario. */
  readonly grupos: readonly GrupoDeMenu[];
  readonly itensDeApoio?: readonly ItemDeMenu[];
  /** Contadores por rota. Apenas duas rotas exibem contador (ver mapa-navegacao). */
  readonly contadores?: Readonly<Record<string, number>>;
  /**
   * `fixa` (padrao): barra lateral do desktop/tablet.
   * `painel`: mesma lista dentro do painel deslizante do celular; ocupa a
   * largura disponivel e nunca e escondida pelo CSS responsivo.
   */
  readonly variante?: "fixa" | "painel";
}

/**
 * Barra lateral fixa.
 *
 * O item ativo e marcado por tres sinais simultaneos: fundo, barra vertical e
 * `aria-current="page"` — nunca so por cor (docs/ux/navegacao.md, secao 2).
 */
export function NavegacaoLateral({
  grupos,
  itensDeApoio = NAVEGACAO_APOIO,
  contadores = {},
  variante = "fixa",
}: NavegacaoLateralProps) {
  const rotaAtual = usePathname() ?? "/";

  return (
    <nav
      className={`${estilos.barra} ${variante === "painel" ? estilos.painel : ""}`}
      aria-label="Navegação principal"
    >
      {grupos.map((grupo) => (
        <div key={grupo.rotulo || "inicio"} className={estilos.grupo}>
          {grupo.rotulo ? <p className={estilos.rotuloGrupo}>{grupo.rotulo}</p> : null}
          <ul>
            {grupo.itens.map((item) => (
              <LinhaDeNavegacao
                key={item.rota}
                item={item}
                ativo={rotaAtiva(rotaAtual, item.rota, item.exata)}
                {...(contadores[item.rota] !== undefined ? { contador: contadores[item.rota] } : {})}
              />
            ))}
          </ul>
        </div>
      ))}

      <div className={estilos.apoio}>
        <ul>
          {itensDeApoio.map((item) => (
            <LinhaDeNavegacao key={item.rota} item={item} ativo={rotaAtiva(rotaAtual, item.rota, item.exata)} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function LinhaDeNavegacao({
  item,
  ativo,
  contador,
}: {
  readonly item: ItemDeMenu;
  readonly ativo: boolean;
  readonly contador?: number;
}) {
  return (
    <li>
      <Link
        href={item.rota}
        className={`${estilos.item} ${ativo ? estilos.ativo : ""}`}
        title={item.descricao}
        {...(ativo ? { "aria-current": "page" as const } : {})}
      >
        <span className={estilos.rotulo}>{item.rotulo}</span>
        {/* Na barra compacta (tablet) o rotulo e escondido; a sigla ocupa o lugar. */}
        <span className={estilos.sigla} aria-hidden="true">
          {item.sigla ?? item.rotulo.slice(0, 2)}
        </span>
        {item.aceitaContador === true && contador !== undefined && contador > 0 ? (
          <span className={estilos.contador}>
            {contador}
            <span className="apenas-leitor-de-tela"> itens precisam de atenção</span>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

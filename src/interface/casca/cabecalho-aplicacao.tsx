"use client";

import { Logotipo } from "../marca/logotipo";
import estilos from "./cabecalho-aplicacao.module.css";

export interface EmpresaDoCabecalho {
  readonly id: string;
  readonly nome: string;
}

export interface CabecalhoAplicacaoProps {
  readonly nomeDaEmpresa: string;
  readonly nomeDoUsuario: string;
  /** Papel na empresa ativa; mostrado para explicar acoes ausentes. */
  readonly papelDoUsuario: string;
  readonly pontosDeAtencao?: number;
  /** Empresas que o usuario pode ativar. Com mais de uma, o seletor aparece. */
  readonly empresas?: readonly EmpresaDoCabecalho[];
  readonly empresaAtivaId?: string;
  /** Server action que valida e grava a troca (recebe `empresaId` no FormData). */
  readonly aoTrocarEmpresa?: (formulario: FormData) => Promise<void>;
  /** Server action que encerra a sessao. */
  readonly aoSair?: () => Promise<void>;
}

/**
 * Cabecalho fixo: empresa ativa, busca, avisos e usuario.
 *
 * O seletor de empresa fica no primeiro lugar do cabecalho porque lancar na
 * empresa errada e o erro mais caro do produto (Carlos, BPO). A troca e um
 * formulario de verdade: funciona sem JavaScript; com JavaScript, envia ao
 * mudar a opcao. A validacao de acesso acontece no servidor.
 */
export function CabecalhoAplicacao({
  nomeDaEmpresa,
  nomeDoUsuario,
  papelDoUsuario,
  pontosDeAtencao = 0,
  empresas = [],
  empresaAtivaId,
  aoTrocarEmpresa,
  aoSair,
}: CabecalhoAplicacaoProps) {
  const podeTrocar = empresas.length > 1 && aoTrocarEmpresa !== undefined;

  return (
    <header className={estilos.cabecalho}>
      <span className={estilos.marca}>
        <Logotipo tamanho="pequeno" />
      </span>

      {podeTrocar ? (
        <form action={aoTrocarEmpresa} className={estilos.empresa}>
          <label className={estilos.rotuloEmpresa} htmlFor="empresa-ativa">
            Empresa
          </label>
          <span className={estilos.seletorEmpresa}>
            <select
              id="empresa-ativa"
              name="empresaId"
              className={estilos.selectEmpresa}
              defaultValue={empresaAtivaId}
              onChange={(evento) => evento.currentTarget.form?.requestSubmit()}
            >
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </option>
              ))}
            </select>
            <button type="submit" className={estilos.botaoTrocar}>
              Trocar
            </button>
          </span>
        </form>
      ) : (
        <div className={estilos.empresa} aria-label={`Empresa ativa: ${nomeDaEmpresa}`}>
          <span className={estilos.rotuloEmpresa}>Empresa</span>
          <span className={estilos.nomeEmpresa}>{nomeDaEmpresa}</span>
        </div>
      )}

      <div className={estilos.busca}>
        <label className="apenas-leitor-de-tela" htmlFor="busca-global">
          Buscar fornecedor, cliente, código ou valor
        </label>
        <input
          id="busca-global"
          type="search"
          className={estilos.campoBusca}
          placeholder="Buscar (Ctrl+K)"
        />
      </div>

      <button type="button" className={estilos.acao} aria-label={`Avisos: ${pontosDeAtencao} pontos de atenção`}>
        <span aria-hidden="true">Avisos</span>
        {pontosDeAtencao > 0 ? <span className={estilos.contador}>{pontosDeAtencao}</span> : null}
      </button>

      <div className={estilos.usuario}>
        <span className={estilos.nomeUsuario}>{nomeDoUsuario}</span>
        <span className={estilos.papel}>{papelDoUsuario}</span>
      </div>

      {aoSair ? (
        <form action={aoSair}>
          <button type="submit" className={estilos.acao}>
            Sair
          </button>
        </form>
      ) : null}
    </header>
  );
}

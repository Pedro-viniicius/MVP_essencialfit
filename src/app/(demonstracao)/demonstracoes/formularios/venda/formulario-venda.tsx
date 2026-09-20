"use client";

import { useMemo, useState } from "react";

import { Dinheiro } from "@/compartilhado/dinheiro/indice";
import {
  Aviso,
  Botao,
  CampoDinheiro,
  CampoFormulario,
  EstadoVazio,
  SeletorEntidade,
  type OpcaoEntidade,
} from "@/interface/componentes/indice";

import { CLIENTES_PARA_VENDA } from "../../../dados/clientes";
import { MAIS_VENDIDOS, PRODUTOS, PRODUTOS_PARA_VENDA } from "../../../dados/produtos";
import estilos from "./venda.module.css";

interface ItemDaVenda {
  readonly sku: string;
  readonly nome: string;
  readonly preco: string;
  readonly quantidade: number;
}

const FORMAS = ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"] as const;

/**
 * Formulario 2 — Venda: "Como registrar uma venda com o minimo de esforco?"
 *
 * Filosofia desta tela: velocidade. Tudo acontece em uma tela so, sem abrir
 * janela nem trocar de aba: atalhos para os campeoes de venda, busca por
 * qualquer parte do nome, quantidade em dois cliques, total sempre visivel.
 * O cliente e opcional — venda de balcao nao pode travar por cadastro.
 */
export function FormularioVenda() {
  const [itens, definirItens] = useState<readonly ItemDaVenda[]>([]);
  const [cliente, definirCliente] = useState<OpcaoEntidade | undefined>(undefined);
  const [desconto, definirDesconto] = useState<string>("");
  const [forma, definirForma] = useState<string>("Pix");
  const [confirmada, definirConfirmada] = useState<string | null>(null);

  const subtotal = useMemo(
    () =>
      Dinheiro.somarTodos(itens.map((item) => Dinheiro.deTexto(item.preco).multiplicarPorInteiro(item.quantidade))),
    [itens],
  );
  const descontoValor = desconto === "" ? Dinheiro.zero() : Dinheiro.deTexto(desconto);
  const total = subtotal.subtrair(descontoValor);
  const unidades = itens.reduce((soma, item) => soma + item.quantidade, 0);

  function acrescentar(sku: string) {
    const produto = PRODUTOS.find((item) => item.sku === sku);
    if (!produto) return;
    definirConfirmada(null);
    definirItens((atuais) => {
      const existente = atuais.find((item) => item.sku === sku);
      if (existente) {
        return atuais.map((item) => (item.sku === sku ? { ...item, quantidade: item.quantidade + 1 } : item));
      }
      return [...atuais, { sku, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
    });
  }

  function mudarQuantidade(sku: string, passo: number) {
    definirItens((atuais) =>
      atuais
        .map((item) => (item.sku === sku ? { ...item, quantidade: item.quantidade + passo } : item))
        .filter((item) => item.quantidade > 0),
    );
  }

  function confirmar() {
    if (itens.length === 0) return;
    definirConfirmada(total.formatarBrasileiro());
    definirItens([]);
    definirDesconto("");
    definirCliente(undefined);
  }

  // Sugestao de item complementar: aparece quando ha suplemento e nao ha acessorio.
  const sugereAcessorio =
    itens.some((item) => item.sku.startsWith("SUP-")) && !itens.some((item) => item.sku.startsWith("ACE-"));

  return (
    <div className={estilos.balcao}>
      <div className={estilos.coluna}>
        {confirmada ? (
          <Aviso tom="sucesso" titulo={`Venda de ${confirmada} registrada`} urgente>
            Na demonstração nada é gravado e nenhum pagamento é processado. No sistema real, o estoque já teria sido
            baixado e a venda apareceria no faturamento do dia.
          </Aviso>
        ) : null}

        <div className={estilos.bloco}>
          <p className={estilos.tituloBloco}>Produtos</p>

          <CampoFormulario id="busca-produto" rotulo="Buscar produto" dica="Digite qualquer parte do nome e use as setas do teclado.">
            {(atributos) => (
              <SeletorEntidade
                {...atributos}
                tipo="Produto"
                opcoes={PRODUTOS_PARA_VENDA}
                aoSelecionar={(opcao) => acrescentar(opcao.id)}
              />
            )}
          </CampoFormulario>

          <div>
            <p className={estilos.tituloBloco}>Mais vendidos hoje</p>
            <div className={estilos.atalhos}>
              {MAIS_VENDIDOS.slice(0, 5).map((produto) => (
                <button
                  key={produto.sku}
                  type="button"
                  className={estilos.atalho}
                  onClick={() => acrescentar(produto.sku)}
                >
                  <span>{produto.nome}</span>
                  <span className={estilos.precoAtalho}>
                    {Dinheiro.deTexto(produto.preco).formatarBrasileiro()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={estilos.bloco}>
          <p className={estilos.tituloBloco}>Itens da venda</p>
          {itens.length === 0 ? (
            <EstadoVazio
              titulo="Nenhum item ainda"
              explicacao="Use a busca ou um dos atalhos acima. Cada clique acrescenta uma unidade."
            />
          ) : (
            <div className={estilos.itens}>
              {itens.map((item) => (
                <div key={item.sku} className={estilos.item}>
                  <div className={estilos.nomeItem}>
                    {item.nome}
                    <div className={estilos.precoUnitario}>
                      {Dinheiro.deTexto(item.preco).formatarBrasileiro()} cada
                    </div>
                  </div>
                  <div className={estilos.quantidade}>
                    <button
                      type="button"
                      className={estilos.botaoQuantidade}
                      onClick={() => mudarQuantidade(item.sku, -1)}
                      aria-label={`Tirar uma unidade de ${item.nome}`}
                    >
                      −
                    </button>
                    <span className={estilos.numeroQuantidade}>{item.quantidade}</span>
                    <button
                      type="button"
                      className={estilos.botaoQuantidade}
                      onClick={() => mudarQuantidade(item.sku, 1)}
                      aria-label={`Acrescentar uma unidade de ${item.nome}`}
                    >
                      +
                    </button>
                  </div>
                  <span className={estilos.valorItem}>
                    {Dinheiro.deTexto(item.preco).multiplicarPorInteiro(item.quantidade).formatarBrasileiro()}
                  </span>
                  <button
                    type="button"
                    className={estilos.remover}
                    onClick={() => definirItens((atuais) => atuais.filter((outro) => outro.sku !== item.sku))}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {sugereAcessorio ? (
            <p className={estilos.sugestao}>
              Quem leva suplemento costuma precisar de coqueteleira. Vale oferecer — são R$ 39,90 com a maior margem
              da loja.
            </p>
          ) : null}
        </div>
      </div>

      <div className={estilos.coluna}>
        <div className={estilos.bloco}>
          <p className={estilos.tituloBloco}>Fechamento</p>

          <CampoFormulario id="cliente-venda" rotulo="Cliente" dica="Opcional. Sem cliente, a venda é registrada como balcão.">
            {(atributos) => (
              <SeletorEntidade
                {...atributos}
                tipo="Cliente"
                opcoes={CLIENTES_PARA_VENDA}
                {...(cliente ? { selecionado: cliente } : {})}
                aoSelecionar={definirCliente}
                aoCriar={(nome) => definirCliente({ id: `novo-${nome}`, rotulo: nome })}
              />
            )}
          </CampoFormulario>

          <CampoFormulario id="desconto" rotulo="Desconto" dica="Em reais. Deixe vazio se não houver.">
            {(atributos) => (
              <CampoDinheiro {...atributos} valor={desconto} aoAlterar={(valor) => definirDesconto(valor ?? "")} />
            )}
          </CampoFormulario>

          <fieldset>
            <legend className={estilos.tituloBloco}>Forma de pagamento</legend>
            <div className={estilos.formasPagamento}>
              {FORMAS.map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  className={`${estilos.forma} ${forma === opcao ? estilos.formaEscolhida : ""}`}
                  aria-pressed={forma === opcao}
                  onClick={() => definirForma(opcao)}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </fieldset>

          <div className={estilos.resumo}>
            <p className={estilos.linhaResumo}>
              <span className={estilos.rotuloResumo}>
                Subtotal ({unidades} {unidades === 1 ? "item" : "itens"})
              </span>
              <span>{subtotal.formatarBrasileiro()}</span>
            </p>
            <p className={estilos.linhaResumo}>
              <span className={estilos.rotuloResumo}>Desconto</span>
              <span>{descontoValor.ehZero() ? "—" : `- ${descontoValor.formatarBrasileiro()}`}</span>
            </p>
            <p className={estilos.total}>
              <span className={estilos.rotuloTotal}>Total</span>
              <span className={estilos.valorTotal}>{total.formatarBrasileiro()}</span>
            </p>
          </div>

          <Botao
            variante="primario"
            onClick={confirmar}
            disabled={itens.length === 0}
            {...(itens.length === 0 ? { motivoDesabilitado: "Acrescente ao menos um produto para fechar a venda." } : {})}
          >
            Confirmar venda em {forma}
          </Botao>
        </div>
      </div>
    </div>
  );
}

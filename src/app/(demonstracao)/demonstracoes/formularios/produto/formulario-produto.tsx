"use client";

import { useState } from "react";

import { Dinheiro } from "@/compartilhado/dinheiro/indice";
import {
  Aviso,
  Botao,
  CampoDinheiro,
  CampoFormulario,
  SecaoFormulario,
} from "@/interface/componentes/indice";

import { PRODUTOS } from "../../../dados/produtos";
import estilos from "./produto.module.css";

const CATEGORIAS = ["Suplementos", "Saúde", "Alimentos", "Acessórios", "Vestuário"] as const;
const FORNECEDORES = [...new Set(PRODUTOS.map((produto) => produto.fornecedor))];

/**
 * Formulario 3 — Produto: "O que precisamos saber para tomar boas decisoes
 * sobre este produto?"
 *
 * Filosofia desta tela: analise. Enquanto preco e custo sao digitados, o
 * sistema escreve em portugues o que aquilo significa — margem por unidade,
 * percentual e quanto de dinheiro o estoque representa. O cadastro deixa de
 * ser arquivo e vira apoio a decisao.
 */
export function FormularioProduto() {
  const [nome, definirNome] = useState("Colágeno Verisol 300g");
  const [categoria, definirCategoria] = useState<string>("Saúde");
  const [sku, definirSku] = useState("SAU-COL-300");
  const [preco, definirPreco] = useState("119.90");
  const [custo, definirCusto] = useState("62.00");
  const [estoque, definirEstoque] = useState(14);
  const [estoqueMinimo, definirEstoqueMinimo] = useState(8);
  const [fornecedor, definirFornecedor] = useState(FORNECEDORES[0] ?? "");
  const [ativo, definirAtivo] = useState(true);
  const [observacoes, definirObservacoes] = useState("");
  const [salvo, definirSalvo] = useState(false);

  const precoValido = preco !== "";
  const custoValido = custo !== "";
  const precoDinheiro = precoValido ? Dinheiro.deTexto(preco) : Dinheiro.zero();
  const custoDinheiro = custoValido ? Dinheiro.deTexto(custo) : Dinheiro.zero();
  const lucro = precoDinheiro.subtrair(custoDinheiro);
  const temCalculo = precoValido && custoValido && !precoDinheiro.ehZero();
  const percentual = temCalculo ? lucro.percentualSobre(precoDinheiro).formatarBrasileiro() : "—";
  const capital = custoDinheiro.multiplicarPorInteiro(estoque);
  const lucroDoEstoque = lucro.multiplicarPorInteiro(estoque);

  return (
    <form
      className={estilos.formulario}
      onSubmit={(evento) => {
        evento.preventDefault();
        definirSalvo(true);
      }}
      noValidate
    >
      {salvo ? (
        <Aviso tom="sucesso" titulo="Produto salvo">
          Na demonstração nada é gravado. No sistema real, este produto já entraria na busca da venda, no painel de
          produtos e no controle de estoque.
        </Aviso>
      ) : null}

      <SecaoFormulario titulo="Identificação" explicacao="Como este produto aparece na busca e na etiqueta.">
        <div className={estilos.duplo}>
          <CampoFormulario id="produto-nome" rotulo="Nome" obrigatorio>
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="text"
                value={nome}
                onChange={(evento) => definirNome(evento.target.value)}
              />
            )}
          </CampoFormulario>

          <CampoFormulario id="produto-categoria" rotulo="Categoria" obrigatorio>
            {(atributos) => (
              <select
                {...atributos}
                className={estilos.controle}
                value={categoria}
                onChange={(evento) => definirCategoria(evento.target.value)}
              >
                {CATEGORIAS.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            )}
          </CampoFormulario>
        </div>

        <div className={estilos.duplo}>
          <CampoFormulario id="produto-sku" rotulo="Código (SKU)" dica="Usado na conferência de estoque e no pedido ao fornecedor.">
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="text"
                value={sku}
                onChange={(evento) => definirSku(evento.target.value)}
              />
            )}
          </CampoFormulario>

          <CampoFormulario id="produto-fornecedor" rotulo="Fornecedor">
            {(atributos) => (
              <select
                {...atributos}
                className={estilos.controle}
                value={fornecedor}
                onChange={(evento) => definirFornecedor(evento.target.value)}
              >
                {FORNECEDORES.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            )}
          </CampoFormulario>
        </div>
      </SecaoFormulario>

      <SecaoFormulario titulo="Preço e custo" explicacao="Os dois números que decidem se vale a pena vender este produto.">
        <div className={estilos.duplo}>
          <CampoFormulario id="produto-preco" rotulo="Preço de venda" obrigatorio>
            {(atributos) => (
              <CampoDinheiro {...atributos} valor={preco} aoAlterar={(valor) => definirPreco(valor ?? "")} />
            )}
          </CampoFormulario>

          <CampoFormulario id="produto-custo" rotulo="Custo de compra" obrigatorio dica="Quanto você paga ao fornecedor por unidade.">
            {(atributos) => (
              <CampoDinheiro {...atributos} valor={custo} aoAlterar={(valor) => definirCusto(valor ?? "")} />
            )}
          </CampoFormulario>
        </div>

        <div className={estilos.resultado} aria-live="polite">
          {temCalculo ? (
            <>
              <p className={estilos.frase}>
                Vendendo por <strong>{precoDinheiro.formatarBrasileiro()}</strong> com custo de{" "}
                <strong>{custoDinheiro.formatarBrasileiro()}</strong>, a margem bruta estimada é de{" "}
                <strong>{lucro.formatarBrasileiro()}</strong> por unidade.
              </p>
              <dl className={estilos.numeros}>
                <div>
                  <dt className={estilos.rotuloNumero}>Lucro por unidade</dt>
                  <dd className={estilos.valorNumero}>{lucro.formatarBrasileiro()}</dd>
                </div>
                <div>
                  <dt className={estilos.rotuloNumero}>Margem sobre o preço</dt>
                  <dd className={estilos.valorNumero}>{percentual}</dd>
                </div>
                <div>
                  <dt className={estilos.rotuloNumero}>Dinheiro neste estoque</dt>
                  <dd className={estilos.valorNumero}>{capital.formatarBrasileiro()}</dd>
                </div>
                <div>
                  <dt className={estilos.rotuloNumero}>Se vender tudo, sobra</dt>
                  <dd className={estilos.valorNumero}>{lucroDoEstoque.formatarBrasileiro()}</dd>
                </div>
              </dl>
              {lucro.ehNegativo() ? (
                <p className={estilos.alerta}>
                  Do jeito que está, cada venda sai mais cara do que o que entra: o custo é maior que o preço.
                </p>
              ) : null}
            </>
          ) : (
            <p className={estilos.frase}>Preencha preço e custo para ver quanto sobra em cada venda.</p>
          )}
        </div>
      </SecaoFormulario>

      <SecaoFormulario titulo="Estoque" explicacao="O mínimo é o ponto em que o sistema avisa antes de faltar.">
        <div className={estilos.duplo}>
          <CampoFormulario id="produto-estoque" rotulo="Estoque atual">
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="number"
                min={0}
                inputMode="numeric"
                value={estoque}
                onChange={(evento) => definirEstoque(Number(evento.target.value) || 0)}
              />
            )}
          </CampoFormulario>

          <CampoFormulario
            id="produto-estoque-minimo"
            rotulo="Estoque mínimo"
            dica="Abaixo disso, o produto aparece na lista de reposição."
            {...(estoque < estoqueMinimo
              ? { aviso: "O estoque atual já está abaixo do mínimo definido." }
              : {})}
          >
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="number"
                min={0}
                inputMode="numeric"
                value={estoqueMinimo}
                onChange={(evento) => definirEstoqueMinimo(Number(evento.target.value) || 0)}
              />
            )}
          </CampoFormulario>
        </div>

        <label className={estilos.interruptor}>
          <input type="checkbox" checked={ativo} onChange={(evento) => definirAtivo(evento.target.checked)} />
          Produto ativo (aparece na venda e na vitrine)
        </label>
      </SecaoFormulario>

      <SecaoFormulario titulo="Observações" explicacao="Sabor, validade, condição do fornecedor." recolhida>
        <CampoFormulario id="produto-observacoes" rotulo="Anotações">
          {(atributos) => (
            <textarea
              {...atributos}
              className={estilos.area}
              value={observacoes}
              placeholder="Ex.: fornecedor entrega em 7 dias; pedido mínimo de 6 unidades."
              onChange={(evento) => definirObservacoes(evento.target.value)}
            />
          )}
        </CampoFormulario>
      </SecaoFormulario>

      <div className={estilos.acoes}>
        <Botao type="submit" variante="primario">
          Salvar produto
        </Botao>
        <span className={estilos.ajuda}>
          O cálculo de margem acontece enquanto você digita — não é preciso salvar para simular um preço.
        </span>
      </div>
    </form>
  );
}

import { describe, expect, it } from "vitest";

import { Dinheiro } from "@/compartilhado/dinheiro/indice";

import { focoAtual, ideiasDoFoco, IDEIAS } from "./ideias";
import {
  capitalTotalEmEstoque,
  faturamentoDoProduto,
  lucroPorUnidade,
  PRODUTOS,
  PRODUTOS_ESTOQUE_BAIXO,
} from "./produtos";
import { FATURAMENTO_POR_CATEGORIA, RESULTADO, RESUMO_ESTOQUE } from "./resultados";

/**
 * A demonstracao so convence se os numeros fecharem. Um cliente atento soma o
 * que ve na tela — e deve chegar ao mesmo total. Estes testes travam a
 * coerencia entre os dados de exemplo e os resumos exibidos.
 */
describe("dados de demonstracao", () => {
  it("o faturamento do mes e a soma de preco x unidades de cada produto", () => {
    const somado = Dinheiro.somarTodos(PRODUTOS.map(faturamentoDoProduto));
    expect(somado.paraTexto()).toBe(RESULTADO.faturamento);
  });

  it("o ticket medio e o faturamento dividido pelas vendas", () => {
    const faturado = Dinheiro.deTexto(RESULTADO.faturamento);
    const porVenda = faturado.dividirEmParcelas(RESULTADO.vendas);
    // A divisao nao e exata: a sobra de centavos vai para as primeiras vendas.
    // O ticket medio exibido e o piso dessa divisao.
    expect(porVenda.at(-1)?.paraTexto()).toBe(RESULTADO.ticketMedio);
    expect(Dinheiro.somarTodos(porVenda).paraTexto()).toBe(RESULTADO.faturamento);
  });

  it("a margem bruta e o faturamento menos o custo das unidades vendidas", () => {
    const margem = Dinheiro.somarTodos(
      PRODUTOS.map((produto) => lucroPorUnidade(produto).multiplicarPorInteiro(produto.vendidos)),
    );
    expect(margem.paraTexto()).toBe(RESULTADO.margemBruta);
  });

  it("o capital em estoque e a soma de custo x quantidade", () => {
    expect(capitalTotalEmEstoque().paraTexto()).toBe(RESUMO_ESTOQUE.capitalParado);
  });

  it("a contagem de estoque baixo bate com o catalogo", () => {
    expect(PRODUTOS_ESTOQUE_BAIXO.length).toBe(RESUMO_ESTOQUE.itensAbaixoDoMinimo);
  });

  it("as categorias somam o faturamento inteiro", () => {
    const somado = Dinheiro.somarTodos(
      FATURAMENTO_POR_CATEGORIA.map((categoria) => Dinheiro.deTexto(categoria.faturamento)),
    );
    expect(somado.paraTexto()).toBe(RESULTADO.faturamento);
  });

  it("nenhum produto tem custo maior que o preco", () => {
    for (const produto of PRODUTOS) {
      expect(lucroPorUnidade(produto).ehPositivo()).toBe(true);
    }
  });
});

describe("ideias da IA", () => {
  it("toda ideia tem as quatro camadas e a base da sugestao", () => {
    for (const ideia of IDEIAS) {
      expect(ideia.oQuePercebemos.length).toBeGreaterThan(20);
      expect(ideia.ideia.length).toBeGreaterThan(20);
      expect(ideia.porQuePodeFuncionar.length).toBeGreaterThan(20);
      expect(ideia.comoTestar.length).toBeGreaterThan(20);
      expect(ideia.baseDaSugestao.length).toBeGreaterThan(20);
    }
  });

  it("nenhuma ideia promete numero de resultado futuro", () => {
    // Precisao falsa ("crescimento de 37,8%") e proibida enquanto nao ha modelo.
    for (const ideia of IDEIAS) {
      expect(`${ideia.ideia} ${ideia.porQuePodeFuncionar}`).not.toMatch(/\d+,\d+\s?%/);
    }
  });

  it("o recorte da URL filtra as ideias e cai em `tudo` quando e desconhecido", () => {
    expect(ideiasDoFoco("estoque").every((ideia) => ideia.focos.includes("estoque"))).toBe(true);
    expect(ideiasDoFoco(undefined)).toHaveLength(IDEIAS.length);
    expect(focoAtual("inventado").chave).toBe("tudo");
    expect(focoAtual("clientes").chave).toBe("clientes");
  });
});

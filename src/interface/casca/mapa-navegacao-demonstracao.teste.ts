import { describe, expect, it } from "vitest";

import { APOIO_DEMONSTRACAO, NAVEGACAO_DEMONSTRACAO, ROTAS_BARRA_INFERIOR_DEMONSTRACAO } from "./mapa-navegacao-demonstracao";
import { rotaAtiva } from "./mapa-navegacao";

describe("navegacao da demonstracao", () => {
  const todos = [...NAVEGACAO_DEMONSTRACAO.flatMap((grupo) => grupo.itens), ...APOIO_DEMONSTRACAO];

  it("nao repete rota entre os itens do menu", () => {
    const rotas = todos.map((item) => item.rota);
    expect(new Set(rotas).size).toBe(rotas.length);
  });

  it("todo item tem rotulo, descricao e sigla para a barra compacta", () => {
    for (const item of todos) {
      expect(item.rotulo.length).toBeGreaterThan(0);
      expect(item.descricao.length).toBeGreaterThan(0);
      expect(item.sigla).toBeDefined();
    }
  });

  it("a barra inferior do celular aponta para rotas que existem no menu", () => {
    const rotas = new Set(todos.map((item) => item.rota));
    for (const rota of ROTAS_BARRA_INFERIOR_DEMONSTRACAO) {
      expect(rotas.has(rota)).toBe(true);
    }
  });

  it("a capa das demonstracoes so fica ativa na rota exata", () => {
    expect(rotaAtiva("/demonstracoes", "/demonstracoes", true)).toBe(true);
    expect(rotaAtiva("/demonstracoes/inicio", "/demonstracoes", true)).toBe(false);
    // Sem `exata`, a subrota manteria a capa acesa junto com o item real.
    expect(rotaAtiva("/demonstracoes/inicio", "/demonstracoes")).toBe(true);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CabecalhoAplicacao } from "../casca/cabecalho-aplicacao";
import { CascaSimples } from "../casca/casca-simples";
import { MARCA } from "./identidade";
import { Logotipo } from "./logotipo";

/**
 * A marca nao pode estar escrita dentro das telas: ela vem de `identidade.ts`.
 * Estes testes falham se alguem voltar a fixar um nome no meio de um
 * componente — que e exatamente o que impediria trocar de marca depois.
 */
describe("marca", () => {
  it("o logotipo usa o nome da identidade e tem texto alternativo", () => {
    const html = renderToStaticMarkup(<Logotipo comAssinatura />);
    expect(html).toContain(MARCA.nome);
    expect(html).toContain(MARCA.assinatura);
    expect(html).toContain(`aria-label="Símbolo da ${MARCA.nome}"`);
  });

  it("as cores do simbolo vem de tokens, nunca de hexadecimal solto", () => {
    const html = renderToStaticMarkup(<Logotipo />);
    expect(html).toContain("var(--cor-marca-forte)");
    expect(html).not.toMatch(/fill="#[0-9a-f]{3,8}"/i);
  });

  it("a casca de entrada mostra a marca atual", () => {
    const html = renderToStaticMarkup(
      <CascaSimples>
        <p>conteudo</p>
      </CascaSimples>,
    );
    expect(html).toContain(MARCA.nome);
    expect(html).not.toContain("Financeiro");
  });

  it("o cabecalho do sistema mostra a marca e a empresa ativa", () => {
    const html = renderToStaticMarkup(
      <CabecalhoAplicacao nomeDaEmpresa="Essencial Fit Centro" nomeDoUsuario="Márcia" papelDoUsuario="Administrador" />,
    );
    expect(html).toContain(MARCA.nome);
    expect(html).toContain("Essencial Fit Centro");
  });
});

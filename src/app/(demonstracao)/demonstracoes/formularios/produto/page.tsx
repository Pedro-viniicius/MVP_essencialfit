import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPainel, CartaoInsight } from "@/interface/componentes/indice";

import estilos from "../../../demonstracao.module.css";
import { FormularioProduto } from "./formulario-produto";

export const metadata: Metadata = {
  title: "Cadastro de produto",
  description: "O que precisamos saber para tomar boas decisões sobre este produto?",
};

export default function PaginaFormularioProduto() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Formulário · Produto"
        pergunta="O que precisamos saber para tomar boas decisões sobre este produto?"
        resposta="Enquanto o preço e o custo são digitados, a tela responde quanto sobra em cada venda e quanto de dinheiro está parado naquele item."
        acoes={<Link href="/demonstracoes/formularios">Ver os outros formulários →</Link>}
      />

      <div className={estilos.duasColunas}>
        <FormularioProduto />

        <div className={estilos.pilha}>
          <CartaoInsight
            mensagem="Margem não é um campo: é uma consequência."
            contexto="Por isso ela não se digita. Ela aparece sozinha assim que o preço e o custo estão na tela — e muda junto com eles."
            tom="informacao"
          />
          <CartaoInsight
            mensagem="Experimente trocar o preço para R$ 129,90."
            contexto="A margem por unidade e o quanto sobra no estoque inteiro mudam na hora. É assim que se simula um ajuste de preço antes de fazê-lo na loja."
            tom="neutro"
          />
        </div>
      </div>
    </div>
  );
}

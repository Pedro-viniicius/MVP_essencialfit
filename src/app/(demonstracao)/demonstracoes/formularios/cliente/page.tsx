import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPainel, CartaoInsight } from "@/interface/componentes/indice";

import estilos from "../../../demonstracao.module.css";
import { FormularioCliente } from "./formulario-cliente";

export const metadata: Metadata = {
  title: "Cadastro de cliente",
  description: "Quem é essa pessoa e como podemos atendê-la melhor?",
};

export default function PaginaFormularioCliente() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Formulário · Cliente"
        pergunta="Quem é essa pessoa e como podemos atendê-la melhor?"
        resposta="Um cadastro curto, dividido em quatro partes, que guarda o que ajuda a atender melhor — e nada além disso."
        acoes={<Link href="/demonstracoes/formularios">Ver os outros formulários →</Link>}
      />

      <div className={estilos.duasColunas}>
        <FormularioCliente />

        <div className={estilos.pilha}>
          <CartaoInsight
            mensagem="Cadastro não é burocracia: é memória."
            contexto="Objetivo e interesses são o que permite, meses depois, saber que aquela pessoa provavelmente precisa repor a creatina — em vez de mandar a mesma oferta para todo mundo."
            tom="informacao"
          />
          <CartaoInsight
            mensagem="Dois campos obrigatórios, o resto é opcional."
            contexto="Quanto mais campos obrigatórios, mais cadastros incompletos e inventados. Aqui, o que falta hoje pode ser completado no próximo atendimento."
            tom="neutro"
          />
        </div>
      </div>
    </div>
  );
}

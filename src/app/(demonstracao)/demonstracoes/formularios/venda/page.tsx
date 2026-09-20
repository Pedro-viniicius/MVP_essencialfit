import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPainel } from "@/interface/componentes/indice";

import estilos from "../../../demonstracao.module.css";
import { FormularioVenda } from "./formulario-venda";

export const metadata: Metadata = {
  title: "Registrar venda",
  description: "Como registrar uma venda com o mínimo de esforço?",
};

export default function PaginaFormularioVenda() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Formulário · Venda"
        pergunta="Como registrar uma venda com o mínimo de esforço?"
        resposta="Uma tela só, do primeiro item ao total. Atalhos para o que mais sai, quantidade em dois cliques e o total sempre à vista."
        acoes={<Link href="/demonstracoes/formularios">Ver os outros formulários →</Link>}
      />

      <FormularioVenda />

      <p className={estilos.aviso}>
        Demonstração de interface de gestão: nenhum pagamento é processado e nenhuma venda é gravada.
      </p>
    </div>
  );
}

import type { Metadata } from "next";

import { AcaoRapida, CabecalhoPainel } from "@/interface/componentes/indice";

import estilos from "../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Formulários",
  description: "Três formas de transformar informação em ação: cliente, venda e produto.",
};

/**
 * Vitrine dos tres formularios.
 *
 * Nao sao tres telas parecidas: cada uma demonstra uma filosofia de uso
 * diferente — acolher, agilizar e analisar.
 */
export default function PaginaFormularios() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Formulários"
        pergunta="Três formas de transformar informação em ação"
        resposta="Cadastrar não é o objetivo: é o começo. Cada um destes formulários foi desenhado a partir de uma pergunta diferente sobre o negócio."
      />

      <div className={estilos.grade3}>
        <AcaoRapida
          marca="Cl"
          titulo="Conhecer o cliente"
          descricao="Cadastre informações sem transformar relacionamento em burocracia."
          rota="/demonstracoes/formularios/cliente"
          chamada="Ver formulário"
        />
        <AcaoRapida
          marca="Vd"
          titulo="Registrar uma venda"
          descricao="Faça em segundos o que normalmente exige várias telas."
          rota="/demonstracoes/formularios/venda"
          chamada="Ver formulário"
        />
        <AcaoRapida
          marca="Pr"
          titulo="Entender um produto"
          descricao="Transforme cadastro em informação para decisão."
          rota="/demonstracoes/formularios/produto"
          chamada="Ver formulário"
        />
      </div>

      <p className={estilos.aviso}>
        Os três formulários funcionam de verdade na tela: validam, calculam e confirmam. Como esta é uma área de
        demonstração, nada é gravado em banco de dados.
      </p>
    </div>
  );
}

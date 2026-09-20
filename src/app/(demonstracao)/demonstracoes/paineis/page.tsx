import type { Metadata } from "next";

import { AcaoRapida, CabecalhoPainel } from "@/interface/componentes/indice";

import estilos from "../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Painéis",
  description: "O mesmo negócio visto por três perguntas diferentes.",
};

/**
 * Vitrine dos tres paineis. Cada um existe para uma decisao diferente — nao
 * sao o mesmo grafico com cores trocadas.
 */
export default function PaginaPaineis() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Painéis"
        pergunta="O mesmo negócio visto por três perguntas diferentes"
        resposta="Os dados são os mesmos; o que muda é a decisão que cada tela ajuda a tomar. Comece pelo resultado, entenda quem está por trás dele e termine onde o dinheiro está."
      />

      <div className={estilos.grade3}>
        <AcaoRapida
          marca="1"
          titulo="Como está meu negócio?"
          descricao="Visão geral para o proprietário: faturamento, meta, margem e o que merece atenção agora."
          rota="/demonstracoes/paineis/visao-geral"
          chamada="Abrir painel"
        />
        <AcaoRapida
          marca="2"
          titulo="Quem está comprando?"
          descricao="Visão de clientes e relacionamento: quem volta sempre, quem chegou agora e quem sumiu."
          rota="/demonstracoes/paineis/clientes"
          chamada="Abrir painel"
        />
        <AcaoRapida
          marca="3"
          titulo="Onde está meu dinheiro?"
          descricao="Visão de produtos, margem e estoque: o que gira, o que para e quanto está na prateleira."
          rota="/demonstracoes/paineis/produtos"
          chamada="Abrir painel"
        />
      </div>
    </div>
  );
}

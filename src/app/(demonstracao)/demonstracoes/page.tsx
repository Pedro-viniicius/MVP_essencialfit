import type { Metadata } from "next";
import Link from "next/link";

import { AcaoRapida, CabecalhoPainel, TituloSecao } from "@/interface/componentes/indice";
import { MARCA } from "@/interface/marca/indice";

import estilos from "../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Experimente o sistema",
  description: "Formulários, painéis e ideias de IA da Essencial Fit, com dados de exemplo.",
};

/**
 * Porta de entrada da apresentacao: reune, em uma tela so, tudo o que pode
 * ser mostrado ao cliente — e na ordem em que faz sentido mostrar.
 */
export default function PaginaDemonstracoes() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Demonstração"
        pergunta="Experimente o sistema"
        resposta={`Cada tela abaixo responde a uma pergunta do dia a dia da ${MARCA.nome}. Todas usam dados de exemplo, com valores e nomes brasileiros, para que nada apareça vazio.`}
        periodo="Setembro de 2026"
      />

      <section className={estilos.secao}>
        <TituloSecao
          titulo="Formulários"
          explicacao="Três jeitos diferentes de transformar informação em ação."
          acao={<Link href="/demonstracoes/formularios">Ver os três juntos</Link>}
        />
        <div className={estilos.grade3}>
          <AcaoRapida
            marca="Cl"
            titulo="Cliente"
            descricao="Cadastre informações sem transformar relacionamento em burocracia."
            rota="/demonstracoes/formularios/cliente"
            chamada="Ver formulário"
          />
          <AcaoRapida
            marca="Vd"
            titulo="Venda"
            descricao="Faça em segundos o que normalmente exige várias telas."
            rota="/demonstracoes/formularios/venda"
            chamada="Ver formulário"
          />
          <AcaoRapida
            marca="Pr"
            titulo="Produto"
            descricao="Transforme cadastro em informação para decisão."
            rota="/demonstracoes/formularios/produto"
            chamada="Ver formulário"
          />
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao
          titulo="Painéis"
          explicacao="O mesmo negócio visto por três perguntas diferentes."
          acao={<Link href="/demonstracoes/paineis">Ver os três juntos</Link>}
        />
        <div className={estilos.grade3}>
          <AcaoRapida
            marca="Id"
            titulo="Visão geral"
            descricao="Como está meu negócio? Faturamento, meta, margem e o que merece atenção."
            rota="/demonstracoes/paineis/visao-geral"
            chamada="Abrir painel"
          />
          <AcaoRapida
            marca="Cl"
            titulo="Clientes"
            descricao="Quem está comprando, quem volta sempre e quem podemos trazer de volta."
            rota="/demonstracoes/paineis/clientes"
            chamada="Abrir painel"
          />
          <AcaoRapida
            marca="Pr"
            titulo="Produtos"
            descricao="O que vende, o que está parado e onde o seu dinheiro está hoje."
            rota="/demonstracoes/paineis/produtos"
            chamada="Abrir painel"
          />
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Ideias IA" explicacao="Veja como dados podem se transformar em possibilidades para o negócio." />
        <div className={estilos.grade2}>
          <AcaoRapida
            destaque
            marca="IA"
            titulo="Explorar ideias"
            descricao="Leituras do negócio explicadas em quatro camadas: o que percebemos, a ideia, por que pode funcionar e como testar."
            rota="/ideias"
            chamada="Explorar ideias"
          />
          <AcaoRapida
            marca="Es"
            titulo="Estoque"
            descricao="O que precisa ser reposto antes de faltar e quanto dinheiro está parado na prateleira."
            rota="/demonstracoes/estoque"
            chamada="Ver estoque"
          />
        </div>
      </section>

      <p className={estilos.aviso}>
        Esta área é uma demonstração: os números são exemplos construídos para a apresentação. O sistema real, com
        login, empresa ativa e banco de dados, continua em <Link href="/entrar">/entrar</Link>.
      </p>
    </div>
  );
}

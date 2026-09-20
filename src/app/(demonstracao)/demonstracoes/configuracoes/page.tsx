import type { Metadata } from "next";

import { CabecalhoPainel, CartaoInsight, TituloSecao } from "@/interface/componentes/indice";
import { Logotipo, MARCA } from "@/interface/marca/indice";

import { EMPRESA } from "../../dados/empresa";
import estilos from "../../demonstracao.module.css";
import proprios from "./configuracoes.module.css";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Identidade visual, dados da empresa e como personalizar o sistema para outra marca.",
};

/** As cores da marca, lidas dos tokens — trocar o tema troca esta tela junto. */
const CORES = [
  { nome: "Marca", token: "--cor-marca-forte" },
  { nome: "Marca (apoio)", token: "--cor-marca-media" },
  { nome: "Energia", token: "--cor-acento-grafico" },
  { nome: "Sucesso", token: "--cor-sucesso-forte" },
  { nome: "Atenção", token: "--cor-atencao-forte" },
  { nome: "Perigo", token: "--cor-perigo-forte" },
];

const ARQUIVOS = [
  {
    caminho: "src/interface/marca/identidade.ts",
    paraQue: "Nome, nome curto, sigla, assinatura e as perguntas que dão título às telas.",
  },
  {
    caminho: "src/interface/marca/tema-essencial-fit.css",
    paraQue: "Todas as cores, o raio dos cantos, as sombras e a tipografia. É aqui que uma marca vira outra.",
  },
  {
    caminho: "src/interface/marca/logotipo.tsx",
    paraQue: "O símbolo em SVG. Usa as cores da marca, então acompanha a troca de tema sozinho.",
  },
  {
    caminho: "src/interface/tokens/tokens.css",
    paraQue: "Os valores neutros do sistema (espaçamento, tamanhos de texto, camadas). Raramente mudam por marca.",
  },
  {
    caminho: "src/interface/casca/mapa-navegacao-demonstracao.ts",
    paraQue: "Os nomes e a ordem dos itens do menu. Mudar o vocabulário do cliente é mudar este arquivo.",
  },
];

/**
 * Configuracoes da demonstracao.
 *
 * Alem dos dados da empresa, esta tela existe para responder a pergunta que
 * todo cliente faz na apresentacao: "isso aqui fica com a cara da minha
 * empresa?". A resposta e concreta — sao cinco arquivos.
 */
export default function PaginaConfiguracoes() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Configurações"
        pergunta="O sistema fica com a cara da sua empresa?"
        resposta="Fica. A identidade não está espalhada pelas telas: ela mora em um punhado de arquivos, e trocar os valores deles veste o mesmo sistema com outra marca."
      />

      <div className={estilos.duasColunas}>
        <section className={estilos.secao}>
          <TituloSecao titulo="Identidade atual" />
          <div className={estilos.bloco}>
            <p>
              <Logotipo tamanho="grande" comAssinatura />
            </p>
            <dl className={estilos.pilha}>
              <div>
                <dt className={proprios.paraQue}>Nome</dt>
                <dd>
                  <strong>{MARCA.nome}</strong>
                </dd>
              </div>
              <div>
                <dt className={proprios.paraQue}>Assinatura</dt>
                <dd>{MARCA.assinatura}</dd>
              </div>
              <div>
                <dt className={proprios.paraQue}>Unidade em demonstração</dt>
                <dd>
                  {EMPRESA.unidade} · {EMPRESA.cidade}
                </dd>
              </div>
              <div>
                <dt className={proprios.paraQue}>Tema aplicado</dt>
                <dd>{MARCA.arquivoDeTema}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={estilos.secao}>
          <TituloSecao titulo="Cores do tema" explicacao="Nenhum componente escreve cor: todos leem daqui." />
          <div className={proprios.amostras}>
            {CORES.map((cor) => (
              <div key={cor.token} className={proprios.amostra}>
                <span className={proprios.cor} style={{ background: `var(${cor.token})` }} aria-hidden="true" />
                <span className={proprios.nomeCor}>{cor.nome}</span>
                <span className={proprios.tokenCor}>{cor.token}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={estilos.secao}>
        <TituloSecao titulo="Onde a marca mora" explicacao="Os arquivos que mudam quando o sistema veste outra empresa." />
        <div className={estilos.bloco}>
          <div className={proprios.tabelaArquivos}>
            {ARQUIVOS.map((arquivo) => (
              <div key={arquivo.caminho} className={proprios.arquivo}>
                <span className={proprios.caminho}>{arquivo.caminho}</span>
                <span className={proprios.paraQue}>{arquivo.paraQue}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CartaoInsight
        mensagem="A mesma base atende outra empresa sem reescrever telas."
        contexto="Cores, cantos, sombras, tipografia, nome e vocabulário do menu são configuração. As regras de negócio, os cálculos e a estrutura de dados continuam os mesmos."
        tom="informacao"
      />
    </div>
  );
}

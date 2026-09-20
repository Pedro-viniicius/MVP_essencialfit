import type { Metadata } from "next";
import Link from "next/link";

import {
  BarraProporcao,
  CabecalhoPainel,
  CartaoIndicador,
  CartaoInsight,
  CartaoRegistro,
  MatrizGiroMargem,
  SeloSituacao,
  TituloSecao,
} from "@/interface/componentes/indice";
import { formatarDinheiro } from "@/interface/formatacao/indice";
import { PERGUNTAS } from "@/interface/marca/indice";

import { EMPRESA } from "../../../dados/empresa";
import {
  capitalNoEstoque,
  capitalTotalEmEstoque,
  faturamentoDoProduto,
  leituraDaPosicao,
  lucroPorUnidade,
  MAIS_VENDIDOS,
  margemPercentual,
  mesesDeEstoque,
  posicaoNaMatriz,
  PRODUTOS,
  PRODUTOS_ESTOQUE_BAIXO,
  PRODUTOS_PARADOS,
} from "../../../dados/produtos";
import { FATURAMENTO_POR_CATEGORIA, RESULTADO, RESUMO_ESTOQUE } from "../../../dados/resultados";
import estilos from "../../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Painel · Produtos",
  description: "O que está vendendo, o que está parado e onde está meu dinheiro?",
};

const dinheiro = (valor: string) => formatarDinheiro(valor).texto;
const percentual = (valor: number) => `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

/**
 * Painel 3 — Produtos: a tela do dinheiro.
 *
 * O centro da tela e a relacao entre giro e margem, porque quase toda decisao
 * de compra e de preco mora ali: o que vende muito nem sempre e o que sustenta
 * o resultado, e o que parece parado as vezes e so falta de lugar na vitrine.
 */
export default function PainelProdutos() {
  const naMatriz = MAIS_VENDIDOS.slice(0, 8).map((produto) => ({
    nome: produto.nome,
    ...posicaoNaMatriz(produto),
    leitura: leituraDaPosicao(produto),
  }));

  const maiorMargem = [...PRODUTOS]
    .toSorted((a, b) => margemPercentual(b) - margemPercentual(a))
    .slice(0, 4);
  const maiorFaturamento = faturamentoDoProduto(MAIS_VENDIDOS[0]!);

  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Painel 3 de 3 · Produtos"
        pergunta={PERGUNTAS.produtos}
        resposta={`Dois produtos puxam o mês e estão quase acabando. Ao mesmo tempo, ${dinheiro(RESUMO_ESTOQUE.capitalEmItensParados)} estão em itens que quase não saem — dinheiro que poderia estar comprando o que gira.`}
        periodo={`${EMPRESA.periodo} · ${PRODUTOS.length} produtos ativos`}
        acoes={<Link href="/ideias?foco=estoque">Gerar ideias para melhorar o giro →</Link>}
      />

      <section className={estilos.secao} aria-label="Dinheiro em produtos">
        <div className={estilos.grade4}>
          <CartaoIndicador
            destaque
            titulo="Dinheiro parado em estoque"
            valor={dinheiro(capitalTotalEmEstoque().paraTexto())}
            leitura="É o custo de tudo o que está na prateleira hoje, esperando comprador."
          />
          <CartaoIndicador
            titulo="Margem bruta do mês"
            valor={dinheiro(RESULTADO.margemBruta)}
            leitura="O que sobrou das vendas antes das despesas da loja."
          />
          <CartaoIndicador
            titulo="Precisam de reposição"
            valor={`${RESUMO_ESTOQUE.itensAbaixoDoMinimo} produtos`}
            leitura="Estão abaixo do estoque mínimo definido para eles."
          />
          <CartaoIndicador
            titulo="Praticamente não saem"
            valor={dinheiro(RESUMO_ESTOQUE.capitalEmItensParados)}
            leitura={`${RESUMO_ESTOQUE.itensParados} produtos com estoque para mais de seis meses.`}
          />
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao
          titulo="O que sai muito nem sempre é o que sustenta o resultado"
          explicacao="Cada ponto é um produto: quanto mais à direita, mais ele sai; quanto mais acima, mais ele deixa."
        />
        <div className={estilos.bloco}>
          <MatrizGiroMargem produtos={naMatriz} />
        </div>
        <div className={estilos.grade2}>
          <CartaoInsight
            mensagem="Este produto vende muito, mas deixa pouca margem."
            contexto="O Whey Isolado responde por quase um terço do faturamento e tem a menor margem percentual entre os campeões. Ele traz gente para a loja — o resultado precisa vir do que entra junto com ele."
            tom="atencao"
            numeros={[
              { rotulo: "Faturamento no mês", valor: dinheiro(faturamentoDoProduto(MAIS_VENDIDOS[0]!).paraTexto()) },
              { rotulo: "Margem por unidade", valor: dinheiro(lucroPorUnidade(MAIS_VENDIDOS[0]!).paraTexto()) },
              { rotulo: "Margem sobre o preço", valor: percentual(margemPercentual(MAIS_VENDIDOS[0]!)) },
            ]}
            acao={<Link href="/ideias?foco=preco">Ver ideias de preço →</Link>}
          />
          <CartaoInsight
            mensagem="Parte do seu dinheiro pode estar parada em estoque."
            contexto="Luvas e camiseta somam meses de cobertura no ritmo atual. Enquanto esse dinheiro dorme ali, ele não compra o que some em quatro dias."
            tom="perigo"
            numeros={[
              { rotulo: "Capital parado", valor: dinheiro(RESUMO_ESTOQUE.capitalEmItensParados) },
              { rotulo: "Produtos", valor: `${RESUMO_ESTOQUE.itensParados}` },
            ]}
            acao={<Link href="/ideias?foco=estoque">Ver ideias de giro →</Link>}
          />
        </div>
      </section>

      <div className={estilos.duasColunas}>
        <section className={estilos.secao}>
          <TituloSecao titulo="Os que mais venderam" explicacao="Por faturamento no mês." />
          <div className={estilos.bloco}>
            <BarraProporcao
              titulo="Produtos por faturamento"
              itens={MAIS_VENDIDOS.slice(0, 6).map((produto) => ({
                rotulo: produto.nome,
                percentual: Number(faturamentoDoProduto(produto).percentualSobre(maiorFaturamento).paraTexto()),
                valor: dinheiro(faturamentoDoProduto(produto).paraTexto()),
                apoio: `${produto.vendidos} unidades · margem de ${percentual(margemPercentual(produto))}`,
              }))}
            />
          </div>
        </section>

        <section className={estilos.secao}>
          <TituloSecao titulo="Os que mais deixam por unidade" explicacao="Maior margem percentual do catálogo." />
          <div className={estilos.pilha}>
            {maiorMargem.map((produto) => (
              <CartaoRegistro
                key={produto.sku}
                comInicial={false}
                nome={produto.nome}
                complemento={produto.categoria}
                situacao={<SeloSituacao rotulo={`Margem de ${percentual(margemPercentual(produto))}`} tom="sucesso" />}
                dados={[
                  { rotulo: "Sobra por unidade", valor: dinheiro(lucroPorUnidade(produto).paraTexto()) },
                  { rotulo: "Vendidos no mês", valor: `${produto.vendidos}` },
                ]}
              />
            ))}
          </div>
        </section>
      </div>

      <section className={estilos.secao}>
        <TituloSecao
          titulo="Onde o dinheiro está parado"
          explicacao="Produtos com estoque para mais de seis meses no ritmo de venda atual."
          acao={<Link href="/demonstracoes/estoque">Ver estoque completo</Link>}
        />
        <div className={estilos.grade2}>
          {PRODUTOS_PARADOS.map((produto) => (
            <CartaoRegistro
              key={produto.sku}
              comInicial={false}
              nome={produto.nome}
              complemento={`${produto.categoria} · ${produto.sku}`}
              situacao={
                <SeloSituacao
                  rotulo={`${Math.round(mesesDeEstoque(produto))} meses de estoque`}
                  tom="perigo"
                  explicacao="Tempo que o estoque atual levaria para acabar no ritmo de venda deste mês."
                />
              }
              dados={[
                { rotulo: "Em estoque", valor: `${produto.estoque} unidades` },
                { rotulo: "Dinheiro parado", valor: dinheiro(capitalNoEstoque(produto).paraTexto()) },
                { rotulo: "Vendidos no mês", valor: `${produto.vendidos}` },
              ]}
              observacao="Vale testar uma ação específica antes de comprar qualquer novidade da mesma categoria."
            />
          ))}
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Precisam ser repostos" explicacao="Do mais urgente para o menos urgente." />
        <div className={estilos.grade2}>
          {PRODUTOS_ESTOQUE_BAIXO.slice(0, 4).map((produto) => (
            <CartaoRegistro
              key={produto.sku}
              comInicial={false}
              nome={produto.nome}
              complemento={produto.fornecedor}
              situacao={
                <SeloSituacao
                  rotulo={`${produto.estoque} em estoque`}
                  tom={produto.estoque <= 5 ? "perigo" : "atencao"}
                  explicacao={`O mínimo definido é ${produto.estoqueMinimo} unidades.`}
                />
              }
              dados={[
                { rotulo: "Vendidos no mês", valor: `${produto.vendidos}` },
                { rotulo: "Cobertura", valor: `${mesesDeEstoque(produto).toFixed(1).replace(".", ",")} mês` },
              ]}
            />
          ))}
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Faturamento por categoria" />
        <div className={estilos.bloco}>
          <BarraProporcao
            titulo="Participação de cada categoria no faturamento"
            itens={FATURAMENTO_POR_CATEGORIA.map((categoria) => ({
              rotulo: categoria.categoria,
              percentual: categoria.percentual,
              valor: dinheiro(categoria.faturamento),
              apoio: `${categoria.unidades} unidades`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}

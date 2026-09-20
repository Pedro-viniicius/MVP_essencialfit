import type { Metadata } from "next";
import Link from "next/link";

import {
  CabecalhoPainel,
  CartaoIndicador,
  CartaoInsight,
  CartaoRegistro,
  SeloSituacao,
  TituloSecao,
} from "@/interface/componentes/indice";
import { formatarDinheiro } from "@/interface/formatacao/indice";
import { PERGUNTAS } from "@/interface/marca/indice";

import { EMPRESA } from "../../dados/empresa";
import {
  capitalNoEstoque,
  capitalTotalEmEstoque,
  mesesDeEstoque,
  PRODUTOS,
  PRODUTOS_ESTOQUE_BAIXO,
  PRODUTOS_PARADOS,
} from "../../dados/produtos";
import { RESUMO_ESTOQUE } from "../../dados/resultados";
import estilos from "../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Estoque",
  description: "O que precisa ser reposto antes de faltar.",
};

const dinheiro = (valor: string) => formatarDinheiro(valor).texto;

/** Quanto tempo o estoque ainda cobre, escrito como alguem falaria. */
function cobertura(meses: number): string {
  if (!Number.isFinite(meses)) return "sem saída no mês";
  const dias = Math.round(meses * 30);
  if (dias <= 1) return "acaba hoje ou amanhã";
  if (dias < 14) return `dá para cerca de ${dias} dias`;
  if (meses < 2) return "dá para pouco mais de um mês";
  return `dá para cerca de ${Math.round(meses)} meses`;
}

/**
 * Estoque — a tela da reposicao.
 *
 * Ela responde a uma pergunta de operacao, nao de analise: o que eu preciso
 * comprar antes que falte? Por isso a ordem e por urgencia, e nao por valor.
 */
export default function PaginaEstoque() {
  const saudaveis = PRODUTOS.filter(
    (produto) => produto.estoque >= produto.estoqueMinimo && mesesDeEstoque(produto) <= 6,
  );

  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Estoque"
        pergunta={PERGUNTAS.estoque}
        resposta={`${RESUMO_ESTOQUE.itensAbaixoDoMinimo} produtos estão abaixo do mínimo e dois deles são campeões de venda. No outro extremo, ${dinheiro(RESUMO_ESTOQUE.capitalEmItensParados)} estão parados em itens que quase não saem.`}
        periodo={`${EMPRESA.periodo} · ${EMPRESA.unidade}`}
        acoes={<Link href="/ideias?foco=estoque">Gerar ideias para melhorar o giro →</Link>}
      />

      <section className={estilos.secao} aria-label="Resumo do estoque">
        <div className={estilos.grade3}>
          <CartaoIndicador
            destaque
            titulo="Dinheiro na prateleira"
            valor={dinheiro(capitalTotalEmEstoque().paraTexto())}
            leitura="Custo de tudo o que está guardado hoje."
          />
          <CartaoIndicador
            titulo="Abaixo do mínimo"
            valor={`${RESUMO_ESTOQUE.itensAbaixoDoMinimo} produtos`}
            leitura="Precisam entrar no próximo pedido ao fornecedor."
          />
          <CartaoIndicador
            titulo="Parados há meses"
            valor={`${RESUMO_ESTOQUE.itensParados} produtos`}
            leitura={`${dinheiro(RESUMO_ESTOQUE.capitalEmItensParados)} que poderiam estar comprando o que gira.`}
          />
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Comprar antes que falte" explicacao="Do mais urgente para o menos urgente." />
        <CartaoInsight
          mensagem="Dois campeões de venda acabam antes do fim da semana."
          contexto="Whey Isolado e Creatina sozinhos fazem quase metade do faturamento do mês. Venda perdida por falta não aparece em relatório nenhum — o cliente simplesmente compra em outro lugar."
          tom="perigo"
          acao={<Link href="/ideias?foco=estoque">Ver ideias sobre reposição →</Link>}
        />
        <div className={estilos.grade2}>
          {PRODUTOS_ESTOQUE_BAIXO.map((produto) => (
            <CartaoRegistro
              key={produto.sku}
              comInicial={false}
              nome={produto.nome}
              complemento={`${produto.fornecedor} · ${produto.sku}`}
              situacao={
                <SeloSituacao
                  rotulo={`${produto.estoque} de ${produto.estoqueMinimo}`}
                  tom={produto.estoque <= 5 ? "perigo" : "atencao"}
                  explicacao={`Há ${produto.estoque} unidades e o mínimo definido é ${produto.estoqueMinimo}.`}
                />
              }
              dados={[
                { rotulo: "Vendidos no mês", valor: `${produto.vendidos}` },
                { rotulo: "Sugestão de compra", valor: `${Math.max(produto.estoqueMinimo * 2 - produto.estoque, 4)} unidades` },
                { rotulo: "Custo da reposição", valor: dinheiro(capitalNoEstoque({ ...produto, estoque: Math.max(produto.estoqueMinimo * 2 - produto.estoque, 4) }).paraTexto()) },
              ]}
              observacao={`No ritmo deste mês, o estoque ${cobertura(mesesDeEstoque(produto))}.`}
            />
          ))}
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Parados na prateleira" explicacao="Estoque para mais de seis meses no ritmo atual." />
        <div className={estilos.grade2}>
          {PRODUTOS_PARADOS.map((produto) => (
            <CartaoRegistro
              key={produto.sku}
              comInicial={false}
              nome={produto.nome}
              complemento={produto.categoria}
              situacao={<SeloSituacao rotulo="Quase não sai" tom="perigo" />}
              dados={[
                { rotulo: "Em estoque", valor: `${produto.estoque} unidades` },
                { rotulo: "Dinheiro parado", valor: dinheiro(capitalNoEstoque(produto).paraTexto()) },
                { rotulo: "Vendidos no mês", valor: `${produto.vendidos}` },
              ]}
              observacao="Antes de comprar qualquer novidade desta categoria, vale tentar girar o que já está aqui."
            />
          ))}
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Em dia" explicacao="Produtos com quantidade adequada e saída constante." />
        <div className={estilos.grade3}>
          {saudaveis.map((produto) => (
            <CartaoRegistro
              key={produto.sku}
              comInicial={false}
              nome={produto.nome}
              complemento={produto.categoria}
              situacao={<SeloSituacao rotulo="Em dia" tom="sucesso" />}
              dados={[
                { rotulo: "Em estoque", valor: `${produto.estoque}` },
                { rotulo: "Cobertura", valor: cobertura(mesesDeEstoque(produto)) },
              ]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

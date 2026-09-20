import type { Metadata } from "next";
import Link from "next/link";

import { Dinheiro } from "@/compartilhado/dinheiro/indice";
import {
  BarraProporcao,
  CabecalhoPainel,
  CartaoIndicador,
  CartaoInsight,
  CartaoProgresso,
  GraficoBarras,
  TituloSecao,
} from "@/interface/componentes/indice";
import { formatarDinheiro, formatarPercentual } from "@/interface/formatacao/indice";
import { PERGUNTAS } from "@/interface/marca/indice";

import { EMPRESA } from "../../../dados/empresa";
import { faturamentoDoProduto, MAIS_VENDIDOS } from "../../../dados/produtos";
import {
  ALERTAS,
  EVOLUCAO,
  FATURAMENTO_POR_CATEGORIA,
  FORMAS_DE_PAGAMENTO,
  RESULTADO,
  RESUMO_CLIENTES,
  VARIACOES,
} from "../../../dados/resultados";
import estilos from "../../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Painel · Visão geral",
  description: "Como está meu negócio? Faturamento, meta, margem e o que merece atenção.",
};

const dinheiro = (valor: string) => formatarDinheiro(valor).texto;

/**
 * Painel 1 — Visao geral: a tela do dono.
 *
 * Ordem: pergunta, resposta em uma frase, os numeros que sustentam a resposta,
 * a explicacao visual (evolucao e meta), o que preocupa e o que dá para fazer.
 */
export default function PainelVisaoGeral() {
  const faturado = Dinheiro.deTexto(RESULTADO.faturamento);
  const meta = Dinheiro.deTexto(EMPRESA.metaDoMes);
  const percentualDaMeta = Number(faturado.percentualSobre(meta).paraTexto());
  const falta = meta.subtrair(faturado);
  const topCinco = MAIS_VENDIDOS.slice(0, 5);
  const maior = faturamentoDoProduto(topCinco[0]!);

  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Painel 1 de 3 · Visão geral"
        pergunta={PERGUNTAS.visaoGeral}
        resposta="Setembro é o melhor mês do semestre e a meta está ao alcance. O que pode atrapalhar não é a venda: são dois campeões prestes a faltar na prateleira."
        periodo={`${EMPRESA.periodo} · ${EMPRESA.diasDecorridos} dias corridos`}
        acoes={<Link href="/ideias?foco=resultado">O que merece minha atenção? →</Link>}
      />

      <section className={estilos.secao} aria-label="Números do período">
        <div className={estilos.grade4}>
          <CartaoIndicador
            destaque
            titulo="Faturamento"
            valor={dinheiro(RESULTADO.faturamento)}
            variacao={VARIACOES.faturamento}
            direcao="subiu"
            leitura={`Média de ${dinheiro(RESULTADO.mediaPorDia)} por dia de loja aberta.`}
          />
          <CartaoIndicador
            titulo="Vendas"
            valor={`${RESULTADO.vendas}`}
            variacao={VARIACOES.vendas}
            direcao="subiu"
            leitura={`${RESULTADO.clientesAtendidos} pessoas diferentes passaram pelo caixa.`}
          />
          <CartaoIndicador
            titulo="Ticket médio"
            valor={dinheiro(RESULTADO.ticketMedio)}
            variacao={VARIACOES.ticketMedio}
            direcao="subiu"
            leitura="Quanto entra, em média, a cada compra."
          />
          <CartaoIndicador
            titulo="Margem bruta estimada"
            valor={dinheiro(RESULTADO.margemBruta)}
            variacao={VARIACOES.margem}
            direcao="subiu"
            leitura={`De cada R$ 100,00 vendidos, cerca de ${formatarPercentual(RESULTADO.margemPercentual)} ficam antes das despesas.`}
          />
        </div>
      </section>

      <div className={estilos.duasColunas}>
        <section className={estilos.secao}>
          <TituloSecao titulo="Como o mês vem crescendo" explicacao="Faturamento dos últimos seis meses." />
          <div className={estilos.bloco}>
            <GraficoBarras
              titulo="Faturamento por mês"
              barras={EVOLUCAO.map((mes) => ({
                rotulo: mes.rotulo,
                quantidade: Number(mes.faturamento),
                valor: dinheiro(mes.faturamento),
                ...(mes.atual ? { destaque: true } : {}),
              }))}
              leitura="A curva subiu em quatro dos últimos cinco meses. Julho foi a única queda do período."
            />
          </div>
        </section>

        <section className={estilos.secao}>
          <TituloSecao titulo="Meta do mês" />
          <CartaoProgresso
            titulo="Meta de setembro"
            percentual={percentualDaMeta}
            frase={`Você já percorreu ${Math.round(percentualDaMeta)}% da meta do mês. Faltam ${falta.formatarBrasileiro()} em ${EMPRESA.diasRestantes} dias — mantendo o ritmo atual, a meta é alcançada por volta do dia 28.`}
            alcancado={dinheiro(RESULTADO.faturamento)}
            meta={dinheiro(EMPRESA.metaDoMes)}
          />
          <CartaoInsight
            mensagem={`${RESUMO_CLIENTES.percentualDeRecorrencia}% do faturamento veio de quem já era cliente.`}
            contexto="A loja está crescendo mais por relacionamento do que por rotatividade de gente nova — e isso costuma ser mais barato de sustentar."
            tom="sucesso"
            numeros={[
              { rotulo: "Clientes atendidos", valor: `${RESUMO_CLIENTES.atendidosNoMes}` },
              { rotulo: "Novos no mês", valor: `${RESUMO_CLIENTES.novos}` },
              { rotulo: "Recorrentes", valor: `${RESUMO_CLIENTES.recorrentes}` },
            ]}
            acao={<Link href="/demonstracoes/paineis/clientes">Ver painel de clientes →</Link>}
          />
        </section>
      </div>

      <section className={estilos.secao}>
        <TituloSecao titulo="O que merece atenção agora" explicacao="Em ordem de urgência, não de tamanho." />
        <div className={estilos.grade2}>
          {ALERTAS.map((alerta) => (
            <CartaoInsight
              key={alerta.titulo}
              mensagem={alerta.titulo}
              contexto={alerta.explicacao}
              tom={alerta.tom}
              acao={<Link href={alerta.rota}>{alerta.acao} →</Link>}
            />
          ))}
        </div>
      </section>

      <div className={estilos.duasColunas}>
        <section className={estilos.secao}>
          <TituloSecao titulo="O que mais vendeu" acao={<Link href="/demonstracoes/paineis/produtos">Ver todos</Link>} />
          <div className={estilos.bloco}>
            <BarraProporcao
              titulo="Produtos por faturamento no mês"
              itens={topCinco.map((produto) => ({
                rotulo: produto.nome,
                percentual: Number(faturamentoDoProduto(produto).percentualSobre(maior).paraTexto()),
                valor: dinheiro(faturamentoDoProduto(produto).paraTexto()),
                apoio: `${produto.vendidos} unidades`,
              }))}
            />
          </div>
        </section>

        <section className={estilos.secao}>
          <TituloSecao titulo="De onde vem o faturamento" />
          <div className={estilos.bloco}>
            <BarraProporcao
              titulo="Faturamento por categoria"
              itens={FATURAMENTO_POR_CATEGORIA.map((categoria) => ({
                rotulo: categoria.categoria,
                percentual: categoria.percentual,
                valor: dinheiro(categoria.faturamento),
                apoio: `${categoria.unidades} unidades`,
              }))}
            />
          </div>
          <CartaoInsight
            mensagem="Sete de cada dez reais vêm de suplementos."
            contexto="Concentração assim facilita a compra e a negociação com o fornecedor, mas deixa o mês dependente de poucos produtos."
            tom="atencao"
            numeros={FATURAMENTO_POR_CATEGORIA.slice(0, 3).map((categoria) => ({
              rotulo: categoria.categoria,
              valor: dinheiro(categoria.faturamento),
            }))}
            acao={<Link href="/ideias?foco=resultado">Ver ideias sobre isso →</Link>}
          />
        </section>
      </div>

      <section className={estilos.secao}>
        <TituloSecao titulo="Como as pessoas pagaram" explicacao="Ajuda a planejar o caixa: Pix entra hoje, cartão entra depois." />
        <div className={estilos.bloco}>
          <BarraProporcao
            titulo="Faturamento por forma de pagamento"
            itens={FORMAS_DE_PAGAMENTO.map((forma) => ({
              rotulo: forma.forma,
              percentual: forma.percentual,
              valor: dinheiro(forma.valor),
            }))}
          />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Dinheiro } from "@/compartilhado/dinheiro/indice";
import {
  AcaoRapida,
  BarraProporcao,
  CabecalhoPainel,
  CartaoIndicador,
  CartaoInsight,
  CartaoProgresso,
  GraficoBarras,
  SeloSituacao,
  TituloSecao,
} from "@/interface/componentes/indice";
import { formatarDinheiro } from "@/interface/formatacao/indice";
import { PERGUNTAS } from "@/interface/marca/indice";

import { EMPRESA } from "../../dados/empresa";
import { faturamentoDoProduto, MAIS_VENDIDOS, PRODUTOS_ESTOQUE_BAIXO } from "../../dados/produtos";
import {
  ALERTAS,
  EVOLUCAO,
  RESULTADO,
  RESUMO_CLIENTES,
  RESUMO_ESTOQUE,
  VARIACOES,
} from "../../dados/resultados";
import estilos from "../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Início",
  description: "Resumo executivo da Essencial Fit: vendas, meta, clientes e o que merece atenção hoje.",
};

const dinheiro = (valor: string) => formatarDinheiro(valor).texto;

/**
 * Inicio da demonstracao.
 *
 * Ordem da tela (docs/ux/dashboard.md): a pergunta, a resposta em uma frase,
 * o que merece atencao, e so entao os numeros. Quem abre esta tela pela manha
 * precisa saber se esta tudo bem antes de precisar ler um indicador.
 */
export default function PaginaInicioDemonstracao() {
  // Conta de dinheiro e sempre com `Dinheiro`/`Percentual`, nunca com float.
  const faturado = Dinheiro.deTexto(RESULTADO.faturamento);
  const meta = Dinheiro.deTexto(EMPRESA.metaDoMes);
  const percentualDaMeta = Number(faturado.percentualSobre(meta).paraTexto());
  const faltaParaMeta = meta.subtrair(faturado).paraTexto();
  const topCinco = MAIS_VENDIDOS.slice(0, 5);
  const maiorFaturamento = faturamentoDoProduto(topCinco[0]!);

  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Início"
        pergunta={PERGUNTAS.inicio}
        resposta={`O mês está melhor que agosto e a meta está ao alcance. O ponto de atenção não é a venda: é a prateleira — dois campeões estão quase acabando enquanto outro dinheiro dorme parado.`}
        periodo={`${EMPRESA.periodo} · ${EMPRESA.unidade}`}
        acoes={<Link href="/ideias?foco=resultado">O que merece minha atenção? →</Link>}
      />

      <section className={estilos.secao} aria-label="O que merece atenção hoje">
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

      <section className={estilos.secao} aria-label="Números do mês">
        <TituloSecao titulo="Os números por trás disso" explicacao="Setembro até hoje, comparado com o mesmo período de agosto." />
        <div className={estilos.grade4}>
          <CartaoIndicador
            destaque
            titulo="Vendas do mês"
            valor={dinheiro(RESULTADO.faturamento)}
            variacao={VARIACOES.faturamento}
            direcao="subiu"
            leitura={`Em ${EMPRESA.diasDecorridos} dias, uma média de ${dinheiro(RESULTADO.mediaPorDia)} por dia.`}
          />
          <CartaoIndicador
            titulo="Vendas realizadas"
            valor={`${RESULTADO.vendas}`}
            variacao={VARIACOES.vendas}
            direcao="subiu"
            leitura="Onze vendas a mais que no mês passado."
          />
          <CartaoIndicador
            titulo="Ticket médio"
            valor={dinheiro(RESULTADO.ticketMedio)}
            variacao={VARIACOES.ticketMedio}
            direcao="subiu"
            leitura="Cada compra está um pouco maior do que era em agosto."
          />
          <CartaoIndicador
            titulo="Clientes atendidos"
            valor={`${RESULTADO.clientesAtendidos}`}
            variacao={VARIACOES.clientes}
            direcao="subiu"
            leitura={`${RESUMO_CLIENTES.novos} compraram aqui pela primeira vez.`}
          />
        </div>
      </section>

      <div className={estilos.duasColunas}>
        <section className={estilos.secao}>
          <TituloSecao titulo="Evolução dos últimos seis meses" />
          <div className={estilos.bloco}>
            <GraficoBarras
              titulo="Faturamento por mês"
              barras={EVOLUCAO.map((mes) => ({
                rotulo: mes.rotulo,
                quantidade: Number(mes.faturamento),
                valor: dinheiro(mes.faturamento),
                ...(mes.atual ? { destaque: true } : {}),
              }))}
              leitura="Setembro já é o melhor mês do semestre, mesmo faltando dez dias para fechar."
            />
          </div>
        </section>

        <section className={estilos.secao}>
          <TituloSecao titulo="Meta do mês" />
          <CartaoProgresso
            titulo="Meta de setembro"
            percentual={percentualDaMeta}
            frase={`Você já percorreu ${Math.round(percentualDaMeta)}% da meta do mês. Faltam ${dinheiro(
              faltaParaMeta,
            )} em ${EMPRESA.diasRestantes} dias — no ritmo atual, a meta deve ser alcançada por volta do dia 28.`}
            alcancado={dinheiro(RESULTADO.faturamento)}
            meta={dinheiro(EMPRESA.metaDoMes)}
          />
        </section>
      </div>

      <div className={estilos.duasColunas}>
        <section className={estilos.secao}>
          <TituloSecao titulo="O que mais saiu neste mês" acao={<Link href="/demonstracoes/paineis/produtos">Ver todos</Link>} />
          <div className={estilos.bloco}>
            <BarraProporcao
              titulo="Produtos mais vendidos em faturamento"
              itens={topCinco.map((produto) => ({
                rotulo: produto.nome,
                percentual: Number(faturamentoDoProduto(produto).percentualSobre(maiorFaturamento).paraTexto()),
                valor: dinheiro(faturamentoDoProduto(produto).paraTexto()),
                apoio: `${produto.vendidos} unidades`,
              }))}
            />
          </div>
        </section>

        <section className={estilos.secao}>
          <TituloSecao titulo="Precisa de reposição" acao={<Link href="/demonstracoes/estoque">Ver estoque</Link>} />
          <div className={estilos.pilha}>
            {PRODUTOS_ESTOQUE_BAIXO.slice(0, 4).map((produto) => (
              <div key={produto.sku} className={estilos.bloco}>
                <p>
                  <strong>{produto.nome}</strong>
                </p>
                <p>
                  <SeloSituacao
                    rotulo={`${produto.estoque} em estoque`}
                    tom={produto.estoque <= 5 ? "perigo" : "atencao"}
                    explicacao={`O mínimo definido para este produto é ${produto.estoqueMinimo}.`}
                  />
                </p>
              </div>
            ))}
            <p>
              <strong>{RESUMO_ESTOQUE.itensAbaixoDoMinimo} produtos</strong> estão abaixo do estoque mínimo hoje.
            </p>
          </div>
        </section>
      </div>

      <section className={estilos.secao}>
        <TituloSecao titulo="O que dá para fazer agora" />
        <div className={estilos.grade3}>
          <AcaoRapida
            marca="Vd"
            titulo="Registrar uma venda"
            descricao="Busca rápida de produto, cliente e forma de pagamento em uma tela só."
            rota="/demonstracoes/formularios/venda"
            chamada="Abrir"
          />
          <AcaoRapida
            marca="Cl"
            titulo="Cadastrar um cliente"
            descricao="Nome, objetivo e a melhor forma de manter contato."
            rota="/demonstracoes/formularios/cliente"
            chamada="Abrir"
          />
          <AcaoRapida
            destaque
            marca="IA"
            titulo="Ver ideias para o negócio"
            descricao="Possibilidades de ação a partir do que já sabemos sobre vendas, clientes e estoque."
            rota="/ideias?foco=resultado"
            chamada="Explorar ideias"
          />
        </div>
      </section>
    </div>
  );
}

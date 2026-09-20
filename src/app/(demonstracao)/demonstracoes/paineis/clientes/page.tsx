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

import { CLIENTES_MAIS_FIEIS, CLIENTES_PARA_REATIVAR } from "../../../dados/clientes";
import { EMPRESA } from "../../../dados/empresa";
import { RESUMO_CLIENTES, VARIACOES } from "../../../dados/resultados";
import estilos from "../../../demonstracao.module.css";

export const metadata: Metadata = {
  title: "Painel · Clientes",
  description: "Quem está comprando e quem podemos trazer de volta?",
};

const dinheiro = (valor: string) => formatarDinheiro(valor).texto;

/**
 * Painel 2 — Clientes: a tela do relacionamento.
 *
 * Aqui nao ha "churn" nem "retencao": ha gente que volta, gente que chegou
 * agora e gente que sumiu. O painel termina em uma lista de pessoas com nome,
 * porque e com pessoas que se fala — nao com percentuais.
 */
export default function PainelClientes() {
  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Painel 2 de 3 · Clientes"
        pergunta={PERGUNTAS.clientes}
        resposta={`A maior parte do faturamento vem de quem já conhece a loja. Do outro lado, ${RESUMO_CLIENTES.paraReativar} pessoas que compravam com frequência não aparecem há mais de 45 dias.`}
        periodo={`${EMPRESA.periodo} · base de ${RESUMO_CLIENTES.baseTotal} clientes`}
        acoes={<Link href="/ideias?foco=clientes">Gerar ideias para trazer clientes de volta →</Link>}
      />

      <section className={estilos.secao} aria-label="Retrato da base de clientes">
        <div className={estilos.grade4}>
          <CartaoIndicador
            destaque
            titulo="Clientes atendidos no mês"
            valor={`${RESUMO_CLIENTES.atendidosNoMes}`}
            variacao={VARIACOES.clientes}
            direcao="subiu"
            leitura={`${RESUMO_CLIENTES.percentualDeRecorrencia}% do faturamento veio de quem já era cliente.`}
          />
          <CartaoIndicador
            titulo="Compraram pela primeira vez"
            valor={`${RESUMO_CLIENTES.novos}`}
            leitura="A segunda compra é o que transforma visitante em cliente."
          />
          <CartaoIndicador
            titulo="Clientes recorrentes"
            valor={`${RESUMO_CLIENTES.recorrentes}`}
            leitura="Compraram mais de uma vez nos últimos 90 dias."
          />
          <CartaoIndicador
            titulo="Voltam a cada"
            valor={`${RESUMO_CLIENTES.frequenciaMediaEmDias} dias`}
            leitura="Intervalo médio entre uma compra e a seguinte."
          />
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao
          titulo="Clientes para reativar"
          explicacao="Já compraram mais de uma vez e não retornam há mais de 45 dias."
          acao={<Link href="/ideias?foco=clientes">Ver ideias de reativação</Link>}
        />
        <CartaoInsight
          mensagem={`${RESUMO_CLIENTES.paraReativar} clientes que já compraram mais de uma vez não retornam há mais de 45 dias.`}
          contexto="Juntos, eles já deixaram mais de R$ 4.000,00 na loja. Falar com quem já confiou uma vez costuma custar menos do que conquistar alguém novo."
          tom="atencao"
          numeros={[
            { rotulo: "Clientes no grupo", valor: `${RESUMO_CLIENTES.paraReativar}` },
            { rotulo: "Ticket médio por cliente", valor: dinheiro(RESUMO_CLIENTES.ticketPorCliente) },
            { rotulo: "Maior tempo sem voltar", valor: "80 dias" },
          ]}
        />
        <div className={estilos.grade2}>
          {CLIENTES_PARA_REATIVAR.map((cliente) => (
            <CartaoRegistro
              key={cliente.id}
              nome={cliente.nome}
              complemento={`${cliente.telefone} · ${cliente.objetivo}`}
              situacao={
                <SeloSituacao
                  rotulo={`${cliente.diasSemComprar} dias sem voltar`}
                  tom={cliente.diasSemComprar > 60 ? "perigo" : "atencao"}
                  explicacao={`Última compra em ${cliente.ultimaCompra}.`}
                />
              }
              dados={[
                { rotulo: "Compras", valor: `${cliente.compras}` },
                { rotulo: "Já gastou", valor: dinheiro(cliente.totalGasto) },
                { rotulo: "Última compra", valor: cliente.ultimaCompra },
              ]}
              observacao={`Costuma levar: ${cliente.costumaLevar}. Um contato lembrando a reposição costuma ser suficiente.`}
            />
          ))}
        </div>
        <p className={estilos.aviso}>
          Nesta demonstração, nenhuma mensagem de WhatsApp é enviada. No sistema real, este é o ponto em que a lista
          vira uma tarefa para a equipe da loja.
        </p>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="Quem mais volta" explicacao="As pessoas que sustentam o mês — vale conhecer pelo nome." />
        <div className={estilos.grade2}>
          {CLIENTES_MAIS_FIEIS.slice(0, 4).map((cliente) => (
            <CartaoRegistro
              key={cliente.id}
              nome={cliente.nome}
              complemento={`${cliente.telefone} · ${cliente.objetivo}`}
              situacao={
                <SeloSituacao
                  rotulo={`${cliente.compras} compras`}
                  tom="sucesso"
                  explicacao={`Última compra em ${cliente.ultimaCompra}.`}
                />
              }
              dados={[
                { rotulo: "Já gastou", valor: dinheiro(cliente.totalGasto) },
                { rotulo: "Última compra", valor: `há ${cliente.diasSemComprar} dias` },
              ]}
              observacao={`Costuma levar: ${cliente.costumaLevar}.`}
            />
          ))}
        </div>
      </section>

      <section className={estilos.secao}>
        <TituloSecao titulo="O que isso sugere" />
        <div className={estilos.grade2}>
          <CartaoInsight
            mensagem="Grande parte das suas vendas depende de poucos clientes."
            contexto="Os dez que mais compram respondem por uma fatia relevante do mês. Isso é bom para o relacionamento e arriscado para a previsibilidade: se dois deles somem, o mês sente."
            tom="atencao"
            numeros={[
              { rotulo: "Base total", valor: `${RESUMO_CLIENTES.baseTotal} clientes` },
              { rotulo: "Atendidos no mês", valor: `${RESUMO_CLIENTES.atendidosNoMes}` },
              { rotulo: "Ticket por cliente", valor: dinheiro(RESUMO_CLIENTES.ticketPorCliente) },
            ]}
            acao={<Link href="/ideias?foco=clientes">Ver ideias sobre isso →</Link>}
          />
          <CartaoInsight
            mensagem="26 pessoas compraram aqui pela primeira vez neste mês."
            contexto="Quem faz a segunda compra tende a continuar voltando. Combinar o retorno no momento da primeira venda costuma funcionar melhor do que esperar a pessoa lembrar sozinha."
            tom="informacao"
            acao={<Link href="/demonstracoes/formularios/cliente">Cadastrar um cliente →</Link>}
          />
        </div>
      </section>
    </div>
  );
}

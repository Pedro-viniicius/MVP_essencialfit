/**
 * Resultados de exemplo do periodo (setembro de 2026).
 *
 * Os numeros conversam entre si: o faturamento e a soma de preco x unidades
 * de `produtos.ts`; o ticket medio e o faturamento dividido pelas vendas; a
 * margem bruta e o faturamento menos o custo das unidades vendidas.
 */

export interface ResultadoDoMes {
  /** Valores canonicos ("18420.00"). */
  readonly faturamento: string;
  readonly vendas: number;
  readonly ticketMedio: string;
  readonly clientesAtendidos: number;
  readonly margemBruta: string;
  /** Margem em percentual do faturamento. */
  readonly margemPercentual: string;
  readonly custoDasVendas: string;
  /** Media vendida por dia ate aqui. */
  readonly mediaPorDia: string;
  /** Projecao simples: media por dia x dias do mes. */
  readonly projecaoDoMes: string;
}

export const RESULTADO: ResultadoDoMes = {
  faturamento: "18420.00",
  vendas: 143,
  ticketMedio: "128.81",
  clientesAtendidos: 118,
  margemBruta: "7752.00",
  margemPercentual: "42.08",
  custoDasVendas: "10668.00",
  mediaPorDia: "921.00",
  projecaoDoMes: "27630.00",
};

/** O mesmo recorte no mes anterior, para comparacao. */
export const RESULTADO_ANTERIOR: ResultadoDoMes = {
  faturamento: "16740.00",
  vendas: 132,
  ticketMedio: "126.82",
  clientesAtendidos: 109,
  margemBruta: "6940.00",
  margemPercentual: "41.46",
  custoDasVendas: "9800.00",
  mediaPorDia: "540.00",
  projecaoDoMes: "16740.00",
};

/** Variacoes ja calculadas, prontas para exibir. */
export const VARIACOES = {
  faturamento: "+10,0% que agosto",
  vendas: "+8,3% que agosto",
  ticketMedio: "+1,6% que agosto",
  clientes: "+8,3% que agosto",
  margem: "+0,6 ponto que agosto",
} as const;

export interface MesDaEvolucao {
  readonly rotulo: string;
  readonly faturamento: string;
  readonly atual?: boolean;
}

export const EVOLUCAO: readonly MesDaEvolucao[] = [
  { rotulo: "abr", faturamento: "14980.00" },
  { rotulo: "mai", faturamento: "15640.00" },
  { rotulo: "jun", faturamento: "16180.00" },
  { rotulo: "jul", faturamento: "15890.00" },
  { rotulo: "ago", faturamento: "16740.00" },
  { rotulo: "set", faturamento: "18420.00", atual: true },
];

export interface ParticipacaoCategoria {
  readonly categoria: string;
  readonly faturamento: string;
  readonly percentual: number;
  readonly unidades: number;
}

export const FATURAMENTO_POR_CATEGORIA: readonly ParticipacaoCategoria[] = [
  { categoria: "Suplementos", faturamento: "13011.60", percentual: 70.6, unidades: 84 },
  { categoria: "Saúde", faturamento: "3156.60", percentual: 17.1, unidades: 34 },
  { categoria: "Alimentos", faturamento: "1234.00", percentual: 6.7, unidades: 20 },
  { categoria: "Acessórios", faturamento: "838.00", percentual: 4.5, unidades: 20 },
  { categoria: "Vestuário", faturamento: "179.80", percentual: 1.0, unidades: 2 },
];

export interface FormaDePagamento {
  readonly forma: string;
  readonly valor: string;
  readonly percentual: number;
}

export const FORMAS_DE_PAGAMENTO: readonly FormaDePagamento[] = [
  { forma: "Pix", valor: "7552.20", percentual: 41 },
  { forma: "Cartão de crédito", valor: "6262.80", percentual: 34 },
  { forma: "Cartão de débito", valor: "3131.40", percentual: 17 },
  { forma: "Dinheiro", valor: "1473.60", percentual: 8 },
];

/** Retrato do relacionamento com a base de clientes. */
export const RESUMO_CLIENTES = {
  baseTotal: 312,
  atendidosNoMes: 118,
  novos: 26,
  recorrentes: 47,
  /** Ja compraram mais de uma vez e sumiram ha mais de 45 dias. */
  paraReativar: 12,
  /** Intervalo medio entre uma compra e a proxima. */
  frequenciaMediaEmDias: 38,
  /** Faturamento dividido pelos clientes atendidos. */
  ticketPorCliente: "156.10",
  /** Parte do faturamento que veio de quem ja era cliente. */
  percentualDeRecorrencia: 64,
} as const;

/** Estoque em uma linha. */
export const RESUMO_ESTOQUE = {
  capitalParado: "11513.00",
  itensAbaixoDoMinimo: 8,
  itensParados: 2,
  capitalEmItensParados: "1902.00",
} as const;

export interface AlertaDemonstracao {
  readonly titulo: string;
  readonly explicacao: string;
  readonly tom: "atencao" | "perigo" | "informacao" | "sucesso";
  readonly rota: string;
  readonly acao: string;
}

/** O que merece atencao hoje, em ordem de urgencia. */
export const ALERTAS: readonly AlertaDemonstracao[] = [
  {
    titulo: "Dois campeões de venda estão quase acabando",
    explicacao:
      "Whey Isolado e Creatina respondem por quase metade do faturamento do mês e, no ritmo atual, acabam antes do fim da semana.",
    tom: "perigo",
    rota: "/demonstracoes/estoque",
    acao: "Ver reposição",
  },
  {
    titulo: "Parte do seu dinheiro está parada na prateleira",
    explicacao:
      "R$ 1.902,00 estão em itens que quase não saem há meses. É dinheiro que poderia estar em produtos que giram.",
    tom: "atencao",
    rota: "/demonstracoes/paineis/produtos",
    acao: "Ver produtos parados",
  },
  {
    titulo: "12 clientes fiéis não aparecem há mais de 45 dias",
    explicacao:
      "São pessoas que já compraram mais de uma vez. Reaproximar costuma custar menos do que conquistar alguém novo.",
    tom: "informacao",
    rota: "/demonstracoes/paineis/clientes",
    acao: "Ver clientes",
  },
];

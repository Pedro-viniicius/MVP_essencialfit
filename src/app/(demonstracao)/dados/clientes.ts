/**
 * Clientes de exemplo da Essencial Fit.
 *
 * Um cliente aqui nao e um cadastro: e uma pessoa com um objetivo. Os campos
 * existem para sustentar as telas de relacionamento (quem volta, quem sumiu,
 * quem compra mais) e o formulario de cadastro.
 */

export interface ClienteDemonstracao {
  readonly id: string;
  readonly nome: string;
  readonly telefone: string;
  readonly objetivo: string;
  /** Quantidade de compras ja feitas. */
  readonly compras: number;
  /** Total gasto desde o primeiro atendimento, canonico. */
  readonly totalGasto: string;
  /** Data da ultima compra, no formato brasileiro. */
  readonly ultimaCompra: string;
  /** Dias desde a ultima compra (referencia: 20/09/2026). */
  readonly diasSemComprar: number;
  /** O que a pessoa costuma levar — usado nas sugestoes de contato. */
  readonly costumaLevar: string;
}

export const CLIENTES: readonly ClienteDemonstracao[] = [
  { id: "cli-001", nome: "Mariana Alvarenga", telefone: "(35) 99812-4471", objetivo: "Ganho de massa", compras: 7, totalGasto: "1284.60", ultimaCompra: "16/09/2026", diasSemComprar: 4, costumaLevar: "Whey isolado e creatina" },
  { id: "cli-002", nome: "Rafael Nogueira", telefone: "(35) 99745-2210", objetivo: "Performance no treino", compras: 6, totalGasto: "1118.40", ultimaCompra: "14/09/2026", diasSemComprar: 6, costumaLevar: "Pré-treino e creatina" },
  { id: "cli-003", nome: "Juliana Prado", telefone: "(35) 99631-8890", objetivo: "Mais disposição no dia a dia", compras: 5, totalGasto: "874.50", ultimaCompra: "11/09/2026", diasSemComprar: 9, costumaLevar: "Multivitamínico e ômega 3" },
  { id: "cli-004", nome: "Carlos Eduardo Resende", telefone: "(35) 99502-7734", objetivo: "Perda de gordura", compras: 5, totalGasto: "812.30", ultimaCompra: "08/09/2026", diasSemComprar: 12, costumaLevar: "Termogênico e barra de proteína" },
  { id: "cli-005", nome: "Fernanda Lopes", telefone: "(35) 99418-6602", objetivo: "Saúde e imunidade", compras: 4, totalGasto: "689.90", ultimaCompra: "05/09/2026", diasSemComprar: 15, costumaLevar: "Colágeno e multivitamínico" },
  { id: "cli-006", nome: "Patrícia Vilela", telefone: "(35) 99377-1195", objetivo: "Ganho de massa", compras: 4, totalGasto: "612.40", ultimaCompra: "02/07/2026", diasSemComprar: 80, costumaLevar: "Creatina e albumina" },
  { id: "cli-007", nome: "Aline Souza", telefone: "(35) 99264-5518", objetivo: "Resistência para corrida", compras: 5, totalGasto: "743.20", ultimaCompra: "28/07/2026", diasSemComprar: 54, costumaLevar: "Whey concentrado e pasta de amendoim" },
  { id: "cli-008", nome: "Diego Martins", telefone: "(35) 99150-3327", objetivo: "Ganho de massa", compras: 3, totalGasto: "498.70", ultimaCompra: "14/07/2026", diasSemComprar: 68, costumaLevar: "Whey isolado" },
  { id: "cli-009", nome: "Marcelo Tavares", telefone: "(35) 99088-4419", objetivo: "Voltar a treinar", compras: 2, totalGasto: "289.80", ultimaCompra: "03/08/2026", diasSemComprar: 48, costumaLevar: "Coqueteleira e whey concentrado" },
  { id: "cli-010", nome: "Bianca Teixeira", telefone: "(35) 99923-7741", objetivo: "Saúde da pele e cabelo", compras: 3, totalGasto: "419.70", ultimaCompra: "18/09/2026", diasSemComprar: 2, costumaLevar: "Colágeno" },
];

/** Quem ja comprou mais de uma vez e nao volta ha mais de 45 dias. */
export const CLIENTES_PARA_REATIVAR: readonly ClienteDemonstracao[] = CLIENTES.filter(
  (cliente) => cliente.compras > 1 && cliente.diasSemComprar > 45,
).toSorted((a, b) => b.diasSemComprar - a.diasSemComprar);

/** Quem mais volta a loja. */
export const CLIENTES_MAIS_FIEIS: readonly ClienteDemonstracao[] = CLIENTES.filter(
  (cliente) => cliente.diasSemComprar <= 45,
).toSorted((a, b) => b.compras - a.compras);

/** Opcoes para o seletor de clientes do formulario de venda. */
export const CLIENTES_PARA_VENDA = CLIENTES.map((cliente) => ({
  id: cliente.id,
  rotulo: cliente.nome,
  complemento: cliente.telefone,
}));

/** Objetivos oferecidos no cadastro de cliente. */
export const OBJETIVOS = [
  "Ganho de massa",
  "Perda de gordura",
  "Mais disposição no dia a dia",
  "Performance no treino",
  "Saúde e imunidade",
  "Voltar a treinar",
] as const;

/** Interesses usados para sugerir produtos e combos. */
export const INTERESSES = [
  "Suplementação",
  "Alimentação saudável",
  "Musculação",
  "Corrida",
  "Bem-estar e sono",
  "Acessórios de treino",
] as const;

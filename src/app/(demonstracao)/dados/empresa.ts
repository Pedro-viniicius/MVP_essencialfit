/**
 * Dados da empresa usada na demonstracao.
 *
 * TUDO nesta pasta e exemplo: nenhum destes numeros vem do banco. Eles existem
 * para que a apresentacao mostre telas cheias, com valores brasileiros
 * plausiveis e coerentes entre si (o faturamento e a soma das vendas por
 * produto; o ticket medio e o faturamento dividido pelas vendas; e assim por
 * diante). Ao ligar o sistema a uma base real, troque a origem — os
 * componentes de tela nao mudam.
 */

export interface EmpresaDemonstracao {
  readonly nome: string;
  readonly unidade: string;
  readonly cidade: string;
  /** Periodo exibido em todas as telas da demonstracao. */
  readonly periodo: string;
  /** Data de referencia por extenso. */
  readonly hoje: string;
  /** Dias ja decorridos e dias que faltam no mes. */
  readonly diasDecorridos: number;
  readonly diasRestantes: number;
  /** Meta de faturamento do mes, em valor canonico. */
  readonly metaDoMes: string;
}

export const EMPRESA: EmpresaDemonstracao = {
  nome: "Essencial Fit",
  unidade: "Loja Centro",
  cidade: "Lavras, MG",
  periodo: "Setembro de 2026",
  hoje: "20 de setembro de 2026",
  diasDecorridos: 20,
  diasRestantes: 10,
  metaDoMes: "25600.00",
};

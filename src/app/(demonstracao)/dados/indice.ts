/**
 * Dados de demonstracao — ponto unico de entrada.
 *
 * Esta pasta NAO e uma rota: nao ha `page.tsx` nela. Ela existe para que as
 * telas de demonstracao leiam de um lugar so e para que, no dia em que os
 * dados vierem do banco, exista um unico ponto a substituir.
 */
export { EMPRESA, type EmpresaDemonstracao } from "./empresa";
export {
  CLIENTES,
  CLIENTES_MAIS_FIEIS,
  CLIENTES_PARA_REATIVAR,
  CLIENTES_PARA_VENDA,
  INTERESSES,
  OBJETIVOS,
  type ClienteDemonstracao,
} from "./clientes";
export {
  MAIS_VENDIDOS,
  PRODUTOS,
  PRODUTOS_ESTOQUE_BAIXO,
  PRODUTOS_PARADOS,
  PRODUTOS_PARA_VENDA,
  capitalNoEstoque,
  capitalTotalEmEstoque,
  estoqueBaixo,
  faturamentoDoProduto,
  leituraDaPosicao,
  lucroPorUnidade,
  margemPercentual,
  mesesDeEstoque,
  posicaoNaMatriz,
  type CategoriaProduto,
  type ProdutoDemonstracao,
} from "./produtos";
export {
  ALERTAS,
  EVOLUCAO,
  FATURAMENTO_POR_CATEGORIA,
  FORMAS_DE_PAGAMENTO,
  RESULTADO,
  RESULTADO_ANTERIOR,
  RESUMO_CLIENTES,
  RESUMO_ESTOQUE,
  VARIACOES,
  type AlertaDemonstracao,
  type FormaDePagamento,
  type MesDaEvolucao,
  type ParticipacaoCategoria,
  type ResultadoDoMes,
} from "./resultados";
export { FOCOS, IDEIAS, focoAtual, ideiasDoFoco, type Foco, type FocoDaIdeia, type IdeiaDemonstracao } from "./ideias";

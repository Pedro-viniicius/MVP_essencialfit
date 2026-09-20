import { Dinheiro } from "@/compartilhado/dinheiro/indice";

/**
 * Catalogo de exemplo da Essencial Fit.
 *
 * Os valores sao canonicos ("219.90") como no resto do sistema. Nada de
 * ponto flutuante: quem faz conta aqui e `Dinheiro`.
 */

export type CategoriaProduto = "Suplementos" | "Saúde" | "Alimentos" | "Acessórios" | "Vestuário";

export interface ProdutoDemonstracao {
  readonly sku: string;
  readonly nome: string;
  readonly categoria: CategoriaProduto;
  /** Preco de venda, canonico. */
  readonly preco: string;
  /** Custo de compra, canonico. */
  readonly custo: string;
  readonly estoque: number;
  readonly estoqueMinimo: number;
  /** Unidades vendidas no periodo. */
  readonly vendidos: number;
  readonly fornecedor: string;
}

export const PRODUTOS: readonly ProdutoDemonstracao[] = [
  { sku: "SUP-WHI-900", nome: "Whey Protein Isolado 900g", categoria: "Suplementos", preco: "219.90", custo: "142.50", estoque: 9, estoqueMinimo: 10, vendidos: 25, fornecedor: "Nutri Brasil Distribuidora" },
  { sku: "SUP-WHC-1000", nome: "Whey Concentrado 1kg", categoria: "Suplementos", preco: "159.90", custo: "104.00", estoque: 21, estoqueMinimo: 10, vendidos: 10, fornecedor: "Nutri Brasil Distribuidora" },
  { sku: "SUP-CRE-300", nome: "Creatina Monohidratada 300g", categoria: "Suplementos", preco: "149.90", custo: "86.00", estoque: 11, estoqueMinimo: 12, vendidos: 23, fornecedor: "Nutri Brasil Distribuidora" },
  { sku: "SUP-PRE-300", nome: "Pré-treino Explosivo 300g", categoria: "Suplementos", preco: "129.90", custo: "78.00", estoque: 6, estoqueMinimo: 10, vendidos: 7, fornecedor: "Alta Performance Suplementos" },
  { sku: "SUP-GLU-300", nome: "Glutamina 300g", categoria: "Suplementos", preco: "89.90", custo: "52.00", estoque: 5, estoqueMinimo: 10, vendidos: 4, fornecedor: "Alta Performance Suplementos" },
  { sku: "SUP-TER-060", nome: "Termogênico 60 cápsulas", categoria: "Suplementos", preco: "109.90", custo: "59.00", estoque: 4, estoqueMinimo: 10, vendidos: 6, fornecedor: "Alta Performance Suplementos" },
  { sku: "SUP-ALB-500", nome: "Albumina 500g", categoria: "Suplementos", preco: "59.90", custo: "34.00", estoque: 6, estoqueMinimo: 8, vendidos: 9, fornecedor: "Nutri Brasil Distribuidora" },
  { sku: "SAU-COL-300", nome: "Colágeno Verisol 300g", categoria: "Saúde", preco: "119.90", custo: "62.00", estoque: 14, estoqueMinimo: 8, vendidos: 9, fornecedor: "Vita Saúde Ltda" },
  { sku: "SAU-MUL-060", nome: "Multivitamínico 60 cápsulas", categoria: "Saúde", preco: "69.90", custo: "31.00", estoque: 32, estoqueMinimo: 12, vendidos: 14, fornecedor: "Vita Saúde Ltda" },
  { sku: "SAU-OME-120", nome: "Ômega 3 1000mg 120 cápsulas", categoria: "Saúde", preco: "99.90", custo: "48.00", estoque: 7, estoqueMinimo: 10, vendidos: 11, fornecedor: "Vita Saúde Ltda" },
  { sku: "ALI-BAR-012", nome: "Barra de Proteína caixa com 12", categoria: "Alimentos", preco: "89.90", custo: "54.00", estoque: 9, estoqueMinimo: 15, vendidos: 8, fornecedor: "Natural Foods do Brasil" },
  { sku: "ALI-PAS-1000", nome: "Pasta de Amendoim 1kg", categoria: "Alimentos", preco: "42.90", custo: "24.00", estoque: 28, estoqueMinimo: 12, vendidos: 12, fornecedor: "Natural Foods do Brasil" },
  { sku: "ACE-COQ-700", nome: "Coqueteleira Essencial 700ml", categoria: "Acessórios", preco: "39.90", custo: "16.50", estoque: 41, estoqueMinimo: 15, vendidos: 19, fornecedor: "Fit Acessórios" },
  { sku: "ACE-LUV-001", nome: "Luvas de Treino", categoria: "Acessórios", preco: "79.90", custo: "38.00", estoque: 22, estoqueMinimo: 6, vendidos: 1, fornecedor: "Fit Acessórios" },
  { sku: "VES-CAM-001", nome: "Camiseta Dry Fit Essencial", categoria: "Vestuário", preco: "89.90", custo: "41.00", estoque: 26, estoqueMinimo: 8, vendidos: 2, fornecedor: "Fit Acessórios" },
];

/** Lucro por unidade vendida: preco menos custo. */
export function lucroPorUnidade(produto: ProdutoDemonstracao): Dinheiro {
  return Dinheiro.deTexto(produto.preco).subtrair(Dinheiro.deTexto(produto.custo));
}

/** Margem em percentual sobre o preco de venda. */
export function margemPercentual(produto: ProdutoDemonstracao): number {
  const preco = Dinheiro.deTexto(produto.preco);
  if (preco.ehZero()) return 0;
  return Number(lucroPorUnidade(produto).percentualSobre(preco).paraTexto());
}

/** Faturamento do produto no periodo. */
export function faturamentoDoProduto(produto: ProdutoDemonstracao): Dinheiro {
  return Dinheiro.deTexto(produto.preco).multiplicarPorInteiro(produto.vendidos);
}

/** Dinheiro que esta parado neste produto (custo x estoque). */
export function capitalNoEstoque(produto: ProdutoDemonstracao): Dinheiro {
  return Dinheiro.deTexto(produto.custo).multiplicarPorInteiro(produto.estoque);
}

/** Quantos meses o estoque atual cobre, no ritmo de venda do periodo. */
export function mesesDeEstoque(produto: ProdutoDemonstracao): number {
  if (produto.vendidos === 0) return Number.POSITIVE_INFINITY;
  return produto.estoque / produto.vendidos;
}

export function estoqueBaixo(produto: ProdutoDemonstracao): boolean {
  return produto.estoque < produto.estoqueMinimo;
}

/** Produtos que precisam de reposicao, do mais urgente para o menos. */
export const PRODUTOS_ESTOQUE_BAIXO: readonly ProdutoDemonstracao[] = PRODUTOS.filter(estoqueBaixo).toSorted(
  (a, b) => mesesDeEstoque(a) - mesesDeEstoque(b),
);

/** Produtos parados: cobertura acima de seis meses no ritmo atual. */
export const PRODUTOS_PARADOS: readonly ProdutoDemonstracao[] = PRODUTOS.filter(
  (produto) => mesesDeEstoque(produto) > 6,
).toSorted((a, b) => capitalNoEstoque(b).comparar(capitalNoEstoque(a)));

/** Mais vendidos por faturamento no periodo. */
export const MAIS_VENDIDOS: readonly ProdutoDemonstracao[] = PRODUTOS.toSorted((a, b) =>
  faturamentoDoProduto(b).comparar(faturamentoDoProduto(a)),
);

/** Total parado em estoque, somando custo x quantidade de todo o catalogo. */
export function capitalTotalEmEstoque(): Dinheiro {
  return Dinheiro.somarTodos(PRODUTOS.map(capitalNoEstoque));
}

/** Opcoes para o seletor de produtos do formulario de venda. */
export const PRODUTOS_PARA_VENDA = PRODUTOS.map((produto) => ({
  id: produto.sku,
  rotulo: produto.nome,
  complemento: `${produto.categoria} · ${Dinheiro.deTexto(produto.preco).formatarBrasileiro()}`,
}));

/**
 * Posicao de cada produto na relacao giro x margem, normalizada de 0 a 100.
 *
 * Giro: unidades vendidas em relacao ao campeao do periodo.
 * Margem: percentual de margem reescalado entre 30% e 60%, que e a faixa real
 * praticada na loja — assim a nuvem de pontos ocupa o quadro inteiro.
 */
export function posicaoNaMatriz(produto: ProdutoDemonstracao): { giro: number; margem: number } {
  const maiorVenda = PRODUTOS.reduce((maximo, item) => Math.max(maximo, item.vendidos), 1);
  const giro = (produto.vendidos / maiorVenda) * 100;
  const margem = ((margemPercentual(produto) - 30) / 30) * 100;
  return { giro: limitar(giro), margem: limitar(margem) };
}

/** Mantem os pontos dentro da area util, longe dos rotulos dos quadrantes. */
function limitar(valor: number): number {
  return Math.max(8, Math.min(92, valor));
}

/** Frase que explica a posicao do produto na matriz, sem jargao. */
export function leituraDaPosicao(produto: ProdutoDemonstracao): string {
  const { giro, margem } = posicaoNaMatriz(produto);
  if (giro >= 50 && margem >= 50) return "Vende bem e deixa boa margem — é o que puxa o resultado.";
  if (giro >= 50 && margem < 50) return "Vende muito, mas deixa pouca margem em cada unidade.";
  if (giro < 50 && margem >= 50) return "Tem boa margem, mas está vendendo pouco.";
  return "Sai pouco e deixa pouco: vale rever preço, posição na loja ou compra.";
}

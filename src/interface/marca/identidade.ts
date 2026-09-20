/**
 * Identidade da marca — o unico lugar onde o nome, a assinatura e os textos
 * institucionais do produto sao escritos.
 *
 * Para transformar este software em outra marca sao necessarios dois arquivos:
 *   1. este (nome, assinatura, sigla, contato);
 *   2. `tema-essencial-fit.css` (cores, raio, sombra, tipografia).
 * Nenhum componente escreve o nome da empresa no meio do codigo.
 */

export interface IdentidadeDaMarca {
  /** Nome completo, como aparece no cabecalho e no titulo da aba. */
  readonly nome: string;
  /** Nome curto para espacos apertados (celular, rodape). */
  readonly nomeCurto: string;
  /** Duas letras do simbolo. Usado quando a barra lateral esta compacta. */
  readonly sigla: string;
  /** Frase de uma linha que explica o negocio. */
  readonly assinatura: string;
  /** Descricao usada em metadados e na tela de entrada. */
  readonly descricao: string;
  /** Como o produto se apresenta ("Gestão do seu negócio"). */
  readonly nomeDoProduto: string;
  /** Cidade e estado, usados nos textos de demonstracao. */
  readonly praca: string;
  /** Arquivo de tema aplicado em `global.css`. Trocar a marca = trocar o tema. */
  readonly arquivoDeTema: string;
}

export const MARCA: IdentidadeDaMarca = {
  nome: "Essencial Fit",
  nomeCurto: "Essencial",
  sigla: "EF",
  assinatura: "Saúde, performance e acompanhamento de perto",
  descricao:
    "Gestão de clientes, vendas, produtos e estoque para quem vive de saúde, bem-estar e suplementação.",
  nomeDoProduto: "Gestão Essencial",
  praca: "Lavras, MG",
  arquivoDeTema: "tema-essencial-fit.css",
};

/**
 * Perguntas que dao nome as telas. Ficam aqui porque sao parte da voz da
 * marca: o produto fala por perguntas, nao por nomes de relatorio.
 */
export const PERGUNTAS = {
  inicio: "Como está a Essencial Fit hoje?",
  visaoGeral: "Como está meu negócio?",
  clientes: "Quem está comprando e quem podemos trazer de volta?",
  produtos: "O que está vendendo, o que está parado e onde está meu dinheiro?",
  estoque: "O que precisa ser reposto antes de faltar?",
  ideias: "O que podemos fazer diferente com o que já sabemos sobre o negócio?",
} as const;

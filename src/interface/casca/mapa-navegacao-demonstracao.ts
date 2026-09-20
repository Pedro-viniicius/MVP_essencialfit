import type { GrupoDeMenu, ItemDeMenu } from "./mapa-navegacao";

/**
 * Navegacao da area de demonstracao — a arquitetura de informacao de um
 * negocio de saude e bem-estar (clientes, vendas, produtos, estoque).
 *
 * Ela e separada de `NAVEGACAO_PRINCIPAL` de proposito: aquela e do sistema
 * autenticado, com permissoes; esta e a vitrine, sem sessao e sem banco.
 * Os rotulos aqui sao a linguagem do cliente, nao o nome das tabelas.
 */
export const NAVEGACAO_DEMONSTRACAO: readonly GrupoDeMenu[] = [
  {
    rotulo: "",
    itens: [
      {
        rotulo: "Início",
        rota: "/demonstracoes/inicio",
        sigla: "In",
        descricao: "Como está a Essencial Fit hoje",
      },
    ],
  },
  {
    rotulo: "Relacionamento",
    itens: [
      {
        rotulo: "Clientes",
        rota: "/demonstracoes/paineis/clientes",
        sigla: "Cl",
        descricao: "Quem está comprando e quem podemos trazer de volta",
      },
      {
        rotulo: "Vendas",
        rota: "/demonstracoes/formularios/venda",
        sigla: "Vd",
        descricao: "Registrar uma venda em poucos segundos",
      },
    ],
  },
  {
    rotulo: "Produtos",
    itens: [
      {
        rotulo: "Produtos",
        rota: "/demonstracoes/paineis/produtos",
        sigla: "Pr",
        descricao: "O que vende, o que para e onde está o dinheiro",
      },
      {
        rotulo: "Estoque",
        rota: "/demonstracoes/estoque",
        sigla: "Es",
        descricao: "O que precisa ser reposto antes de faltar",
        aceitaContador: true,
      },
    ],
  },
  {
    rotulo: "Decisão",
    itens: [
      {
        rotulo: "Indicadores",
        rota: "/demonstracoes/paineis/visao-geral",
        sigla: "Id",
        descricao: "Faturamento, meta, margem e ticket médio",
      },
      {
        rotulo: "Ideias IA",
        rota: "/ideias",
        sigla: "IA",
        descricao: "Possibilidades de ação a partir do que já sabemos",
      },
    ],
  },
];

/** Rodape da barra lateral da demonstracao. */
export const APOIO_DEMONSTRACAO: readonly ItemDeMenu[] = [
  {
    rotulo: "Demonstrações",
    rota: "/demonstracoes",
    sigla: "De",
    descricao: "Todas as telas de demonstração reunidas",
    exata: true,
  },
  {
    rotulo: "Configurações",
    rota: "/demonstracoes/configuracoes",
    sigla: "Cf",
    descricao: "Identidade visual, dados da empresa e preferências",
  },
];

/** Destinos da barra inferior do celular (tres + "Mais"). */
export const ROTAS_BARRA_INFERIOR_DEMONSTRACAO: readonly string[] = [
  "/demonstracoes/inicio",
  "/demonstracoes/paineis/clientes",
  "/demonstracoes/formularios/venda",
];

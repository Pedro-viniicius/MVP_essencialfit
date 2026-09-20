import type { Permissao } from "@/nucleo/autorizacao/publico";

/**
 * Mapa da navegacao principal.
 *
 * Esta lista e a arquitetura de informacao em codigo. Ela NAO reflete as
 * tabelas do banco: reflete tarefas humanas. Antes de acrescentar um item,
 * leia os quatro criterios em docs/ux/arquitetura-informacao.md, secao 8.
 */

/**
 * Um destino do menu, sem regra de acesso. E o que a barra lateral precisa
 * saber para desenhar um item — e o que a area de demonstracao usa, ja que la
 * nao ha sessao nem permissao.
 */
export interface ItemDeMenu {
  /** Rotulo como o usuario le — com acento. */
  readonly rotulo: string;
  readonly rota: string;
  /** Frase curta usada como titulo acessivel e dica. */
  readonly descricao: string;
  /** Duas letras mostradas quando a barra lateral esta compacta (tablet). */
  readonly sigla?: string;
  /**
   * Quando verdadeiro, o item so fica ativo na rota exata. Use em itens que
   * sao "capa" de uma area cujas telas tem itens proprios no menu.
   */
  readonly exata?: boolean;
  /** Apenas dois itens podem exibir contador; mais do que isso vira ruido. */
  readonly aceitaContador?: boolean;
}

/** Item do sistema autenticado: um destino do menu MAIS a permissao que o revela. */
export interface ItemDeNavegacao extends ItemDeMenu {
  /** Permissao minima para ver o item. Sem ela, o item nao e renderizado. */
  readonly permissao: Permissao;
}

export interface GrupoDeMenu {
  /** Vazio no primeiro grupo: "Início" nao precisa de rotulo. */
  readonly rotulo: string;
  readonly itens: readonly ItemDeMenu[];
}

export interface GrupoDeNavegacao extends GrupoDeMenu {
  readonly itens: readonly ItemDeNavegacao[];
}

export const NAVEGACAO_PRINCIPAL: readonly GrupoDeNavegacao[] = [
  {
    rotulo: "",
    itens: [
      {
        rotulo: "Início",
        rota: "/inicio",
        sigla: "In",
        permissao: "relatorios.visualizar",
        descricao: "Sua situação de hoje e o que precisa de atenção",
      },
    ],
  },
  {
    rotulo: "Operação",
    itens: [
      {
        rotulo: "Contas a pagar",
        rota: "/contas-pagar",
        sigla: "CP",
        permissao: "contas_pagar.visualizar",
        descricao: "Compromissos com fornecedores, impostos e serviços",
        aceitaContador: true,
      },
      {
        rotulo: "Contas a receber",
        rota: "/contas-receber",
        sigla: "CR",
        permissao: "contas_receber.visualizar",
        descricao: "Vendas e serviços que você tem a receber",
      },
    ],
  },
  {
    rotulo: "Tesouraria",
    itens: [
      {
        rotulo: "Bancos e caixa",
        rota: "/bancos",
        sigla: "Bc",
        permissao: "bancos.visualizar",
        descricao: "Onde está o seu dinheiro",
      },
      {
        rotulo: "Conciliação",
        rota: "/conciliacao",
        sigla: "Cc",
        permissao: "bancos.conciliar",
        descricao: "Conferir o extrato com os seus lançamentos",
        aceitaContador: true,
      },
      {
        rotulo: "Fluxo de caixa",
        rota: "/fluxo-de-caixa",
        sigla: "FC",
        permissao: "fluxo_caixa.visualizar",
        descricao: "Entradas e saídas no tempo",
      },
    ],
  },
  {
    rotulo: "Gestão",
    itens: [
      {
        rotulo: "Resultados",
        rota: "/resultados",
        sigla: "Re",
        permissao: "dre.visualizar",
        descricao: "DRE gerencial, margens e indicadores",
      },
      {
        rotulo: "Orçamento",
        rota: "/orcamento",
        sigla: "Or",
        permissao: "orcamento.visualizar",
        descricao: "Planejado comparado ao realizado",
      },
      {
        rotulo: "Dívidas",
        rota: "/dividas",
        sigla: "Dv",
        permissao: "dividas.visualizar",
        descricao: "Empréstimos e financiamentos",
      },
    ],
  },
];

/** Itens de apoio, no rodape da barra lateral. */
export const NAVEGACAO_APOIO: readonly ItemDeNavegacao[] = [
  {
    rotulo: "Ideias IA",
    rota: "/ideias",
    sigla: "IA",
    permissao: "analises_ia.visualizar",
    descricao: "Leituras do negócio e possibilidades de ação",
  },
  {
    rotulo: "Demonstrações",
    rota: "/demonstracoes",
    sigla: "De",
    permissao: "relatorios.visualizar",
    descricao: "Telas de demonstração com dados de exemplo",
  },
  {
    rotulo: "Cadastros",
    rota: "/cadastros",
    sigla: "Cd",
    permissao: "cadastros.visualizar",
    descricao: "Clientes, fornecedores, categorias e centros de custo",
  },
  {
    rotulo: "Configurações",
    rota: "/configuracoes",
    sigla: "Cf",
    permissao: "configuracao.gerenciar",
    descricao: "Empresa, usuários, preferências e auditoria",
  },
];

/** Filtra a navegacao pelas permissoes efetivas do usuario (negar por padrao). */
export function navegacaoVisivel(
  permissoes: ReadonlySet<Permissao>,
  grupos: readonly GrupoDeNavegacao[] = NAVEGACAO_PRINCIPAL,
): readonly GrupoDeNavegacao[] {
  return grupos
    .map((grupo) => ({ ...grupo, itens: grupo.itens.filter((item) => permissoes.has(item.permissao)) }))
    .filter((grupo) => grupo.itens.length > 0);
}

/** Verdadeiro quando a rota atual pertence ao item (considera subrotas). */
export function rotaAtiva(rotaAtual: string, rotaDoItem: string, exata = false): boolean {
  if (rotaDoItem === "/" || exata) return rotaAtual === rotaDoItem;
  return rotaAtual === rotaDoItem || rotaAtual.startsWith(`${rotaDoItem}/`);
}

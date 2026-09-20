/**
 * Motor de ideias — SIMULADO.
 *
 * Nenhum modelo de IA roda aqui. As ideias foram escritas a partir dos mesmos
 * dados de exemplo das outras telas e mostram o FORMATO que a analise real vai
 * ter: o que percebemos, a ideia, por que pode funcionar, como testar e em que
 * a sugestao se baseia.
 *
 * Por tras de cada cartao ha um conceito de microeconomia (elasticidade,
 * custo de oportunidade, bens complementares, margem de contribuicao), mas o
 * texto visivel nunca da aula: ele fala de prateleira, de cliente e de caixa.
 */

/** Recortes de analise. Chegam pela URL: /ideias?foco=estoque */
export type FocoDaIdeia = "resultado" | "clientes" | "estoque" | "preco";

export interface Foco {
  readonly chave: FocoDaIdeia | "tudo";
  readonly rotulo: string;
  /** O que o usuario quer saber ao escolher este recorte. */
  readonly pergunta: string;
}

export const FOCOS: readonly Foco[] = [
  { chave: "tudo", rotulo: "Tudo", pergunta: "O que podemos fazer diferente com o que já sabemos sobre o negócio?" },
  { chave: "resultado", rotulo: "Resultado", pergunta: "O que merece minha atenção para melhorar o resultado do mês?" },
  { chave: "clientes", rotulo: "Clientes", pergunta: "Como trazer de volta quem já comprou e comprar mais de quem fica?" },
  { chave: "estoque", rotulo: "Estoque", pergunta: "Como melhorar o giro e liberar o dinheiro que está na prateleira?" },
  { chave: "preco", rotulo: "Preço e margem", pergunta: "Onde o preço pode render mais sem afastar o cliente?" },
];

export interface IdeiaDemonstracao {
  readonly id: string;
  readonly titulo: string;
  /** Assunto mostrado como etiqueta no cartao. */
  readonly etiqueta: string;
  /** Em quais recortes esta ideia aparece. */
  readonly focos: readonly FocoDaIdeia[];
  readonly oQuePercebemos: string;
  readonly ideia: string;
  readonly porQuePodeFuncionar: string;
  readonly comoTestar: string;
  /** Resposta a "Por que a IA sugeriu isso?". Sem precisao falsa. */
  readonly baseDaSugestao: string;
  readonly acao: { readonly rotulo: string; readonly rota: string };
}

export const IDEIAS: readonly IdeiaDemonstracao[] = [
  {
    id: "combo",
    titulo: "Monte um combo",
    etiqueta: "Ticket médio",
    focos: ["resultado", "clientes"],
    oQuePercebemos:
      "Quem leva whey também costuma demonstrar interesse em coqueteleira e em itens complementares, mas quase sempre leva um produto só por compra.",
    ideia:
      "Criar um combo de whey com um acessório e comparar o ticket médio do combo com o das vendas separadas.",
    porQuePodeFuncionar:
      "O combo aumenta o valor percebido da compra sem depender de desconto: o cliente leva mais porque faz sentido junto, não porque ficou mais barato.",
    comoTestar:
      "Ofereça o combo a uma parte dos clientes durante uma semana e compare o ticket médio dos dois grupos.",
    baseDaSugestao:
      "Esta sugestão considera o que costuma sair na mesma compra, a margem de cada item e o ticket médio atual de R$ 128,81. Há sinais de que vale testar — não é uma previsão de resultado.",
    acao: { rotulo: "Transformar em teste", rota: "/demonstracoes/paineis/produtos" },
  },
  {
    id: "produto-parado",
    titulo: "Produto parado é dinheiro parado",
    etiqueta: "Estoque",
    focos: ["estoque", "resultado"],
    oQuePercebemos:
      "Dois produtos permanecem em estoque há muito mais tempo que a média da loja: juntos somam R$ 1.902,00 que não se movem desde o meio do ano.",
    ideia:
      "Fazer uma ação específica para esses itens — combo, vitrine ou brinde em compras acima de um valor — antes de comprar qualquer novidade da mesma categoria.",
    porQuePodeFuncionar:
      "Estoque tem custo de oportunidade: o dinheiro que está ali não pode comprar o whey que some em quatro dias.",
    comoTestar:
      "Escolha um dos dois itens, coloque em destaque por 15 dias e acompanhe quantas unidades saem e quanto do valor volta para o caixa.",
    baseDaSugestao:
      "Esta sugestão considera o tempo médio em estoque, as unidades vendidas no mês e o custo de cada item parado.",
    acao: { rotulo: "Ver produtos", rota: "/demonstracoes/paineis/produtos" },
  },
  {
    id: "preco",
    titulo: "Talvez o preço não seja o problema",
    etiqueta: "Preço",
    focos: ["preco", "resultado"],
    oQuePercebemos:
      "O Whey Isolado é o produto mais procurado da loja, mas deixa a menor margem percentual entre os campeões de venda.",
    ideia:
      "Testar um ajuste pequeno de preço nesse item, em vez de tentar vender mais unidades imediatamente.",
    porQuePodeFuncionar:
      "Se a procura não cair na mesma proporção do aumento, o resultado total melhora vendendo a mesma coisa. Procura firme costuma aguentar ajustes pequenos.",
    comoTestar:
      "Suba um degrau de preço por duas semanas e acompanhe três números juntos: unidades vendidas, faturamento e margem.",
    baseDaSugestao:
      "Esta sugestão considera margem por unidade, frequência de compra e a participação do produto no faturamento. É um sinal de que vale testar, não uma garantia de reação do cliente.",
    acao: { rotulo: "Criar experimento", rota: "/demonstracoes/formularios/produto" },
  },
  {
    id: "clientes-sumidos",
    titulo: "Clientes que sumiram",
    etiqueta: "Relacionamento",
    focos: ["clientes", "resultado"],
    oQuePercebemos:
      "12 pessoas que compravam com regularidade não voltam há mais de 45 dias. Juntas, já deixaram mais de R$ 4.000,00 na loja.",
    ideia:
      "Montar uma campanha de reativação para esse grupo antes de investir o mesmo valor em atrair gente nova.",
    porQuePodeFuncionar:
      "Recuperar uma relação que já existe costuma exigir menos esforço comercial do que criar uma do zero: a pessoa já conhece a loja e já confiou uma vez.",
    comoTestar:
      "Fale com metade do grupo esta semana, com uma oferta ligada ao que a pessoa costuma levar, e compare o retorno com a outra metade.",
    baseDaSugestao:
      "Esta sugestão considera frequência de compra, dias sem retornar e o que cada pessoa costuma levar.",
    acao: { rotulo: "Ver oportunidade", rota: "/demonstracoes/paineis/clientes" },
  },
  {
    id: "ruptura",
    titulo: "Compre antes de faltar, não depois",
    etiqueta: "Estoque",
    focos: ["estoque"],
    oQuePercebemos:
      "Whey Isolado e Creatina, que sozinhos fazem quase metade do faturamento, têm estoque para menos de uma semana.",
    ideia:
      "Definir um ponto de reposição para os cinco produtos que mais giram e comprar sempre que o estoque chegar nele.",
    porQuePodeFuncionar:
      "A venda perdida por falta não aparece em relatório nenhum — o cliente simplesmente compra em outro lugar, e às vezes fica por lá.",
    comoTestar:
      "Aplique o ponto de reposição por um mês e conte quantas vezes um campeão de venda ficou em falta, comparando com o mês anterior.",
    baseDaSugestao:
      "Esta sugestão considera unidades vendidas por mês, estoque atual, estoque mínimo e o prazo de entrega dos fornecedores.",
    acao: { rotulo: "Ver reposição", rota: "/demonstracoes/estoque" },
  },
  {
    id: "acessorio",
    titulo: "O item pequeno que segura a margem",
    etiqueta: "Margem",
    focos: ["preco", "resultado"],
    oQuePercebemos:
      "A coqueteleira é barata, sai bem e deixa a maior margem percentual da loja — mas quase nunca é oferecida junto com o suplemento.",
    ideia:
      "Oferecer o acessório em toda venda de suplemento acima de R$ 150,00, como sugestão do atendente.",
    porQuePodeFuncionar:
      "Itens de valor baixo e margem alta melhoram o resultado da venda inteira sem exigir que o cliente gaste muito mais.",
    comoTestar:
      "Combine com a equipe por duas semanas e compare quantas vendas passaram a levar o acessório junto.",
    baseDaSugestao:
      "Esta sugestão considera margem por produto, o que costuma sair na mesma compra e o ticket médio atual.",
    acao: { rotulo: "Ver produtos", rota: "/demonstracoes/paineis/produtos" },
  },
  {
    id: "complementares",
    titulo: "Quem cuida da pele também costuma cuidar do coração",
    etiqueta: "Relacionamento",
    focos: ["clientes"],
    oQuePercebemos:
      "Boa parte de quem leva colágeno tem objetivo de saúde e bem-estar, e o ômega 3 quase nunca aparece na mesma compra.",
    ideia:
      "Sugerir o ômega 3 para o grupo que compra colágeno, ligando a sugestão ao objetivo que a pessoa declarou no cadastro.",
    porQuePodeFuncionar:
      "Produtos que servem ao mesmo objetivo se puxam: a conversa deixa de ser sobre produto e passa a ser sobre o que a pessoa quer alcançar.",
    comoTestar:
      "Selecione quem comprou colágeno nos últimos 60 dias e faça a sugestão no próximo atendimento, anotando quem aceitou.",
    baseDaSugestao:
      "Esta sugestão considera o objetivo declarado no cadastro, o histórico de compras e a proximidade entre categorias.",
    acao: { rotulo: "Ver clientes", rota: "/demonstracoes/paineis/clientes" },
  },
  {
    id: "primeira-compra",
    titulo: "A segunda compra vale mais que a primeira",
    etiqueta: "Recorrência",
    focos: ["clientes", "resultado"],
    oQuePercebemos:
      "26 pessoas compraram pela primeira vez neste mês. Historicamente, quem faz a segunda compra tende a continuar voltando.",
    ideia:
      "Criar um retorno combinado: no momento da primeira venda, marcar o contato para quando o produto estiver acabando.",
    porQuePodeFuncionar:
      "A segunda compra é o ponto em que a pessoa deixa de ser visitante e vira cliente — e ela depende mais de lembrança do que de desconto.",
    comoTestar:
      "Combine o retorno com metade dos novos clientes deste mês e compare quantos voltam em 45 dias.",
    baseDaSugestao:
      "Esta sugestão considera data da primeira compra, intervalo médio entre compras e duração estimada do produto levado.",
    acao: { rotulo: "Ver clientes", rota: "/demonstracoes/paineis/clientes" },
  },
];

/** Ideias de um recorte. `tudo` devolve a lista inteira. */
export function ideiasDoFoco(foco: string | undefined): readonly IdeiaDemonstracao[] {
  if (!foco || foco === "tudo") return IDEIAS;
  return IDEIAS.filter((ideia) => (ideia.focos as readonly string[]).includes(foco));
}

/** Foco valido a partir do texto da URL; qualquer outra coisa vira `tudo`. */
export function focoAtual(texto: string | undefined): Foco {
  return FOCOS.find((opcao) => opcao.chave === texto) ?? FOCOS[0]!;
}

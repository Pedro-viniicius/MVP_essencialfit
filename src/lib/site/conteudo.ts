/**
 * Todo o texto da experiência institucional da Essencial Fit.
 *
 * Copy e dados de exemplo ficam aqui, fora dos componentes, para que a
 * narrativa possa ser revisada de uma vez só. O sistema de linguagem da marca
 * (Norte, Sinais, Terreno, Rotas, Marcos, Desvios, Leitura) aparece sempre
 * acompanhado de um subtítulo descritivo: ninguém deve precisar decifrar um
 * botão. Os números do painel de exemplo são inventados e sinalizados.
 */

export const SITE = {
  nome: "Essencial Fit",
  /** Nome da camada física (cartões, etiquetas) — aparece impresso no cartão. */
  tecnologia: "NFC + QR Code",
  slogan: "Ouvir melhor para cuidar melhor.",
  descricao:
    "A Essencial Fit transforma respostas rápidas no ponto de venda em informação para entender melhor seus clientes e tomar decisões mais conscientes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  precoInicial: "Experiência personalizada",
} as const;

/** Frases curtas que se repetem com moderação ao longo da página. */
export const PRINCIPIOS = {
  movimento: "Nem todo movimento é progresso.",
  mapa: "O mapa ajuda. O terreno responde.",
  sistema: "O sistema aponta. Você decide.",
  sinais: "A realidade sempre deixa sinais.",
  rota: "Corrija a rota cedo.",
} as const;

export const NAV = {
  links: [
    { href: "#fluxo", rotulo: "Como funciona" },
    { href: "#sinais", rotulo: "Sinais" },
    { href: "#norte", rotulo: "Painel" },
    { href: "#cenarios", rotulo: "Cenários" },
    { href: "#preco", rotulo: "Preço" },
    { href: "#faq", rotulo: "Perguntas" },
  ],
  cta: "Solicitar demonstração",
  abrirMenu: "Abrir menu",
  fecharMenu: "Fechar menu",
} as const;

export const HERO = {
  selo: "Essencial Fit · NFC + QR Code",
  titulo: "Sua experiência na Essencial Fit pode ajudar a loja a cuidar melhor de você.",
  subtitulo:
    "Aproxime o celular ou leia o QR Code, responda poucas perguntas e ajude a transformar escolhas reais em uma experiência cada vez mais útil.",
  ctaPrimario: "Participar da experiência",
  ctaSecundario: "Entender como funciona",
  nota: "Sem aplicativo. Um toque no cartão ou uma leitura do QR Code.",
} as const;

/** Demonstração do hero: um toque virando direção. A agulha se orienta conforme os sinais chegam. */
export const DEMO_HERO = {
  legenda: "Demonstração",
  cartao: { empresa: "Essencial Fit", instrucao: "Aproxime o celular", codigo: "EF-01" },
  passos: [
    { rotulo: "Toque", descricao: "A pessoa aproxima o celular do cartão ou lê o QR Code. É aqui que o mundo físico começa a virar informação." },
    { rotulo: "Sinal", descricao: "Ela responde em segundos: objetivo, interesse e momento de compra." },
    { rotulo: "Dado", descricao: "A resposta vira um registro com origem, ponto, responsável e horário." },
    { rotulo: "Contexto", descricao: "O registro se junta a centenas de outros e vira padrão, comparação, indicador." },
    { rotulo: "Direção", descricao: "A agulha se orienta: o que os sinais apontam e o que merece a próxima decisão." },
  ],
  tela: {
    notificacao: { titulo: "Essencial Fit", texto: "Abrir experiência da Loja Centro" },
    formulario: {
      titulo: "Essencial Fit",
      subtitulo: "Três perguntas rápidas",
      campos: ["Seu objetivo", "O que mais interessa?", "Quando faria sentido?"],
      valores: ["Mais disposição", "Vitaminas e saúde", "Nos próximos 30 dias"],
      botao: "Enviar",
      sucesso: "Obrigado. Suas respostas foram registradas.",
    },
    registro: {
      titulo: "Sinal registrado",
      linhas: [
        ["Origem", "NFC"],
        ["Ponto", "Loja Centro · EF-01"],
        ["Origem", "Balcão principal"],
        ["Objetivo", "Mais disposição"],
        ["Interesse", "Vitaminas e saúde"],
        ["Momento", "Próximos 30 dias"],
      ],
    },
    contexto: {
      titulo: "Contexto · 14 dias",
      linhas: [
        { rotulo: "Buscam mais disposição", valor: 318 },
        { rotulo: "Interesse em vitaminas", valor: 61 },
        { rotulo: "Pretendem decidir em 30 dias", valor: 57 },
      ],
    },
    direcao: {
      titulo: "Direção",
      leitura: "Há um sinal consistente: disposição é o objetivo mais citado e vitaminas concentram boa parte do interesse no balcão.",
      sugestao: "Vale testar uma orientação curta sobre rotina e vitaminas no ponto de coleta e medir quantas pessoas pedem ajuda depois.",
    },
    /** Ângulo da agulha por passo (graus): começa girando sem referência e assenta no norte. */
    angulos: [-140, 70, -35, 18, 0],
  },
} as const;

export const FLUXO = {
  titulo: "Interação → Sinal → Dado → Contexto → Decisão → Direção",
  subtitulo:
    "O cartão não é o destino. É o começo do sinal. O que acontece depois é o que separa um QR Code qualquer de um instrumento de orientação.",
  etapas: [
    { rotulo: "Interação", descricao: "Um toque no balcão, no estande, na mesa, no cartão do vendedor.", marca: "físico" },
    { rotulo: "Sinal", descricao: "Uma resposta, uma escolha, um contato. Pequeno, mas real.", marca: "físico" },
    { rotulo: "Dado", descricao: "Registrado com origem, ponto, responsável e horário.", marca: "sistema" },
    { rotulo: "Contexto", descricao: "Comparado com outros sinais: por período, ponto, segmento.", marca: "sistema" },
    { rotulo: "Decisão", descricao: "Uma leitura do que mudou e do que merece atenção.", marca: "você" },
    { rotulo: "Direção", descricao: "Uma rota ajustada. E o ciclo recomeça.", marca: "você" },
  ],
  legendaMarcas: { físico: "Na loja", sistema: "Essencial Fit", você: "Próxima decisão" },
  comoFunciona: {
    titulo: "Na prática, quatro etapas",
    passos: [
      { titulo: "Definimos o norte", descricao: "O que você precisa saber: qual produto interessa, qual canal converte, qual preço é aceito, quem atende melhor." },
      { titulo: "Personalizamos", descricao: "Cartões, QR Codes, páginas, perguntas e consentimento — com a sua marca e para a sua operação." },
      { titulo: "As pessoas interagem", descricao: "Um toque ou uma leitura. Sem aplicativo, sem cadastro, sem instrução." },
      { titulo: "Você lê os sinais", descricao: "Painel com indicadores, desvios, leitura assistida por IA e hipóteses para testar." },
    ],
  },
} as const;

export const PROBLEMA = {
  selo: PRINCIPIOS.movimento,
  titulo: "Uma empresa pode vender, anunciar, postar todo dia, contratar, lançar, baixar o preço, abrir canal novo — e ainda não saber se está indo na direção certa.",
  subtitulo:
    "Movimento não é o mesmo que orientação. Esta experiência reduz a incerteza sem prometer o futuro: mostra o que os clientes já estão dizendo com as próprias escolhas.",
  sem: {
    titulo: "Sem orientação",
    itens: ["Achismo", "Ruído", "Opiniões", "Métricas soltas", "Decisões isoladas", "Campanhas desconectadas", "Informação fragmentada"],
  },
  com: {
    titulo: "Com orientação",
    itens: ["Sinais", "Contexto", "Padrões", "Indicadores", "Hipóteses", "Aprendizado", "Decisão e correção de rota"],
  },
  intuicao: "Intuição inicia perguntas. Dados ajudam a testar se estamos indo na direção certa.",
} as const;

export const SINAIS = {
  selo: "Leia os sinais",
  titulo: "Cada interação deixa um sinal. Sozinho, ele diz pouco. Junto com os outros, ele aponta.",
  subtitulo:
    "O problema raramente é falta de informação. É que ela nunca foi registrada — ou foi, e ninguém conseguiu interpretar.",
  colunas: [
    { titulo: "Sinais", descricao: "Um toque, uma resposta" },
    { titulo: "Padrões", descricao: "Centenas de toques, uma tendência" },
    { titulo: "Indicadores", descricao: "Uma pergunta respondida" },
  ],
  toques: [
    { id: "Toque 01", linhas: ["Creatina", "Objetivo: performance"] },
    { id: "Toque 02", linhas: ["Vitaminas", "Objetivo: disposição"] },
    { id: "Toque 03", linhas: ["Whey Protein", "Momento: próximos 30 dias"] },
    { id: "Toque 04", linhas: ["Origem: evento", "Canal: Instagram"] },
    { id: "Toque 05", linhas: ["Snacks saudáveis", "Busca: praticidade"] },
    { id: "Toque 06", linhas: ["Creatina", "Preferência: WhatsApp"] },
  ],
  padroes: [
    { rotulo: "Interesse em creatina", valor: 64 },
    { rotulo: "Busca por mais disposição", valor: 41 },
    { rotulo: "Preferem WhatsApp", valor: 58 },
    { rotulo: "Chegaram por evento", valor: 23 },
  ],
  indicadores: [
    { rotulo: "Interesse mais citado", valor: "Creatina" },
    { rotulo: "Canal que converte", valor: "WhatsApp" },
    { rotulo: "Faixa de preço aceita", valor: "R$ 180–240" },
  ],
  fecho: PRINCIPIOS.sinais,
} as const;

/** "Um cartão. Muitos pontos de contato." — cada chip muda a tela do celular. */
export type TipoFuncao =
  | "google"
  | "whatsapp"
  | "pix"
  | "instagram"
  | "formulario"
  | "evento"
  | "pesquisa"
  | "contato"
  | "catalogo";

export type Funcao = {
  id: TipoFuncao;
  chip: string;
  cartao: string;
  acontece: string;
  sinal: string;
};

export const FUNCOES = {
  titulo: "Um cartão. Muitos pontos de contato.",
  subtitulo:
    "O mesmo cartão pode levar a destinos diferentes, conforme o que você precisa aprender. E cada destino deixa um sinal diferente.",
  rotuloAcontece: "O que acontece",
  rotuloSinal: "Que sinal fica",
  rotuloSelecionar: "Escolha um ponto de contato",
  itens: [
    { id: "google", chip: "Google", cartao: "Avalie sua experiência", acontece: "Abre a avaliação do seu perfil no Google, com uma pergunta de contexto antes, se fizer sentido.", sinal: "Quantos clientes chegam até a avaliação, por ponto, atendente e turno." },
    { id: "whatsapp", chip: "WhatsApp", cartao: "Fale com a gente", acontece: "Abre uma conversa com a mensagem inicial preenchida e o contexto do cartão.", sinal: "Quantos toques viraram conversa — e de qual vendedor ou unidade cada uma veio." },
    { id: "pix", chip: "PIX", cartao: "Pague por PIX", acontece: "Mostra a chave ou o código para copiar. O pagamento acontece no banco da pessoa, como sempre.", sinal: "Em quais pontos e horários o pagamento por aproximação é mais usado." },
    { id: "instagram", chip: "Instagram", cartao: "Siga a gente", acontece: "Abre o perfil da empresa — ou a rede que fizer mais sentido para a campanha.", sinal: "Se a rede recebe atenção real de quem está na loja, não só de quem já segue." },
    { id: "formulario", chip: "Formulário", cartao: "Deixe seu contato", acontece: "Abre um formulário curto, com os campos que você definiu e o consentimento que a finalidade exige.", sinal: "Leads por vendedor, interesse, prazo de compra e origem (NFC ou QR)." },
    { id: "evento", chip: "Evento", cartao: "Faça seu check-in", acontece: "Registra a inscrição ou a presença e pode encaminhar para uma pesquisa ou um sorteio.", sinal: "Presença por horário, estandes mais visitados e o que cada participante respondeu." },
    { id: "pesquisa", chip: "Pesquisa", cartao: "Responda em 30 segundos", acontece: "Três a cinco perguntas com resposta de um toque, no momento da experiência.", sinal: "Preferências, faixa de preço aceita e diferenças entre segmentos." },
    { id: "contato", chip: "Contato", cartao: "Salve meu contato", acontece: "Cartão de visita digital: salvar contato, WhatsApp, LinkedIn, site ou portfólio.", sinal: "Quantas pessoas salvaram o contato de cada profissional e qual canal escolheram." },
    { id: "catalogo", chip: "Catálogo", cartao: "Veja o catálogo", acontece: "Catálogo ou cardápio digital, com um botão de interesse por item.", sinal: "Quais produtos são mais abertos, comparados e marcados como interesse." },
  ] satisfies Funcao[],
  aplicacoesTitulo: "Onde isso se aplica",
  aplicacoes: [
    { titulo: "Vendas com atribuição", descricao: "Cada vendedor com o próprio cartão. Todo sinal sabe quem atendeu, onde e quando.", exemplos: "Concessionárias, imobiliárias, varejo, showrooms" },
    { titulo: "Eventos", descricao: "Inscrição, check-in, pesquisa e sorteio sem fila e sem papel. Funciona mesmo com sinal fraco.", exemplos: "Feiras, lançamentos, ativações" },
    { titulo: "Restaurantes e serviços", descricao: "Cardápio, avaliação ao final e um canal direto na mesa ou no balcão.", exemplos: "Restaurantes, clínicas, salões, academias" },
    { titulo: "Produtos no ponto de venda", descricao: "Etiqueta ao lado do produto: informação, interesse e comparação sem depender do vendedor.", exemplos: "Varejo, galerias, exposições" },
    { titulo: "Pesquisa de mercado", descricao: "Perguntas curtas respondidas por quem está vivendo a experiência, não por quem lembra dela depois.", exemplos: "Lançamentos, teste de preço, avaliação de serviço" },
    { titulo: "Organizações e campanhas institucionais", descricao: "Troca voluntária de informação com o público: inscrições, agenda, canais de contato e opiniões.", exemplos: "Associações, ONGs, órgãos públicos" },
  ],
} as const;

export const TERRENO = {
  selo: "Conheça o terreno",
  titulo: "O mercado não responde ao que você acredita. Ele responde ao que você oferece.",
  subtitulo:
    "Toda empresa trabalha com hipóteses sobre produto, preço, canal e cliente. As pessoas respondem com escolhas. A Essencial Fit torna essa resposta fácil de observar.",
  suposicao: { titulo: "O que a empresa supõe", rotulo: "Mapa" },
  realidade: { titulo: "O que a interação mostra", rotulo: "Terreno" },
  pares: [
    { suposicao: "“Nosso cliente é jovem e vem pelo Instagram.”", realidade: "Quem responde tem 35–44 anos e chegou pela indicação de um vendedor." },
    { suposicao: "“O preço é o que trava a venda.”", realidade: "61% aceitariam a faixa atual; a objeção mais citada é o prazo de entrega." },
    { suposicao: "“O produto mais vendido é o mais desejado.”", realidade: "Creatina recebe mais interesse nos cartões, mas orientação para iniciantes ainda aparece pouco no balcão." },
  ],
  fecho: PRINCIPIOS.mapa,
  perguntasTitulo: "Perguntas que o terreno responde",
  perguntasSubtitulo: "Economia aplicada sem aula de economia: cada pergunta abaixo tem um sinal que a responde.",
  perguntas: [
    { pergunta: "Seu preço está afastando clientes?", sinal: "Faixa de preço aceita por segmento, comparada ao preço praticado." },
    { pergunta: "Qual produto gera interesse sem gerar compra?", sinal: "Interesse por toque contra vendas fechadas, por produto." },
    { pergunta: "Qual canal traz atenção e qual traz decisão?", sinal: "Aberturas por canal contra conversão por canal." },
    { pergunta: "Há demanda ou apenas curiosidade?", sinal: "Intenção de compra declarada e prazo, cruzados com retorno de contato." },
    { pergunta: "O que os clientes substituem quando uma opção muda?", sinal: "Segunda escolha declarada quando a primeira não está disponível." },
    { pergunta: "Qual segmento aceita melhor determinada faixa?", sinal: "Distribuição de preço aceito por faixa etária, ponto ou origem." },
  ],
} as const;

/** Painel "Norte": organizado por perguntas, não por uma parede de métricas. */
export const NORTE = {
  selo: "O painel",
  titulo: "Norte: um painel organizado pelas perguntas que você faria a um bom navegador",
  subtitulo:
    "Onde estamos? O que mudou? O que os sinais mostram? Onde vale olhar com mais atenção? Qual hipótese testar agora? Cada bloco responde a uma delas.",
  aviso: "Dados de demonstração",
  periodo: "Últimos 14 dias · Loja Centro",
  areas: [
    { nome: "Norte", descricao: "Visão geral e objetivo do período" },
    { nome: "Sinais", descricao: "Dados e indicadores da operação" },
    { nome: "Terreno", descricao: "Quem interage e como se comporta" },
    { nome: "Desvios", descricao: "O que saiu do padrão" },
    { nome: "Rotas", descricao: "Ações e hipóteses que merecem atenção" },
    { nome: "Marcos", descricao: "Metas e progresso" },
    { nome: "Leitura", descricao: "Interpretação assistida por IA" },
  ],
  ondeEstamos: {
    pergunta: "Onde estamos?",
    kpis: [
      { rotulo: "Interações", valor: "1.284", detalhe: "+12% vs. período anterior" },
      { rotulo: "Pessoas únicas", valor: "946", detalhe: "74% do total" },
      { rotulo: "Toques que viraram resposta", valor: "38%", detalhe: "488 respostas" },
      { rotulo: "Consentimento para contato", valor: "91%", detalhe: "444 pessoas" },
    ],
    serie: {
      titulo: "Interações por dia",
      valores: [52, 61, 48, 70, 88, 95, 64, 58, 77, 84, 102, 118, 96, 71],
      rotulos: ["1", "", "", "", "5", "", "", "", "", "10", "", "", "", "14"],
    },
    origem: [
      { rotulo: "NFC", valor: 62 },
      { rotulo: "QR Code", valor: 38 },
    ],
  },
  oQueMudou: {
    pergunta: "O que mudou?",
    desvios: [
      { texto: "Ponto Centro: +42% de interações na semana", tipo: "alta" },
      { texto: "Conversão do Instagram caiu de 14% para 9%", tipo: "baixa" },
      { texto: "Faixa de preço aceita se deslocou para R$ 180–240", tipo: "mudanca" },
    ],
  },
  sinaisMostram: {
    pergunta: "O que os sinais estão mostrando?",
    canais: {
      titulo: "Canal: atenção × decisão",
      colunas: ["Canal", "Aberturas", "Conversão"],
      linhas: [
        ["Instagram", "412", "9%"],
        ["WhatsApp", "298", "31%"],
        ["Google", "176", "22%"],
        ["Site", "121", "14%"],
      ],
    },
    produtos: {
      titulo: "Interesse por produto",
      itens: [
        { rotulo: "Creatina", valor: 318 },
        { rotulo: "Whey Protein", valor: 274 },
        { rotulo: "Vitaminas", valor: 190 },
        { rotulo: "Modelo D", valor: 97 },
      ],
    },
    responsaveis: {
      titulo: "Por responsável",
      colunas: ["Vendedor", "Sinais", "Conversão"],
      linhas: [
        ["Vendedor 07", "212", "44%"],
        ["Vendedora 03", "187", "41%"],
        ["Vendedor 12", "164", "35%"],
        ["Vendedora 05", "141", "31%"],
      ],
    },
  },
  ondeOlhar: {
    pergunta: "Onde vale olhar com mais atenção?",
    itens: [
      { titulo: "Creatina: interesse alto, dúvidas recorrentes", texto: "318 pessoas demonstraram interesse; iniciantes pedem orientação sobre uso e rotina." },
      { titulo: "Instagram atrai, WhatsApp decide", texto: "Mais aberturas no Instagram; 3,4× mais conversão no WhatsApp." },
    ],
  },
  hipotese: {
    pergunta: "Qual hipótese testar agora?",
    itens: [
      { texto: "Cartões do balcão apontando para o WhatsApp em vez do Instagram, por duas semanas.", medir: "Conversão por canal" },
      { texto: "Teste uma orientação curta sobre creatina para quem declarou foco em performance.", medir: "Interesse → pedido de ajuda" },
    ],
  },
  fecho: PRINCIPIOS.sistema,
} as const;

export const LEITURA = {
  selo: "Leitura",
  titulo: "A IA se comporta como um navegador, não como um comandante.",
  subtitulo:
    "Ela lê os sinais que a sua operação coletou, aponta o que mudou e o que merece atenção, e diz quando os dados ainda não bastam para concluir. A decisão continua sendo sua.",
  aviso: "Exemplo ilustrativo",
  rotuloBase: "Base",
  observacoes: [
    { texto: "Há um sinal consistente de que o Instagram traz atenção e o WhatsApp traz decisão.", base: "412 aberturas e 9% de conversão no Instagram; 298 aberturas e 31% no WhatsApp, nos últimos 14 dias." },
    { texto: "Os dados sugerem que vale investigar como a creatina é apresentada.", base: "318 pessoas citaram creatina; dúvidas de uso aparecem com frequência entre iniciantes." },
    { texto: "Esse comportamento merece atenção: o ponto Centro cresceu 42% e os outros ficaram estáveis.", base: "486 interações contra 341 na semana anterior. Sem mudança de equipe registrada." },
    { texto: "Os dados ainda não são suficientes para concluir sobre a faixa 55+.", base: "Apenas 31 respostas nessa faixa no período; a leitura ficará disponível com mais sinais." },
  ],
  diz: { titulo: "Como a Leitura fala", itens: ["“Os dados sugerem que vale investigar…”", "“Esse comportamento merece atenção…”", "“Há um sinal consistente de…”", "“Considere testar…”", "“Os dados ainda não são suficientes para concluir…”"] },
  naoDiz: { titulo: "O que ela nunca diz", itens: ["“Faça isso.”", "“O resultado será X.”", "Uma causa onde só existe correlação", "Um dado que não foi coletado"] },
  fecho: PRINCIPIOS.sistema,
} as const;

export const DESVIOS = {
  selo: "Desvios",
  titulo: "Trabalhar mais na direção errada continua sendo ir na direção errada.",
  subtitulo:
    "Nenhum destes exemplos é falta de esforço. É esforço sem sinal. Desvio percebido cedo é informação; percebido tarde, é custo.",
  exemplos: [
    { acao: "Postar mais no Instagram", realidade: "quando os clientes convertem pelo WhatsApp." },
    { acao: "Dar desconto em um produto", realidade: "quando o preço não era a objeção real." },
    { acao: "Promover o produto mais vendido", realidade: "quando outro tem demanda alta e ninguém vê." },
    { acao: "Abrir outro ponto de venda", realidade: "sem entender por que o atual funciona." },
  ],
  fecho: "O pior problema não é estar errado. É continuar na direção errada sem perceber.",
} as const;

export const RECALIBRAR = {
  selo: "Recalibre cedo",
  titulo: "Uma boa empresa não precisa acertar tudo de primeira. Precisa perceber cedo quando está errando.",
  subtitulo:
    "Dados não existem apenas para confirmar decisões. Eles também mostram quando é hora de recalibrar. A Essencial Fit fecha esse ciclo.",
  ciclo: [
    { rotulo: "Coletar", descricao: "Cada toque vira um sinal registrado." },
    { rotulo: "Observar", descricao: "Sinais viram padrões e desvios." },
    { rotulo: "Aprender", descricao: "Uma hipótese confirmada, outra descartada." },
    { rotulo: "Ajustar", descricao: "A rota muda: canal, preço, produto, ponto." },
    { rotulo: "Coletar de novo", descricao: "O terreno responde à nova rota." },
  ],
  fecho: PRINCIPIOS.rota,
} as const;

export const CENARIOS = {
  selo: "Cenários",
  titulo: "Como a direção muda quando o terreno responde",
  subtitulo: "Situações hipotéticas, construídas para ilustrar o método. Não são relatos de clientes.",
  aviso: "Exemplo hipotético",
  rotulos: { suposicao: "Suposição", sinal: "Sinal observado", direcao: "Nova direção" },
  itens: [
    {
      numero: "01",
      contexto: "Uma loja de roupas",
      suposicao: "O Instagram é o principal canal de vendas.",
      sinal: "Os cartões do balcão mostram: o Instagram gera descoberta; o WhatsApp gera conversão.",
      direcao: "O Instagram continua, mas o cartão do balcão e o investimento em atendimento passam a apontar para o WhatsApp.",
    },
    {
      numero: "02",
      contexto: "Uma loja de saúde e suplementação",
      suposicao: "O preço é a principal objeção.",
      sinal: "Na pesquisa de 30 segundos, as condições de financiamento aparecem antes do preço.",
      direcao: "A conversa de venda começa pelo financiamento. O desconto que estava planejado não é necessário.",
    },
    {
      numero: "03",
      contexto: "Um restaurante",
      suposicao: "O prato mais vendido é o mais desejado.",
      sinal: "O cardápio digital mostra outro prato com muito interesse — e pouca visibilidade na mesa.",
      direcao: "O cardápio muda de lugar o prato. Duas semanas depois, o terreno responde de novo.",
    },
  ],
} as const;

export const PERSONALIZACAO = {
  titulo: "Você não compra um cartão. Você configura um instrumento.",
  subtitulo:
    "A interface física e o sistema são personalizados para a sua operação. O mesmo cartão muda de função sem ser reimpresso.",
  fisico: {
    titulo: "Interface física",
    descricao: `Cartões, etiquetas e displays ${SITE.tecnologia}, com a sua identidade.`,
    itens: ["Logo e cores da marca", "Mensagem impressa", "QR Code como alternativa ao NFC", "Identificação do vendedor ou atendente", "Produto, evento, campanha ou departamento", "Unidade ou ponto de coleta"],
  },
  digital: {
    titulo: "Sistema",
    descricao: "O que acontece depois do toque e como os sinais são tratados.",
    itens: ["Destino e fluxo de cada cartão", "Perguntas e formulários", "Tela de confirmação e identidade visual", "Consentimento por finalidade", "Indicadores, desvios e marcos", "Permissões de acesso", "Exportações e integrações"],
  },
  cartoesTitulo: "O mesmo cartão, seis pontos de contato",
  cartoes: [
    { numero: "01", funcao: "Avaliação no Google", contexto: "Balcão" },
    { numero: "02", funcao: "Captura de leads", contexto: "Vendedor 07" },
    { numero: "03", funcao: "PIX", contexto: "Feira" },
    { numero: "04", funcao: "Instagram", contexto: "Campanha de verão" },
    { numero: "05", funcao: "Inscrição em evento", contexto: "Lançamento" },
    { numero: "06", funcao: "Pesquisa com clientes", contexto: "Nova linha" },
  ],
} as const;

export const PRIVACIDADE = {
  titulo: "Sinais coletados com consentimento e tratados com critério",
  subtitulo: "Arquitetura desenvolvida considerando os princípios da LGPD: finalidade, necessidade, transparência e segurança.",
  itens: [
    { titulo: "Consentimento por finalidade", descricao: "Cada uso dos dados tem o próprio consentimento, com o texto exato que a pessoa aceitou registrado e versionado." },
    { titulo: "Só o necessário", descricao: "As perguntas pedem apenas o que a finalidade exige. Dados sensíveis ficam de fora por padrão." },
    { titulo: "Acesso controlado", descricao: "Painel com autenticação em dois fatores e permissões por perfil de uso." },
    { titulo: "Dados mascarados na operação", descricao: "Telefones e e-mails aparecem parcialmente ocultos; revelar exige uma ação registrada." },
    { titulo: "Rastreabilidade e auditoria", descricao: "Acessos, revelações e exportações ficam registrados: quem, quando e o quê." },
    { titulo: "Retenção e anonimização", descricao: "Prazo definido por projeto; ao final, os dados pessoais são anonimizados e os indicadores permanecem." },
    { titulo: "Sem rastreamento invisível", descricao: "Nenhum script de terceiros nas páginas de interação. O IP nunca é armazenado em texto claro." },
    { titulo: "Exportações com critério", descricao: "Listas de contato saem apenas com quem consentiu com aquela finalidade, e cada exportação é auditada." },
  ],
} as const;

export const PRECO = {
  titulo: "Um plano inicial. Sem tabela de três colunas.",
  subtitulo: "A experiência Essencial Fit é configurada a partir do que a loja precisa aprender, com perguntas curtas e finalidade clara.",
  rotuloAPartir: "Plano inicial",
  valor: SITE.precoInicial,
  descricao: "Plataforma e implantação inicial. Inclui, conforme a aplicação:",
  inclui: [
    "Painel Norte: sinais, desvios, rotas e marcos",
    "Coleta configurável: páginas, perguntas, consentimento",
    "Integração NFC + QR Code",
    "Atribuição por vendedor, ponto ou unidade",
    "Exportação de dados",
    "Leitura assistida por IA",
    "Suporte à personalização",
  ],
  observacao: "Cartões físicos, desenvolvimento sob medida, integrações e implantações de grande porte são orçados à parte.",
  cta: "Conversar sobre uma aplicação",
} as const;

export const FAQ = {
  titulo: "Perguntas frequentes",
  itens: [
    { pergunta: "Preciso instalar algum aplicativo?", resposta: "Não. Nem a sua empresa nem o cliente. O toque ou a leitura do QR Code abre uma página no navegador do celular." },
    { pergunta: "O cliente precisa ter NFC no celular?", resposta: "A maioria dos smartphones recentes tem NFC ativo por padrão. Quando não tem, o QR Code impresso no cartão faz o mesmo caminho." },
    { pergunta: "E se o celular não ler o cartão?", resposta: "O QR Code está sempre no cartão como alternativa. Os dois levam à mesma página, e o painel registra qual deles foi usado." },
    { pergunta: "Posso escolher para onde o cartão leva?", resposta: "Sim. Google, WhatsApp, PIX, Instagram, formulário, pesquisa, catálogo, evento ou qualquer página. O destino é configurado por cartão." },
    { pergunta: "Posso alterar a função depois?", resposta: "Sim. O cartão aponta para um endereço que continua o mesmo; o que acontece depois é alterado no painel, sem reimprimir nada." },
    { pergunta: "Os cartões são personalizados?", resposta: "Sim: logo, cores, mensagem, identificação do vendedor, do produto, da unidade ou da campanha. Também há etiquetas e displays para balcão e mesa." },
    { pergunta: "Consigo saber qual vendedor coletou cada sinal?", resposta: "Sim. Cada cartão é vinculado a um responsável, ponto ou unidade, e todo registro carrega essa atribuição." },
    { pergunta: "Consigo usar em eventos?", resposta: "Sim. Inscrição, check-in, pesquisa, sorteio e feedback. O fluxo funciona mesmo com sinal fraco: os registros são enviados quando a conexão volta." },
    { pergunta: "O que é o painel?", resposta: "É a área interna da Essencial Fit, organizada pelas perguntas que importam: quem respondeu, o que mais interessa e onde vale testar uma melhoria." },
    { pergunta: "Como a inteligência artificial é utilizada?", resposta: "Como uma camada de leitura sobre os sinais coletados: ela aponta mudanças, padrões e desvios, sugere o que investigar e avisa quando os dados não bastam. Ela não decide nem inventa informação." },
    { pergunta: "As ideias preveem resultados?", resposta: "Não. Elas transformam padrões nas respostas em hipóteses pequenas e mensuráveis. A equipe decide o que testar." },
    { pergunta: "Como funciona a proteção dos dados?", resposta: "Consentimento por finalidade com texto versionado, acesso com dois fatores, dados mascarados na operação, auditoria de acessos e exportações, retenção definida e anonimização ao final. A arquitetura foi desenvolvida considerando os princípios da LGPD." },
    { pergunta: "Posso integrar com outros sistemas?", resposta: "Exportações em CSV fazem parte do plano inicial. Integrações com CRM, ferramentas de marketing ou sistemas internos são avaliadas por projeto." },
    { pergunta: "Quanto custa?", resposta: "O plano inicial cobre a plataforma e a implantação. O valor depende da aplicação: quantos pontos de contato, quais perguntas e qual volume. Cartões físicos, integrações e desenvolvimento sob medida são orçados à parte." },
  ],
} as const;

export const CTA_FINAL = {
  titulo: "Você não precisa prever todo o caminho. Precisa saber ler o próximo sinal.",
  subtitulo:
    "A Essencial Fit transforma interações reais em informação para entender melhor seus clientes e escolher onde vale melhorar a experiência.",
  cta: "Encontrar meu próximo norte",
  nota: "Cada aplicação é orçada pelo que você precisa aprender.",
} as const;

export const CONTATO = {
  titulo: "Conte o que você precisa aprender sobre a sua operação",
  subtitulo: "Respondemos com uma proposta de aplicação: quais pontos de contato, quais perguntas e quais sinais.",
  campos: {
    nome: "Seu nome",
    empresa: "Empresa",
    contato: "WhatsApp ou e-mail",
    contatoDica: "para retornarmos",
    mensagem: "O que você quer descobrir, medir ou conectar?",
    mensagemPlaceholder: "Ex.: quero saber qual vendedor gera mais leads e se o preço é mesmo a objeção principal.",
  },
  consentimento: "Ao enviar, você autoriza o contato da Essencial Fit sobre esta solicitação. Nenhum outro uso.",
  /** Gravada em cada solicitação; mude a versão sempre que o texto acima mudar. */
  consentimentoVersao: "2026-09-15.v2",
  botao: "Enviar solicitação",
  enviando: "Enviando…",
  sucesso: { titulo: "Recebemos sua solicitação.", texto: "Entraremos em contato pelo canal informado." },
  erros: {
    nome: "Informe seu nome.",
    empresa: "Informe o nome da empresa.",
    contato: "Informe um WhatsApp ou e-mail válido.",
    mensagem: "Conte, em poucas palavras, o que você quer descobrir ou medir.",
    generico: "Não foi possível enviar agora. Tente novamente em instantes.",
    limite: "Recebemos várias solicitações deste endereço. Tente novamente mais tarde.",
  },
} as const;

export const RODAPE = {
  descricao: "Orientação por informação: cartões NFC + QR Code, sinais estruturados, painel Norte e leitura assistida por IA.",
  colunas: [
    {
      titulo: "Produto",
      links: [
        { href: "#fluxo", rotulo: "Como funciona" },
        { href: "#funcoes", rotulo: "Pontos de contato" },
        { href: "#norte", rotulo: "Painel Norte" },
        { href: "#personalizacao", rotulo: "Personalização" },
      ],
    },
    {
      titulo: "Método",
      links: [
        { href: "#sinais", rotulo: "Leia os sinais" },
        { href: "#terreno", rotulo: "Conheça o terreno" },
        { href: "#recalibrar", rotulo: "Recalibre cedo" },
        { href: "#cenarios", rotulo: "Cenários" },
      ],
    },
    {
      titulo: "Confiança",
      links: [
        { href: "#privacidade", rotulo: "Privacidade e LGPD" },
        { href: "#leitura", rotulo: "Como usamos IA" },
        { href: "#faq", rotulo: "Perguntas frequentes" },
        { href: "#contato", rotulo: "Solicitar demonstração" },
      ],
    },
  ],
  legal: "Os dados e cenários exibidos nesta página são ilustrativos.",
  principio: PRINCIPIOS.sistema,
} as const;

/**
 * Conjunto de dados fictícios do modo de teste.
 *
 * É a mesma história que `scripts/seed-demo.ts` grava no banco — evento de
 * demonstração, oito pontos de captura e ~220 cadastros com pico à tarde —
 * só que montada em memória. O sorteio usa semente fixa: toda execução gera
 * exatamente os mesmos nomes, horários e totais, então um link com filtro
 * continua válido depois de reiniciar o servidor.
 *
 * Nada aqui é real: os nomes são combinações de listas, os telefones usam a
 * faixa `9 0xxxx-xxxx` que a Anatel nunca alocou e os e-mails são example.com.
 */
import { DEMO_SLUG } from "@/lib/demo/constantes";
import type { Finalidade, Origem } from "@/lib/domain";
import { M } from "@/lib/texts/messages";
import { POLITICA_VERSAO } from "@/lib/texts/privacy";

export type EventoMock = {
  id: string;
  slug: string;
  nome: string;
  inicio: Date;
  fim: Date;
  ativo: boolean;
  politicaVersao: string;
  retencaoMeses: number;
  modelos: string[];
};

export type VendedorMock = { id: string; codigo: string; nome: string; ativo: boolean };

export type LeadMock = {
  id: string;
  eventoId: string;
  vendedorId: string | null;
  origem: Origem;
  nome: string;
  telefone: string;
  email: string | null;
  modeloInteresse: string | null;
  prazoCompra: string | null;
  cupom: string;
  ipHash: string | null;
  userAgent: string | null;
  chaveIdempotencia: string | null;
  criadoEm: Date;
  anonimizadoEm: Date | null;
};

export type ConsentimentoMock = {
  leadId: string;
  finalidade: Finalidade;
  concedido: boolean;
  textoVersao: string;
  registradoEm: Date;
};

export type AuditoriaMock = {
  id: number;
  usuarioId: string | null;
  acao: string;
  entidade: string | null;
  entidadeId: string | null;
  metadados: Record<string, unknown> | null;
  criadoEm: Date;
};

export type SolicitacaoMock = {
  id: string;
  nome: string;
  empresa: string;
  contato: string;
  mensagem: string;
  consentimentoVersao: string;
  ipHash: string | null;
  userAgent: string | null;
  criadoEm: Date;
};

export type Dados = {
  eventos: EventoMock[];
  vendedores: VendedorMock[];
  leads: LeadMock[];
  consentimentos: ConsentimentoMock[];
  auditoria: AuditoriaMock[];
  solicitacoes: SolicitacaoMock[];
};

/** Slug do evento aberto: é o que `/f/<slug>` espera no modo de teste. */
export const SLUG_ABERTO = "essencial-fit";

const MODELOS_DO_EVENTO = [
  "Creatina",
  "Whey Protein",
  "Vitaminas e saúde",
  "Snacks saudáveis",
  "Acessórios",
  "Quero orientação",
];

const DIA = "2026-08-29"; // um sábado, o mesmo dia do seed de demonstração

// Desempenho visivelmente diferente: um líder, um pelotão e uma cauda.
const PONTOS = [
  { codigo: "D01", nome: "Balcão principal", peso: 30 },
  { codigo: "D02", nome: "Área de suplementos", peso: 22 },
  { codigo: "D03", nome: "Cartão do sorteio", peso: 42 },
  { codigo: "D04", nome: "Espaço de bem-estar", peso: 14 },
  { codigo: "D05", nome: "Caixa", peso: 34 },
  { codigo: "D06", nome: "Academia parceira", peso: 10 },
  { codigo: "D07", nome: "Evento local", peso: 26 },
  { codigo: "D08", nome: "QR da vitrine", peso: 18 },
];

// Cadastros por hora: manhã lenta, pico das 14h às 17h, cauda no fechamento.
const POR_HORA: Record<number, number> = {
  9: 5, 10: 9, 11: 13, 12: 15, 13: 18, 14: 31, 15: 38, 16: 36, 17: 27, 18: 18, 19: 8,
};

const DDDS = [16, 19, 11, 17, 14, 15, 18, 31, 34, 41];

const AGENTES = [
  "Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 Chrome/128.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13; moto g54 5G) AppleWebKit/537.36 Chrome/127.0 Mobile Safari/537.36",
];

const PRIMEIROS = [
  "Adriana", "Alexandre", "Aline", "Anderson", "Andréia", "Bárbara", "Breno", "Bruna", "Caio", "Carla",
  "Cláudio", "Cristiane", "Daniel", "Débora", "Diego", "Edson", "Elaine", "Fabiana", "Fábio", "Felipe",
  "Fernanda", "Gabriel", "Gilberto", "Gustavo", "Helena", "Henrique", "Isabela", "Jéssica", "João Victor",
  "Josiane", "Kátia", "Leandro", "Letícia", "Luciana", "Luiz Fernando", "Márcia", "Mariana", "Maurício",
  "Michele", "Natália", "Otávio", "Priscila", "Rafael", "Raquel", "Ricardo", "Rosana", "Samuel", "Sérgio",
  "Simone", "Tatiane", "Vanessa", "Vinícius", "Wagner", "Wesley",
];

const SOBRENOMES = [
  "Albuquerque", "Amaral", "Azevedo", "Barbosa", "Benevides", "Bittencourt", "Brandão", "Cabral", "Camargo",
  "Cardoso", "Castilho", "Cavalcanti", "Coutinho", "Dutra", "Esteves", "Farias", "Figueiredo", "Fonseca",
  "Galvão", "Guimarães", "Hoffmann", "Lacerda", "Leite", "Macedo", "Magalhães", "Medeiros", "Mendonça",
  "Nogueira", "Ottoni", "Pacheco", "Peixoto", "Quadros", "Rezende", "Sampaio", "Siqueira", "Teixeira",
  "Toledo", "Vasconcelos", "Viana", "Xavier", "Zanetti",
];

/** Sorteio com semente fixa: a mesma história em toda execução. */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gerarDados(): Dados {
  const rnd = mulberry32(20260829);
  const entre = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
  const escolher = <T,>(lista: readonly T[]) => lista[Math.floor(rnd() * lista.length)];
  const pesos = <T,>(itens: readonly (readonly [T, number])[]) => {
    const total = itens.reduce((s, [, p]) => s + p, 0);
    return () => {
      let x = rnd() * total;
      for (const [v, p] of itens) {
        x -= p;
        if (x < 0) return v;
      }
      return itens[itens.length - 1][0];
    };
  };
  const hex = (n: number) => Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
  const id = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.floor(rnd() * 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const cupom = (prefixo: string) =>
    `${prefixo}-` + Array.from({ length: 5 }, () => ALFABETO[Math.floor(rnd() * ALFABETO.length)]).join("");
  const semAcento = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, ".");

  const escolherModelo = pesos<string | null>([
    ["Creatina", 30], ["Whey Protein", 24], ["Vitaminas e saúde", 15], ["Snacks saudáveis", 12],
    ["Acessórios", 10], ["Quero orientação", 5], [M.form.naoSei, 3], [null, 1],
  ]);
  const escolherPrazo = pesos<string | null>([
    ["Só quero conhecer", 45], ["Mais adiante", 20], ["Nos próximos 30 dias", 17], ["Hoje", 13], [null, 5],
  ]);
  const escolherOrigem = pesos<Origem>([["nfc", 55], ["qr", 30], ["manual", 12], ["direto", 3]]);

  // O evento aberto é o que o formulário público usa; ele nasce sem cadastros.
  const aberto: EventoMock = {
    id: id(),
    slug: SLUG_ABERTO,
    nome: "Experiência Essencial Fit",
    inicio: new Date("2026-09-19T07:00:00-03:00"),
    fim: new Date("2026-09-19T23:59:59-03:00"),
    ativo: true,
    politicaVersao: POLITICA_VERSAO,
    retencaoMeses: 12,
    modelos: MODELOS_DO_EVENTO,
  };

  // O evento de demonstração fica inativo, igual ao seed: o formulário público
  // o recusa e ele nunca poderia receber um cadastro de verdade.
  const demo: EventoMock = {
    id: id(),
    slug: DEMO_SLUG,
    nome: "Essencial Fit · dados de demonstração",
    inicio: new Date(`${DIA}T09:00:00-03:00`),
    fim: new Date(`${DIA}T19:00:00-03:00`),
    ativo: false,
    politicaVersao: POLITICA_VERSAO,
    retencaoMeses: 12,
    modelos: MODELOS_DO_EVENTO,
  };

  // Pontos do evento aberto ficam ativos (dá para testar `?v=01`); os da
  // demonstração ficam inativos, para não atribuírem cadastro nenhum.
  const vendedores: VendedorMock[] = [
    ...Array.from({ length: 8 }, (_, i) => {
      const codigo = String(i + 1).padStart(2, "0");
      return { id: id(), codigo, nome: `Ponto ${codigo}`, ativo: true };
    }),
    ...PONTOS.map((p) => ({ id: id(), codigo: p.codigo, nome: p.nome, ativo: false })),
  ];

  const idPorCodigo = new Map(vendedores.map((v) => [v.codigo, v.id]));
  const escolherPonto = pesos<string | null>([
    ...PONTOS.map((p) => [idPorCodigo.get(p.codigo)!, p.peso] as const),
    [null, 4], // alguns sem ponto: cartão sem `?v=` ou código digitado errado
  ]);

  const leads: LeadMock[] = [];
  const consentimentos: ConsentimentoMock[] = [];
  const nomes = new Set<string>();
  const telefones = new Set<string>();
  const concedidos: Record<string, Record<Finalidade, boolean>> = {};

  for (const [hora, qtd] of Object.entries(POR_HORA)) {
    for (let i = 0; i < qtd; i++) {
      let nome: string;
      do nome = `${escolher(PRIMEIROS)} ${escolher(SOBRENOMES)}`;
      while (nomes.has(nome));
      nomes.add(nome);

      let telefone: string;
      do telefone = `+55${escolher(DDDS)}90${String(entre(0, 9_999_999)).padStart(7, "0")}`;
      while (telefones.has(telefone));
      telefones.add(telefone);

      const criadoEm = new Date(
        `${DIA}T${String(hora).padStart(2, "0")}:${String(entre(0, 59)).padStart(2, "0")}:${String(entre(0, 59)).padStart(2, "0")}-03:00`,
      );
      const origem = escolherOrigem();
      const leadId = id();

      leads.push({
        id: leadId,
        eventoId: demo.id,
        vendedorId: origem === "direto" ? null : escolherPonto(),
        origem,
        nome,
        telefone,
        email: rnd() < 0.7 ? `${semAcento(nome)}${entre(1, 99)}@example.com` : null,
        modeloInteresse: escolherModelo(),
        prazoCompra: escolherPrazo(),
        cupom: cupom("DEMO"),
        ipHash: hex(64),
        userAgent: escolher(AGENTES),
        chaveIdempotencia: id(),
        criadoEm,
        anonimizadoEm: null,
      });
      concedidos[leadId] = {
        contato_comercial: true,
        promocao: rnd() < 0.85,
        marketing: rnd() < 0.55,
      };
    }
  }

  leads.sort((a, b) => a.criadoEm.getTime() - b.criadoEm.getTime());
  for (const lead of leads) {
    for (const finalidade of ["contato_comercial", "promocao", "marketing"] as const) {
      consentimentos.push({
        leadId: lead.id,
        finalidade,
        concedido: concedidos[lead.id][finalidade],
        textoVersao: POLITICA_VERSAO,
        registradoEm: lead.criadoEm,
      });
    }
  }

  // Textura operacional: o que o sistema real grava diante de um cartão com
  // código errado e de tráfego suspeito.
  const auditoria: AuditoriaMock[] = [];
  let sequencia = 1;
  const registrar = (
    acao: string,
    lead: LeadMock,
    metadados: Record<string, unknown>,
  ) => {
    auditoria.push({
      id: sequencia++,
      usuarioId: null,
      acao,
      entidade: "lead",
      entidadeId: lead.id,
      metadados,
      criadoEm: lead.criadoEm,
    });
  };

  for (const lead of leads.filter((l) => !l.vendedorId && l.origem !== "direto").slice(0, 3)) {
    registrar("vendedor_desconhecido", lead, { codigo: "D0", evento: DEMO_SLUG, origem: lead.origem });
  }
  if (leads[97]) registrar("lead_suspeito", leads[97], { motivo: "3 cadastros do mesmo ip_hash em 40 s", evento: DEMO_SLUG });
  if (leads[141]) registrar("lead_suspeito", leads[141], { motivo: "user-agent de automação", evento: DEMO_SLUG });

  return { eventos: [aberto, demo], vendedores, leads, consentimentos, auditoria, solicitacoes: [] };
}

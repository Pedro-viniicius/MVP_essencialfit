/**
 * Demo data for /demo: one inactive event, eight fictional sellers and ~220
 * invented leads that tell a plausible event-day story.
 *
 *   pnpm db:seed:demo            # (re)creates the demo event from scratch
 *   pnpm db:seed:demo --purge    # removes the demo event and everything under it
 *
 * Nothing here is real: names are combined from generated lists, phones use
 * the `9 0xxx-xxxx` block Anatel never allocated, e-mails use example.com.
 * The event is `ativo = false`, so the public form refuses it and it can
 * never receive a real submission. Sellers are `ativo = false` too, so a
 * crafted ?v=D01 can never attribute a real lead to a demo seller.
 */
import { scriptDatabaseUrl } from "./lib/env";
import { anunciarAlvo } from "./lib/alvo";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { createPool } from "../src/lib/db/pool";
import { auditoria, consentimentos, eventos, leads, vendedores } from "../src/lib/db/schema";
import { DEMO_SLUG } from "../src/lib/demo/constantes";
import { POLITICA_VERSAO } from "../src/lib/texts/privacy";
import { M } from "../src/lib/texts/messages";

const DIA = "2026-08-29"; // a Saturday, about two weeks before the pitch
const EVENTO = {
  slug: DEMO_SLUG,
  nome: "Essencial Fit · dados de demonstração",
  inicio: new Date(`${DIA}T09:00:00-03:00`),
  fim: new Date(`${DIA}T19:00:00-03:00`),
  ativo: false,
  politicaVersao: POLITICA_VERSAO,
  retencaoMeses: 12,
  modelos: ["Creatina", "Whey Protein", "Vitaminas e saúde", "Snacks saudáveis", "Acessórios", "Quero orientação"],
};

// Clearly different performance: a leader, a pack, a tail.
const VENDEDORES = [
  { codigo: "D01", nome: "Balcão principal", peso: 30 },
  { codigo: "D02", nome: "Área de suplementos", peso: 22 },
  { codigo: "D03", nome: "Cartão do sorteio", peso: 42 },
  { codigo: "D04", nome: "Espaço de bem-estar", peso: 14 },
  { codigo: "D05", nome: "Caixa", peso: 34 },
  { codigo: "D06", nome: "Academia parceira", peso: 10 },
  { codigo: "D07", nome: "Evento local", peso: 26 },
  { codigo: "D08", nome: "QR da vitrine", peso: 18 },
];

// Leads per hour: slow morning, peak 14h–17h, tail at closing (~220 total).
const POR_HORA: Record<number, number> = {
  9: 5, 10: 9, 11: 13, 12: 15, 13: 18, 14: 31, 15: 38, 16: 36, 17: 27, 18: 18, 19: 8,
};

const MODELOS = pesos([
  ["Creatina", 30], ["Whey Protein", 24], ["Vitaminas e saúde", 15], ["Snacks saudáveis", 12], ["Acessórios", 10], ["Quero orientação", 5],
  [M.form.naoSei, 3], [null, 1],
]);
const PRAZOS = pesos([
  ["Só quero conhecer", 45], ["Mais adiante", 20], ["Nos próximos 30 dias", 17], ["Hoje", 13], [null, 5],
]);
const ORIGENS = pesos([["nfc", 55], ["qr", 30], ["manual", 12], ["direto", 3]] as const);
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

// Seeded PRNG so every run tells the same story.
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260829);
const entre = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const escolher = <T,>(lista: readonly T[]) => lista[Math.floor(rnd() * lista.length)];
function pesos<T>(itens: readonly (readonly [T, number])[]) {
  const total = itens.reduce((s, [, p]) => s + p, 0);
  return () => {
    let x = rnd() * total;
    for (const [v, p] of itens) { x -= p; if (x < 0) return v; }
    return itens[itens.length - 1][0];
  };
}
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const cupom = () => "DEMO-" + Array.from({ length: 5 }, () => ALFABETO[Math.floor(rnd() * ALFABETO.length)]).join("");
const hex = (n: number) => Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, ".");

async function main() {
  const somentePurge = process.argv.includes("--purge");
  const url = scriptDatabaseUrl();
  anunciarAlvo(url);
  const pool = createPool(url);
  const db = drizzle(pool);
  try {
    await db.transaction(async (tx) => {
      const removido = await purgar(tx);
      if (removido) console.log(`Evento demo anterior removido (${removido.leads} leads, ${removido.auditoria} linhas de auditoria).`);
      if (somentePurge) {
        console.log(removido ? "Purge concluído." : "Nada a remover: o evento demo não existe.");
        return;
      }
      const evento = await criar(tx);
      console.log(`Evento "${evento.slug}" pronto (inativo): ${evento.total} leads, ${VENDEDORES.length} vendedores.`);
    });
  } finally {
    await pool.end();
  }
}

type Tx = Parameters<Parameters<ReturnType<typeof drizzle>["transaction"]>[0]>[0];

async function purgar(tx: Tx) {
  const [evento] = await tx.select({ id: eventos.id }).from(eventos).where(eq(eventos.slug, DEMO_SLUG));
  if (!evento) return null;
  const ids = (await tx.select({ id: leads.id }).from(leads).where(eq(leads.eventoId, evento.id))).map((l) => l.id);
  let auditoriaRemovida = 0;
  if (ids.length) {
    const r = await tx.delete(auditoria).where(inArray(auditoria.entidadeId, ids));
    auditoriaRemovida += r.rowCount ?? 0;
  }
  // Rows written by /demo itself (reveal, export) are tagged with the slug.
  const r2 = await tx.delete(auditoria).where(sql`${auditoria.metadados}->>'evento' = ${DEMO_SLUG}`);
  auditoriaRemovida += r2.rowCount ?? 0;
  await tx.delete(leads).where(eq(leads.eventoId, evento.id)); // consents cascade
  await tx.delete(vendedores).where(inArray(vendedores.codigo, VENDEDORES.map((v) => v.codigo)));
  await tx.delete(eventos).where(eq(eventos.id, evento.id));
  return { leads: ids.length, auditoria: auditoriaRemovida };
}

async function criar(tx: Tx) {
  const [evento] = await tx.insert(eventos).values(EVENTO).returning({ id: eventos.id, slug: eventos.slug });
  const inseridos = await tx
    .insert(vendedores)
    .values(VENDEDORES.map((v) => ({ codigo: v.codigo, nome: v.nome, ativo: false })))
    .returning({ id: vendedores.id, codigo: vendedores.codigo });
  const idPorCodigo = new Map(inseridos.map((v) => [v.codigo, v.id]));
  const escolherVendedor = pesos([
    ...VENDEDORES.map((v) => [idPorCodigo.get(v.codigo)!, v.peso] as const),
    [null, 4], // a handful with no seller: card without ?v= or a mistyped code
  ]);

  const nomes = new Set<string>();
  const telefones = new Set<string>();
  const novos: (typeof leads.$inferInsert & { consent: Record<string, boolean> })[] = [];
  for (const [hora, qtd] of Object.entries(POR_HORA)) {
    for (let i = 0; i < qtd; i++) {
      let nome: string;
      do nome = `${escolher(PRIMEIROS)} ${escolher(SOBRENOMES)}`; while (nomes.has(nome));
      nomes.add(nome);
      let telefone: string;
      do telefone = `+55${escolher(DDDS)}90${String(entre(0, 9_999_999)).padStart(7, "0")}`; while (telefones.has(telefone));
      telefones.add(telefone);
      const minuto = entre(0, 59);
      const criadoEm = new Date(`${DIA}T${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}:${String(entre(0, 59)).padStart(2, "0")}-03:00`);
      const origem = ORIGENS();
      novos.push({
        eventoId: evento.id,
        vendedorId: origem === "direto" ? null : escolherVendedor(),
        origem,
        nome,
        telefone,
        email: rnd() < 0.7 ? `${semAcento(nome)}${entre(1, 99)}@example.com` : null,
        modeloInteresse: MODELOS(),
        prazoCompra: PRAZOS(),
        cupom: cupom(),
        ipHash: hex(64),
        userAgent: escolher(AGENTES),
        chaveIdempotencia: randomUUID(),
        criadoEm,
        consent: { contato_comercial: true, promocao: rnd() < 0.85, marketing: rnd() < 0.55 },
      });
    }
  }
  novos.sort((a, b) => a.criadoEm!.getTime() - b.criadoEm!.getTime());

  const gravados = await tx
    .insert(leads)
    .values(novos.map((n) => { const { consent, ...l } = n; void consent; return l; }))
    .returning({ id: leads.id, criadoEm: leads.criadoEm, vendedorId: leads.vendedorId, origem: leads.origem });

  await tx.insert(consentimentos).values(
    gravados.flatMap((l, i) =>
      (["contato_comercial", "promocao", "marketing"] as const).map((finalidade) => ({
        leadId: l.id,
        finalidade,
        concedido: novos[i].consent[finalidade],
        textoVersao: POLITICA_VERSAO,
        registradoEm: l.criadoEm,
      })),
    ),
  );

  // Operational texture: what the real system writes on a bad card and on suspicious traffic.
  const semVendedor = gravados.filter((l) => l.vendedorId === null && l.origem !== "direto").slice(0, 3);
  const suspeitos = [gravados[97], gravados[141]];
  await tx.insert(auditoria).values([
    ...semVendedor.map((l) => ({
      acao: "vendedor_desconhecido",
      entidade: "lead",
      entidadeId: l.id,
      metadados: { codigo: "D0", evento: DEMO_SLUG, origem: l.origem },
      criadoEm: l.criadoEm,
    })),
    {
      acao: "lead_suspeito",
      entidade: "lead",
      entidadeId: suspeitos[0].id,
      metadados: { motivo: "3 cadastros do mesmo ip_hash em 40 s", evento: DEMO_SLUG },
      criadoEm: suspeitos[0].criadoEm,
    },
    {
      acao: "lead_suspeito",
      entidade: "lead",
      entidadeId: suspeitos[1].id,
      metadados: { motivo: "user-agent de automação", evento: DEMO_SLUG },
      criadoEm: suspeitos[1].criadoEm,
    },
  ]);

  return { slug: evento.slug, total: gravados.length };
}

main().catch((err) => {
  console.error("Seed demo falhou:", err);
  process.exit(1);
});

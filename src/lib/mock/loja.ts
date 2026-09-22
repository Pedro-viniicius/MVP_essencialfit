/**
 * Banco em memória do modo de teste.
 *
 * Cada função aqui responde exatamente o que a consulta real responderia —
 * mesmo formato, mesma ordenação, mesmos campos — só que lendo os arrays de
 * `dados.ts` em vez do Postgres. É o único lugar que precisa mudar quando uma
 * consulta real mudar de formato.
 *
 * Gravações (cadastro, revelação, exportação, pedido de contato) ficam nestes
 * arrays: valem enquanto o servidor estiver de pé e somem no restart, quando
 * o conjunto volta ao estado inicial.
 */
import { randomUUID } from "node:crypto";
import type { ResultadoCriacao } from "@/lib/leads/criar-lead";
import { DEMO_SLUG } from "@/lib/demo/constantes";
import { mascararEmail, mascararNome, mascararTelefone } from "@/lib/demo/mascara";
import type { Filtros, LinhaLista } from "@/lib/demo/queries";
import { TAMANHO_PAGINA } from "@/lib/demo/queries";
import type { Finalidade } from "@/lib/domain";
import { log } from "@/lib/logger";
import type { LeadParsed } from "@/lib/validation/lead";
import { gerarDados, type AuditoriaMock, type Dados, type LeadMock } from "./dados";

const FUSO = "America/Sao_Paulo";

// Guardado no globalThis para o hot reload do `next dev` não recriar o
// conjunto a cada edição de arquivo — e com ele perder o que foi cadastrado.
const globalParaMock = globalThis as unknown as { dadosMock?: Dados };

function dados(): Dados {
  if (!globalParaMock.dadosMock) {
    globalParaMock.dadosMock = gerarDados();
    log.info("modo de teste ligado: dados fictícios em memória", {
      leads: globalParaMock.dadosMock.leads.length,
      eventos: globalParaMock.dadosMock.eventos.map((e) => e.slug).join(", "),
    });
  }
  return globalParaMock.dadosMock;
}

/** Hora local do cadastro, que é como o painel agrupa a curva do dia. */
function horaLocal(data: Date): number {
  return Number(data.toLocaleString("pt-BR", { timeZone: FUSO, hour: "2-digit", hour12: false }));
}

/** Agrupa e ordena do maior para o menor, como o `order by count desc` das consultas. */
function contarPor<T extends string | null>(itens: LeadMock[], chave: (l: LeadMock) => T) {
  const totais = new Map<T, number>();
  for (const item of itens) totais.set(chave(item), (totais.get(chave(item)) ?? 0) + 1);
  return [...totais.entries()]
    .map(([rotulo, total]) => ({ rotulo, total }))
    .sort((a, b) => b.total - a.total || String(a.rotulo).localeCompare(String(b.rotulo), "pt-BR"));
}

function leadsDoEvento(eventoId: string): LeadMock[] {
  return dados().leads.filter((l) => l.eventoId === eventoId);
}

function consentiu(leadId: string, finalidade: Finalidade): boolean {
  return dados().consentimentos.some((c) => c.leadId === leadId && c.finalidade === finalidade && c.concedido);
}

// ---------------------------------------------------------------- formulário

/** Espelha `buscarEventoPorSlug`: só o que o formulário público precisa. */
export async function buscarEventoPorSlug(slug: string) {
  const e = dados().eventos.find((x) => x.slug === slug);
  return e
    ? { id: e.id, slug: e.slug, nome: e.nome, ativo: e.ativo, politicaVersao: e.politicaVersao, modelos: e.modelos }
    : null;
}

/**
 * Espelha `criarLead`, com as mesmas regras de negócio: mesma chave de
 * idempotência devolve o cadastro original, telefone repetido no mesmo evento
 * vira "duplicado" com o cupom que já existe, e um código de ponto
 * desconhecido grava auditoria em vez de atribuir errado.
 */
export async function criarLead(
  evento: { id: string; slug: string; politicaVersao: string },
  entrada: LeadParsed,
  contexto: { ipHash: string | null; userAgent: string | null },
): Promise<ResultadoCriacao> {
  const banco = dados();

  const repetido = banco.leads.find((l) => l.chaveIdempotencia === entrada.chaveIdempotencia);
  if (repetido) return { status: "repetido", leadId: repetido.id, cupom: repetido.cupom };

  const duplicado = banco.leads.find(
    (l) => l.eventoId === evento.id && l.telefone === entrada.telefone && !l.anonimizadoEm,
  );
  if (duplicado) return { status: "duplicado", cupom: duplicado.cupom };

  const vendedor = entrada.vendedorCodigo
    ? banco.vendedores.find((v) => v.codigo === entrada.vendedorCodigo && v.ativo)
    : null;

  const lead: LeadMock = {
    id: randomUUID(),
    eventoId: evento.id,
    vendedorId: vendedor?.id ?? null,
    origem: entrada.origem,
    nome: entrada.nome,
    telefone: entrada.telefone,
    email: entrada.email,
    modeloInteresse: entrada.modeloInteresse,
    prazoCompra: entrada.prazoCompra,
    cupom: entrada.cupom,
    ipHash: contexto.ipHash,
    userAgent: contexto.userAgent,
    chaveIdempotencia: entrada.chaveIdempotencia,
    criadoEm: new Date(),
    anonimizadoEm: null,
  };
  banco.leads.push(lead);

  for (const finalidade of ["contato_comercial", "promocao", "marketing"] as const) {
    banco.consentimentos.push({
      leadId: lead.id,
      finalidade,
      concedido: entrada.consentimentos[finalidade],
      textoVersao: evento.politicaVersao,
      registradoEm: lead.criadoEm,
    });
  }

  if (entrada.vendedorCodigo && !vendedor) {
    await registrarAuditoria({
      acao: "vendedor_desconhecido",
      entidade: "lead",
      entidadeId: lead.id,
      metadados: { codigo: entrada.vendedorCodigo, evento: evento.slug, origem: entrada.origem },
    });
  }

  return { status: "criado", leadId: lead.id, cupom: lead.cupom };
}

// -------------------------------------------------------------------- painel

export async function eventoDemo() {
  const e = dados().eventos.find((x) => x.slug === DEMO_SLUG);
  return e ? { id: e.id, nome: e.nome, inicio: e.inicio, retencaoMeses: e.retencaoMeses, ativo: e.ativo } : null;
}

export async function resumo(eventoId: string) {
  const itens = leadsDoEvento(eventoId);
  const comVendedor = itens.filter((l) => l.vendedorId);
  const distintos = new Set(comVendedor.map((l) => l.vendedorId)).size;
  const comMarketing = itens.filter((l) => consentiu(l.id, "marketing")).length;
  const registrados = itens.filter((l) =>
    dados().consentimentos.some((c) => c.leadId === l.id && c.finalidade === "marketing"),
  ).length;
  return {
    total: itens.length,
    ate3Meses: itens.filter((l) => l.prazoCompra === "Hoje" || l.prazoCompra === "Nos próximos 30 dias").length,
    mediaPorVendedor: distintos ? comVendedor.length / distintos : 0,
    taxaMarketing: registrados ? comMarketing / registrados : 0,
    comMarketing,
    semMarketing: registrados - comMarketing,
  };
}

export async function porHora(eventoId: string) {
  const totais = new Map<number, number>();
  for (const l of leadsDoEvento(eventoId)) {
    const hora = horaLocal(l.criadoEm);
    totais.set(hora, (totais.get(hora) ?? 0) + 1);
  }
  return [...totais.entries()]
    .map(([hora, total]) => ({ hora, total }))
    .sort((a, b) => a.hora - b.hora);
}

export async function porVendedor(eventoId: string) {
  const nomePorId = new Map(dados().vendedores.map((v) => [v.id, v.nome]));
  return contarPor(leadsDoEvento(eventoId), (l) => l.vendedorId).map(({ rotulo, total }) => ({
    id: rotulo,
    nome: rotulo ? (nomePorId.get(rotulo) ?? null) : null,
    total,
  }));
}

export async function porModelo(eventoId: string) {
  return contarPor(leadsDoEvento(eventoId), (l) => l.modeloInteresse);
}

export async function porPrazo(eventoId: string) {
  return contarPor(leadsDoEvento(eventoId), (l) => l.prazoCompra);
}

export async function porOrigem(eventoId: string) {
  return contarPor(leadsDoEvento(eventoId), (l) => l.origem);
}

export async function revelacoesHoje() {
  const inicioDoDia = new Date(new Date().toLocaleDateString("en-CA", { timeZone: FUSO }) + "T00:00:00-03:00");
  return dados().auditoria.filter(
    (a) => a.acao === "dado_revelado" && a.metadados?.evento === DEMO_SLUG && a.criadoEm >= inicioDoDia,
  ).length;
}

function filtrar(eventoId: string, f: Filtros): LeadMock[] {
  return leadsDoEvento(eventoId).filter((l) => {
    if (f.vendedor === "sem" && l.vendedorId !== null) return false;
    if (f.vendedor && f.vendedor !== "sem" && l.vendedorId !== f.vendedor) return false;
    if (f.modelo && l.modeloInteresse !== f.modelo) return false;
    if (f.prazo && l.prazoCompra !== f.prazo) return false;
    if (f.consentimento === "marketing" && !consentiu(l.id, "marketing")) return false;
    return true;
  });
}

export async function listar(eventoId: string, f: Filtros) {
  const encontrados = filtrar(eventoId, f).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());
  const pagina = encontrados.slice((f.pagina - 1) * TAMANHO_PAGINA, f.pagina * TAMANHO_PAGINA);
  const suspeitos = new Set(
    dados().auditoria.filter((a) => a.acao === "lead_suspeito").map((a) => a.entidadeId),
  );
  const nomePorId = new Map(dados().vendedores.map((v) => [v.id, v.nome]));

  const itens: LinhaLista[] = pagina.map((l) => ({
    id: l.id,
    // Mascarado na origem, igual à consulta real: o cliente nunca recebe o valor inteiro.
    nome: mascararNome(l.nome),
    telefone: mascararTelefone(l.telefone),
    email: mascararEmail(l.email),
    modelo: l.modeloInteresse,
    prazo: l.prazoCompra,
    vendedor: l.vendedorId ? (nomePorId.get(l.vendedorId) ?? null) : null,
    origem: l.origem,
    criadoEm: l.criadoEm,
    consentimentos: {
      contato_comercial: consentiu(l.id, "contato_comercial"),
      promocao: consentiu(l.id, "promocao"),
      marketing: consentiu(l.id, "marketing"),
    },
    suspeito: suspeitos.has(l.id),
  }));

  return { itens, total: encontrados.length, paginas: Math.max(1, Math.ceil(encontrados.length / TAMANHO_PAGINA)) };
}

export async function buscarCompleto(eventoId: string, leadId: string) {
  const l = leadsDoEvento(eventoId).find((x) => x.id === leadId);
  return l ? { id: l.id, nome: l.nome, telefone: l.telefone, email: l.email } : null;
}

export async function paraExportacao(eventoId: string, incluirSemConsentimento: boolean) {
  const nomePorId = new Map(dados().vendedores.map((v) => [v.id, v.nome]));
  return leadsDoEvento(eventoId)
    .filter((l) => incluirSemConsentimento || consentiu(l.id, "marketing"))
    .sort((a, b) => a.criadoEm.getTime() - b.criadoEm.getTime())
    .map((l) => ({
      nome: l.nome,
      telefone: l.telefone,
      email: l.email,
      modelo: l.modeloInteresse,
      prazo: l.prazoCompra,
      vendedor: l.vendedorId ? (nomePorId.get(l.vendedorId) ?? null) : null,
      origem: l.origem,
      criadoEm: l.criadoEm,
      marketing: consentiu(l.id, "marketing"),
      promocao: consentiu(l.id, "promocao"),
    }));
}

export async function opcoesFiltro(eventoId: string) {
  const [vs, ms, ps] = await Promise.all([porVendedor(eventoId), porModelo(eventoId), porPrazo(eventoId)]);
  return {
    vendedores: vs.filter((v) => v.id && v.nome).map((v) => ({ id: v.id!, nome: v.nome! })),
    modelos: ms.map((m) => m.rotulo).filter((x): x is string => !!x),
    prazos: ps.map((p) => p.rotulo).filter((x): x is string => !!x),
  };
}

// ----------------------------------------------------------------- auditoria

export async function registrarAuditoria(entrada: {
  acao: string;
  entidade?: string;
  entidadeId?: string;
  usuarioId?: string | null;
  metadados?: Record<string, unknown>;
}) {
  const banco = dados();
  const linha: AuditoriaMock = {
    id: banco.auditoria.length + 1,
    usuarioId: entrada.usuarioId ?? null,
    acao: entrada.acao,
    entidade: entrada.entidade ?? null,
    entidadeId: entrada.entidadeId ?? null,
    metadados: entrada.metadados ?? null,
    criadoEm: new Date(),
  };
  banco.auditoria.push(linha);
}

/**
 * O freio de força bruta do login lê a própria auditoria. Em modo de teste
 * ninguém está atacando o painel, então o contador existe mas começa zerado
 * a cada restart.
 */
export async function falhasDeLogin(ipHash: string | null, desde: Date): Promise<number> {
  return dados().auditoria.filter(
    (a) => a.acao === "login_falhou" && a.criadoEm > desde && (!ipHash || a.metadados?.ipHash === ipHash),
  ).length;
}

// -------------------------------------------------------- pedidos de contato

export async function contarSolicitacoesPorIp(ipHash: string, desde: Date): Promise<number> {
  return dados().solicitacoes.filter((s) => s.ipHash === ipHash && s.criadoEm > desde).length;
}

export async function gravarSolicitacaoContato(entrada: {
  nome: string;
  empresa: string;
  contato: string;
  mensagem: string;
  consentimentoVersao: string;
  ipHash: string | null;
  userAgent: string | null;
}) {
  dados().solicitacoes.push({ id: randomUUID(), ...entrada, criadoEm: new Date() });
}

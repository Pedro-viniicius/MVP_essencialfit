import { ArrowRightIcon, MinusIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CENARIOS, DESVIOS, FLUXO, PERSONALIZACAO, PROBLEMA, RECALIBRAR, SINAIS, TERRENO } from "@/lib/site/conteudo";
import { Cabecalho, CartaoFisico, IconeBussola, Secao, SimboloNfc } from "./primitivos";

/* --- Interação → Sinal → Dado → Contexto → Decisão → Direção ------------- */

const COR_MARCA: Record<string, string> = { físico: "bg-white text-tinta border-linha", sistema: "bg-tinta text-white border-tinta", você: "bg-acento text-white border-acento" };

/** Uma rota com seis waypoints. Horizontal no desktop, vertical no celular. */
export function Fluxo() {
  return (
    <Secao id="fluxo">
      <Cabecalho titulo={FLUXO.titulo} subtitulo={FLUXO.subtitulo} alinhamento="centro" />
      <ol className="relative mt-14 grid gap-3 md:grid-cols-6 md:gap-0">
        {/* linha da rota (tracejada: um caminho, não um cano) */}
        <span aria-hidden className="absolute top-0 bottom-6 left-[15px] border-l border-dashed border-tinta/30 md:top-4 md:right-[8%] md:bottom-auto md:left-[8%] md:border-t md:border-l-0" />
        {FLUXO.etapas.map((e, i) => (
          <li key={e.rotulo} className="relative flex md:flex-col md:items-center md:text-center">
            <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold tabular-nums", COR_MARCA[e.marca])}>{i + 1}</span>
            <div className="ml-4 pb-6 md:ml-0 md:mt-4 md:px-2 md:pb-0">
              <p className={cn("font-semibold", e.marca === "você" && "text-acento")}>{e.rotulo}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{e.descricao}</p>
            </div>
          </li>
        ))}
      </ol>
      <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground" aria-label="Legenda">
        {(Object.keys(FLUXO.legendaMarcas) as (keyof typeof FLUXO.legendaMarcas)[]).map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-3 rounded-full border", COR_MARCA[k])} />
            {FLUXO.legendaMarcas[k]}
          </li>
        ))}
      </ul>

      <div className="mt-16 border-t border-linha pt-10">
        <h3 className="text-xl font-semibold">{FLUXO.comoFunciona.titulo}</h3>
        <ol className="mt-6 grid gap-6 md:grid-cols-4 md:gap-8">
          {FLUXO.comoFunciona.passos.map((p, i) => (
            <li key={p.titulo} className="flex gap-4 md:block">
              <span className="text-2xl font-semibold tabular-nums text-acento">{String(i + 1).padStart(2, "0")}</span>
              <div className="md:mt-3">
                <h4 className="font-semibold">{p.titulo}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Secao>
  );
}

/* --- Problema: movimento sem orientação ---------------------------------- */

export function Problema() {
  return (
    <Secao id="problema" tom="tinta" className="malha-clara">
      <Cabecalho selo={PROBLEMA.selo} titulo={PROBLEMA.titulo} subtitulo={PROBLEMA.subtitulo} claro className="max-w-4xl [&_h2]:text-2xl [&_h2]:sm:text-3xl" />
      <div className="mt-12 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <ListaOrientacao titulo={PROBLEMA.sem.titulo} itens={PROBLEMA.sem.itens} tipo="sem" />
        <div className="flex justify-center md:flex-col" aria-hidden>
          <ArrowRightIcon className="size-8 rotate-90 text-acento md:rotate-0" />
        </div>
        <ListaOrientacao titulo={PROBLEMA.com.titulo} itens={PROBLEMA.com.itens} tipo="com" />
      </div>
      <p className="mx-auto mt-12 max-w-2xl text-center text-xl font-medium text-balance text-white/90">{PROBLEMA.intuicao}</p>
    </Secao>
  );
}

function ListaOrientacao({ titulo, itens, tipo }: { titulo: string; itens: readonly string[]; tipo: "sem" | "com" }) {
  return (
    <div className={cn("rounded-2xl p-6 sm:p-8", tipo === "sem" ? "border border-white/15" : "bg-white text-tinta")}>
      <h3 className={cn("text-xs font-semibold tracking-[0.14em] uppercase", tipo === "sem" ? "text-white/60" : "text-acento")}>{titulo}</h3>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
        {itens.map((t, i) => (
          <li key={t} className={cn("flex items-center gap-3", tipo === "sem" ? "text-white/75" : "font-medium")}>
            {tipo === "sem" ? (
              <span aria-hidden className="size-1.5 rounded-full bg-white/40" />
            ) : (
              <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold tabular-nums", i === itens.length - 1 ? "bg-acento text-white" : "bg-superficie text-tinta")}>
                {i + 1}
              </span>
            )}
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Leia os sinais ------------------------------------------------------- */

/** Toques individuais → padrões → indicadores. Três colunas, um zoom-out. */
export function Sinais() {
  const max = Math.max(...SINAIS.padroes.map((p) => p.valor));
  return (
    <Secao id="sinais" tom="superficie">
      <Cabecalho selo={SINAIS.selo} titulo={SINAIS.titulo} subtitulo={SINAIS.subtitulo} />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {/* Sinais */}
        <Coluna indice={0}>
          <ul className="grid grid-cols-2 gap-2">
            {SINAIS.toques.map((t, i) => (
              <li key={t.id} className="relative rounded-lg border border-linha bg-white p-2.5 font-mono text-[11px] leading-snug">
                <span aria-hidden className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-acento" style={{ opacity: 0.4 + (i % 3) * 0.3 }} />
                <p className="font-semibold text-tinta">{t.id}</p>
                {t.linhas.map((l) => (
                  <p key={l} className="text-muted-foreground">{l}</p>
                ))}
              </li>
            ))}
          </ul>
        </Coluna>
        {/* Padrões */}
        <Coluna indice={1}>
          <ul className="space-y-3.5">
            {SINAIS.padroes.map((p, i) => (
              <li key={p.rotulo} className="text-sm">
                <div className="flex justify-between gap-3">
                  <span>{p.rotulo}</span>
                  <span className="font-semibold tabular-nums">{p.valor}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-superficie">
                  <span className={cn("block h-full rounded-full", i === 0 ? "bg-acento" : "bg-tinta/30")} style={{ width: `${(p.valor / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Coluna>
        {/* Indicadores */}
        <Coluna indice={2}>
          <dl className="space-y-3">
            {SINAIS.indicadores.map((ind) => (
              <div key={ind.rotulo} className="rounded-lg border border-linha bg-superficie p-3">
                <dt className="text-xs text-muted-foreground">{ind.rotulo}</dt>
                <dd className="mt-0.5 flex items-center gap-2 text-lg font-semibold">
                  <IconeBussola className="size-4 text-acento" />
                  {ind.valor}
                </dd>
              </div>
            ))}
          </dl>
        </Coluna>
      </div>
      <p className="mt-10 text-center text-lg font-medium text-tinta">{SINAIS.fecho}</p>
    </Secao>
  );
}

function Coluna({ indice, children }: { indice: number; children: React.ReactNode }) {
  const c = SINAIS.colunas[indice];
  return (
    <div className="relative flex flex-col rounded-2xl border border-linha bg-white p-5">
      {indice < 2 && <ArrowRightIcon aria-hidden className="absolute -right-3.5 top-1/2 z-10 hidden size-6 -translate-y-1/2 rounded-full border border-linha bg-white p-1 text-acento lg:block" />}
      <p className="flex items-baseline gap-2">
        <span className="text-xs font-semibold tabular-nums text-acento">0{indice + 1}</span>
        <span className="font-semibold">{c.titulo}</span>
        <span className="text-sm text-muted-foreground">· {c.descricao}</span>
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/* --- Conheça o terreno ---------------------------------------------------- */

export function Terreno() {
  return (
    <Secao id="terreno">
      <Cabecalho selo={TERRENO.selo} titulo={TERRENO.titulo} subtitulo={TERRENO.subtitulo} />
      <div className="mt-12 overflow-hidden rounded-2xl border border-linha">
        <div className="grid grid-cols-2 bg-superficie text-xs font-semibold tracking-[0.14em] uppercase">
          <p className="border-r border-linha px-5 py-3 text-muted-foreground">
            {TERRENO.suposicao.titulo} <span className="ml-1 rounded bg-white px-1.5 py-0.5 normal-case tracking-normal text-tinta-suave">{TERRENO.suposicao.rotulo}</span>
          </p>
          <p className="px-5 py-3 text-acento">
            {TERRENO.realidade.titulo} <span className="ml-1 rounded bg-white px-1.5 py-0.5 normal-case tracking-normal">{TERRENO.realidade.rotulo}</span>
          </p>
        </div>
        {TERRENO.pares.map((p) => (
          <div key={p.suposicao} className="grid grid-cols-2 border-t border-linha">
            <p className="border-r border-linha px-5 py-5 text-muted-foreground italic">{p.suposicao}</p>
            <p className="px-5 py-5 font-medium">{p.realidade}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-lg font-medium">{TERRENO.fecho}</p>

      <div className="mt-16 border-t border-linha pt-10">
        <h3 className="text-xl font-semibold">{TERRENO.perguntasTitulo}</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">{TERRENO.perguntasSubtitulo}</p>
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {TERRENO.perguntas.map((q) => (
            <div key={q.pergunta} className="border-t border-linha pt-4">
              <dt className="font-semibold">{q.pergunta}</dt>
              <dd className="mt-1.5 flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-0.5 shrink-0 text-xs font-semibold tracking-[0.14em] text-acento uppercase">Sinal</span>
                {q.sinal}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Secao>
  );
}

/* --- Desvios -------------------------------------------------------------- */

export function Desvios() {
  return (
    <Secao id="desvios" tom="superficie">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Cabecalho selo={DESVIOS.selo} titulo={DESVIOS.titulo} subtitulo={DESVIOS.subtitulo} />
        <ul className="divide-y divide-linha rounded-2xl border border-linha bg-white">
          {DESVIOS.exemplos.map((e) => (
            <li key={e.acao} className="flex gap-4 px-5 py-4">
              <span aria-hidden className="mt-1 flex shrink-0 items-center gap-1 text-acento">
                <span className="block h-px w-5 bg-current" />
                <span className="block size-1.5 rotate-45 border border-current" />
              </span>
              <p className="leading-snug">
                <span className="font-semibold">{e.acao}</span> <span className="text-muted-foreground">{e.realidade}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-10 max-w-3xl text-lg font-medium text-balance">{DESVIOS.fecho}</p>
    </Secao>
  );
}

/* --- Recalibre cedo ------------------------------------------------------- */

export function Recalibrar() {
  const n = RECALIBRAR.ciclo.length;
  return (
    <Secao id="recalibrar" tom="tinta" className="malha-clara">
      <Cabecalho selo={RECALIBRAR.selo} titulo={RECALIBRAR.titulo} subtitulo={RECALIBRAR.subtitulo} claro alinhamento="centro" />
      {/* Ciclo: anel com cinco waypoints no desktop, lista no celular. */}
      <ol className="mx-auto mt-14 grid max-w-3xl gap-3 md:grid-cols-5 md:gap-0">
        {RECALIBRAR.ciclo.map((c, i) => {
          const ultimo = i === n - 1;
          return (
            <li key={c.rotulo} className="relative flex md:flex-col md:items-center md:text-center">
              {i < n - 1 && <span aria-hidden className="absolute top-8 left-[15px] h-[calc(100%-1rem)] w-px bg-white/20 md:top-4 md:left-1/2 md:h-px md:w-full" />}
              <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold", ultimo ? "border-acento bg-acento text-white" : "border-white/30 bg-tinta text-white")}>
                {ultimo ? "↺" : i + 1}
              </span>
              <div className="ml-4 pb-5 md:ml-0 md:mt-3 md:px-2 md:pb-0">
                <p className={cn("font-semibold", ultimo && "text-acento")}>{c.rotulo}</p>
                <p className="mt-1 text-sm leading-snug text-white/65">{c.descricao}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-12 text-center text-2xl font-semibold tracking-tight">{RECALIBRAR.fecho}</p>
    </Secao>
  );
}

/* --- Cenários ------------------------------------------------------------- */

export function Cenarios() {
  return (
    <Secao id="cenarios">
      <Cabecalho selo={CENARIOS.selo} titulo={CENARIOS.titulo} subtitulo={CENARIOS.subtitulo} />
      <ol className="mt-12 grid gap-4 lg:grid-cols-3">
        {CENARIOS.itens.map((c) => (
          <li key={c.numero} className="flex flex-col rounded-2xl border border-linha p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                <span className="mr-2 tabular-nums text-acento">{c.numero}</span>
                {c.contexto}
              </p>
              <span className="rounded-full border border-linha px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{CENARIOS.aviso}</span>
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <Passo rotulo={CENARIOS.rotulos.suposicao} texto={c.suposicao} tom="suposicao" />
              <Passo rotulo={CENARIOS.rotulos.sinal} texto={c.sinal} tom="sinal" />
              <Passo rotulo={CENARIOS.rotulos.direcao} texto={c.direcao} tom="direcao" />
            </dl>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

function Passo({ rotulo, texto, tom }: { rotulo: string; texto: string; tom: "suposicao" | "sinal" | "direcao" }) {
  const Icone = tom === "suposicao" ? MinusIcon : tom === "sinal" ? TrendingUpIcon : IconeBussola;
  return (
    <div className={cn("border-l-2 pl-3", tom === "direcao" ? "border-acento" : "border-linha")}>
      <dt className={cn("flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase", tom === "direcao" ? "text-acento" : "text-muted-foreground")}>
        <Icone className="size-3.5" aria-hidden />
        {rotulo}
      </dt>
      <dd className={cn("mt-1 leading-relaxed", tom === "suposicao" ? "text-muted-foreground italic" : tom === "direcao" ? "font-medium" : undefined)}>{texto}</dd>
    </div>
  );
}

/* --- Personalização ------------------------------------------------------- */

export function Personalizacao() {
  return (
    <Secao id="personalizacao" tom="superficie">
      <Cabecalho titulo={PERSONALIZACAO.titulo} subtitulo={PERSONALIZACAO.subtitulo} />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <ColunaPers icone={<SimboloNfc className="size-6 text-acento" />} {...PERSONALIZACAO.fisico} />
        <ColunaPers icone={<IconeBussola className="size-6 text-tinta" acento="var(--acento)" />} {...PERSONALIZACAO.digital} />
      </div>
      <h3 className="mt-16 text-xl font-semibold">{PERSONALIZACAO.cartoesTitulo}</h3>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {PERSONALIZACAO.cartoes.map((c) => (
          <li key={c.numero}>
            <CartaoFisico empresa={`Cartão ${c.numero}`} instrucao={c.funcao} codigo={c.contexto} compacto />
          </li>
        ))}
      </ul>
    </Secao>
  );
}

function ColunaPers({ icone, titulo, descricao, itens }: { icone: React.ReactNode; titulo: string; descricao: string; itens: readonly string[] }) {
  return (
    <div className="rounded-2xl border border-linha bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-acento-suave">{icone}</span>
        <div>
          <h3 className="text-lg font-semibold">{titulo}</h3>
          <p className="text-sm text-muted-foreground">{descricao}</p>
        </div>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {itens.map((t) => (
          <li key={t} className="rounded-full border border-linha bg-superficie px-3.5 py-1.5 text-sm font-medium">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

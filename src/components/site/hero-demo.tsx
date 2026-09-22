"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_HERO } from "@/lib/site/conteudo";
import { CartaoFisico, IconeBussola, Telefone } from "./primitivos";

const INTERVALO_MS = 3000;
const PASSOS = DEMO_HERO.passos;
const MQ_REDUZIDO = "(prefers-reduced-motion: reduce)";

function assinarReduzido(aoMudar: () => void) {
  const mq = window.matchMedia(MQ_REDUZIDO);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}
const lerReduzido = () => window.matchMedia(MQ_REDUZIDO).matches;
// No servidor assumimos movimento reduzido: nada anda antes de hidratar.
const lerReduzidoServidor = () => true;

/**
 * Um toque virando direção, em cinco quadros: Toque → Sinal → Dado →
 * Contexto → Direção. Ao lado, um instrumento: a agulha gira sem
 * referência no começo e assenta no norte quando os sinais viram contexto.
 * Avança sozinho enquanto visível; um clique assume o controle. Com
 * prefers-reduced-motion não há avanço automático nem animação.
 */
export function HeroDemo() {
  const [passo, setPasso] = useState(0);
  const [manual, setManual] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const reduzido = useSyncExternalStore(assinarReduzido, lerReduzido, lerReduzidoServidor);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (manual || reduzido || !visivel) return;
    const t = setInterval(() => setPasso((p) => (p + 1) % PASSOS.length), INTERVALO_MS);
    return () => clearInterval(t);
  }, [manual, reduzido, visivel]);

  const escolher = (i: number) => {
    setManual(true);
    setPasso(i);
  };

  return (
    <div ref={raiz} className="malha rounded-3xl border border-linha bg-superficie p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">{DEMO_HERO.legenda}</p>
        <p aria-live="polite" className="text-xs font-medium text-tinta">
          {passo + 1}/{PASSOS.length} · {PASSOS[passo].rotulo}
        </p>
      </div>

      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        {/* Cartão + celular: o cartão encosta no passo 0 e se afasta depois. */}
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              "relative z-10 -mr-10 w-36 shrink-0 transition-transform duration-500 ease-out sm:-mr-8 sm:w-40",
              passo === 0 ? "translate-x-6 -rotate-6" : "-translate-x-3 -rotate-12 opacity-90",
            )}
          >
            <CartaoFisico empresa={DEMO_HERO.cartao.empresa} instrucao={DEMO_HERO.cartao.instrucao} codigo={DEMO_HERO.cartao.codigo} compacto />
            {passo === 0 && (
              <span aria-hidden className="pointer-events-none absolute top-1/2 -right-3 -translate-y-1/2">
                <span className="absolute inset-0 -m-4 rounded-full border-2 border-acento anim-pulso-nfc" />
                <span className="absolute inset-0 -m-4 rounded-full border-2 border-acento anim-pulso-nfc [animation-delay:0.5s]" />
                <span className="block size-3 rounded-full bg-acento" />
              </span>
            )}
          </div>
          <Telefone className="w-[190px] shrink-0 sm:w-[200px]">
            <Tela passo={passo} />
          </Telefone>
        </div>

        {/* Instrumento: a agulha se orienta com os sinais. */}
        <Instrumento passo={passo} />
      </div>

      <ol className="mt-5 grid gap-1.5 sm:grid-cols-5 sm:gap-2" aria-label="Etapas da demonstração">
        {PASSOS.map((p, i) => {
          const ativo = i === passo;
          return (
            <li key={p.rotulo} className="min-w-0">
              <button
                type="button"
                onClick={() => escolher(i)}
                aria-current={ativo ? "step" : undefined}
                className={cn(
                  "flex w-full min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:min-h-0 sm:flex-col sm:items-start sm:gap-1 sm:py-3",
                  ativo ? "border-acento bg-white shadow-sm" : "border-transparent hover:bg-white/70",
                )}
              >
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums", ativo ? "bg-acento text-white" : "bg-linha text-tinta-suave")}>
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-sm font-semibold", ativo ? "text-tinta" : "text-tinta-suave")}>{p.rotulo}</span>
                  <span className={cn("mt-0.5 text-xs leading-snug text-muted-foreground sm:hidden", ativo ? "block" : "hidden")}>{p.descricao}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 hidden min-h-10 text-sm leading-snug text-muted-foreground sm:block" key={passo}>
        {PASSOS[passo].descricao}
      </p>
    </div>
  );
}

/** Mostrador com a agulha. Sem referência ela aponta para qualquer lado; com contexto, para o norte. */
function Instrumento({ passo }: { passo: number }) {
  const angulo = DEMO_HERO.tela.angulos[passo];
  const orientado = passo === PASSOS.length - 1;
  const cardeais = [
    { c: "N", style: { top: 6, left: "50%", transform: "translateX(-50%)" } },
    { c: "L", style: { right: 8, top: "50%", transform: "translateY(-50%)" } },
    { c: "S", style: { bottom: 6, left: "50%", transform: "translateX(-50%)" } },
    { c: "O", style: { left: 8, top: "50%", transform: "translateY(-50%)" } },
  ] as const;
  return (
    <div className="mx-auto flex w-full max-w-[220px] flex-col items-center sm:w-40" aria-hidden>
      <div className="relative size-32 rounded-full border border-linha bg-white shadow-sm sm:size-36">
        {cardeais.map(({ c, style }) => (
          <span key={c} className={cn("absolute text-[10px] font-semibold", c === "N" ? "text-acento" : "text-tinta-suave")} style={style}>
            {c}
          </span>
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="absolute top-1/2 left-1/2 h-px w-2 bg-linha" style={{ transform: `rotate(${i * 30}deg) translateX(52px)` }} />
        ))}
        <svg viewBox="0 0 100 100" className="agulha absolute inset-0" style={{ transform: `rotate(${angulo}deg)` }}>
          <polygon points="50,14 55,50 45,50" className={orientado ? "fill-acento" : "fill-tinta/70"} />
          <polygon points="50,86 55,50 45,50" className="fill-tinta/20" />
          <circle cx="50" cy="50" r="4" className="fill-tinta" />
        </svg>
        {orientado && <span className="absolute inset-0 rounded-full border-2 border-acento anim-sinal" />}
      </div>
      <p className={cn("mt-3 flex items-center gap-1.5 text-xs font-semibold", orientado ? "text-acento" : "text-tinta-suave")}>
        <IconeBussola className="size-3.5" />
        {orientado ? "Orientada" : passo >= 3 ? "Calibrando…" : "Sem referência"}
      </p>
    </div>
  );
}

function Tela({ passo }: { passo: number }) {
  const t = DEMO_HERO.tela;
  if (passo === 0) {
    return (
      <div key="0" className="anim-surgir flex flex-1 flex-col bg-superficie px-3 pt-8">
        <p className="text-center text-3xl font-semibold tracking-tight text-tinta">14:32</p>
        <p className="text-center text-[11px] text-muted-foreground">sexta-feira, 18 de setembro</p>
        <div className="mt-6 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <span aria-hidden className="grid size-6 place-items-center rounded-md bg-tinta text-white">
              <IconeBussola className="size-4" acento="var(--acento)" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-tinta">{t.notificacao.titulo}</p>
              <p className="truncate text-[11px] text-muted-foreground">{t.notificacao.texto}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (passo === 1) {
    return (
      <div key="1" className="anim-surgir flex flex-1 flex-col px-3 pt-4">
        <p className="text-[11px] font-medium text-muted-foreground">{t.formulario.titulo}</p>
        <p className="text-sm font-semibold leading-tight text-tinta">{t.formulario.subtitulo}</p>
        <div className="mt-3 space-y-2">
          {t.formulario.campos.map((campo, i) => (
            <div key={campo}>
              <p className="text-[10px] font-medium text-tinta">{campo}</p>
              <div className="mt-0.5 h-7 rounded-md border border-tinta/30 px-2 text-[11px] leading-7 text-tinta">{t.formulario.valores[i]}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-md bg-acento-suave px-2.5 py-2 text-[11px] font-medium text-acento">
          <CheckIcon className="size-3.5" aria-hidden />
          {t.formulario.sucesso}
        </div>
      </div>
    );
  }
  if (passo === 2) {
    return (
      <div key="2" className="anim-surgir flex flex-1 flex-col px-3 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-acento">
          <span className="size-1.5 rounded-full bg-acento" aria-hidden />
          {t.registro.titulo}
        </div>
        <dl className="mt-2 divide-y divide-linha rounded-lg border border-linha font-mono text-[10px]">
          {t.registro.linhas.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 px-2 py-1.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate text-right font-medium text-tinta">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (passo === 3) {
    const max = Math.max(...t.contexto.linhas.map((l) => l.valor));
    return (
      <div key="3" className="anim-surgir flex flex-1 flex-col px-3 pt-4">
        <p className="text-[11px] font-medium text-muted-foreground">{t.contexto.titulo}</p>
        <ul className="mt-3 space-y-3">
          {t.contexto.linhas.map((l, i) => (
            <li key={l.rotulo} className="text-[11px]">
              <div className="flex justify-between">
                <span className="text-tinta">{l.rotulo}</span>
                <span className="font-semibold tabular-nums text-tinta">
                  {l.valor}
                  {i > 0 && "%"}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-superficie">
                <span className="block h-full rounded-full bg-tinta/60" style={{ width: `${((i === 0 ? l.valor / max : l.valor / 100) * 100).toFixed(0)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div key="4" className="anim-surgir flex flex-1 flex-col px-3 pt-4">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-acento">
        <IconeBussola className="size-3.5" />
        {t.direcao.titulo}
      </p>
      <p className="mt-2 text-[11px] leading-snug text-tinta">{t.direcao.leitura}</p>
      <p className="mt-3 rounded-md border border-acento/30 bg-acento-suave px-2.5 py-2 text-[11px] leading-snug text-tinta">{t.direcao.sugestao}</p>
    </div>
  );
}

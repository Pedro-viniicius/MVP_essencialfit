"use client";

import { useId, useState } from "react";
import { CheckIcon, CopyIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FUNCOES, type TipoFuncao } from "@/lib/site/conteudo";
import { Cabecalho, CartaoFisico, QrIlustrativo, Secao, Telefone } from "./primitivos";

/**
 * "Um cartão. Infinitas funções." Um seletor de chips troca a tela do
 * celular e o texto impresso no cartão. Sem parágrafos: a tela explica.
 */
export function Funcoes() {
  const [ativa, setAtiva] = useState<TipoFuncao>("formulario");
  const funcao = FUNCOES.itens.find((f) => f.id === ativa) ?? FUNCOES.itens[0];
  const idTela = useId();

  return (
    <Secao id="funcoes" tom="superficie">
      <Cabecalho titulo={FUNCOES.titulo} subtitulo={FUNCOES.subtitulo} />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase" id={`${idTela}-rotulo`}>
            {FUNCOES.rotuloSelecionar}
          </p>
          <div role="tablist" aria-labelledby={`${idTela}-rotulo`} className="mt-3 flex flex-wrap gap-2">
            {FUNCOES.itens.map((f) => {
              const selecionada = f.id === ativa;
              return (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={selecionada}
                  aria-controls={`${idTela}-painel`}
                  onClick={() => setAtiva(f.id)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    selecionada ? "border-tinta bg-tinta text-white" : "border-linha bg-white text-tinta hover:border-tinta/40",
                  )}
                >
                  {f.chip}
                </button>
              );
            })}
          </div>

          <div id={`${idTela}-painel`} role="tabpanel" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1" key={funcao.id}>
            <div className="anim-surgir">
              <p className="text-xs font-semibold tracking-[0.14em] text-acento uppercase">{FUNCOES.rotuloAcontece}</p>
              <p className="mt-2 text-lg leading-relaxed text-tinta">{funcao.acontece}</p>
            </div>
            <div className="anim-surgir [animation-delay:80ms]">
              <p className="text-xs font-semibold tracking-[0.14em] text-acento uppercase">{FUNCOES.rotuloSinal}</p>
              <p className="mt-2 text-lg leading-relaxed text-tinta">{funcao.sinal}</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center gap-0 sm:gap-6">
          <div className="z-10 -mr-8 w-32 shrink-0 -rotate-6 sm:mr-0 sm:w-44">
            <CartaoFisico key={funcao.id} empresa="Essencial Fit" instrucao={funcao.cartao} compacto className="anim-surgir" />
          </div>
          <Telefone className="max-w-[200px] sm:max-w-[240px]">
            <TelaFuncao tipo={funcao.id} />
          </Telefone>
        </div>
      </div>

      <div className="mt-16 border-t border-linha pt-10">
        <h3 className="text-xl font-semibold">{FUNCOES.aplicacoesTitulo}</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCOES.aplicacoes.map((a) => (
            <li key={a.titulo} className="rounded-2xl border border-linha bg-white p-5">
              <h4 className="font-semibold">{a.titulo}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.descricao}</p>
              <p className="mt-3 text-xs text-muted-foreground">{a.exemplos}</p>
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  );
}

/* --- Telas ---------------------------------------------------------------- */

const Tela = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("anim-surgir flex flex-1 flex-col px-3 pt-3 text-tinta", className)}>{children}</div>
);
const BotaoTela = ({ children, claro }: { children: React.ReactNode; claro?: boolean }) => (
  <div className={cn("rounded-md py-2 text-center text-[11px] font-semibold", claro ? "border border-linha text-tinta" : "bg-acento text-white")}>{children}</div>
);
const Campo = ({ rotulo, valor }: { rotulo: string; valor?: string }) => (
  <div>
    <p className="text-[10px] font-medium">{rotulo}</p>
    <div className={cn("mt-0.5 h-7 rounded-md border px-2 text-[11px] leading-7", valor ? "border-tinta/30" : "border-linha text-transparent")}>{valor ?? "—"}</div>
  </div>
);

function TelaFuncao({ tipo }: { tipo: TipoFuncao }) {
  switch (tipo) {
    case "google":
      return (
        <Tela key={tipo}>
          <p className="text-[11px] font-medium text-muted-foreground">Google</p>
          <p className="text-sm font-semibold">Essencial Fit</p>
          <p className="mt-3 text-[11px]">Como foi sua experiência?</p>
          <div className="mt-1 flex gap-1" aria-hidden>
            {[1, 2, 3, 4, 5].map((n) => (
              <StarIcon key={n} className={cn("size-5", n <= 4 ? "fill-amber-400 text-amber-400" : "text-linha")} />
            ))}
          </div>
          <div className="mt-3 h-16 rounded-md border border-linha p-2 text-[11px] text-muted-foreground">Atendimento rápido e…</div>
          <div className="mt-3">
            <BotaoTela>Publicar avaliação</BotaoTela>
          </div>
        </Tela>
      );
    case "whatsapp":
      return (
        <Tela key={tipo} className="bg-[#efeae2] px-0 pt-0">
          <div className="flex items-center gap-2 bg-white px-3 py-2">
            <span aria-hidden className="size-6 rounded-full bg-tinta/15" />
            <div>
              <p className="text-[11px] font-semibold">Essencial Fit</p>
              <p className="text-[10px] text-muted-foreground">online</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-2 px-3 pb-3">
            <div className="ml-6 rounded-lg rounded-tr-none bg-[#d9fdd3] px-2 py-1.5 text-[11px]">
              Olá! Vim pelo cartão da Essencial Fit e quero saber mais sobre creatina.
            </div>
            <div className="mr-6 rounded-lg rounded-tl-none bg-white px-2 py-1.5 text-[11px]">Oi! Já te envio as opções.</div>
          </div>
        </Tela>
      );
    case "pix":
      return (
        <Tela key={tipo} className="items-center text-center">
          <p className="text-sm font-semibold">Pagar por PIX</p>
          <p className="text-[11px] text-muted-foreground">Essencial Fit</p>
          <QrIlustrativo className="mt-3 size-24 border border-linha" />
          <p className="mt-3 text-[10px] text-muted-foreground">Chave</p>
          <p className="text-[11px] font-medium">pix@lojacentro.com.br</p>
          <div className="mt-3 w-full">
            <BotaoTela claro>
              <span className="inline-flex items-center gap-1">
                <CopyIcon className="size-3" aria-hidden /> Copiar código
              </span>
            </BotaoTela>
          </div>
        </Tela>
      );
    case "instagram":
      return (
        <Tela key={tipo}>
          <div className="flex items-center gap-3">
            <span aria-hidden className="size-12 rounded-full border-2 border-tinta/20 bg-superficie" />
            <div className="flex flex-1 justify-around text-center">
              {[
                ["148", "posts"],
                ["12,4 mil", "seguidores"],
                ["302", "seguindo"],
              ].map(([n, r]) => (
                <div key={r}>
                  <p className="text-[11px] font-semibold tabular-nums">{n}</p>
                  <p className="text-[9px] text-muted-foreground">{r}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] font-semibold">@lojacentro</p>
          <p className="text-[10px] text-muted-foreground">Novidades da semana toda quinta.</p>
          <div className="mt-3">
            <BotaoTela>Seguir</BotaoTela>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-0.5" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="aspect-square bg-superficie" />
            ))}
          </div>
        </Tela>
      );
    case "formulario":
      return (
        <Tela key={tipo}>
          <p className="text-[11px] font-medium text-muted-foreground">Essencial Fit</p>
          <p className="text-sm font-semibold leading-tight">Deixe seu contato e receba o catálogo</p>
          <div className="mt-3 space-y-2">
            <Campo rotulo="Nome" valor="Marina S." />
            <Campo rotulo="WhatsApp" valor="(16) 9 ••••-••21" />
            <Campo rotulo="Interesse" valor="Creatina" />
          </div>
          <label className="mt-3 flex items-start gap-1.5 text-[10px] leading-snug text-muted-foreground">
            <span aria-hidden className="mt-0.5 grid size-3 shrink-0 place-items-center rounded-sm bg-acento text-white">
              <CheckIcon className="size-2.5" />
            </span>
            Autorizo o contato sobre o produto do meu interesse.
          </label>
          <div className="mt-3">
            <BotaoTela>Receber catálogo</BotaoTela>
          </div>
        </Tela>
      );
    case "evento":
      return (
        <Tela key={tipo}>
          <p className="text-[11px] font-medium text-muted-foreground">Lançamento 2026</p>
          <div className="mt-2 flex items-center gap-2 rounded-md bg-acento-suave px-2.5 py-2 text-[11px] font-semibold text-acento">
            <CheckIcon className="size-3.5" aria-hidden /> Check-in confirmado
          </div>
          <div className="mt-3 rounded-lg border border-linha p-3">
            <p className="text-[10px] text-muted-foreground">Participante</p>
            <p className="text-sm font-semibold">Marina S.</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Entrada às 14:32 · Credencial 0231</p>
          </div>
          <div className="mt-3 space-y-2">
            <BotaoTela>Responder pesquisa (30 s)</BotaoTela>
            <BotaoTela claro>Participar do sorteio</BotaoTela>
          </div>
        </Tela>
      );
    case "pesquisa":
      return (
        <Tela key={tipo}>
          <p className="text-[11px] font-medium text-muted-foreground">Pergunta 2 de 3</p>
          <p className="text-sm font-semibold leading-tight">Quanto você pagaria por este produto?</p>
          <div className="mt-3 space-y-1.5">
            {["Até R$ 180", "R$ 180 a R$ 240", "R$ 240 a R$ 300", "Acima de R$ 300"].map((o, i) => (
              <div
                key={o}
                className={cn("rounded-md border px-2.5 py-2 text-[11px]", i === 1 ? "border-acento bg-acento-suave font-semibold text-acento" : "border-linha")}
              >
                {o}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <BotaoTela>Próxima</BotaoTela>
          </div>
        </Tela>
      );
    case "contato":
      return (
        <Tela key={tipo}>
          <div className="flex items-center gap-3">
            <span aria-hidden className="size-12 rounded-full bg-tinta/10" />
            <div>
              <p className="text-sm font-semibold">Ana Ribeiro</p>
              <p className="text-[10px] text-muted-foreground">Consultora · Essencial Fit</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <BotaoTela>Salvar contato</BotaoTela>
            <BotaoTela claro>WhatsApp</BotaoTela>
            <BotaoTela claro>LinkedIn</BotaoTela>
            <BotaoTela claro>Site</BotaoTela>
          </div>
        </Tela>
      );
    case "catalogo":
      return (
        <Tela key={tipo}>
          <p className="text-sm font-semibold">Catálogo</p>
          <p className="text-[10px] text-muted-foreground">Essencial Fit · 4 categorias</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Creatina", "Performance"],
              ["Whey Protein", "Proteína"],
              ["Vitaminas", "Bem-estar"],
              ["Modelo D", "R$ 319"],
            ].map(([n, p], i) => (
              <div key={n} className="rounded-lg border border-linha p-2">
                <span aria-hidden className="block aspect-[4/3] rounded-md bg-superficie" />
                <p className="mt-1.5 text-[11px] font-semibold">{n}</p>
                <p className="text-[10px] text-muted-foreground">{p}</p>
                <p className={cn("mt-1 text-[9px] font-semibold", i === 1 ? "text-acento" : "text-muted-foreground")}>
                  {i === 1 ? "✓ Tenho interesse" : "Tenho interesse"}
                </p>
              </div>
            ))}
          </div>
        </Tela>
      );
  }
}

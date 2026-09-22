import { ArrowDownRightIcon, ArrowUpRightIcon, MoveRightIcon, SparklesIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEITURA, NORTE } from "@/lib/site/conteudo";
import { Cabecalho, IconeBussola, Secao } from "./primitivos";

/* --- Norte: painel organizado por perguntas ------------------------------- */

export function Norte() {
  const n = NORTE;
  return (
    <Secao id="norte" tom="superficie">
      <Cabecalho selo={n.selo} titulo={n.titulo} subtitulo={n.subtitulo} />

      {/* Áreas do produto: nome curto + subtítulo descritivo, sempre. */}
      <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {n.areas.map((a, i) => (
          <li key={a.nome} className={cn("rounded-xl border px-3 py-2.5", i === 0 ? "border-tinta bg-tinta text-white" : "border-linha bg-white")}>
            <p className="text-sm font-semibold">{a.nome}</p>
            <p className={cn("mt-0.5 text-xs leading-snug", i === 0 ? "text-white/70" : "text-muted-foreground")}>{a.descricao}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 overflow-hidden rounded-2xl border border-linha bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-sm">
            <IconeBussola className="size-4 text-tinta" acento="var(--acento)" />
            <span className="font-semibold">Norte</span>
            <span className="text-muted-foreground">· {n.periodo}</span>
          </p>
          <span className="rounded-full border border-atencao/30 bg-atencao-suave px-2.5 py-1 text-xs font-semibold text-atencao">{n.aviso}</span>
        </div>

        <div className="space-y-8 p-4 sm:p-6">
          {/* 1. Onde estamos? */}
          <Pergunta numero={1} texto={n.ondeEstamos.pergunta}>
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {n.ondeEstamos.kpis.map((k) => (
                <div key={k.rotulo} className="rounded-xl border border-linha p-4">
                  <dt className="text-sm text-muted-foreground">{k.rotulo}</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums sm:text-3xl">{k.valor}</dd>
                  <dd className="mt-1 text-xs text-muted-foreground">{k.detalhe}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Bloco titulo={n.ondeEstamos.serie.titulo} className="lg:col-span-2">
                <Colunas valores={n.ondeEstamos.serie.valores} rotulos={n.ondeEstamos.serie.rotulos} />
              </Bloco>
              <Bloco titulo="Origem do sinal">
                <Origem itens={n.ondeEstamos.origem} />
              </Bloco>
            </div>
          </Pergunta>

          {/* 2. O que mudou? */}
          <Pergunta numero={2} texto={n.oQueMudou.pergunta} area="Desvios">
            <ul className="grid gap-3 md:grid-cols-3">
              {n.oQueMudou.desvios.map((d) => {
                const Icone = d.tipo === "alta" ? ArrowUpRightIcon : d.tipo === "baixa" ? ArrowDownRightIcon : MoveRightIcon;
                return (
                  <li key={d.texto} className="flex items-start gap-3 rounded-xl border border-linha p-4 text-sm">
                    <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", d.tipo === "baixa" ? "bg-acento-suave text-acento" : "bg-superficie text-tinta")}>
                      <Icone className="size-4" aria-hidden />
                    </span>
                    <span className="font-medium leading-snug">{d.texto}</span>
                  </li>
                );
              })}
            </ul>
          </Pergunta>

          {/* 3. O que os sinais estão mostrando? */}
          <Pergunta numero={3} texto={n.sinaisMostram.pergunta} area="Sinais">
            <div className="grid gap-3 md:grid-cols-3">
              <Bloco titulo={n.sinaisMostram.canais.titulo}>
                <Tabela colunas={n.sinaisMostram.canais.colunas} linhas={n.sinaisMostram.canais.linhas} destacarLinha={1} />
              </Bloco>
              <Bloco titulo={n.sinaisMostram.produtos.titulo}>
                <Barras itens={n.sinaisMostram.produtos.itens} />
              </Bloco>
              <Bloco titulo={n.sinaisMostram.responsaveis.titulo}>
                <Tabela colunas={n.sinaisMostram.responsaveis.colunas} linhas={n.sinaisMostram.responsaveis.linhas} />
              </Bloco>
            </div>
          </Pergunta>

          {/* 4. Onde vale olhar? */}
          <Pergunta numero={4} texto={n.ondeOlhar.pergunta} area="Leitura">
            <ul className="grid gap-3 md:grid-cols-2">
              {n.ondeOlhar.itens.map((i) => (
                <li key={i.titulo} className="rounded-xl border-l-2 border-acento bg-superficie p-4">
                  <p className="font-semibold">{i.titulo}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.texto}</p>
                </li>
              ))}
            </ul>
          </Pergunta>

          {/* 5. Qual hipótese testar? */}
          <Pergunta numero={5} texto={n.hipotese.pergunta} area="Rotas">
            <ol className="grid gap-3 md:grid-cols-2">
              {n.hipotese.itens.map((h, i) => (
                <li key={h.texto} className="flex gap-3 rounded-xl border border-linha p-4">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-tinta text-xs font-semibold text-white tabular-nums">{i + 1}</span>
                  <div className="text-sm">
                    <p className="font-medium leading-snug">{h.texto}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold tracking-[0.12em] uppercase">Medir</span> · {h.medir}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Pergunta>
        </div>
        <p className="border-t border-linha px-4 py-3 text-center text-sm font-medium sm:px-6">{n.fecho}</p>
      </div>
    </Secao>
  );
}

function Pergunta({ numero, texto, area, children }: { numero: number; texto: string; area?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`norte-p${numero}`}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 id={`norte-p${numero}`} className="flex items-baseline gap-2 text-base font-semibold">
          <span className="text-xs tabular-nums text-acento">0{numero}</span>
          {texto}
        </h3>
        {area && <span className="rounded-full bg-superficie px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{area}</span>}
      </div>
      {children}
    </section>
  );
}

function Bloco({ titulo, className, children }: { titulo: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-linha p-4", className)}>
      <h4 className="text-sm font-semibold">{titulo}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Colunas({ valores, rotulos }: { valores: readonly number[]; rotulos: readonly string[] }) {
  const max = Math.max(...valores);
  const pico = valores.indexOf(max);
  return (
    <div role="img" aria-label={`Interações por dia; pico de ${max} no dia ${pico + 1}.`}>
      <div className="flex h-32 items-end gap-1 sm:h-40 sm:gap-1.5">
        {valores.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end" title={`Dia ${i + 1}: ${v}`}>
            <span className={cn("block rounded-t-sm", i === pico ? "bg-acento" : "bg-tinta/15")} style={{ height: `${(v / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1 sm:gap-1.5" aria-hidden>
        {rotulos.map((r, i) => (
          <span key={i} className="flex-1 text-center text-[10px] tabular-nums text-muted-foreground">
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function Origem({ itens }: { itens: readonly { rotulo: string; valor: number }[] }) {
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full" role="img" aria-label={itens.map((i) => `${i.rotulo} ${i.valor}%`).join(", ")}>
        {itens.map((i, idx) => (
          <span key={i.rotulo} className={idx === 0 ? "bg-tinta" : "bg-tinta/15"} style={{ width: `${i.valor}%` }} />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {itens.map((i, idx) => (
          <li key={i.rotulo} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span aria-hidden className={cn("size-2.5 rounded-full", idx === 0 ? "bg-tinta" : "bg-tinta/15")} />
              {i.rotulo}
            </span>
            <span className="font-semibold tabular-nums">{i.valor}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-snug text-muted-foreground">Cada cartão registra se foi aproximado (NFC) ou lido pela câmera (QR Code).</p>
    </div>
  );
}

function Barras({ itens }: { itens: readonly { rotulo: string; valor: number }[] }) {
  const max = Math.max(...itens.map((i) => i.valor));
  return (
    <ul className="space-y-2.5">
      {itens.map((i, idx) => (
        <li key={i.rotulo} className="text-sm">
          <div className="flex justify-between">
            <span className={idx === 0 ? "font-semibold" : undefined}>{i.rotulo}</span>
            <span className="tabular-nums text-muted-foreground">{i.valor.toLocaleString("pt-BR")}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-superficie">
            <span className={cn("block h-full rounded-full", idx === 0 ? "bg-acento" : "bg-tinta/25")} style={{ width: `${(i.valor / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Tabela({ colunas, linhas, destacarLinha = 0 }: { colunas: readonly string[]; linhas: readonly (readonly string[])[]; destacarLinha?: number }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-muted-foreground">
          {colunas.map((c, i) => (
            <th key={c} scope="col" className={cn("pb-2 font-medium", i > 0 && "text-right")}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-linha">
        {linhas.map((l, i) => (
          <tr key={l[0]} className={i === destacarLinha ? "font-semibold" : undefined}>
            {l.map((c, j) => (
              <td key={j} className={cn("py-2", j > 0 && "text-right tabular-nums", j === l.length - 1 && i === destacarLinha && "text-acento")}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* --- Leitura (IA) --------------------------------------------------------- */

export function Leitura() {
  return (
    <Secao id="leitura">
      <Cabecalho selo={LEITURA.selo} titulo={LEITURA.titulo} subtitulo={LEITURA.subtitulo} />
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div className="rounded-2xl border border-linha bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-linha px-5 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <SparklesIcon className="size-4 text-acento" aria-hidden />
              Leitura dos últimos 14 dias
            </p>
            <span className="rounded-full border border-atencao/30 bg-atencao-suave px-2.5 py-1 text-xs font-semibold text-atencao">{LEITURA.aviso}</span>
          </div>
          <ol className="divide-y divide-linha">
            {LEITURA.observacoes.map((o, i) => (
              <li key={o.texto} className="px-5 py-5">
                <p className="flex gap-3 text-base font-medium leading-snug">
                  <span className="mt-0.5 text-sm tabular-nums text-muted-foreground">{i + 1}.</span>
                  {o.texto}
                </p>
                <p className="mt-2 ml-7 text-sm text-muted-foreground">
                  <span className="font-semibold">{LEITURA.rotuloBase}:</span> {o.base}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-4">
          <ListaCurta titulo={LEITURA.diz.titulo} itens={LEITURA.diz.itens} positivo />
          <ListaCurta titulo={LEITURA.naoDiz.titulo} itens={LEITURA.naoDiz.itens} />
          <p className="pt-2 text-2xl font-semibold tracking-tight">{LEITURA.fecho}</p>
        </div>
      </div>
    </Secao>
  );
}

function ListaCurta({ titulo, itens, positivo }: { titulo: string; itens: readonly string[]; positivo?: boolean }) {
  return (
    <div className="rounded-2xl border border-linha p-6">
      <h3 className="text-xs font-semibold tracking-[0.14em] uppercase">{titulo}</h3>
      <ul className="mt-4 space-y-2.5">
        {itens.map((t) => (
          <li key={t} className="flex gap-3 text-sm leading-snug">
            {positivo ? <IconeBussola className="mt-0.5 size-4 shrink-0 text-acento" /> : <XIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />}
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

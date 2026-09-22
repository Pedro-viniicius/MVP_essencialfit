import Link from "next/link";
import { EstadoVazio, Etiqueta } from "@/components/painel/primitivos";
import { Button, buttonVariants } from "@/components/ui/button";
import { FINALIDADES } from "@/lib/domain";
import type { Filtros, LinhaLista } from "@/lib/demo/queries";
import { A } from "@/lib/texts/admin";
import { cn } from "@/lib/utils";
import { LinhaContato } from "./linha-contato";

type Opcoes = { vendedores: { id: string; nome: string }[]; modelos: string[]; prazos: string[] };
type Props = {
  itens: LinhaLista[];
  total: number;
  paginas: number;
  filtros: Filtros;
  opcoes: Opcoes;
};

const FUSO = "America/Sao_Paulo";
const hora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: FUSO });
const select =
  "min-h-11 w-full rounded-lg border border-border bg-muted px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
// A tabela em colunas só abre no desktop: em 768px os consentimentos
// quebravam em duas linhas e a altura da linha dobrava.
const COLUNAS = "lg:grid-cols-[1.7fr_1.2fr_0.9fr_1.4fr_0.5fr]";

export function Lista({ itens, total, paginas, filtros, opcoes }: Props) {
  const T = A.demo.lista;
  const F = T.filtros;
  const link = (pagina: number) => {
    const p = new URLSearchParams();
    if (filtros.vendedor) p.set("v", filtros.vendedor);
    if (filtros.modelo) p.set("m", filtros.modelo);
    if (filtros.prazo) p.set("p", filtros.prazo);
    if (filtros.consentimento) p.set("c", filtros.consentimento);
    if (pagina > 1) p.set("pg", String(pagina));
    const q = p.toString();
    return `/demo${q ? `?${q}` : ""}#lista`;
  };

  // Resumo do recorte atual: o que está filtrado fica escrito, não subentendido.
  const ativos = [
    filtros.vendedor && `${F.vendedor}: ${filtros.vendedor === "sem" ? F.semVendedor : opcoes.vendedores.find((v) => v.id === filtros.vendedor)?.nome ?? filtros.vendedor}`,
    filtros.modelo && `${F.modelo}: ${filtros.modelo}`,
    filtros.prazo && `${F.prazo}: ${filtros.prazo}`,
    filtros.consentimento && F.marketing,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <form method="get" action="/demo#lista" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <Campo rotulo={F.vendedor}>
          <select name="v" defaultValue={filtros.vendedor ?? ""} className={select}>
            <option value="">{F.todos}</option>
            {opcoes.vendedores.map((v) => (
              <option key={v.id} value={v.id}>{v.nome}</option>
            ))}
            <option value="sem">{F.semVendedor}</option>
          </select>
        </Campo>
        <Campo rotulo={F.modelo}>
          <select name="m" defaultValue={filtros.modelo ?? ""} className={select}>
            <option value="">{F.todos}</option>
            {opcoes.modelos.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Campo>
        <Campo rotulo={F.prazo}>
          <select name="p" defaultValue={filtros.prazo ?? ""} className={select}>
            <option value="">{F.todos}</option>
            {opcoes.prazos.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Campo>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button type="submit" className="w-full lg:w-auto">{F.aplicar}</Button>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm sm:col-span-2 lg:col-span-4">
          <input type="checkbox" name="c" value="marketing" defaultChecked={filtros.consentimento === "marketing"} className="size-5 accent-destaque" />
          {F.soMarketing}
        </label>
      </form>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{T.resultado(total)}</span>
          {paginas > 1 && ` · ${T.pagina(filtros.pagina, paginas)}`}
        </span>
        {ativos.length > 0 && (
          <>
            <span className="flex flex-wrap items-center gap-1.5">
              <span>{F.ativos}</span>
              {ativos.map((a) => (
                <Etiqueta key={a}>{a}</Etiqueta>
              ))}
            </span>
            <Link href="/demo#lista" className="min-h-11 font-medium text-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              {F.limpar}
            </Link>
          </>
        )}
      </div>

      {itens.length === 0 ? (
        <EstadoVazio titulo={T.vazio.titulo} descricao={T.vazio.descricao}>
          {ativos.length > 0 && (
            <Link href="/demo#lista" className={buttonVariants({ variant: "outline" })}>
              {F.limpar}
            </Link>
          )}
        </EstadoVazio>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          <li className={cn("hidden py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase lg:grid lg:gap-4", COLUNAS)}>
            <span>{T.colunas.contato}</span><span>{T.colunas.interesse}</span><span>{T.colunas.vendedor}</span><span>{T.colunas.consentimentos}</span><span className="text-right">{T.colunas.hora}</span>
          </li>
          {itens.map((l) => (
            <li key={l.id} className={cn("grid grid-cols-1 gap-2 py-4 lg:items-center lg:gap-4 lg:py-3", COLUNAS)}>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1"><LinhaContato id={l.id} nome={l.nome} telefone={l.telefone} email={l.email} /></div>
                {l.suspeito && <Etiqueta tom="atencao" className="shrink-0">{T.suspeito}</Etiqueta>}
              </div>
              <div className="text-sm sm:text-base">
                <Rotulo>{T.colunas.interesse}</Rotulo>
                <span>{l.modelo ?? "—"}</span>
                <span className="text-muted-foreground"> · </span>
                <span>{l.prazo ?? "—"}</span>
              </div>
              <div className="text-sm sm:text-base">
                <Rotulo>{T.colunas.vendedor}</Rotulo>
                {l.vendedor ?? <span className="text-muted-foreground">{A.demo.ranking.semVendedor}</span>}
                <span className="text-muted-foreground"> · {A.demo.origem.rotulos[l.origem] ?? l.origem}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Rotulo>{T.colunas.consentimentos}</Rotulo>
                {FINALIDADES.map((f) => {
                  const sim = l.consentimentos[f];
                  return (
                    <span key={f} className={cn("rounded px-1.5 py-0.5 text-xs", sim ? "bg-muted text-foreground" : "border border-border text-muted-foreground line-through")}>
                      {T.consent[f]}
                    </span>
                  );
                })}
                {!l.consentimentos.marketing && <span className="text-xs font-medium text-perigo">{T.naoContatar}</span>}
              </div>
              <div className="text-sm text-muted-foreground tabular-nums lg:text-right">
                <Rotulo>{T.colunas.hora}</Rotulo>
                {hora.format(l.criadoEm)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {paginas > 1 && (
        <nav className="flex items-center justify-between gap-3" aria-label="Paginação">
          {filtros.pagina > 1 ? (
            <Link href={link(filtros.pagina - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>{T.anterior}</Link>
          ) : <span />}
          <span className="text-sm text-muted-foreground">{T.pagina(filtros.pagina, paginas)}</span>
          {filtros.pagina < paginas ? (
            <Link href={link(filtros.pagina + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>{T.proxima}</Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}

/** Rótulo da coluna repetido no celular, onde o cabeçalho da tabela não existe. */
function Rotulo({ children }: { children: string }) {
  return <span className="mr-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase lg:hidden">{children}</span>;
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-muted-foreground">
      <span className="mb-1 block">{rotulo}</span>
      {children}
    </label>
  );
}

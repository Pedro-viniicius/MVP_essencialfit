import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Peças de superfície do painel. Todas usam os tokens de `.painel`
 * (globals.css): nenhuma cor literal, nenhum branco transparente em texto.
 */

export type Tom = "neutro" | "sucesso" | "atencao" | "perigo";

/** Largura máxima e respiro lateral compartilhados por todas as telas. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)} {...props} />;
}

const ETIQUETA: Record<Tom, string> = {
  neutro: "border-border bg-muted text-foreground",
  sucesso: "border-sucesso/40 bg-sucesso-suave text-sucesso",
  atencao: "border-atencao/40 bg-atencao-suave text-atencao",
  perigo: "border-perigo/40 bg-perigo-suave text-perigo",
};

/** Rótulo curto. O tom reforça o texto; nunca é o único sinal. */
export function Etiqueta({ tom = "neutro", className, children }: { tom?: Tom; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", ETIQUETA[tom], className)}>
      {children}
    </span>
  );
}

type CartaoProps = ComponentProps<"section"> & {
  titulo?: string;
  descricao?: string;
  /** Canto superior direito: uma ação ou uma etiqueta. */
  acao?: ReactNode;
  /** Nível do título dentro da página; 3 quando o cartão já está sob um h2. */
  nivel?: 2 | 3;
};

/** Superfície única de conteúdo. Nunca aninhe um Cartao dentro de outro. */
export function Cartao({ titulo, descricao, acao, nivel = 2, className, children, ...props }: CartaoProps) {
  const Titulo = nivel === 3 ? "h3" : "h2";
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4 sm:p-6", className)} {...props}>
      {(titulo || acao) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            {titulo && <Titulo className="text-lg font-semibold tracking-tight sm:text-xl">{titulo}</Titulo>}
            {descricao && <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>}
          </div>
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

type MetricaProps = {
  valor: string;
  /** O que o número significa, em uma linha. */
  rotulo: string;
  /** De onde ele vem ou com o que se compara. Só quando o dado existe. */
  contexto?: string;
  destaque?: boolean;
};

/** Número → descrição → contexto. Um número sozinho não decide nada. */
export function Metrica({ valor, rotulo, contexto, destaque = false }: MetricaProps) {
  return (
    <div className={cn("rounded-xl border p-4 sm:p-5", destaque ? "border-destaque/50 bg-destaque/10" : "border-border bg-card")}>
      <p className={cn("text-3xl leading-none font-semibold tracking-tight tabular-nums sm:text-4xl", destaque && "text-destaque")}>
        {valor}
      </p>
      <p className="mt-2 text-sm font-medium sm:text-base">{rotulo}</p>
      {contexto && <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{contexto}</p>}
    </div>
  );
}

const AVISO: Record<Tom, string> = {
  neutro: "border-border bg-muted text-foreground",
  sucesso: "border-sucesso/40 bg-sucesso-suave",
  atencao: "border-atencao/40 bg-atencao-suave",
  perigo: "border-perigo/40 bg-perigo-suave",
};

/** Mensagem persistente de contexto ou consequência. */
export function Aviso({ tom = "neutro", className, ...props }: ComponentProps<"p"> & { tom?: Tom }) {
  return <p className={cn("rounded-lg border px-3 py-2 text-sm leading-snug", AVISO[tom], className)} {...props} />;
}

/**
 * O que merece atenção agora: o fato, por que importa e o que fazer.
 * Sem ação disponível, o cartão continua válido — só não tem link.
 */
export function Atencao({
  titulo,
  texto,
  href,
  acao,
  tom = "neutro",
}: {
  titulo: string;
  texto: string;
  href?: string;
  acao?: string;
  tom?: Tom;
}) {
  const borda = tom === "atencao" ? "border-l-atencao" : tom === "perigo" ? "border-l-perigo" : tom === "sucesso" ? "border-l-sucesso" : "border-l-destaque";
  return (
    <li className={cn("flex flex-col rounded-xl border border-border border-l-4 bg-card p-4", borda)}>
      <p className="font-semibold">{titulo}</p>
      <p className="mt-1 flex-1 text-sm leading-snug text-muted-foreground">{texto}</p>
      {href && acao && (
        <Link
          href={href}
          className="mt-3 inline-flex min-h-11 items-center self-start text-sm font-semibold underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {acao}
        </Link>
      )}
    </li>
  );
}

/** Tela sem dados: explica o porquê e oferece o próximo passo. */
export function EstadoVazio({ titulo, descricao, children }: { titulo: string; descricao: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <p className="text-lg font-semibold">{titulo}</p>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{descricao}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

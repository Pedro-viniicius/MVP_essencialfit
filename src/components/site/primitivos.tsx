import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { IconeMarca, Marca as MarcaCompartilhada } from "@/components/marca";
import { SITE } from "@/lib/site/conteudo";

/** Largura máxima e respiro lateral compartilhados por todas as seções. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

type SecaoProps = ComponentProps<"section"> & {
  id: string;
  /** Fundo alternado para separar blocos sem linhas divisórias. */
  tom?: "branco" | "superficie" | "tinta";
};

export function Secao({ id, tom = "branco", className, children, ...props }: SecaoProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        tom === "superficie" && "bg-superficie",
        tom === "tinta" && "bg-tinta text-white",
        className,
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

type CabecalhoProps = {
  selo?: string;
  titulo: string;
  subtitulo?: string;
  alinhamento?: "esquerda" | "centro";
  claro?: boolean;
  className?: string;
};

/** Selo + título + subtítulo. O título é sempre um h2: uma seção, uma ideia. */
export function Cabecalho({ selo, titulo, subtitulo, alinhamento = "esquerda", claro, className }: CabecalhoProps) {
  return (
    <div className={cn("max-w-3xl", alinhamento === "centro" && "mx-auto text-center", className)}>
      {selo && <Selo claro={claro}>{selo}</Selo>}
      <h2 className={cn("text-3xl font-semibold tracking-tight text-balance sm:text-4xl", selo && "mt-4")}>{titulo}</h2>
      {subtitulo && (
        <p className={cn("mt-4 text-lg leading-relaxed text-pretty", claro ? "text-white/70" : "text-muted-foreground")}>{subtitulo}</p>
      )}
    </div>
  );
}

export function Selo({ children, claro, className }: { children: ReactNode; claro?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase",
        claro ? "text-white/60" : "text-acento",
        className,
      )}
    >
      {children}
    </p>
  );
}

type BotaoLinkProps = ComponentProps<"a"> & {
  variante?: "primario" | "secundario" | "claro";
  tamanho?: "padrao" | "grande";
};

/** Âncora com aparência de botão: a landing só navega, nunca submete daqui. */
export function BotaoLink({ variante = "primario", tamanho = "padrao", className, ...props }: BotaoLinkProps) {
  return (
    <a
      className={cn(
        buttonVariants({ variant: variante === "secundario" ? "outline" : "default", size: tamanho === "grande" ? "lg" : "default" }),
        "rounded-full px-6",
        variante === "primario" && "bg-acento text-white shadow-sm hover:bg-acento-forte",
        variante === "secundario" && "border-linha bg-white text-tinta hover:bg-superficie",
        variante === "claro" && "bg-white text-tinta hover:bg-white/90",
        className,
      )}
      {...props}
    />
  );
}

/** Símbolo e marca vivem em `components/marca`: landing, captura e painel usam o mesmo. */
export function IconeBussola(props: { className?: string; acento?: string }) {
  return <IconeMarca {...props} />;
}

export function Marca({ className, claro }: { className?: string; claro?: boolean }) {
  return <MarcaCompartilhada className={className} claro={claro} nome={SITE.nome} />;
}

type CartaoProps = {
  empresa: string;
  instrucao: string;
  codigo?: string;
  className?: string;
  /** Tamanho reduzido para grades. */
  compacto?: boolean;
};

/**
 * Cartão físico. Frente escura com logo, instrução, símbolo NFC e um QR
 * ilustrativo — o QR sempre aparece para que a alternativa seja óbvia.
 */
export function CartaoFisico({ empresa, instrucao, codigo, className, compacto }: CartaoProps) {
  return (
    <div
      className={cn(
        "relative aspect-[1.586] w-full overflow-hidden rounded-2xl bg-tinta text-white shadow-lg ring-1 ring-white/10",
        compacto ? "p-3.5" : "p-5",
        className,
      )}
      role="img"
      aria-label={`Cartão ${empresa}: ${instrucao}`}
    >
      {/* Tarja sutil: dá volume sem gradiente chamativo. */}
      <div aria-hidden className="absolute inset-y-0 right-0 w-1/3 bg-white/[0.04]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn("font-semibold tracking-tight", compacto ? "text-sm" : "text-base")}>{empresa}</p>
            <p className={cn("mt-0.5 text-white/70", compacto ? "text-[10px]" : "text-xs")}>{SITE.nome}</p>
          </div>
          <SimboloNfc className={compacto ? "size-5" : "size-7"} />
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className={cn("font-medium leading-tight", compacto ? "text-xs" : "text-sm")}>{instrucao}</p>
            {codigo && <p className={cn("mt-1 font-mono text-white/70", compacto ? "text-[10px]" : "text-xs")}>{codigo}</p>}
          </div>
          <QrIlustrativo className={compacto ? "size-9" : "size-14"} />
        </div>
      </div>
    </div>
  );
}

export function SimboloNfc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-white/80", className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M8.5 9.5a4 4 0 0 0 0 5" />
      <path d="M6 7a8 8 0 0 0 0 10" />
      <path d="M15.5 9.5a4 4 0 0 1 0 5" />
      <path d="M18 7a8 8 0 0 1 0 10" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** QR Code ilustrativo (padrão fixo, não escaneável de propósito). */
export function QrIlustrativo({ className }: { className?: string }) {
  const celulas = QR_PADRAO.flatMap((linha, y) => linha.split("").map((c, x) => (c === "1" ? `${x},${y}` : null))).filter(Boolean) as string[];
  return (
    <svg viewBox="0 0 13 13" className={cn("rounded-sm bg-white p-[3px]", className)} aria-hidden shapeRendering="crispEdges">
      {celulas.map((k) => {
        const [x, y] = k.split(",").map(Number);
        return <rect key={k} x={x} y={y} width="1" height="1" fill="#111" />;
      })}
    </svg>
  );
}

const QR_PADRAO = [
  "1111111010111",
  "1000001001001",
  "1011101101011",
  "1011101000101",
  "1011101110111",
  "1000001010000",
  "1111111010111",
  "0000000110100",
  "1101011001101",
  "0110100111011",
  "1010111010010",
  "0001001101101",
  "1111100110111",
];

type TelefoneProps = {
  children: ReactNode;
  className?: string;
  /** Texto do relógio da barra de status. */
  hora?: string;
};

/** Moldura de smartphone. O conteúdo é a tela; a moldura nunca rola. */
export function Telefone({ children, className, hora = "14:32" }: TelefoneProps) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/19] w-full max-w-[260px] rounded-[2.2rem] bg-tinta p-2 shadow-xl ring-1 ring-black/10",
        className,
      )}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-white">
        <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-medium text-tinta">
          <span className="tabular-nums">{hora}</span>
          <span aria-hidden className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-tinta" />
          <span aria-hidden className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-[1px] bg-tinta/80" />
            <span className="inline-block h-2.5 w-4 rounded-[2px] border border-tinta/60" />
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

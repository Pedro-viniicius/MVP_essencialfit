import { cn } from "@/lib/utils";
import { MARCA } from "@/lib/marca";

/**
 * Identidade visual compartilhada pela landing, pela captura e pelo painel.
 * O nome vem sempre de `MARCA`; nenhuma tela escreve a marca à mão.
 */

/**
 * Símbolo da marca: uma folha em movimento ascendente. Saúde e evolução sem
 * recorrer à estética agressiva de academia.
 */
export function IconeMarca({ className, acento = "currentColor" }: { className?: string; acento?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 18c0-7 4.8-12 12.8-12H20c0 7-4.8 12-12.8 12H5Z" fill={acento} stroke="none" opacity=".9" />
      <path d="M6.5 17.5c3.2-3.4 6.4-5.7 10.3-7.4" />
      <path d="M12.8 13.3h4v-4" />
    </svg>
  );
}

type MarcaProps = {
  className?: string;
  /** Fundo escuro: inverte o quadrado do símbolo. */
  claro?: boolean;
  /** Em barras estreitas, o nome curto assume no celular. */
  compacta?: boolean;
  nome?: string;
};

/** Marca: ícone em um quadrado + nome. */
export function Marca({ className, claro, compacta, nome = MARCA.nome }: MarcaProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <span
        aria-hidden
        className={cn("grid size-8 shrink-0 place-items-center rounded-lg", claro ? "bg-white text-tinta" : "bg-tinta text-white")}
      >
        <IconeMarca className="size-5" />
      </span>
      {compacta ? (
        <>
          <span className="sm:hidden">{MARCA.nomeCurto}</span>
          <span className="hidden sm:inline">{nome}</span>
        </>
      ) : (
        <span>{nome}</span>
      )}
    </span>
  );
}

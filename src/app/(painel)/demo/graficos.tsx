import { A } from "@/lib/texts/admin";
import { cn } from "@/lib/utils";

/**
 * Plain HTML/CSS bars: one series per chart, so no palette and no legend.
 * The single accent marks the peak / the leader; everything else is neutral
 * on the panel surface. Bars stay ≤ 24 px thick with a 2 px surface gap.
 */
type Item = { rotulo: string; total: number };

export function Colunas({ itens }: { itens: { hora: number; total: number }[] }) {
  const max = Math.max(1, ...itens.map((i) => i.total));
  const pico = itens.find((i) => i.total === max);
  // Com muitas horas no eixo, um rótulo a cada duas evita sobreposição no celular.
  const passo = itens.length > 12 ? 2 : 1;
  return (
    <div className="flex h-44 items-end gap-0.5 sm:h-60 sm:gap-1" role="img" aria-label={`${A.demo.curva.sub}; ${A.demo.curva.pico} ${pico?.hora}h`}>
      {itens.map((i, idx) => {
        const ehPico = i === pico;
        return (
          <div key={i.hora} className="flex h-full flex-1 flex-col justify-end" title={`${i.hora}h: ${i.total}`}>
            <div className={cn("mb-1 text-center text-sm leading-none font-semibold sm:text-base", !ehPico && "hidden sm:block")}>
              {ehPico ? (
                <>
                  {i.total}
                  <span className="ml-1 hidden text-[0.7em] font-medium tracking-wide text-muted-foreground uppercase sm:inline">{A.demo.curva.pico}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{i.total}</span>
              )}
            </div>
            <div
              className={cn("mx-auto w-full max-w-6 rounded-t", ehPico ? "bg-destaque" : "bg-foreground/80")}
              style={{ height: `${(i.total / max) * 100}%` }}
            />
            <div className={cn("mt-2 text-center text-[10px] text-muted-foreground tabular-nums sm:text-sm", idx % passo !== 0 && !ehPico && "invisible sm:visible")}>
              {i.hora}h
            </div>
          </div>
        );
      })}
    </div>
  );
}

type BarrasProps = {
  itens: (Item & { apagado?: boolean })[];
  destacarPrimeiro?: boolean;
  /** Label beside the bar (needs width); otherwise label above the bar. */
  lado?: boolean;
};

export function Barras({ itens, destacarPrimeiro = false, lado = false }: BarrasProps) {
  const max = Math.max(1, ...itens.map((i) => i.total));
  return (
    <ul className="space-y-3">
      {itens.map((i, idx) => {
        const lider = destacarPrimeiro && idx === 0;
        const cor = lider ? "bg-destaque" : i.apagado ? "bg-muted-foreground/60" : "bg-foreground/80";
        return (
          <li
            key={i.rotulo}
            title={`${i.rotulo}: ${i.total}`}
            className={cn(lado && "sm:grid sm:grid-cols-[minmax(0,12rem)_1fr_3rem] sm:items-center sm:gap-3")}
          >
            {/* No celular o rótulo ocupa a linha inteira e não precisa ser cortado;
                a partir de sm ele volta a ser a primeira coluna da barra. */}
            <div className={cn("mb-1 flex items-baseline justify-between gap-3 text-sm sm:text-base", lado && "sm:contents")}>
              <span className={cn(lider ? "font-semibold text-foreground" : i.apagado ? "text-muted-foreground" : "text-foreground/90", lado && "sm:order-1 sm:truncate sm:text-lg")}>
                {i.rotulo}
              </span>
              <span className={cn("tabular-nums", lider ? "font-semibold" : "text-muted-foreground", lado && "sm:order-3 sm:text-right sm:text-lg")}>
                {i.total}
              </span>
            </div>
            <span className={cn("block h-3 w-full", lado && "sm:order-2 sm:h-5")}>
              <span className={cn("block h-full rounded-r", cor)} style={{ width: `${(i.total / max) * 100}%` }} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Uma frase respondendo ao gráfico acima. Só aparece quando o dado sustenta. */
export function Leitura({ children }: { children: string }) {
  return <p className="mt-4 border-t border-border pt-3 text-sm leading-snug text-muted-foreground">{children}</p>;
}

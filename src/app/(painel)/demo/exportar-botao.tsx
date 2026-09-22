"use client";

import { useState } from "react";
import { Aviso } from "@/components/painel/primitivos";
import { buttonVariants } from "@/components/ui/button";
import { A } from "@/lib/texts/admin";
import { cn } from "@/lib/utils";

/**
 * Consent is the default: the link exports only people who agreed to
 * marketing and says so. Including the rest needs an explicit tick, and
 * the warning appears before the click, not after.
 */
export function ExportarBotao({ comMarketing, semMarketing }: { comMarketing: number; semMarketing: number }) {
  const [tudo, setTudo] = useState(false);
  const E = A.demo.exportar;
  return (
    <div className="space-y-3">
      <a
        href={tudo ? "/demo/exportar?tudo=1" : "/demo/exportar"}
        className={cn(
          buttonVariants({ variant: tudo ? "outline" : "default" }),
          "w-full text-center sm:w-auto",
          tudo && "border-perigo text-perigo",
        )}
      >
        {tudo ? E.botaoTudo(semMarketing) : E.botao(comMarketing)}
      </a>
      {semMarketing > 0 && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={tudo} onChange={(e) => setTudo(e.target.checked)} className="size-5 accent-destaque" />
          {E.incluir(semMarketing)}
        </label>
      )}
      {tudo ? (
        <Aviso tom="perigo" role="alert" className="font-medium text-perigo">
          {E.aviso}
        </Aviso>
      ) : (
        <p className="text-sm text-muted-foreground">{E.registrado}</p>
      )}
    </div>
  );
}

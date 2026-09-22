"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { A } from "@/lib/texts/admin";
import { revelarAction, type Revelado } from "./actions";

type Props = { id: string; nome: string; telefone: string; email: string | null };

/**
 * Masked by default. "Revelar" asks the server for the full values, which
 * writes an auditoria row; the page is refreshed so the counter moves.
 */
export function LinhaContato({ id, nome, telefone, email }: Props) {
  const [revelado, setRevelado] = useState<Revelado | null>(null);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();
  const T = A.demo.lista;
  const v = revelado ?? { nome, telefone, email };

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold sm:text-lg">{v.nome}</p>
        <p className="truncate text-sm text-muted-foreground tabular-nums sm:text-base">
          {v.telefone}
          {v.email && <span> · {v.email}</span>}
        </p>
      </div>
      {revelado ? (
        <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">{T.revelado}</span>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={pendente}
          onClick={() =>
            iniciar(async () => {
              const r = await revelarAction(id);
              if (r) {
                setRevelado(r);
                router.refresh();
              }
            })
          }
        >
          {pendente ? T.revelando : T.revelar}
        </Button>
      )}
    </div>
  );
}

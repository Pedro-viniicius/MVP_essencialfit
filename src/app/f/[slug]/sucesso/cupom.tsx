"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { CheckIcon } from "lucide-react";
import { M } from "@/lib/texts/messages";

const semAssinatura = () => () => {};

function lerStorage(chave: string): string | null {
  try {
    return sessionStorage.getItem(chave);
  } catch {
    return null;
  }
}

/**
 * Reads the coupon from sessionStorage (set right before navigation) with the
 * query string as a fallback for browsers that block storage. The server
 * snapshot is the query string, so SSR and hydration agree.
 */
export function Cupom({ slug }: { slug: string }) {
  const params = useSearchParams();
  const daUrl = params.get("c") ?? "";
  const cupom = useSyncExternalStore(
    semAssinatura,
    () => lerStorage(`cupom:${slug}`) ?? daUrl,
    () => daUrl,
  );
  const offline = useSyncExternalStore(
    semAssinatura,
    () => lerStorage(`offline:${slug}`) === "1",
    () => false,
  );

  return (
    <>
      {/* A confirmação vem antes do código: primeiro a pessoa sabe que deu certo. */}
      <p className="anim-surgir flex items-center gap-2 text-lg font-semibold text-acento">
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-acento-suave">
          <CheckIcon className="size-5" />
        </span>
        {M.sucesso.confirmacao}
      </p>
      <p className="mt-8 text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase">{M.sucesso.titulo}</p>
      <p
        className="mt-2 font-mono text-[2.6rem] leading-none font-bold tracking-wider break-all sm:text-5xl"
        aria-live="polite"
      >
        {cupom || "—"}
      </p>
      <p className="mt-6 max-w-xs text-lg text-pretty">{M.sucesso.instrucao}</p>
      {offline && (
        <p role="status" className="mt-6 max-w-xs rounded-lg bg-superficie p-3 text-sm text-muted-foreground">
          {M.sucesso.salvoOffline}
        </p>
      )}
    </>
  );
}

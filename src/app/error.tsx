"use client";

import { Marca } from "@/components/marca";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="captura flex flex-1 flex-col items-center justify-center gap-4 bg-white px-6 py-10 text-center">
      <Marca />
      <h1 className="text-2xl font-bold tracking-tight">Algo deu errado</h1>
      <p className="max-w-sm text-muted-foreground">
        Não foi possível carregar a página. Tente novamente em instantes.
      </p>
      <Button onClick={reset} size="lg" className="mt-2">
        Tentar novamente
      </Button>
    </main>
  );
}

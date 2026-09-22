import { Marca } from "@/components/marca";

export default function NotFound() {
  return (
    <main className="captura flex flex-1 flex-col items-center justify-center gap-4 bg-white px-6 py-10 text-center">
      <Marca />
      <h1 className="text-2xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="max-w-sm text-muted-foreground">
        Confira o endereço ou aproxime o celular do cartão novamente.
      </p>
    </main>
  );
}

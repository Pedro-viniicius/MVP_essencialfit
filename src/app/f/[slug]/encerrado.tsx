import { Marca } from "@/components/marca";
import { M } from "@/lib/texts/messages";

export function Encerrado({ nomeEvento }: { nomeEvento: string }) {
  return (
    <main className="captura flex flex-1 flex-col items-center justify-center gap-4 bg-white px-6 py-10 text-center">
      <Marca />
      <div>
        <p className="text-sm text-muted-foreground">{nomeEvento}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{M.encerrado.titulo}</h1>
      </div>
      <p className="max-w-sm text-muted-foreground">{M.encerrado.texto}</p>
    </main>
  );
}

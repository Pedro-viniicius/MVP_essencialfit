/**
 * Um bloco de perguntas com um propósito só. O título diz por que aquele
 * dado está sendo pedido — ninguém preenche o que não entende.
 */
export function Grupo({ titulo, ajuda, children }: { titulo: string; ajuda?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xs font-semibold tracking-[0.14em] text-acento uppercase">{titulo}</h2>
        {ajuda && <p className="mt-1 text-sm text-muted-foreground">{ajuda}</p>}
      </div>
      {children}
    </section>
  );
}

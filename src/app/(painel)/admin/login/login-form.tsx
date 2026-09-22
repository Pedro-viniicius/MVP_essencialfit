"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Aviso } from "@/components/painel/primitivos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { A } from "@/lib/texts/admin";
import { entrarAction, entrarComoTesteAction, type EstadoLogin } from "./actions";

/**
 * Password + 6-digit code. The code field opens the numeric keyboard and
 * accepts the OS "one-time code" autofill. Errors are one generic line so
 * the screen never says which of the two was wrong.
 *
 * Com o modo de teste ligado, um atalho aparece acima do formulário: não há
 * senha nem autenticador de verdade para conferir neste ambiente.
 */
export function LoginForm({
  next,
  configurado,
  modoTeste = false,
}: {
  next: string;
  configurado: boolean;
  modoTeste?: boolean;
}) {
  const [estado, agir, pendente] = useActionState<EstadoLogin, FormData>(entrarAction, {});
  const L = A.login;
  const bloqueado = pendente || !configurado;

  return (
    <div className="space-y-8">
      {modoTeste && (
        <section className="space-y-3 rounded-lg border border-atencao/40 bg-atencao-suave px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-atencao">{L.teste.titulo}</p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{L.teste.texto}</p>
          </div>
          <form action={entrarComoTesteAction}>
            <input type="hidden" name="next" value={next} />
            <BotaoTeste rotulo={L.teste.entrar} pendente={L.teste.entrando} />
          </form>
        </section>
      )}

      <form action={agir} className="space-y-5" aria-busy={pendente}>
        <input type="hidden" name="next" value={next} />
        <header>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{L.marca}</p>
          <h1 className="text-3xl font-bold tracking-tight">{L.titulo}</h1>
          <p className="mt-1 text-muted-foreground">{L.subtitulo}</p>
        </header>

        {!configurado && (
          <Aviso tom="atencao" role="status" className="text-atencao">
            {L.naoConfigurado}
          </Aviso>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="senha">{L.senha}</Label>
          <Input id="senha" name="senha" type="password" autoComplete="current-password" required disabled={bloqueado} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="codigo">{L.codigo}</Label>
          <Input
            id="codigo"
            name="codigo"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            autoComplete="one-time-code"
            maxLength={6}
            required
            disabled={bloqueado}
            placeholder="······"
            aria-describedby="codigo-ajuda"
            className="text-center font-mono text-2xl tracking-[0.4em]"
          />
          <p id="codigo-ajuda" className="text-sm leading-snug text-muted-foreground">
            {L.codigoAjuda}
          </p>
        </div>

        {estado.erro && (
          <Aviso tom="perigo" role="alert" className="font-medium text-perigo">
            {estado.erro}
          </Aviso>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={bloqueado} aria-busy={pendente}>
          {pendente ? L.entrando : L.entrar}
        </Button>
      </form>

      <details className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
        <summary className="min-h-11 cursor-pointer list-none py-2 font-medium text-foreground marker:hidden">
          {L.ajuda.titulo}
        </summary>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          {L.ajuda.passos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
        <p className="mt-3 text-xs">{L.ajuda.rodape}</p>
      </details>
    </div>
  );
}

/** Precisa ser um filho do <form> para o useFormStatus enxergar o envio. */
function BotaoTeste({ rotulo, pendente }: { rotulo: string; pendente: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? pendente : rotulo}
    </Button>
  );
}

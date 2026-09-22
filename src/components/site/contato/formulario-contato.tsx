"use client";

import { useActionState, useId } from "react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CONTATO } from "@/lib/site/conteudo";
import { enviarSolicitacao, type EstadoContato } from "./actions";

const INICIAL: EstadoContato = { status: "inicial" };

/**
 * Formulário não controlado enviado por server action: funciona antes da
 * hidratação e sem JavaScript (a resposta vem como navegação normal).
 */
export function FormularioContato() {
  const [estado, acao, pendente] = useActionState(enviarSolicitacao, INICIAL);
  const id = useId();
  const erros = estado.status === "erro" ? (estado.campos ?? {}) : {};
  const valores = estado.status === "erro" ? estado.valores : undefined;

  if (estado.status === "enviado") {
    return (
      <div role="status" className="anim-surgir flex h-full flex-col justify-center rounded-2xl border border-linha bg-white p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-acento-suave text-acento">
          <CheckIcon className="size-6" aria-hidden />
        </span>
        <p className="mt-4 text-xl font-semibold">{CONTATO.sucesso.titulo}</p>
        <p className="mt-1 text-muted-foreground">{CONTATO.sucesso.texto}</p>
      </div>
    );
  }

  return (
    <form action={acao} noValidate className="rounded-2xl border border-linha bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={`${id}-nome`} nome="nome" rotulo={CONTATO.campos.nome} erro={erros.nome} defaultValue={valores?.nome} autoComplete="name" />
        <Campo id={`${id}-empresa`} nome="empresa" rotulo={CONTATO.campos.empresa} erro={erros.empresa} defaultValue={valores?.empresa} autoComplete="organization" />
        <div className="sm:col-span-2">
          <Campo id={`${id}-contato`} nome="contato" rotulo={CONTATO.campos.contato} dica={CONTATO.campos.contatoDica} erro={erros.contato} defaultValue={valores?.contato} autoComplete="tel" inputMode="email" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-mensagem`}>{CONTATO.campos.mensagem}</Label>
          <textarea
            id={`${id}-mensagem`}
            name="mensagem"
            rows={4}
            required
            defaultValue={valores?.mensagem}
            placeholder={CONTATO.campos.mensagemPlaceholder}
            aria-invalid={erros.mensagem ? true : undefined}
            aria-describedby={erros.mensagem ? `${id}-mensagem-erro` : undefined}
            className={cn(
              "w-full rounded-lg border border-input bg-background px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            )}
          />
          {erros.mensagem && (
            <p id={`${id}-mensagem-erro`} role="alert" className="text-sm font-medium text-destructive">
              {erros.mensagem}
            </p>
          )}
        </div>
      </div>

      {/* Isca para robôs: fora do fluxo visual e da ordem de tabulação. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site
          <input type="text" name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{CONTATO.consentimento}</p>

      {estado.status === "erro" && estado.geral && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
          {estado.geral}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pendente} className="mt-6 w-full rounded-full bg-acento hover:bg-acento-forte sm:w-auto sm:px-8">
        {pendente && <Loader2Icon className="animate-spin" aria-hidden />}
        {pendente ? CONTATO.enviando : CONTATO.botao}
      </Button>
    </form>
  );
}

type CampoProps = React.ComponentProps<"input"> & { id: string; nome: string; rotulo: string; dica?: string; erro?: string };

function Campo({ id, nome, rotulo, dica, erro, ...props }: CampoProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {rotulo}
        {dica && <span className="font-normal text-muted-foreground">{dica}</span>}
      </Label>
      <Input id={id} name={nome} required aria-invalid={erro ? true : undefined} aria-describedby={erro ? `${id}-erro` : undefined} {...props} />
      {erro && (
        <p id={`${id}-erro`} role="alert" className="text-sm font-medium text-destructive">
          {erro}
        </p>
      )}
    </div>
  );
}

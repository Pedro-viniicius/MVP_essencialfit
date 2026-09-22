"use client";

import { useRef, useState, useSyncExternalStore, type FocusEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ORIGENS, type Origem } from "@/lib/domain";
import { gerarCupom } from "@/lib/coupon";
import { M } from "@/lib/texts/messages";
import { leadSchema, type LeadInput } from "@/lib/validation/lead";
import { mascararTelefone } from "@/lib/validation/phone";
import { Chips } from "./chips";
import { ConsentSection } from "./consent-section";
import { Field } from "./field";
import { Grupo } from "./grupo";
import { enviarLead } from "./submit";

export type EventoPublico = {
  slug: string;
  nome: string;
  modelos: string[];
  politicaVersao: string;
};

type CampoErro = "nome" | "telefone" | "email" | "consentimentos";
type Erros = Partial<Record<CampoErro, string>>;

const semAssinatura = () => () => {};

function lerOrigem(valor: string | null): Origem {
  return (ORIGENS as readonly string[]).includes(valor ?? "") ? (valor as Origem) : "direto";
}

/**
 * The whole form is uncontrolled: people start typing on a congested 4G
 * connection long before React hydrates, and a controlled input would wipe
 * what they typed. Values are read from FormData at submit time; React only
 * owns error messages and the submitting state.
 */
export function LeadForm({ evento }: { evento: EventoPublico }) {
  const router = useRouter();
  const params = useSearchParams();
  const origem = lerOrigem(params.get("o"));
  const vendedorCodigo = params.get("v")?.trim() || null;
  // Kiosk mode: the salesperson types leads on their own phone, back to back.
  const modoManual = origem === "manual";

  // false in the server HTML, true once mounted: the submit button is visibly
  // "Carregando…" until JavaScript can actually handle the tap.
  const hidratado = useSyncExternalStore(semAssinatura, () => true, () => false);

  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [ultimoCupom, setUltimoCupom] = useState<string | null>(null);
  const [cupomExistente, setCupomExistente] = useState<string | null>(null);
  const enviandoRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const modelos = [...evento.modelos, M.form.naoSei];

  function lerFormulario(): LeadInput {
    const fd = new FormData(formRef.current!);
    const texto = (k: string) => String(fd.get(k) ?? "");
    return {
      nome: texto("nome"),
      telefone: texto("telefone"),
      email: texto("email"),
      modeloInteresse: (fd.get("modelo") as string | null) ?? null,
      prazoCompra: (fd.get("prazo") as LeadInput["prazoCompra"]) ?? null,
      consentimentos: {
        contato_comercial: fd.get("contato_comercial") === "on",
        promocao: fd.get("promocao") === "on",
        marketing: fd.get("marketing") === "on",
      } as LeadInput["consentimentos"],
      origem,
      vendedorCodigo,
      cupom: gerarCupom(evento.slug),
      chaveIdempotencia: crypto.randomUUID(),
      site: texto("site"),
    };
  }

  /** Validate one field on blur — never on every keystroke. */
  function validarNoBlur(campo: "nome" | "telefone" | "email") {
    return (e: FocusEvent<HTMLInputElement>) => {
      const resultado = leadSchema.shape[campo].safeParse(e.target.value);
      setErros((atual) => ({
        ...atual,
        [campo]: resultado.success ? undefined : resultado.error.issues[0]?.message,
      }));
    };
  }

  function limpar() {
    formRef.current?.reset();
    setErros({});
    formRef.current?.querySelector<HTMLInputElement>("#nome")?.focus();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Ref, not state: state updates are async and a double tap lands before re-render.
    if (enviandoRef.current) return;

    const input = lerFormulario();
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) {
      const novos: Erros = {};
      for (const issue of parsed.error.issues) {
        const campo = issue.path[0] as CampoErro;
        if (["nome", "telefone", "email", "consentimentos"].includes(campo) && !novos[campo]) {
          novos[campo] = issue.message;
        }
      }
      setErros(novos);
      const primeiro = Object.keys(novos)[0];
      formRef.current
        ?.querySelector<HTMLElement>(primeiro === "consentimentos" ? "#consent-contato_comercial" : `#${primeiro}`)
        ?.focus();
      return;
    }

    enviandoRef.current = true;
    setEnviando(true);
    setErroGeral(null);
    setCupomExistente(null);
    // Kiosk mode: the previous visitor's coupon must not sit next to this one's error.
    setUltimoCupom(null);
    try {
      const resultado = await enviarLead(evento.slug, input);
      if (!resultado.ok) {
        if (resultado.cupom !== undefined) {
          // Already registered: not an error on their part, so no red text.
          setCupomExistente(resultado.cupom);
          setErroGeral(null);
          setErros({});
          window.scrollTo({ top: 0 });
        } else if (resultado.campo) {
          setErros({ [resultado.campo]: resultado.erro });
        } else {
          setErroGeral(resultado.erro);
        }
        return;
      }
      if (modoManual) {
        setUltimoCupom(resultado.cupom);
        limpar();
        window.scrollTo({ top: 0 });
        return;
      }
      try {
        sessionStorage.setItem(`cupom:${evento.slug}`, resultado.cupom);
        if (resultado.enfileirado) sessionStorage.setItem(`offline:${evento.slug}`, "1");
      } catch {
        /* private mode: the query string below carries the coupon */
      }
      router.push(`/f/${evento.slug}/sucesso?c=${resultado.cupom}`);
    } catch {
      // Unreachable server and no local queue (storage blocked): say so.
      setErroGeral(M.erros.generico);
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  }

  const bloqueado = !hidratado || enviando;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {modoManual && (
        <div className="rounded-lg border border-border bg-superficie p-3 text-sm">
          <p>{M.manual.aviso}</p>
          {ultimoCupom && (
            <p role="status" className="mt-1 font-semibold">
              {M.manual.enviado} <span className="font-mono text-lg">{ultimoCupom}</span>
            </p>
          )}
        </div>
      )}

      {cupomExistente !== null && (
        <div role="status" className="anim-surgir rounded-lg border border-acento/30 bg-acento-suave p-3 text-sm">
          <p>{M.erros.telefoneDuplicado}</p>
          {cupomExistente && (
            <p className="mt-1 font-semibold">
              {M.erros.telefoneDuplicadoCupom}{" "}
              <span className="font-mono text-lg">{cupomExistente}</span>
            </p>
          )}
        </div>
      )}

      {/* O toque vem antes do teclado: duas perguntas de um toque abrem o
          formulário, e só então pedimos nome e contato. */}
      <Grupo titulo={M.form.grupos.interesse} ajuda={M.form.grupos.interesseAjuda}>
        <Chips label={M.form.modelo} name="modelo" options={modelos} />
        <Chips label={M.form.prazo} name="prazo" options={M.prazos} />
      </Grupo>

      <Grupo titulo={M.form.grupos.contato} ajuda={M.form.grupos.contatoAjuda}>
        <Field id="nome" label={M.form.nome} error={erros.nome}>
          <Input
            id="nome"
            name="nome"
            onBlur={validarNoBlur("nome")}
            // Só no modo atendimento: no celular de quem chegou pelo cartão, o
            // teclado subindo sozinho esconde a primeira pergunta.
            autoFocus={modoManual}
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            placeholder={M.form.nomePlaceholder}
            required
            aria-invalid={!!erros.nome}
            aria-describedby={erros.nome ? "nome-erro" : undefined}
          />
        </Field>

        <Field id="telefone" label={M.form.whatsapp} error={erros.telefone}>
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            // Mask applied straight on the DOM so the input stays uncontrolled.
            onChange={(e) => {
              e.target.value = mascararTelefone(e.target.value);
            }}
            onBlur={validarNoBlur("telefone")}
            autoComplete="tel-national"
            enterKeyHint="next"
            placeholder={M.form.whatsappPlaceholder}
            required
            aria-invalid={!!erros.telefone}
            aria-describedby={erros.telefone ? "telefone-erro" : undefined}
          />
        </Field>

        <Field id="email" label={M.form.email} hint={M.form.emailOpcional} error={erros.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            onBlur={validarNoBlur("email")}
            autoComplete="email"
            autoCapitalize="none"
            enterKeyHint="done"
            placeholder={M.form.emailPlaceholder}
            aria-invalid={!!erros.email}
            aria-describedby={erros.email ? "email-erro" : undefined}
          />
        </Field>
      </Grupo>

      <ConsentSection
        error={erros.consentimentos}
        onRequiredChange={(checked) => {
          if (checked) setErros((atual) => ({ ...atual, consentimentos: undefined }));
        }}
      />

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label htmlFor="site">Site</label>
        <input id="site" name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {erroGeral && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {erroGeral}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={bloqueado} aria-busy={enviando}>
        {bloqueado ? (
          <>
            <Loader2Icon className="animate-spin" aria-hidden="true" />
            {enviando ? M.form.enviando : M.form.carregando}
          </>
        ) : (
          M.form.enviar
        )}
      </Button>
    </form>
  );
}

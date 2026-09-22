import { CONSENTIMENTOS } from "@/lib/texts/privacy";
import { M } from "@/lib/texts/messages";
import type { Finalidade } from "@/lib/domain";

type Props = {
  error?: string | null;
  onRequiredChange?: (checked: boolean) => void;
};

const ORDEM: Finalidade[] = ["contato_comercial", "promocao", "marketing"];

/**
 * Native checkboxes, never pre-checked, usable before hydration.
 * Values are read from FormData at submit time.
 */
export function ConsentSection({ error, onRequiredChange }: Props) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold tracking-[0.14em] text-acento uppercase">{M.form.consentimentos}</legend>

      <div className="space-y-1 rounded-lg bg-superficie p-3 text-sm leading-snug text-muted-foreground">
        {M.form.privacidadeResumo.map((linha) => (
          <p key={linha}>{linha}</p>
        ))}
        <a
          href="/privacidade"
          target="_blank"
          rel="noopener"
          className="inline-block min-h-11 py-2 font-medium text-acento underline underline-offset-4"
        >
          {M.form.verPolitica}
        </a>
      </div>

      {ORDEM.map((finalidade) => {
        const id = `consent-${finalidade}`;
        const { rotulo, obrigatorio } = CONSENTIMENTOS[finalidade];
        return (
          <label key={finalidade} htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
            <input
              id={id}
              name={finalidade}
              type="checkbox"
              className="mt-0.5 size-6 shrink-0 accent-primary"
              aria-required={obrigatorio}
              aria-invalid={obrigatorio && !!error}
              aria-describedby={obrigatorio && error ? `${id}-erro` : undefined}
              onChange={obrigatorio ? (e) => onRequiredChange?.(e.target.checked) : undefined}
            />
            <span className="text-sm leading-snug">
              {rotulo}{" "}
              {obrigatorio && <span className="text-muted-foreground">({M.form.obrigatorio})</span>}
            </span>
          </label>
        );
      })}

      {error && (
        <p id="consent-contato_comercial-erro" role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}

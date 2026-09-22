/**
 * Consent texts, versioned.
 *
 * `POLITICA_VERSAO` is stored on every consent row (texto_versao). Any change
 * to the wording below MUST bump the version: it is the legal proof of what
 * the person actually agreed to, not merely that they clicked.
 */
export const POLITICA_VERSAO = "2026-09-20.essencial-fit.v1";

export const CONSENTIMENTOS = {
  contato_comercial: {
    rotulo:
      "Autorizo a Essencial Fit a usar estes dados para responder ao meu interesse por WhatsApp, telefone ou e-mail.",
    obrigatorio: true,
  },
  promocao: {
    rotulo:
      "Quero participar desta ação da Essencial Fit e aceito o regulamento apresentado.",
    obrigatorio: false,
  },
  marketing: {
    rotulo:
      "Aceito receber novidades, conteúdos e ofertas da Essencial Fit.",
    obrigatorio: false,
  },
} as const;

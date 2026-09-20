import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CascaDemonstracao } from "@/interface/casca/casca-demonstracao";

import { EMPRESA } from "./dados/empresa";
import { RESUMO_ESTOQUE } from "./dados/resultados";

export const metadata: Metadata = {
  title: { default: "Demonstração", template: "%s · Essencial Fit" },
  description: "Área de demonstração da Essencial Fit com dados de exemplo.",
};

/**
 * Area de demonstracao.
 *
 * Nao exige sessao nem banco de dados: abre em qualquer maquina, direto no
 * `pnpm dev`, porque e ela que vai ao ar na frente do cliente. O sistema real
 * continua atras de `/entrar`, intacto.
 */
export default function LayoutDemonstracao({ children }: { children: ReactNode }) {
  return (
    <CascaDemonstracao
      unidade={EMPRESA.unidade}
      contadores={{ "/demonstracoes/estoque": RESUMO_ESTOQUE.itensAbaixoDoMinimo }}
    >
      {children}
    </CascaDemonstracao>
  );
}

import type { ReactNode } from "react";

import { Logotipo } from "../marca/logotipo";
import estilos from "./casca-simples.module.css";

/**
 * Casca minima para telas fora da aplicacao (entrar, criar conta, primeiro
 * acesso): um cartao centralizado, sem barra lateral nem cabecalho.
 */
export function CascaSimples({ children }: { readonly children: ReactNode }) {
  return (
    <div className={estilos.pagina}>
      <main id="conteudo" className={estilos.cartao}>
        <p className={estilos.marca}>
          <Logotipo comAssinatura />
        </p>
        {children}
      </main>
    </div>
  );
}

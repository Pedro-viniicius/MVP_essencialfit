import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/interface/estilos/global.css";
import { MARCA } from "@/interface/marca/indice";

export const metadata: Metadata = {
  title: { default: MARCA.nome, template: `%s · ${MARCA.nome}` },
  description: MARCA.descricao,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Layout raiz: apenas o documento HTML e os estilos globais.
 * A casca (cabecalho + barra lateral) fica no grupo `(aplicacao)`; telas fora
 * da casca — `/entrar`, `/primeiro-acesso` — entram em outro grupo no Gate 5.
 */
export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

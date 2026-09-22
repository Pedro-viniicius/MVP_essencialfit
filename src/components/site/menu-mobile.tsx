"use client";

import { useEffect, useId, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { NAV } from "@/lib/site/conteudo";
import { BotaoLink } from "./primitivos";

/** Menu de celular: um botão, um painel abaixo da barra, fecha ao navegar ou com Esc. */
export function MenuMobile() {
  const [aberto, setAberto] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        aria-label={aberto ? NAV.fecharMenu : NAV.abrirMenu}
        onClick={() => setAberto((v) => !v)}
        className="grid size-11 place-items-center rounded-full text-tinta outline-none hover:bg-superficie focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {aberto ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>
      {aberto && (
        <div id={id} className="anim-surgir absolute inset-x-0 top-16 border-b border-linha bg-white px-4 pb-5 pt-2 shadow-lg sm:px-6">
          <nav aria-label="Seções" className="flex flex-col">
            {NAV.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-tinta outline-none hover:bg-superficie focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {l.rotulo}
              </a>
            ))}
          </nav>
          <BotaoLink href="#contato" onClick={() => setAberto(false)} className="mt-3 w-full">
            {NAV.cta}
          </BotaoLink>
        </div>
      )}
    </div>
  );
}

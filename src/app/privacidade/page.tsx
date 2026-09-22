import type { Metadata } from "next";
import Link from "next/link";
import { Marca } from "@/components/marca";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: `Privacidade — ${MARCA.nome}`,
  description: "Como a Essencial Fit usa e protege os dados enviados nas experiências por NFC e QR Code.",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <main className="captura mx-auto w-full max-w-2xl flex-1 bg-white px-5 py-10 sm:py-16">
      <Marca />
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-balance">Privacidade em linguagem clara</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Perguntamos pouco e explicamos por quê. Os dados enviados nos cartões NFC e QR Codes são usados para registrar sua participação, responder ao seu interesse e entender como melhorar a experiência na loja.
      </p>

      <div className="mt-10 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">O que é registrado</h2>
          <p className="mt-2 text-muted-foreground">Nome, contato, respostas escolhidas, origem do acesso e as autorizações que você concedeu. Informações técnicas são usadas apenas para segurança e prevenção de abuso.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Para que usamos</h2>
          <p className="mt-2 text-muted-foreground">Para concluir a experiência, entrar em contato quando autorizado e transformar respostas agrupadas em indicadores. Não vendemos seus dados.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Por quanto tempo</h2>
          <p className="mt-2 text-muted-foreground">Os registros identificáveis ficam guardados pelo período informado no formulário e depois são anonimizados. Autorizações podem ser revogadas a qualquer momento.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Seus direitos</h2>
          <p className="mt-2 text-muted-foreground">Você pode pedir confirmação, acesso, correção, exclusão ou revogação do consentimento pelo e-mail <a className="font-medium text-acento underline underline-offset-4" href={`mailto:${MARCA.contatoPrivacidade}`}>{MARCA.contatoPrivacidade}</a>.</p>
        </section>
      </div>

      <Link href="/" className="mt-10 inline-flex min-h-11 items-center font-semibold text-acento underline underline-offset-4">
        Voltar ao início
      </Link>
    </main>
  );
}


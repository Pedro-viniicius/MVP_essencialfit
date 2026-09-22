import type { Metadata } from "next";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Funcoes } from "@/components/site/funcoes";
import { Cenarios, Desvios, Fluxo, Personalizacao, Problema, Recalibrar, Sinais, Terreno } from "@/components/site/narrativa";
import { Leitura, Norte } from "@/components/site/dados";
import { Faq, Preco, Privacidade, Rodape } from "@/components/site/confianca";
import { CtaFinal } from "@/components/site/cta-final";
import { FAQ, SITE } from "@/lib/site/conteudo";

const TITULO = `${SITE.nome} — ${SITE.slogan}`;

export const metadata: Metadata = {
  title: TITULO,
  description: SITE.descricao,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE.nome,
    title: TITULO,
    description: SITE.descricao,
  },
  twitter: { card: "summary_large_image", title: TITULO, description: SITE.descricao },
};

// FAQ em dados estruturados: as mesmas perguntas e respostas da página.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.itens.map((i) => ({
    "@type": "Question",
    name: i.pergunta,
    acceptedAnswer: { "@type": "Answer", text: i.resposta },
  })),
};

/**
 * Landing da experiência Essencial Fit. Ordem das seções = narrativa:
 * direção a partir de sinais → como o toque vira direção → o problema (movimento
 * sem orientação) → leia os sinais → pontos de contato → conheça o terreno →
 * painel Norte → leitura (IA) → desvios → recalibre cedo → cenários →
 * personalização → confiança → preço → perguntas → próximo norte.
 */
export default function LandingPage() {
  return (
    <div className="site flex min-h-full flex-1 flex-col bg-white">
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Ir para o conteúdo
      </a>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Fluxo />
        <Problema />
        <Sinais />
        <Funcoes />
        <Terreno />
        <Norte />
        <Leitura />
        <Desvios />
        <Recalibrar />
        <Cenarios />
        <Personalizacao />
        <Privacidade />
        <Preco />
        <Faq />
        <CtaFinal />
      </main>
      <Rodape />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}

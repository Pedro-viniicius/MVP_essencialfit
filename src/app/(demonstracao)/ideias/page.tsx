import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPainel, CartaoIdeia, EstadoVazio, TituloSecao } from "@/interface/componentes/indice";

import { FOCOS, focoAtual, ideiasDoFoco } from "../dados/ideias";
import estilos from "../demonstracao.module.css";
import proprios from "./ideias.module.css";

export const metadata: Metadata = {
  title: "Ideias IA",
  description: "Uma visão econômica do seu negócio para transformar dados em possibilidades de ação.",
};

/**
 * Ideias IA — prototipo.
 *
 * O que ja existe: o formato da analise (quatro camadas mais a base da
 * sugestao), os recortes por assunto e a ligacao com os paineis.
 * O que ainda nao existe: um modelo lendo dados reais. Isto esta escrito na
 * propria tela, porque prometer inteligencia que nao esta ligada e a forma
 * mais rapida de perder a confianca de quem decide.
 */
export default async function PaginaIdeias({
  searchParams,
}: {
  searchParams: Promise<{ readonly foco?: string }>;
}) {
  const parametros = await searchParams;
  const foco = focoAtual(parametros.foco);
  const ideias = ideiasDoFoco(foco.chave);

  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Ideias IA · Protótipo"
        pergunta={foco.pergunta}
        resposta="Uma visão econômica do seu negócio para transformar dados em possibilidades de ação."
        periodo="Setembro de 2026"
        acoes={<Link href="/demonstracoes/inicio">Voltar ao início →</Link>}
      />

      <nav className={proprios.filtros} aria-label="Assunto das ideias">
        {FOCOS.map((opcao) => {
          const ativo = opcao.chave === foco.chave;
          return (
            <Link
              key={opcao.chave}
              href={opcao.chave === "tudo" ? "/ideias" : `/ideias?foco=${opcao.chave}`}
              className={`${proprios.filtro} ${ativo ? proprios.filtroAtivo : ""}`}
              {...(ativo ? { "aria-current": "page" as const } : {})}
            >
              {opcao.rotulo}
            </Link>
          );
        })}
      </nav>

      <section className={estilos.secao}>
        <TituloSecao
          titulo={`${ideias.length} ${ideias.length === 1 ? "ideia" : "ideias"} para este recorte`}
          explicacao="Cada ideia mostra o que percebemos, o que dá para fazer, por que pode funcionar e como testar em pequeno."
        />
        {ideias.length === 0 ? (
          <EstadoVazio
            motivo="filtrado"
            titulo="Nenhuma ideia para este recorte"
            explicacao="Escolha outro assunto acima para ver as possibilidades que o sistema encontrou."
            acao={<Link href="/ideias">Ver todas as ideias</Link>}
          />
        ) : (
          <div className={proprios.grade}>
            {ideias.map((ideia) => (
              <CartaoIdeia
                key={ideia.id}
                titulo={ideia.titulo}
                etiqueta={ideia.etiqueta}
                oQuePercebemos={ideia.oQuePercebemos}
                ideia={ideia.ideia}
                porQuePodeFuncionar={ideia.porQuePodeFuncionar}
                comoTestar={ideia.comoTestar}
                baseDaSugestao={ideia.baseDaSugestao}
                acao={
                  <Link href={ideia.acao.rota} className={proprios.acaoLink}>
                    {ideia.acao.rotulo}
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className={proprios.honestidade}>
        <p className={proprios.tituloHonestidade}>O que já é real e o que ainda não é</p>
        <p className={proprios.textoHonestidade}>
          Nesta demonstração, nenhum modelo de inteligência artificial está lendo dados da sua empresa. As ideias
          acima foram construídas a partir dos dados de exemplo e mostram o formato que a análise vai ter: um sinal
          encontrado nos números, uma ação possível, o raciocínio por trás dela e um jeito de testar sem arriscar o
          mês.
        </p>
        <p className={proprios.textoHonestidade}>
          Quando ligada à base real, a análise passa a considerar histórico de vendas, produtos, clientes, preços,
          custos, estoque, frequência de compra, margens e as metas do negócio. Mesmo então, a regra continua a
          mesma: nenhuma sugestão sem explicação, e nenhum número inventado para parecer preciso.
        </p>
      </section>
    </div>
  );
}

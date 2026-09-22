import { Atencao, Cartao, Container, EstadoVazio, Etiqueta, Metrica } from "@/components/painel/primitivos";
import { Topo } from "@/components/painel/topo";
import { exigirAdmin } from "@/lib/admin/session";
import { A } from "@/lib/texts/admin";
import {
  eventoDemo, listar, opcoesFiltro, porHora, porModelo, porOrigem, porPrazo, porVendedor, resumo, revelacoesHoje, type Filtros,
} from "@/lib/demo/queries";
import { ExportarBotao } from "./exportar-botao";
import { Barras, Colunas, Leitura } from "./graficos";
import { Lista } from "./lista";

export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("pt-BR");
const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const parte = (valor: number, total: number) => (total > 0 ? pct.format(valor / total) : "—");

function diasAteAnonimizacao(inicio: Date, meses: number, agora = Date.now()) {
  const data = new Date(inicio);
  data.setMonth(data.getMonth() + meses);
  return Math.max(0, Math.ceil((data.getTime() - agora) / 86_400_000));
}

/**
 * Demo dashboard on invented data. The event is fixed to DEMO_SLUG inside
 * the queries; the URL only carries list filters and the page number.
 *
 * A tela segue a ordem de uma decisão: o que merece atenção → como estamos →
 * o que os sinais mostram → quem respondeu. Toda leitura em texto é calculada
 * a partir das mesmas consultas; nada é estimado nem inventado.
 */
export default async function DemoPage({ searchParams }: PageProps<"/demo">) {
  await exigirAdmin("/demo");
  const evento = await eventoDemo();
  if (!evento) {
    return (
      <>
        <Topo atual="demo" />
        <main id="conteudo" className="flex-1 py-10">
          <Container className="max-w-2xl">
            <EstadoVazio titulo={A.demo.semDados.titulo} descricao={A.demo.semDados.descricao} />
          </Container>
        </main>
      </>
    );
  }

  const sp = await searchParams;
  const um = (k: string) => (typeof sp[k] === "string" && sp[k] ? (sp[k] as string) : undefined);
  const filtros: Filtros = {
    vendedor: um("v"),
    modelo: um("m"),
    prazo: um("p"),
    consentimento: um("c") === "marketing" ? "marketing" : undefined,
    pagina: Math.max(1, Number.parseInt(um("pg") ?? "1", 10) || 1),
  };

  const [kpis, horas, vendedores, modelos, prazos, origens, revelacoes, opcoes, lista] = await Promise.all([
    resumo(evento.id), porHora(evento.id), porVendedor(evento.id), porModelo(evento.id), porPrazo(evento.id),
    porOrigem(evento.id), revelacoesHoje(), opcoesFiltro(evento.id), listar(evento.id, filtros),
  ]);

  const dataEvento = evento.inicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
  const diasRestantes = diasAteAnonimizacao(evento.inicio, evento.retencaoMeses);

  // Leituras derivadas das mesmas consultas — sem estimativa e sem projeção.
  const comPonto = vendedores.filter((v) => v.id);
  const semPonto = vendedores.find((v) => !v.id)?.total ?? 0;
  const identificadas = Math.max(0, kpis.total - semPonto);
  const lider = comPonto[0];
  const hoje = prazos.find((p) => p.rotulo === "Hoje")?.total ?? 0;
  const pico = horas.reduce<{ hora: number; total: number } | null>((a, h) => (a && a.total >= h.total ? a : h), null);
  const interesseTopo = modelos.find((m) => m.rotulo);

  const K = A.demo.kpis;
  const T = A.demo.atencao;

  return (
    <>
      <Topo atual="demo" />
      <main id="conteudo" className="flex-1 py-6 sm:py-8">
        <Container className="space-y-10 sm:space-y-12">
          <header>
            <Etiqueta tom="atencao">{A.demo.selo}</Etiqueta>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{A.demo.titulo}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{A.demo.subtitulo}</p>
            <p className="mt-3 text-sm font-medium">
              {evento.nome} · <span className="font-normal text-muted-foreground">{dataEvento}</span>
            </p>
          </header>

          {/* 1. O que merece atenção — só aparece o que os dados sustentam. */}
          <Secao id="atencao" titulo={T.titulo} descricao={T.descricao}>
            {hoje > 0 || semPonto > 0 || kpis.semMarketing > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {hoje > 0 && (
                  <Atencao titulo={T.hoje(hoje)} texto={T.hojeTexto} href="/demo?p=Hoje#lista" acao={T.verRespostas} />
                )}
                {semPonto > 0 && (
                  <Atencao tom="atencao" titulo={T.semPonto(semPonto)} texto={T.semPontoTexto} href="/demo?v=sem#lista" acao={T.verRespostas} />
                )}
                {kpis.semMarketing > 0 && (
                  <Atencao tom="perigo" titulo={T.semMarketing(kpis.semMarketing)} texto={T.semMarketingTexto} href="/demo#exportar" acao={T.semMarketingAcao} />
                )}
                <Atencao titulo={T.retencao(diasRestantes)} texto={T.retencaoTexto(evento.retencaoMeses)} />
              </ul>
            ) : (
              <EstadoVazio titulo={T.vazio.titulo} descricao={T.vazio.descricao} />
            )}
          </Secao>

          {/* 2. Como estamos — número, o que significa e de onde vem. */}
          <Secao id="indicadores" titulo={A.demo.indicadores.titulo} descricao={A.demo.indicadores.descricao}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <Metrica
                valor={fmt.format(kpis.total)}
                rotulo={K.total}
                contexto={comPonto.length ? K.totalContexto(comPonto.length) : undefined}
              />
              <Metrica
                destaque
                valor={fmt.format(kpis.ate3Meses)}
                rotulo={K.ate3Meses}
                contexto={kpis.total ? K.ate3MesesSub(parte(kpis.ate3Meses, kpis.total)) : K.semContexto}
              />
              <Metrica
                valor={dec.format(kpis.mediaPorVendedor)}
                rotulo={K.mediaVendedor}
                contexto={lider?.nome ? K.mediaVendedorContexto(lider.nome, lider.total) : undefined}
              />
              <Metrica
                valor={pct.format(kpis.taxaMarketing)}
                rotulo={K.taxaMarketing}
                contexto={
                  kpis.comMarketing + kpis.semMarketing > 0
                    ? K.taxaMarketingContexto(kpis.comMarketing, kpis.comMarketing + kpis.semMarketing)
                    : K.semContexto
                }
              />
            </div>
          </Secao>

          {/* 3. O que os sinais mostram — cada gráfico responde a uma pergunta. */}
          <Secao id="sinais" titulo={A.demo.sinais.titulo}>
            <div className="space-y-4">
              <Cartao nivel={3} titulo={A.demo.curva.titulo} descricao={A.demo.curva.sub}>
                <Colunas itens={horas} />
                {pico && kpis.total > 0 && <Leitura>{A.demo.curva.leitura(pico.hora, pico.total, parte(pico.total, kpis.total))}</Leitura>}
              </Cartao>

              <div className="grid gap-4 lg:grid-cols-2">
                <Cartao nivel={3} titulo={A.demo.ranking.titulo} descricao={A.demo.ranking.sub}>
                  <Barras
                    lado
                    destacarPrimeiro
                    itens={[
                      ...comPonto.map((v) => ({ rotulo: v.nome!, total: v.total })),
                      ...(semPonto > 0 ? [{ rotulo: A.demo.ranking.semVendedor, total: semPonto, apagado: true }] : []),
                    ]}
                  />
                  {lider?.nome && identificadas > 0 && (
                    <Leitura>{A.demo.ranking.leitura(lider.nome, parte(lider.total, identificadas))}</Leitura>
                  )}
                </Cartao>

                <Cartao nivel={3} titulo={A.demo.modelo.titulo}>
                  <Barras itens={modelos.map((m) => ({ rotulo: m.rotulo ?? A.demo.modelo.semResposta, total: m.total }))} />
                  {interesseTopo?.rotulo && kpis.total > 0 && (
                    <Leitura>{A.demo.modelo.leitura(interesseTopo.rotulo, parte(interesseTopo.total, kpis.total))}</Leitura>
                  )}
                </Cartao>

                <Cartao nivel={3} titulo={A.demo.prazo.titulo}>
                  <Barras itens={prazos.map((p) => ({ rotulo: p.rotulo ?? A.demo.prazo.semResposta, total: p.total }))} />
                </Cartao>

                <Cartao nivel={3} titulo={A.demo.origem.titulo} descricao={A.demo.origem.sub}>
                  <Barras itens={origens.map((o) => ({ rotulo: A.demo.origem.rotulos[o.rotulo] ?? o.rotulo, total: o.total }))} />
                </Cartao>
              </div>
            </div>
          </Secao>

          {/* 4. Quem respondeu — o detalhe, sempre mascarado por padrão. */}
          <Secao id="respostas" titulo={A.demo.lista.titulo} descricao={A.demo.lista.descricao}>
            <div className="space-y-4">
              <Cartao id="lista" className="scroll-mt-20" acao={<Etiqueta>{A.demo.lista.revelacoesHoje(revelacoes)}</Etiqueta>}>
                <Lista itens={lista.itens} total={lista.total} paginas={lista.paginas} filtros={filtros} opcoes={opcoes} />
              </Cartao>

              <Cartao id="exportar" nivel={3} titulo={A.demo.exportar.titulo} className="scroll-mt-20">
                <ExportarBotao comMarketing={kpis.comMarketing} semMarketing={kpis.semMarketing} />
              </Cartao>
            </div>
          </Secao>
        </Container>
      </main>
    </>
  );
}

/** Bloco da página: um título, uma pergunta respondida. */
function Secao({ id, titulo, descricao, children }: { id: string; titulo: string; descricao?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="text-xl font-semibold tracking-tight sm:text-2xl">
        {titulo}
      </h2>
      {descricao && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{descricao}</p>}
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

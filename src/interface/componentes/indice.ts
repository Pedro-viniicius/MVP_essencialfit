/**
 * Sistema de design: ponto unico de entrada dos componentes de interface.
 *
 * Regra desta pasta (verificada por `pnpm verificar:arquitetura`): nenhum
 * componente aqui conhece modulo de negocio, banco de dados ou nucleo.
 * Eles recebem dados ja prontos da camada de apresentacao. Ver ADR-024.
 */
export { AcaoRapida, type AcaoRapidaProps } from "./acao-rapida/acao-rapida";
export { Aviso, type AvisoProps } from "./aviso/aviso";
export { BarraProporcao, type BarraProporcaoProps, type ItemDeProporcao } from "./barra-proporcao/barra-proporcao";
export { BarraFiltros, type BarraFiltrosProps, type FichaDeFiltro } from "./barra-filtros/barra-filtros";
export { Botao, type BotaoProps, type VarianteBotao } from "./botao/botao";
export { CabecalhoPagina, type CabecalhoPaginaProps } from "./cabecalho-pagina/cabecalho-pagina";
export { CabecalhoPainel, type CabecalhoPainelProps } from "./cabecalho-painel/cabecalho-painel";
export { CampoDinheiro, type CampoDinheiroProps } from "./campo-dinheiro/campo-dinheiro";
export { CampoFormulario, type AtributosDoControle, type CampoFormularioProps } from "./campo-formulario/campo-formulario";
export { CartaoIdeia, type CartaoIdeiaProps } from "./cartao-ideia/cartao-ideia";
export { CartaoIndicador, type CartaoIndicadorProps, type DirecaoVariacao } from "./cartao-indicador/cartao-indicador";
export { CartaoInsight, type CartaoInsightProps, type NumeroDeApoio } from "./cartao-insight/cartao-insight";
export { CartaoProgresso, type CartaoProgressoProps } from "./cartao-progresso/cartao-progresso";
export { CartaoRegistro, type CartaoRegistroProps, type DadoDoRegistro } from "./cartao-registro/cartao-registro";
export { CartaoResumo, type CartaoResumoProps } from "./cartao-resumo/cartao-resumo";
export { DialogoConfirmacao, type DialogoConfirmacaoProps } from "./dialogo-confirmacao/dialogo-confirmacao";
export { Esqueleto, type EsqueletoProps } from "./esqueleto/esqueleto";
export {
  AcoesFormularioSimples,
  ControleTexto,
  FormularioSimples,
  LigacoesFormularioSimples,
  TituloFormularioSimples,
} from "./formulario-simples/formulario-simples";
export { EstadoVazio, type EstadoVazioProps } from "./estado-vazio/estado-vazio";
export { Gaveta, type GavetaProps } from "./gaveta/gaveta";
export { GraficoBarras, type BarraDoGrafico, type GraficoBarrasProps } from "./grafico-barras/grafico-barras";
export { LinhaDoTempo, type EventoDaLinhaDoTempo, type LinhaDoTempoProps } from "./linha-do-tempo/linha-do-tempo";
export { MatrizGiroMargem, type MatrizGiroMargemProps, type ProdutoNaMatriz } from "./matriz-giro-margem/matriz-giro-margem";
export { SecaoFormulario, type SecaoFormularioProps } from "./secao-formulario/secao-formulario";
export { SeletorEntidade, type OpcaoEntidade, type SeletorEntidadeProps } from "./seletor-entidade/seletor-entidade";
export { SeloSituacao, type SeloSituacaoProps, type TomSemantico } from "./selo-situacao/selo-situacao";
export {
  TabelaDados,
  type AlinhamentoColuna,
  type ColunaTabela,
  type OrdenacaoTabela,
  type TabelaDadosProps,
} from "./tabela-dados/tabela-dados";
export { TituloSecao, type TituloSecaoProps } from "./titulo-secao/titulo-secao";
export { ValorFinanceiro, type ValorFinanceiroProps } from "./valor-financeiro/valor-financeiro";

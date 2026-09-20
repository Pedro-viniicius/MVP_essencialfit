import Link from "next/link";

import { AcaoRapida, Aviso, CabecalhoPainel, TituloSecao } from "@/interface/componentes/indice";
import { exigirContextoAplicacao, ROTAS } from "@/nucleo/empresas/publico";

import estilos from "./inicio.module.css";

/**
 * Inicio do sistema autenticado.
 *
 * A tela cheia (docs/ux/dashboard.md) depende dos casos de uso de caixa,
 * contas e previsao, que chegam nos Gates 6 e 7. Ate la, esta tela e honesta:
 * ela nao inventa numero. O que ela faz e levar quem entrou para onde a
 * experiencia completa ja pode ser vista — a area de demonstracao.
 */
export default async function PaginaInicio() {
  const { empresaAtiva, sessao } = await exigirContextoAplicacao(ROTAS.inicio);
  const nomeDaEmpresa = empresaAtiva.nomeFantasia ?? empresaAtiva.nome;
  const primeiroNome = sessao.nome.split(" ")[0] ?? sessao.nome;

  return (
    <div className={estilos.pagina}>
      <CabecalhoPainel
        etiqueta="Início"
        pergunta={`Como está a ${nomeDaEmpresa} hoje?`}
        resposta={`Olá, ${primeiroNome}. Ainda não há movimentações registradas nesta empresa — quando houver, esta tela mostra o disponível de hoje, o que precisa de atenção e os próximos sete dias.`}
        acoes={<Link href="/demonstracoes/inicio">Ver a experiência completa →</Link>}
      />

      <Aviso tom="informacao" titulo="Esta empresa ainda não tem dados financeiros">
        Cadastre contas, bancos e movimentações para que os números apareçam aqui. Enquanto isso, a área de
        demonstração mostra as mesmas telas preenchidas com dados de exemplo.
      </Aviso>

      <section className={estilos.secao}>
        <TituloSecao
          titulo="Enquanto isso, conheça o que o sistema faz"
          explicacao="Os mesmos componentes e a mesma navegação, com dados de exemplo."
        />
        <div className={estilos.grade}>
          <AcaoRapida
            destaque
            marca="De"
            titulo="Área de demonstração"
            descricao="Formulários, painéis e ideias reunidos em um só lugar."
            rota="/demonstracoes"
            chamada="Abrir demonstração"
          />
          <AcaoRapida
            marca="Id"
            titulo="Painéis"
            descricao="O mesmo negócio visto por três perguntas diferentes."
            rota="/demonstracoes/paineis"
            chamada="Ver painéis"
          />
          <AcaoRapida
            marca="IA"
            titulo="Ideias IA"
            descricao="Como dados podem virar possibilidades de ação para o negócio."
            rota="/ideias"
            chamada="Explorar ideias"
          />
        </div>
      </section>
    </div>
  );
}

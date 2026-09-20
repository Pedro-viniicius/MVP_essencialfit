"use client";

import { useState } from "react";

import {
  Aviso,
  Botao,
  CampoFormulario,
  SecaoFormulario,
} from "@/interface/componentes/indice";

import { INTERESSES, OBJETIVOS } from "../../../dados/clientes";
import estilos from "./formulario.module.css";

interface DadosDoCliente {
  nome: string;
  telefone: string;
  ehWhatsapp: boolean;
  email: string;
  nascimento: string;
  objetivo: string;
  interesses: string[];
  preferenciaDeContato: string;
  ultimoAtendimento: string;
  observacoes: string;
}

const INICIAL: DadosDoCliente = {
  nome: "",
  telefone: "",
  ehWhatsapp: true,
  email: "",
  nascimento: "",
  objetivo: "",
  interesses: [],
  preferenciaDeContato: "WhatsApp",
  ultimoAtendimento: "",
  observacoes: "",
};

/**
 * Formulario 1 — Cliente: "Quem e essa pessoa e como podemos atende-la melhor?"
 *
 * Filosofia desta tela: acolher. Ela e dividida em quatro secoes curtas, tem
 * apenas dois campos obrigatorios e explica para que serve cada informacao
 * delicada (aniversario, objetivo). Ninguem deve sentir que esta preenchendo
 * ficha de cartorio para comprar whey.
 */
export function FormularioCliente() {
  const [dados, definirDados] = useState<DadosDoCliente>(INICIAL);
  const [erros, definirErros] = useState<Partial<Record<keyof DadosDoCliente, string>>>({});
  const [salvo, definirSalvo] = useState<string | null>(null);
  const [enviando, definirEnviando] = useState(false);

  function alterar<C extends keyof DadosDoCliente>(campo: C, valor: DadosDoCliente[C]) {
    definirDados((atual) => ({ ...atual, [campo]: valor }));
    definirErros((atuais) => {
      const restantes = { ...atuais };
      delete restantes[campo];
      return restantes;
    });
    definirSalvo(null);
  }

  function alternarInteresse(interesse: string) {
    definirDados((atual) => ({
      ...atual,
      interesses: atual.interesses.includes(interesse)
        ? atual.interesses.filter((item) => item !== interesse)
        : [...atual.interesses, interesse],
    }));
  }

  function validar(): boolean {
    const encontrados: Partial<Record<keyof DadosDoCliente, string>> = {};
    if (dados.nome.trim().length < 3) encontrados.nome = "Escreva o nome como a pessoa gosta de ser chamada.";
    if (dados.telefone.replace(/\D/g, "").length < 10) {
      encontrados.telefone = "Informe o telefone com DDD — é por ele que o contato acontece.";
    }
    if (dados.email !== "" && !dados.email.includes("@")) encontrados.email = "Este e-mail parece incompleto.";
    definirErros(encontrados);
    return Object.keys(encontrados).length === 0;
  }

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!validar()) return;
    definirEnviando(true);
    // Demonstracao: nada e gravado. O atraso existe so para mostrar o botao ocupado.
    window.setTimeout(() => {
      definirEnviando(false);
      definirSalvo(dados.nome.trim());
      definirDados(INICIAL);
    }, 500);
  }

  return (
    <form className={estilos.formulario} onSubmit={enviar} noValidate>
      {salvo ? (
        <Aviso tom="sucesso" titulo={`${salvo} foi cadastrado`}>
          Na demonstração nada é gravado. No sistema real, a pessoa já apareceria na busca de clientes e nas
          sugestões de contato.
        </Aviso>
      ) : null}

      <SecaoFormulario titulo="Dados pessoais" explicacao="O mínimo para conseguir falar com a pessoa depois.">
        <div className={estilos.duplo}>
          <CampoFormulario id="nome" rotulo="Nome" obrigatorio {...(erros.nome ? { erro: erros.nome } : {})}>
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="text"
                autoComplete="name"
                value={dados.nome}
                onChange={(evento) => alterar("nome", evento.target.value)}
              />
            )}
          </CampoFormulario>

          <CampoFormulario
            id="telefone"
            rotulo="Telefone"
            obrigatorio
            dica="Com DDD. Ex.: (35) 99812-4471"
            {...(erros.telefone ? { erro: erros.telefone } : {})}
          >
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={dados.telefone}
                onChange={(evento) => alterar("telefone", evento.target.value)}
              />
            )}
          </CampoFormulario>
        </div>

        <label className={`${estilos.opcao} ${dados.ehWhatsapp ? estilos.opcaoMarcada : ""}`}>
          <input
            type="checkbox"
            checked={dados.ehWhatsapp}
            onChange={(evento) => alterar("ehWhatsapp", evento.target.checked)}
          />
          Este número também é WhatsApp
        </label>

        <div className={estilos.duplo}>
          <CampoFormulario
            id="email"
            rotulo="E-mail"
            dica="Opcional. Serve para recibo e novidades."
            {...(erros.email ? { erro: erros.email } : {})}
          >
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="email"
                autoComplete="email"
                value={dados.email}
                onChange={(evento) => alterar("email", evento.target.value)}
              />
            )}
          </CampoFormulario>

          <CampoFormulario
            id="nascimento"
            rotulo="Data de nascimento"
            dica="Usada só para lembrar do aniversário — nunca para cobrar nada."
          >
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="date"
                value={dados.nascimento}
                onChange={(evento) => alterar("nascimento", evento.target.value)}
              />
            )}
          </CampoFormulario>
        </div>
      </SecaoFormulario>

      <SecaoFormulario
        titulo="Objetivos"
        explicacao="É o que permite sugerir o produto certo em vez de empurrar o que está encalhado."
      >
        <CampoFormulario id="objetivo" rotulo="Objetivo principal" dica="Escolha o que mais se aproxima do que a pessoa busca.">
          {(atributos) => (
            <select
              {...atributos}
              className={estilos.controle}
              value={dados.objetivo}
              onChange={(evento) => alterar("objetivo", evento.target.value)}
            >
              <option value="">Ainda não sei</option>
              {OBJETIVOS.map((objetivo) => (
                <option key={objetivo} value={objetivo}>
                  {objetivo}
                </option>
              ))}
            </select>
          )}
        </CampoFormulario>

        <fieldset>
          <legend className={estilos.rodapeAjuda}>Interesses (pode marcar mais de um)</legend>
          <div className={estilos.opcoes}>
            {INTERESSES.map((interesse) => {
              const marcado = dados.interesses.includes(interesse);
              return (
                <label key={interesse} className={`${estilos.opcao} ${marcado ? estilos.opcaoMarcada : ""}`}>
                  <input type="checkbox" checked={marcado} onChange={() => alternarInteresse(interesse)} />
                  {interesse}
                </label>
              );
            })}
          </div>
        </fieldset>
      </SecaoFormulario>

      <SecaoFormulario titulo="Relacionamento" explicacao="Como e quando falar com esta pessoa.">
        <div className={estilos.duplo}>
          <CampoFormulario id="preferencia" rotulo="Preferência de contato">
            {(atributos) => (
              <select
                {...atributos}
                className={estilos.controle}
                value={dados.preferenciaDeContato}
                onChange={(evento) => alterar("preferenciaDeContato", evento.target.value)}
              >
                <option>WhatsApp</option>
                <option>Ligação</option>
                <option>E-mail</option>
                <option>Só na loja</option>
              </select>
            )}
          </CampoFormulario>

          <CampoFormulario id="ultimo-atendimento" rotulo="Data do último atendimento" dica="Deixe em branco se este é o primeiro.">
            {(atributos) => (
              <input
                {...atributos}
                className={estilos.controle}
                type="date"
                value={dados.ultimoAtendimento}
                onChange={(evento) => alterar("ultimoAtendimento", evento.target.value)}
              />
            )}
          </CampoFormulario>
        </div>
      </SecaoFormulario>

      <SecaoFormulario titulo="Observações" explicacao="O que você lembraria se a pessoa entrasse na loja amanhã." recolhida>
        <CampoFormulario id="observacoes" rotulo="Anotações sobre o atendimento">
          {(atributos) => (
            <textarea
              {...atributos}
              className={estilos.area}
              value={dados.observacoes}
              placeholder="Ex.: treina de manhã, prefere sabor baunilha, está voltando depois de uma lesão."
              onChange={(evento) => alterar("observacoes", evento.target.value)}
            />
          )}
        </CampoFormulario>
      </SecaoFormulario>

      <div className={estilos.acoes}>
        <Botao type="submit" variante="primario" ocupado={enviando} rotuloOcupado="Salvando...">
          Salvar cliente
        </Botao>
        <Botao
          type="button"
          variante="discreto"
          onClick={() => {
            definirDados(INICIAL);
            definirErros({});
            definirSalvo(null);
          }}
        >
          Limpar
        </Botao>
        <span className={estilos.rodapeAjuda}>Só nome e telefone são obrigatórios. O resto pode vir com o tempo.</span>
      </div>
    </form>
  );
}

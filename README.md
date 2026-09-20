# Financeiro

Plataforma web de gestao financeira para micro, pequenas e medias empresas
brasileiras e escritorios de BPO financeiro: operacao financeira, tesouraria
e controle gerencial.

> **Organizar a operacao financeira, mostrar a situacao real da empresa e
> transformar dados financeiros em decisoes compreensiveis.**

## Estado do projeto

| Gate | Entrega | Status |
|---|---|---|
| 1 | Produto e Dominio | concluido — [`docs/produto/`](docs/produto/README.md), [`docs/domain.md`](docs/domain.md) |
| 2 | Arquitetura | concluido — [`docs/arquitetura/`](docs/arquitetura/LEIA-ME.md), [`docs/decisoes/`](docs/decisoes/LEIA-ME.md) |
| 3 | Modelo de Dados | concluido — [`docs/modelo-dados/`](docs/modelo-dados/LEIA-ME.md), [`src/banco-dados/`](src/banco-dados/LEIA-ME.md) |
| 4 | UX, Arquitetura de Informacao e Sistema de Interface | concluido — [`docs/ux/`](docs/ux/LEIA-ME.md), [`src/interface/`](src/interface/LEIA-ME.md), ADR-020 a 024 |
| 5 | Fundacao: autenticacao, primeiro acesso, empresa ativa | concluido — [`docs/arquitetura/autenticacao-e-empresa-ativa.md`](docs/arquitetura/autenticacao-e-empresa-ativa.md), ADR-025 |
| 6 | Operacao Financeira | proximo |
| 7 | Tesouraria | — |
| 8 | Controle Gerencial | — |
| 9 | Analises (IA) | — |
| 10 | Prontidao para producao | — |

## Arquitetura em uma frase

> Monolito modular, orientado por dominio, single-tenant por instalacao,
> multiempresa internamente, usando Next.js + TypeScript + PostgreSQL + Drizzle.

Leia [`docs/arquitetura/visao-geral.md`](docs/arquitetura/visao-geral.md).

## Comecando (desenvolvimento)

Requisitos: Node.js 22+, pnpm 12, Docker (para o PostgreSQL).

```
pnpm install
cp .env.exemplo .env                 # ajuste BANCO_URL etc.
docker run -d --name financeiro-pg -e POSTGRES_DB=financeiro -e POSTGRES_USER=financeiro_admin \
  -e POSTGRES_PASSWORD=admin -p 127.0.0.1:5432:5432 \
  -v "$PWD/scripts/banco/criar-usuarios.sql:/docker-entrypoint-initdb.d/10-criar-usuarios.sql:ro" \
  postgres:17-alpine
pnpm banco:migrar                    # aplica migracoes
pnpm dev                             # http://localhost:3000
pnpm tarefas:executar                # em outro terminal: processo de tarefas
```

Demonstracao: `http://localhost:3000/demonstracoes` abre a area de
apresentacao (formularios, paineis e Ideias IA com dados de exemplo). Ela nao
exige sessao, banco de dados nem `.env` — ver
[`src/app/(demonstracao)/LEIA-ME.md`](src/app/(demonstracao)/LEIA-ME.md).
A identidade visual fica em [`src/interface/marca/`](src/interface/marca/LEIA-ME.md).

Primeiro uso: `http://localhost:3000` leva a `/entrar` → "Criar a primeira
conta" (`/criar-conta`) → `/primeiro-acesso` (cadastra a empresa; voce vira
administrador) → `/inicio`. Fluxo completo em
[`docs/arquitetura/autenticacao-e-empresa-ativa.md`](docs/arquitetura/autenticacao-e-empresa-ativa.md).

Verificacoes (o que a CI roda):

```
pnpm verificar:tudo    # lint + tipos + arquitetura + testes + licencas + build
```

## Estrutura

```
src/
  app/            rotas e telas (Next.js); (publico)/ entrar e criar conta,
                  (autenticado)/ primeiro acesso, (aplicacao)/ tudo dentro da casca,
                  (demonstracao)/ area de apresentacao com dados de exemplo
  proxy.ts        repassa a rota pedida em cabecalho; nao decide acesso
  interface/      sistema de design: tokens, marca, componentes, formatacao, casca
  composicao/     escolha de provedores concretos
  modulos/        modulos de negocio (contas-pagar, bancos, dre, orcamento...)
  nucleo/         autenticacao, autorizacao, auditoria, empresas, eventos, tarefas...
  integracoes/    portas e adaptadores (bancos, contabil, e-mail, webhooks, IA)
  compartilhado/  Dinheiro, DataCivil, erros, validacao, tipos
  banco-dados/    esquemas agregados, migracoes e testes de integracao
docs/             produto, dominio, arquitetura, modelo-dados, ux, decisoes (ADR), seguranca, licenciamento
scripts/          backup, restauracao, usuarios do banco, licencas
```

Cada pasta tem um `LEIA-ME.md`. Nomes em portugues, sem acentos em
identificadores (ADR-016).

## Implantacao

`docker compose up -d` com `.env` preenchido. Modelos A (gerido), B (nuvem do
cliente) e C (servidor local) em
[`docs/arquitetura/modelos-deploy.md`](docs/arquitetura/modelos-deploy.md).

## Licenca

Software proprietario. Licenca perpetua por versao principal; ver
[`docs/licenciamento.md`](docs/licenciamento.md).

# Essencial Fit — experiência NFC + QR Code

Experiência física → digital da Essencial Fit: cartões NFC + QR Code, coleta
estruturada, painel e leitura dos sinais deixados pelas pessoas. Este repositório
reúne a apresentação (`/`) e a captura pública (`/f/essencial-fit`).

## Rodar só para ver as telas

```bash
pnpm install && pnpm dev   # http://localhost:3000
```

Sem `.env`, sem banco, sem serviço externo: o modo de teste atende tudo com
dados fictícios em memória e o `/admin/login` ganha um botão de entrada direta.
Como desligar e o que configurar para valer: [MOCKS.md](MOCKS.md).

## Landing (`/`)

Página única, estática, em pt-BR: hero com demonstração animada (toque →
página → resposta → registro → indicador), seletor "Um cartão. Infinitas
funções.", fluxo físico → dado → decisão, aplicações, personalização, painel
de exemplo (dados ilustrativos, sinalizados), IA como camada de interpretação,
privacidade/LGPD, preço inicial, FAQ e formulário de contato.

- Copy e dados de exemplo: `src/lib/site/conteudo.ts` (um arquivo, revisável de uma vez).
- Componentes: `src/components/site/`. Só três são client components (demonstração
  do hero, seletor de funções, menu de celular) mais o formulário de contato.
- Tokens visuais e animações: `src/app/globals.css`, escopo `.site` (verde profundo,
  acento energético e neutros quentes; `prefers-reduced-motion` desliga tudo).
- Formulário de contato: server action em `src/components/site/contato/actions.ts`,
  grava em `solicitacoes_contato` (migração `drizzle/0002`), 3 envios/hora por IP
  (hash), campo-isca contra robôs, texto de consentimento versionado. A página
  renderiza sem banco; só o envio precisa de `DATABASE_URL`.
- SEO: `robots index` apenas na landing (o restante segue `noindex`), canonical e
  OpenGraph a partir de `NEXT_PUBLIC_SITE_URL`, imagem em `src/app/opengraph-image.tsx`,
  FAQ em JSON-LD.

## Essencial Fit — captura pública (`/f/essencial-fit`)

Formulário curto da Essencial Fit. A pessoa encosta o celular no cartão NFC ou lê
o QR Code, responde sobre seu interesse e recebe a confirmação da participação.

Site configurado por `NEXT_PUBLIC_SITE_URL`.

> README completo (rodar local, seed, vendedores, exportação, plano de contingência)
> chega na etapa de hardening. Esta seção já é definitiva.

## Dia do evento

### Qual banco está no ar? (5 segundos)

Cada banco Neon tem um endereço próprio, `ep-xxx.sa-east-1.aws.neon.tech`.
O sistema imprime esse endereço (nunca a senha) em dois lugares. Se os dois
forem iguais, terminal e site estão falando com o mesmo banco.

1. **O que o site está usando** — Vercel → projeto da Essencial Fit → **Logs** →
   pesquise `banco de dados`. A linha mostra `"host":"ep-xxx…"`. Ela é gravada
   quando a função sobe, então se não aparecer, abra o formulário uma vez e
   pesquise de novo.
2. **O que o seu terminal está usando** — na pasta do projeto:

   ```bash
   pnpm db:whoami:prod
   ```

   Imprime `→ lendo de ep-xxx… (arquivo: .env.producao)`, os eventos, o número
   de vendedores e de leads (com a hora do último). É só leitura e apaga o
   arquivo de credenciais ao terminar.

Para saber a qual branch o `ep-xxx` pertence: Neon → projeto → **Branches** →
cada branch lista o seu endpoint. `pnpm db:whoami` (sem `:prod`) mostra o banco
do `.env` local, que deve ser a branch `dev`.

Todo script que escreve no banco (`db:seed`, `anonimizar`) começa com a linha
`→ escrevendo em ep-xxx… (arquivo: …)`. Se o `ep-` não for o de produção quando
deveria ser (ou for, quando não deveria), Ctrl-C.

## Painel (`/admin`) e demonstração (`/demo`)

O acesso é por senha + código de 6 dígitos do aplicativo autenticador (TOTP).
Guia do operador — primeiro acesso, login diário, celular novo, rotação da
chave — em [`docs/admin-acesso.md`](docs/admin-acesso.md). Resumo dos comandos:

```bash
pnpm totp:enroll             # gera a chave TOTP (recusa se já existir)
pnpm totp:enroll -- --rotate # troca a chave conscientemente
pnpm totp:code               # código atual, para testar o login localmente
```

Variáveis: `ADMIN_PASSWORD` (16+), `ADMIN_TOTP_SECRET` (base32), `SESSION_SECRET`
(`openssl rand -hex 32`). Sem qualquer uma delas o login fica fechado.

### `/demo` — painel de gestão com dados fictícios

Mostra ao cliente o que o painel faz com os dados capturados, usando um evento
inventado (`slug = demo`, sempre inativo, nunca recebe cadastros reais):

```bash
pnpm db:seed:demo             # cria o evento demo com ~220 cadastros inventados
pnpm db:seed:demo --purge     # apaga o evento demo e tudo que pertence a ele
pnpm db:seed:demo:prod        # o mesmo, contra a produção (pede confirmação visual do host)
```

Nomes, telefones (`(DD) 90xxx-xxxx`, faixa que a Anatel não atribui) e e-mails
(`@example.com`) são gerados; nenhum dado real aparece na tela. Todas as
consultas são filtradas pelo evento demo — a URL só carrega filtros da lista.

O que a tela demonstra de LGPD: dados pessoais mascarados por padrão; "Revelar"
grava `auditoria.acao = 'dado_revelado'`; a exportação CSV só inclui quem
consentiu marketing (o contrário exige marcar a opção explicitamente) e grava
`auditoria.acao = 'exportacao'`; quem não consentiu marketing aparece como "Não
contatar por campanha"; o prazo de anonimização fica visível.

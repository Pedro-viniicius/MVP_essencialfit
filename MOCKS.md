# Modo de teste (sem `.env`, sem banco, sem serviço externo)

Serve para conferir a interface: o projeto sobe com um comando, todas as telas
abrem e os fluxos principais funcionam de ponta a ponta — só que o que estaria
no Postgres fica em memória.

O código de integração real **não foi removido nem alterado na sua lógica**. Cada
função de acesso a dados ganhou uma linha no começo que desvia para a versão em
memória enquanto a flag estiver ligada. Desligou a flag, o caminho real volta a
ser o único.

## Como rodar

```bash
pnpm install
pnpm dev
```

Abra **http://localhost:3000**.

> Use `localhost`, não `127.0.0.1`: no `next dev` o runtime do cliente se liga a
> `localhost`, e pelo IP a página abre mas não hidrata (nenhum clique responde).
> Em `pnpm build && pnpm start` os dois endereços funcionam.

Nenhum arquivo `.env` é necessário. Se já existir um `.env.local`, ele continua
sendo lido — o modo de teste só preenche o que estiver faltando e nunca
sobrescreve o que você definiu.

## Por onde começar

| Tela | Endereço | O que dá para testar |
| --- | --- | --- |
| Landing | `/` | Narrativa, preço, FAQ e o formulário de contato (envia de verdade, para a memória) |
| Captura pública | `/f/essencial-fit` | Formulário completo, validação, cupom, duplicado, evento encerrado |
| Modo atendimento | `/f/essencial-fit?o=manual&v=03` | Balcão: o formulário volta em branco para a próxima pessoa |
| Evento encerrado | `/f/demo` | Estado de evento inativo |
| Privacidade | `/privacidade` | Texto da política |
| Login do painel | `/admin/login` | Botão **Entrar como usuário de teste** (ou qualquer senha e qualquer código) |
| Painel | `/admin` | Estado vazio do painel real |
| Demonstração | `/demo` | Atenção, indicadores, gráficos, lista com filtros, revelar, exportar CSV |

## O que está fictício

| Serviço real | No modo de teste | Onde |
| --- | --- | --- |
| Postgres/Neon via Drizzle | Arrays em memória | `src/lib/mock/loja.ts` |
| Consultas do painel (`/demo`) | Mesmo formato, mesma ordenação, dados inventados | `src/lib/demo/queries.ts` |
| Evento do formulário público | Dois eventos fixos: `essencial-fit` (aberto) e `demo` (encerrado) | `src/lib/db/queries.ts` |
| Gravação de cadastro | Guarda na memória, com as mesmas regras (idempotência, telefone repetido, ponto desconhecido) | `src/lib/leads/criar-lead.ts` |
| Trilha de auditoria | Lista em memória; alimenta "revelações hoje" | `src/lib/admin/audit.ts` |
| Login do admin (senha + TOTP) | Qualquer senha e qualquer código entram; há um botão de atalho | `src/app/(painel)/admin/login/actions.ts` |
| Limite de cadastros por IP | Desligado, para não trancar quem está testando | `src/lib/security/rate-limit.ts` |
| Pedido de contato da landing | Guarda na memória | `src/components/site/contato/actions.ts` |

Os dados de demonstração são os mesmos que `pnpm db:seed:demo` grava no banco:
218 cadastros num sábado de evento, oito pontos de captura com desempenhos
diferentes e pico das 14h às 17h. O sorteio usa semente fixa, então a história é
idêntica a cada execução — um link com filtro continua válido depois de
reiniciar. Nada ali é real: os nomes vêm de listas combinadas, os telefones usam
a faixa `9 0xxxx-xxxx` que a Anatel nunca alocou e os e-mails são `example.com`.

**O que você cadastrar durante o teste vive enquanto o servidor estiver de pé.**
Ao reiniciar, tudo volta ao estado inicial.

## Voltar aos serviços reais

1. Em `src/lib/mock/config.ts`, troque `const PADRAO = true` por `false`.
   (Ou, sem editar código, exporte `USAR_MOCKS=false` no ambiente.)
2. Preencha o `.env.local` a partir do `.env.example`:

   | Variável | Para quê | Sem ela |
   | --- | --- | --- |
   | `DATABASE_URL` | Conexão do Neon (endpoint com pool) | Nada que toque o banco funciona |
   | `NEXT_PUBLIC_SITE_URL` | Canonical, OpenGraph e cupom | Cai em `http://localhost:3000` |
   | `IP_HASH_SALT` | Hash do IP (`openssl rand -hex 32`) | O IP simplesmente não é gravado |
   | `SESSION_SECRET` | Assina o cookie do `/admin` (32+ caracteres) | O login não abre |
   | `ADMIN_PASSWORD` | Senha do painel (16+ caracteres) | O login não abre |
   | `ADMIN_TOTP_SECRET` | Chave do autenticador (`pnpm totp:enroll`) | O login não abre |
   | `LIMITE_POR_MINUTO` / `LIMITE_POR_HORA` | Opcionais; padrão 5 e 30 | Usa o padrão |

3. Rode as migrações e os seeds:

   ```bash
   pnpm db:migrate
   pnpm db:seed        # evento aberto + pontos de captura
   pnpm db:seed:demo   # dados de demonstração do /demo
   ```

Num deploy na Vercel o modo de teste já fica desligado sozinho, mesmo com
`PADRAO = true`: a variável `VERCEL` denuncia o ambiente e o painel nunca sobe
sem senha por descuido.

## Publicar como vitrine na Vercel

Para o site no ar mostrar a interface sem banco nenhum, defina **`USAR_MOCKS=true`**
nas variáveis do projeto na Vercel. Essa escolha explícita vence a proteção acima,
e o `vercel-build` (`scripts/vercel-build.sh`) pula a migração — sem ela, o build
falharia na hora de migrar um banco que não existe.

Três coisas para saber antes:

- **O `/admin` fica aberto.** Sem senha e sem autenticador, para qualquer pessoa
  com o endereço. Os dados são fictícios e o `/admin` em si é um estado vazio,
  mas o endereço é público.
- **O que for cadastrado no ar não persiste.** Cada instância da função tem a sua
  própria memória: um cadastro feito numa requisição pode não aparecer na
  seguinte, e some a cada instância reciclada. Serve para demonstrar as telas,
  não para receber cadastro de verdade.
- **Os números do `/demo` são sempre os mesmos.** É a semente fixa: 218 cadastros,
  o mesmo pico, o mesmo líder. Bom para apresentar, inútil como relatório.

Para voltar a publicar de verdade, remova `USAR_MOCKS` das variáveis da Vercel.
O build passa a migrar e a compilar como antes, sem mais nenhuma mudança.

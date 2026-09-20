# Area de demonstracao

Telas completas, com dados de exemplo, para apresentar o produto a um cliente.

**Nao exige sessao, nem banco de dados, nem `.env`.** Isso e proposital: a
demonstracao precisa abrir em qualquer maquina, na hora, com `pnpm dev`. O
sistema real continua atras de `/entrar` e nao foi alterado.

## Estrutura

```
(demonstracao)/
  layout.tsx                    casca propria (CascaDemonstracao)
  demonstracao.module.css       grades e blocos compartilhados pelas telas
  dados/                        dados de exemplo (nao e rota: nao tem page.tsx)
  demonstracoes/
    page.tsx                    "Experimente o sistema" — entrada da apresentacao
    inicio/                     "Como esta a Essencial Fit hoje?"
    formularios/                capa + cliente, venda, produto
    paineis/                    capa + visao-geral, clientes, produtos
    estoque/                    reposicao e dinheiro parado
    configuracoes/              identidade visual e onde a marca mora
  ideias/                       Ideias IA (aceita ?foco=resultado|clientes|estoque|preco)
```

## Os dados

`dados/` guarda produtos, clientes, resultados e ideias em valores canonicos
("219.90"), como no resto do sistema. Os numeros fecham entre si — faturamento
e a soma de preco x unidades, ticket medio e faturamento / vendas — e
`dados/dados.teste.ts` trava essa coerencia. Se alguem mudar um preco sem
mudar o resumo, o teste falha.

Para ligar estas telas a dados reais, troque a origem em `dados/`: as paginas
recebem tudo pronto e nao sabem de onde veio.

## O que e simulado

Nada e gravado: os formularios validam, calculam e confirmam na tela, mas nao
tocam no banco. Nenhum pagamento e processado, nenhuma mensagem e enviada e
nenhum modelo de IA le dados — a propria tela de Ideias IA diz isso ao usuario.

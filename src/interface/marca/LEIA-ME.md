# Marca

Tudo o que identifica a empresa dona da instalacao. O resto do sistema nao
escreve nome, cor, raio ou sombra: le daqui.

| Arquivo | O que guarda |
|---|---|
| `identidade.ts` | Nome, nome curto, sigla, assinatura, descricao e as perguntas que dao titulo as telas. |
| `tema-essencial-fit.css` | Cores, raio dos cantos, sombras e tipografia. Redefine os tokens de `../tokens/tokens.css`. |
| `logotipo.tsx` | Simbolo em SVG inline + nome. As cores vem de tokens, entao o simbolo acompanha a troca de tema. |
| `indice.ts` | Ponto unico de entrada. |

## Como vestir o sistema com outra marca

1. Copie `tema-essencial-fit.css` para `tema-<nome-da-marca>.css` e troque os
   valores. Nenhum componente precisa ser tocado.
2. Troque o `@import` em `../estilos/global.css` para o novo arquivo.
3. Ajuste `identidade.ts` (nome, sigla, assinatura, `arquivoDeTema`).
4. Se o vocabulario do menu mudar, ajuste `../casca/mapa-navegacao-demonstracao.ts`
   (area de demonstracao) e `../casca/mapa-navegacao.ts` (sistema autenticado).

`marca.teste.tsx` falha se alguem voltar a fixar o nome da marca dentro de um
componente — que e exatamente o que impediria a troca.

## Regras

- O tema so redefine tokens ja existentes; ele nao inventa nome de variavel
  que os componentes nao conhecem.
- `tokens.css` continua com um valor neutro para cada token da marca, para que
  o sistema abra mesmo sem tema.
- Contraste minimo AA e responsabilidade do tema: ao trocar as cores, confira
  `docs/ux/acessibilidade.md`.

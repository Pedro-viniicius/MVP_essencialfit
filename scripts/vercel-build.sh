#!/usr/bin/env sh
# Build da Vercel.
#
# Com o modo de teste ligado (USAR_MOCKS=true nas variáveis do projeto) não há
# banco para migrar: o site sobe como vitrine da interface, servido pelos dados
# fictícios de src/lib/mock. Sem a variável, o build é o de sempre — migra e
# depois compila, falhando cedo se a migração não passar. Ver MOCKS.md.
set -eu
cd "$(dirname "$0")/.."

# O gerenciador de pacotes já põe node_modules/.bin no PATH quando roda um
# script; repetir aqui deixa `sh scripts/vercel-build.sh` funcionar direto.
PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH

case "${USAR_MOCKS:-}" in
  true|1|on)
    echo "USAR_MOCKS=${USAR_MOCKS}: modo de teste, pulando a migração do banco."
    ;;
  *)
    drizzle-kit migrate
    ;;
esac

next build

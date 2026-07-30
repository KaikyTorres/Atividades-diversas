#!/usr/bin/env bash
#
# Testa uma chave da Places API antes de colar no CRM.
#
#   ./testar-chave.sh AIzaSy...
#   ./testar-chave.sh AIzaSy... "pizzaria em Sinop"
#
# Faz UMA busca (custa uma chamada) pedindo telefone, site e nota — os mesmos
# campos que a prospecção usa. Assim o teste passa pelo grupo de cobrança mais
# caro: se funcionar aqui, funciona no CRM.

set -euo pipefail

CHAVE="${1:-}"
BUSCA="${2:-padaria em Cuiabá}"

if [ -z "$CHAVE" ]; then
  echo "Uso: $0 SUA_CHAVE [\"nicho em cidade\"]" >&2
  exit 1
fi

CAMPOS="places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount"

echo "Buscando: $BUSCA"
echo

# escapa a busca para caber dentro do JSON
BUSCA_JSON=${BUSCA//\\/\\\\}
BUSCA_JSON=${BUSCA_JSON//\"/\\\"}

RESPOSTA=$(curl -sS -X POST 'https://places.googleapis.com/v1/places:searchText' \
  -H 'Content-Type: application/json' \
  -H "X-Goog-Api-Key: $CHAVE" \
  -H "X-Goog-FieldMask: $CAMPOS" \
  -d "{\"textQuery\":\"$BUSCA_JSON\",\"languageCode\":\"pt-BR\",\"maxResultCount\":5}")

if ! command -v jq >/dev/null 2>&1; then
  echo "$RESPOSTA"
  echo
  echo "(instale o jq para ver isso formatado)"
  exit 0
fi

if echo "$RESPOSTA" | jq -e '.error' >/dev/null 2>&1; then
  echo "A chave NÃO funcionou. O Google respondeu:"
  echo
  echo "$RESPOSTA" | jq -r '.error | "  status: \(.status // "-")\n  código: \(.code // "-")\n  mensagem: \(.message // "-")"'
  echo
  echo "Veja a tabela \"Quando der erro\" no README desta pasta."
  exit 1
fi

TOTAL=$(echo "$RESPOSTA" | jq '(.places // []) | length')

if [ "$TOTAL" -eq 0 ]; then
  echo "A chave funcionou (sem erro do Google), mas a busca não achou nada."
  echo "Tente outro termo ou outra cidade."
  exit 0
fi

echo "A chave funcionou. $TOTAL resultado(s):"
echo
echo "$RESPOSTA" | jq -r '.places[] |
  "  \(.displayName.text // "(sem nome)")
    endereço: \(.formattedAddress // "-")
    telefone: \(.nationalPhoneNumber // "não informado")
    site:     \(.websiteUri // "não informado")
    nota:     \(.rating // "-") (\(.userRatingCount // 0) avaliações)
"'

echo "Se veio telefone e site aqui, a chave está pronta para o CRM."

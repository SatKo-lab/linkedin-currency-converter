#!/usr/bin/env bash
# Verify a bearer token against the deployed API without ever printing or
# logging the token itself. Usage: ./scripts/test-api-token.sh
set -euo pipefail

WORKER_URL="https://linkedin-currency-converter.sathishkottravel.workers.dev"

read -r -s -p "Token: " TOKEN
echo

echo
echo "Length:"
echo -n "$TOKEN" | wc -c

echo
echo "Invalid characters (empty = clean; anything printed here is invalid):"
echo -n "$TOKEN" | tr -d 'A-Za-z0-9._~+/=-'
echo

echo
echo "Byte dump of the tail (look for a stray trailing newline before the end):"
echo -n "$TOKEN" | od -c | tail -3

echo
echo "Live request against $WORKER_URL/api/v1/health:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  -H "Authorization: Bearer $TOKEN" \
  "$WORKER_URL/api/v1/health"

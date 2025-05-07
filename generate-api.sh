#!/bin/bash

set -e  # Para o script parar em caso de erro

TMP_DIR="temp-api"
TARGET_DIR="src/api"
CORE_SUBDIR="core"
KEEP_FILES=("OpenAPI.ts")

# 1. Salva cópias dos arquivos a preservar
echo "💾 Salvando arquivos OpenAPI antigos..."
mkdir -p .openapi-backup
for file in "${KEEP_FILES[@]}"; do
  cp "$TARGET_DIR/$CORE_SUBDIR/$file" ".openapi-backup/$file"
done

# 2. Gera nova API na pasta temporária
echo "⚙️ Gerando nova API..."
npx openapi-typescript-codegen \
  --input http://localhost:8000/api/schema \
  --output $TMP_DIR \
  --client fetch

# 3. Substitui o diretório de destino por completo
echo "📁 Substituindo API antiga..."
rm -rf "$TARGET_DIR"
mv "$TMP_DIR" "$TARGET_DIR"

# 4. Restaura os arquivos preservados
echo "♻️ Restaurando arquivos OpenAPI..."
for file in "${KEEP_FILES[@]}"; do
  cp ".openapi-backup/$file" "$TARGET_DIR/$CORE_SUBDIR/$file"
done

# 5. Limpeza
echo "🧹 Limpando backup..."
rm -rf .openapi-backup

echo "✅ API gerada com sucesso, preservando OpenAPI.ts e OpenAPIConfig.ts!"

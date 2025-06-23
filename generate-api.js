import { execSync } from "child_process";
import { existsSync, mkdirSync, copyFileSync, rmSync, renameSync } from "fs";
import { join } from "path";

const TMP_DIR = "temp-api";
const TARGET_DIR = "src/api";
const CORE_SUBDIR = "core";
const KEEP_FILES = ["OpenAPI.ts", "OpenAPIConfig.ts", "request.ts"];
const BACKUP_DIR = ".openapi-backup";

function log(step) {
  console.log(`\x1b[36m${step}\x1b[0m`);
}

function run() {
  try {
    // 1. Backup
    log("💾 Salvando arquivos OpenAPI antigos...");
    if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR);
    for (const file of KEEP_FILES) {
      const src = join(TARGET_DIR, CORE_SUBDIR, file);
      const dest = join(BACKUP_DIR, file);
      if (existsSync(src)) {
        copyFileSync(src, dest);
      }
    }

    // 2. Gerar nova API
    log("⚙️ Gerando nova API...");
    execSync(
      `npx openapi-typescript-codegen --input https://server-saude-staging.paas.ic.unicamp.br/api/schema --output ${TMP_DIR} --client fetch`,
      { stdio: "inherit" }
    );

    // 3. Remover API antiga
    log("📁 Substituindo API antiga...");
    rmSync(TARGET_DIR, { recursive: true, force: true });

    setTimeout(() => {
        renameSync(TMP_DIR, TARGET_DIR);
        log("✅ API substituída com sucesso!");
    }, 300);

    // 4. Restaurar arquivos
    log("♻️ Restaurando arquivos OpenAPI...");
    for (const file of KEEP_FILES) {
      const src = join(BACKUP_DIR, file);
      const dest = join(TARGET_DIR, CORE_SUBDIR, file);
      if (existsSync(src)) {
        copyFileSync(src, dest);
      }
    }

    // 5. Limpeza
    log("🧹 Limpando backup...");
    rmSync(BACKUP_DIR, { recursive: true, force: true });

    log("✅ API gerada com sucesso, preservando OpenAPI.ts e OpenAPIConfig.ts!");
  } catch (err) {
    console.error("❌ Erro ao gerar API:", err);
    process.exit(1);
  }
}

run();

import nextEnv from "@next/env";
import { resolveSiteConfig } from "../lib/site-origin.mjs";

nextEnv.loadEnvConfig(process.cwd());
const production = process.argv.includes("--production") || process.env.VERCEL_ENV === "production";
const config = resolveSiteConfig(process.env.NEXT_PUBLIC_SITE_URL, production ? "production" : process.env.VERCEL_ENV, process.env.VERCEL_PROJECT_PRODUCTION_URL);
if (production && !config.publicSite) {
  console.error("Publicação interrompida: defina NEXT_PUBLIC_SITE_URL com a URL HTTPS pública do projeto (sem credenciais), ou habilite as variáveis de sistema da Vercel para usar VERCEL_PROJECT_PRODUCTION_URL. Depois faça um novo build.");
  process.exitCode = 1;
} else {
  console.log(config.publicSite ? `Domínio para metadados: ${config.origin}` : "Build local/prévia: indexação desativada.");
}

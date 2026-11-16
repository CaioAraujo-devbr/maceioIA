import assert from "node:assert/strict";

const target = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;
if (!target) {
  console.error("Uso: npm run verify:live -- https://seu-dominio-publico");
  process.exit(1);
}
const url = new URL(target);
if (url.protocol !== "https:" || url.username || url.password) {
  console.error("Informe uma URL HTTPS pública sem credenciais.");
  process.exit(1);
}
const origin = url.origin;
let failed = false;
for (const path of ["/", "/guia/transporte", "/planejar?days=3", "/sobre", "/privacidade", "/api/health", "/robots.txt", "/sitemap.xml"]) {
  try {
    const response = await fetch(origin + path, { signal: AbortSignal.timeout(15_000), redirect: "error" });
    assert.equal(response.status, 200, `HTTP ${response.status}`);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff", "cabeçalho de segurança ausente");
    const body = await response.text();
    if (path === "/api/health") assert.equal(JSON.parse(body).status, "ok", "diagnóstico inválido");
    if (path === "/robots.txt") {
      assert.ok(!/^Disallow:\s*\/\s*$/m.test(body), "produção está bloqueando indexação");
      assert.ok(body.includes(`Sitemap: ${origin}/sitemap.xml`), "sitemap aponta para outro domínio");
    }
    if (path === "/sitemap.xml") {
      assert.ok(body.includes(`<loc>${origin}/guia/transporte</loc>`), "URL do guia incorreta no sitemap");
      assert.ok(!body.includes("localhost") && !body.includes("127.0.0.1"), "sitemap contém endereço local");
    }
    if (path === "/") {
      assert.ok(body.includes(`rel="canonical" href="${origin}"`) || body.includes(`rel="canonical" href="${origin}/"`), "canonical não corresponde ao domínio");
      assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(body), "página inicial marcada como noindex");
    }
    console.log(`OK ${path}`);
  } catch (error) {
    failed = true;
    console.error(`FALHOU ${path}: ${error.message}`);
  }
}
process.exitCode = failed ? 1 : 0;

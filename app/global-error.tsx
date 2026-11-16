"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- A full navigation must recover even when the root layout fails. */

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return <html lang="pt-BR"><body style={{ margin: 0, padding: "64px 24px", background: "#f6f8f7", color: "#103c50", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}><main style={{ maxWidth: 650, margin: "0 auto" }}><p>MACEIÓ.IA</p><h1>Não foi possível carregar o site.</h1><p>Tente novamente para continuar sua viagem.</p><button onClick={retry} style={{ padding: "12px 20px", cursor: "pointer" }}>Tentar novamente</button><p><a href="/" style={{ color: "#103c50" }}>Voltar ao início</a></p></main></body></html>;
}

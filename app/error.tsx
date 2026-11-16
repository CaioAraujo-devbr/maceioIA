"use client";
import Link from "next/link";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return <main id="conteudo" className="travel-container service-page"><p className="eyebrow">MACEIÓ.IA</p><h1>Não conseguimos abrir esta página.</h1><p>Tente carregar novamente. Se o problema continuar, volte ao início.</p><div className="service-links"><button type="button" onClick={retry}>Tentar novamente</button><Link href="/">Voltar ao início</Link></div></main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { searchVisitorGuides } from "@/lib/visitor-guides";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: "Guia prático de Maceió", description: "Informações práticas sobre transporte, hospedagem, alimentação, praias e viagem com crianças.", alternates: { canonical: "/guia" }, ...(q ? { robots: { index: false, follow: true } } : {}) };
}
export default async function GuidePage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const guides = searchVisitorGuides(query);
  return <div className="travel-home"><SiteHeader/><main id="conteudo" className="travel-container practical-directory"><p className="eyebrow">Informações para sua viagem</p><h1>Guia prático de Maceió</h1><form action="/guia" method="get" className="visitor-search"><label htmlFor="guide-search">O que você quer saber?</label><div><input id="guide-search" name="q" type="search" maxLength={120} defaultValue={query} placeholder="Ex.: aeroporto, hotel, crianças"/><button type="submit">Buscar</button></div></form>{query && <p className="search-result-count">{guides.length ? `${guides.length} ${guides.length === 1 ? "guia encontrado" : "guias encontrados"}` : "Nenhum guia encontrado"} para “{query}”. <Link href="/guia">Ver todos</Link></p>}
    {guides.length ? <div className="practical-guides">{guides.map((guide) => <Link href={`/guia/${guide.slug}`} key={guide.slug}><span>{guide.category}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong>Ler orientações →</strong></Link>)}</div> : <div className="empty-search"><h2>Tente outro assunto.</h2><p>Busque por aeroporto, hospedagem, comida ou praias. Você também pode levar sua dúvida ao chat.</p><Link href="/chat">Tirar uma dúvida →</Link></div>}
  </main><SiteFooter/></div>;
}

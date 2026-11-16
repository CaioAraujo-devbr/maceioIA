import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { VISITOR_GUIDES } from "@/lib/visitor-guides";
import { chatHref } from "@/lib/planner-entry";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return VISITOR_GUIDES.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = VISITOR_GUIDES.find((item) => item.slug === slug);
  return guide ? { title: guide.title, description: guide.description, alternates: { canonical: `/guia/${slug}` }, openGraph: { title: guide.title, description: guide.description } } : { title: "Guia não encontrado" };
}
export default async function PracticalGuide({ params }: Props) {
  const { slug } = await params;
  const guide = VISITOR_GUIDES.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <div className="travel-home"><SiteHeader/><main id="conteudo" className="travel-container practical-article">
    <Link href="/guia" className="text-link">← Guia prático</Link>
    <p className="eyebrow">{guide.category}</p><h1>{guide.title}</h1><p className="article-description">{guide.description}</p>
    {guide.reviewedAt && <p className="guide-reviewed">Fontes consultadas em {guide.reviewedAt}. Confirme condições atuais nos links abaixo.</p>}
    <div className="article-layout"><article>
      {guide.facts && <section className="guide-essentials"><h2>O essencial</h2><ul>{guide.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></section>}
      {guide.comparison && <section><h2>{guide.comparisonTitle ?? "Qual transporte escolher?"}</h2><div className="transport-options">{guide.comparison.map((option) => <div key={option.name}><h3>{option.name}</h3><p>{option.bestFor}</p><p><strong>Confira:</strong> {option.check}</p></div>)}</div></section>}
      {guide.places && <section className="guide-places"><h2>{guide.slug === "alimentacao" ? "Endereços para sua refeição" : "Hospedagens para comparar"}</h2><p className="guide-places-intro">Uma seleção inicial, sem ordem de classificação. Confirme valores e condições diretamente com cada estabelecimento.</p>{guide.places.map((place) => <div className="local-place" key={place.name}><p className="eyebrow">{place.area}</p><h3>{place.name}</h3><p>{place.description}</p><address>{place.address}</address><p><strong>Antes de escolher:</strong> {place.check}</p><div className="local-place-actions"><a href={place.source} target="_blank" rel="noreferrer">Site oficial ↗</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`} target="_blank" rel="noreferrer">Ver no mapa ↗</a><a href={`tel:${place.phone}`}>Ligar</a></div></div>)}</section>}
      {guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
      {guide.sources && <div className="article-sources"><h2>Fontes e consulta</h2>{guide.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>}
      {guide.slug === "informacoes" || guide.slug === "praias" ? <div className="article-sources"><h2>Fontes para consultar</h2><a href="https://www.marinha.mil.br/chm/tabuas-de-mare" target="_blank" rel="noreferrer">Tábua de marés · Marinha — confira o ano do documento ↗</a><a href="https://www2.ima.al.gov.br/laboratorio/relatorios-de-balneabilidade/balneabilidade-de-praias/" target="_blank" rel="noreferrer">Balneabilidade · IMA/AL ↗</a><a href="https://maceio.al.gov.br/noticias/semtur" target="_blank" rel="noreferrer">Notícias de turismo · Prefeitura ↗</a>{guide.slug === "informacoes" && <a href="https://assistenciasocial.al.gov.br/telefone-uteis" target="_blank" rel="noreferrer">Telefones úteis · Governo de Alagoas ↗</a>}</div> : null}
    </article><aside><h2>Organize seus dias</h2><p>Escolha o grupo, o orçamento, o transporte e um destino que não pode faltar.</p><Link href="/planejar" className="travel-button">Montar roteiro →</Link>{guide.mapQuery && <a className="text-link guide-map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.mapQuery)}`} target="_blank" rel="noreferrer">Localizar o aeroporto no mapa ↗</a>}<Link href={chatHref(guide.question)} className="text-link">Perguntar sobre este assunto →</Link><Link href={guide.slug === "hospedagem" ? "/guia/alimentacao" : "/guia/hospedagem"} className="text-link guide-map-link">{guide.slug === "hospedagem" ? "Encontrar uma refeição →" : "Comparar regiões para ficar →"}</Link></aside></div>
  </main><SiteFooter/></div>;
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DESTINATIONS } from "@/lib/destinations";
import { chatHref } from "@/lib/planner-entry";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { TravelIcon } from "@/components/travel-icon";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return DESTINATIONS.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = DESTINATIONS.find((item) => item.slug === slug);
  return place ? { title: place.name, description: place.subtitle, alternates: { canonical: `/destinos/${slug}` }, openGraph: { title: place.name, description: place.subtitle, images: [place.image] } } : { title: "Destino não encontrado" };
}
export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const place = DESTINATIONS.find((item) => item.slug === slug);
  if (!place) notFound();
  return <div className="travel-home"><SiteHeader/><main id="conteudo" className="travel-container destination-detail"><Link className="text-link" href="/#destinos">← Voltar aos destinos</Link><p className="eyebrow">{place.tag}</p><h1>{place.name}</h1><p className="detail-subtitle">{place.subtitle}</p><div className="detail-image"><Image src={place.image} alt={place.alt} fill priority sizes="(max-width: 1200px) 100vw, 1200px"/></div><div className="detail-columns"><article><h2>Conheça o lugar</h2><p>{place.description}</p><h2>Ideias para sua visita</h2><ul>{place.activities.map((activity) => <li key={activity}><TravelIcon name="check"/>{activity}</li>)}</ul><h2>Antes de ir</h2><p>{place.before}</p><Link href="/#antes-de-sair" className="text-link">Consultar fontes oficiais <TravelIcon name="arrow"/></Link></article><aside><span className="section-index">GUIA</span><h2>Esse lugar combina com sua viagem?</h2><p>Leve sua dúvida ao chat e conte o perfil da viagem antes de decidir.</p><Link className="travel-button" href={chatHref(`Quero conhecer ${place.name}. O que preciso saber antes de ir?`)}>Perguntar ao guia <TravelIcon name="arrow"/></Link><a className="text-link" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " Alagoas Brasil")}`}>Localizar no mapa <TravelIcon name="external"/></a></aside></div></main><SiteFooter/></div>;
}

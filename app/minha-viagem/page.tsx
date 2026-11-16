import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SavedTrip } from "@/components/saved-trip";

export const metadata: Metadata = { title: "Minha viagem", robots: { index: false, follow: true } };
export default function MyTripPage() {
  return <div className="travel-home"><SiteHeader/><main id="conteudo" className="travel-container my-trip-page"><p className="eyebrow">MACEIÓ.IA / Seu planejamento</p><h1>Minha viagem</h1><SavedTrip/></main><SiteFooter/></div>;
}

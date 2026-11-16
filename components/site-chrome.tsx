import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { TravelIcon } from "./travel-icon";
import { OfficialSeal } from "./official-seal";
import { DESTINATIONS } from "@/lib/destinations";

export function Logo({ className = "" }: { className?: string }) {
  return <Link href="/" className={`brand ${className}`} aria-label="MACEIÓ.IA — página inicial"><OfficialSeal decorative/><span className="brand-wordmark">MACEIÓ<span>.IA</span><small>TURISMO · ALAGOAS</small></span></Link>;
}
export function SiteHeader() {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="travel-header"><div className="travel-container header-inner"><Logo/><nav className="desktop-navigation" aria-label="Navegação principal"><Link href="/#destinos">Destinos</Link><Link href="/guia">Guia prático</Link><Link href="/minha-viagem">Minha viagem</Link></nav><Link href="/planejar" className="header-chat">Montar roteiro <TravelIcon name="arrow"/></Link><MobileMenu/></div></header></>;
}
export function SiteFooter() {
  return <footer className="travel-footer compact-footer"><div className="travel-container"><div className="compact-footer-line"><span>MACEIÓ.IA · Turismo em Alagoas</span><nav aria-label="Links do rodapé"><Link href="/planejar">Montar roteiro</Link><Link href="/chat">Tirar uma dúvida</Link><Link href="/minha-viagem">Minha viagem</Link><Link href="/sobre">Sobre</Link><Link href="/privacidade">Privacidade</Link></nav></div><p className="compact-footer-note">Sugestões automáticas. Confirme condições, preços e horários.</p><details className="photo-credits"><summary>Créditos das fotografias</summary><p>Fotografias históricas e ilustrativas dos destinos, redimensionadas e convertidas para WebP; o enquadramento varia conforme a tela.</p>{DESTINATIONS.map((place) => <p key={place.slug}><a href={place.source} target="_blank" rel="noreferrer">{place.name}: {place.credit}</a> · <a href={place.license} target="_blank" rel="noreferrer">Licença / declaração</a></p>)}</details></div></footer>;
}

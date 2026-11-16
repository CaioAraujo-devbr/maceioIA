import Image from "next/image";
import Link from "next/link";
import { SavedTrip } from "@/components/saved-trip";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TravelIcon, type IconName } from "@/components/travel-icon";
import { DESTINATIONS } from "@/lib/destinations";

export const metadata = { alternates: { canonical: "/" } };

const guides: { title: string; description: string; href: string; icon: IconName }[] = [
  { title: "Chegar e se locomover", description: "Aeroporto, transporte e retorno.", href: "/guia/transporte", icon: "car" },
  { title: "Escolher onde ficar", description: "Regiões e hospedagens para comparar.", href: "/guia/hospedagem", icon: "bed" },
  { title: "Encontrar uma boa refeição", description: "Endereços, mapas e contatos.", href: "/guia/alimentacao", icon: "food" },
  { title: "Praias e piscinas naturais", description: "Escolha o lugar e confira as condições.", href: "/guia/praias", icon: "wave" },
  { title: "Viajar com crianças", description: "Menos deslocamentos, mais pausas.", href: "/guia/familia", icon: "sun" },
  { title: "Conferir antes de sair", description: "Marés, água e informações oficiais.", href: "/guia/informacoes", icon: "check" },
];

export default function HomePage() {
  return <div className="travel-home coast-home">
    <SiteHeader/>
    <main id="conteudo">
      <section className="coast-hero" aria-labelledby="home-heading">
        <div className="travel-container coast-hero-grid">
          <div className="coast-hero-copy">
            <p className="coast-kicker"><TravelIcon name="pin"/> Maceió, Alagoas</p>
            <h1 id="home-heading">Maceió,<br/><span>por onde começar?</span></h1>
            <p>Escolha os lugares, organize seus dias e leve o roteiro com você.</p>
            <div className="coast-hero-actions"><a className="travel-button" href="#comecar">Começar meu roteiro <TravelIcon name="arrow"/></a><Link href="/chat">Tirar uma dúvida <span aria-hidden="true">↗</span></Link></div>
            <p className="coast-hero-note">Praias, sabores e caminhos de Alagoas.</p>
          </div>
          <figure className="coast-hero-photo">
            <Image src="/images/pajucara.webp" alt="Guarda-sóis coloridos e mar azul na Praia de Pajuçara, em Maceió" fill preload sizes="(max-width: 700px) 100vw, 58vw"/>
            <figcaption><span><TravelIcon name="pin"/> Pajuçara</span><Link href="/destinos/pajucara">Conheça este lugar <TravelIcon name="arrow"/></Link></figcaption>
          </figure>
        </div>
      </section>

      <div className="travel-container coast-launcher" id="comecar">
        <div className="coast-launcher-heading"><div><span className="coast-overline">Seu ponto de partida</span><h2>Como vai ser sua viagem?</h2></div><p>Roteiros de 1 a 7 dias. Sem cadastro.</p></div>
        <form action="/planejar#resultado" method="get" className="coast-trip-form">
          <label>Quantos dias?<select name="days" defaultValue="3">{Array.from({ length: 7 }, (_, index) => <option key={index} value={index + 1}>{index + 1} {index === 0 ? "dia" : "dias"}</option>)}</select></label>
          <label>Quem vai com você?<select name="profile" defaultValue=""><option value="">Ainda não defini</option><option value="couple">Casal, sem crianças</option><option value="family">Com crianças</option><option value="solo">Sozinho(a)</option><option value="friends">Amigos, sem crianças</option></select></label>
          <label>Como vai se locomover?<select name="transport" defaultValue=""><option value="">Ainda não defini</option><option value="car">Com carro</option><option value="transfer">Sem carro</option></select></label>
          <button type="submit" className="travel-button">Ver meu roteiro <TravelIcon name="arrow"/></button>
        </form>
      </div>
      <SavedTrip compact/>

      <section id="destinos" className="travel-container coast-section coast-destinations" aria-labelledby="destinations-heading">
        <div className="coast-section-heading"><div><p className="coast-overline">Maceió e litoral sul</p><h2 id="destinations-heading">Um lugar para cada dia.</h2></div><p>Comece pela orla.<br/>{" "}Depois, encontre seu próximo passeio.</p></div>
        <div className="coast-destination-grid">{DESTINATIONS.map((place, index) => <Link key={place.slug} href={`/destinos/${place.slug}`} className="coast-destination">
          <div className="coast-destination-image"><Image src={place.image} alt={place.alt} fill sizes="(max-width: 600px) 100vw, 33vw"/><span>{index === 2 ? "Litoral sul" : "Na cidade"}</span></div>
          <div className="coast-destination-title"><h3>{place.name}</h3><TravelIcon name="arrow"/></div><p>{index === 0 ? "Jangadas e artesanato na orla." : index === 1 ? "Caminhadas e vida à beira-mar." : "Coqueiral, mar e Lagoa do Roteiro."}</p>
        </Link>)}</div>
      </section>

      <section className="coast-guide-section" aria-labelledby="guide-heading"><div className="travel-container">
        <div className="coast-guide-heading"><div><p className="coast-overline">O que resolve sua viagem</p><h2 id="guide-heading">O guia está aqui.</h2></div><form action="/guia" method="get" className="coast-guide-search"><label htmlFor="home-search">Encontre um assunto</label><div><input id="home-search" name="q" type="search" maxLength={120} placeholder="Aeroporto, hotel, restaurante…"/><button type="submit" aria-label="Buscar no guia"><TravelIcon name="arrow"/></button></div></form></div>
        <div className="coast-guides">{guides.map((guide) => <Link key={guide.href} href={guide.href}><TravelIcon name={guide.icon}/><div><h3>{guide.title}</h3><p>{guide.description}</p></div><TravelIcon name="arrow"/></Link>)}</div>
      </div></section>

      <section id="antes-de-sair" className="travel-container coast-before"><div><p className="coast-overline">Antes de sair</p><h2>Confira as condições do dia.</h2><p>Consulte a data e o local nas fontes oficiais.</p></div><div className="coast-official-links"><a href="https://www.marinha.mil.br/chm/tabuas-de-mare" target="_blank" rel="noreferrer"><span>Marés<small>Marinha do Brasil</small></span><TravelIcon name="external"/></a><a href="https://www2.ima.al.gov.br/laboratorio/relatorios-de-balneabilidade/balneabilidade-de-praias/" target="_blank" rel="noreferrer"><span>Qualidade da água<small>IMA / Alagoas</small></span><TravelIcon name="external"/></a><a href="https://maceio.al.gov.br/noticias/semtur" target="_blank" rel="noreferrer"><span>Notícias de turismo<small>Prefeitura de Maceió</small></span><TravelIcon name="external"/></a></div></section>
    </main>
    <SiteFooter/>
  </div>;
}

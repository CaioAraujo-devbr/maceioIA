import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const metadata: Metadata = { title: "Sobre o MACEIÓ.IA", description: "Como funciona o guia independente de viagem a Maceió e Alagoas.", alternates: { canonical: "/sobre" } };

export default function AboutPage() {
  return <div className="travel-home"><SiteHeader/><main id="conteudo" className="travel-container service-page"><p className="eyebrow">Sobre o projeto</p><h1>Uma viagem mais fácil de organizar.</h1><p>O MACEIÓ.IA é um guia independente para quem visita Maceió e Alagoas. Reúne roteiros de 1 a 7 dias, orientações de chegada e uma seleção inicial de lugares para conhecer, comer e se hospedar.</p><h2>Como as sugestões são feitas</h2><p>O planejador e o chat combinam informações locais com regras de duração, transporte e preferências. Nesta versão, não há modelo de IA conectado, consulta em tempo real ou atendimento humano pelo chat.</p><h2>Fontes e atualização</h2><p>Os guias indicam suas fontes e, quando disponível, a data de revisão. A seleção de estabelecimentos é inicial: não é um ranking nem uma garantia de qualidade. Confirme preços, funcionamento e disponibilidade diretamente com cada local.</p><h2>Antes de reservar ou sair</h2><p>Não realizamos reservas nem vendemos passeios nesta versão. Marés, condições do mar e previsões precisam ser verificadas nas fontes oficiais. O projeto não representa a Prefeitura ou outro órgão público.</p><div className="service-links"><Link href="/guia">Explorar o guia →</Link><Link href="/privacidade">Dados e privacidade</Link></div></main><SiteFooter/></div>;
}

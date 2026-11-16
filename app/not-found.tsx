import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export default function NotFound() {
  return <div className="travel-home"><SiteHeader/><main id="conteudo" className="travel-container service-page"><p className="eyebrow">Página não encontrada · 404</p><h1>Vamos encontrar seu caminho.</h1><p>Este endereço não existe ou mudou. Continue pelo roteiro ou encontre uma orientação no guia.</p><div className="service-links"><Link href="/planejar">Montar meu roteiro →</Link><Link href="/guia">Abrir guia prático →</Link><Link href="/">Voltar ao início</Link></div></main><SiteFooter/></div>;
}

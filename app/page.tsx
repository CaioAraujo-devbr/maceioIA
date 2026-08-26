import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const DESTINOS = [
  { title: "Pajuçara", text: "Jangadas e piscinas naturais de corais na maré baixa." },
  { title: "Ponta Verde", text: "Calçadão, hotéis e a base perfeita para a primeira visita." },
  { title: "Ipioca", text: "Águas rasas e vilarejo ao norte, longe da pressa da orla." },
  { title: "Gunga", text: "Coqueiral icônico, dunas e buggy em Barra de São Miguel." },
  { title: "Maragogi", text: "Day trip às Galés — recifes em alto-mar." },
  { title: "Penedo", text: "História e o Rio São Francisco num bate-volta cultural." },
];

const PASSOS = [
  { n: "01", title: "Pergunte do seu jeito", text: "PT, EN ou ES. Datas, orçamento, criança, mar calmo — quanto mais contexto, melhor." },
  { n: "02", title: "Receba o porquê", text: "Não é lista genérica: maré, distância, público e plano B se chover." },
  { n: "03", title: "Ajuste o roteiro", text: "Troque Gunga por Ipioca, some mergulho ou um jantar na Massagueira." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sand-50 text-ocean-950">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-ocean-hero text-white">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="wave" />
          </div>
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ocean-100">
                Turismo inteligente · Alagoas
              </p>
              <h1 className="mt-6 font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
                Maceió no bolso: um agente que conhece cada praia.
              </h1>
              <p className="mt-5 max-w-xl text-base text-ocean-50/90 sm:text-lg">
                A <strong className="font-semibold text-white">MaceiôIA</strong> recomenda
                praias, restaurantes, passeios, hotéis e roteiros em português, inglês
                ou espanhol — com cara de guia local, não de folheto.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-600"
                >
                  Começar a conversar
                </Link>
                <Link
                  href="/#destinos"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Ver destinos
                </Link>
              </div>
              <p className="mt-6 text-xs text-ocean-100/70">
                PT · EN · ES &nbsp;·&nbsp; Pensado para o celular &nbsp;·&nbsp; MVP com
                respostas simuladas
              </p>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <div className="rounded-[1.5rem] bg-sand-50 p-4 text-ocean-950">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral-400" />
                    <span className="text-xs font-medium text-ocean-600">MaceiôIA ao vivo</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="ml-8 rounded-2xl bg-ocean-700 px-3 py-2 text-white">
                      Vale a pena ir ao Gunga com criança de 5 anos?
                    </div>
                    <div className="mr-4 rounded-2xl border border-ocean-100 bg-white px-3 py-2 leading-relaxed">
                      Sim — chegue cedo, faça o trecho da laguna e o buggy curto, e
                      evite o mar aberto se houver corrente. Leve sombra e lanche…
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 hidden rotate-[-6deg] rounded-2xl bg-coral-500 px-4 py-2 text-sm font-semibold text-white shadow-lg sm:block">
                Sol, sururu e maré baixa
              </div>
            </div>
          </div>
          <svg className="relative -mb-px block w-full text-sand-50" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
            <path fill="currentColor" d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </section>

        <section id="destinos" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-coral-600">
            O mapa na cabeça do agente
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">
            De Pajuçara a Penedo, sem enrolação.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINOS.map((destino) => (
              <article
                key={destino.title}
                className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card"
              >
                <h3 className="font-display text-xl text-ocean-800">{destino.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ocean-800/75">{destino.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-ocean-950 py-16 text-ocean-50 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="font-display text-3xl text-white">Mais que um chatbot.</h2>
              <p className="mt-3 text-sm text-ocean-200">
                Segurança na orla, Uber no aeroporto MCZ, maré das piscinas naturais,
                quando a chuva de junho atrapalha (e quando não).
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {[
                "Praias urbanas e selvagens",
                "Restaurantes e comida local",
                "Mergulho e jangadas",
                "Hotéis por bairro",
                "Melhor época e clima",
                "Transporte e segurança",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="font-display text-3xl sm:text-4xl">Três toques até o roteiro.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PASSOS.map((passo) => (
              <article key={passo.n} className="rounded-3xl bg-white p-6 shadow-card">
                <p className="font-display text-3xl text-coral-500">{passo.n}</p>
                <h3 className="mt-3 text-lg font-semibold">{passo.title}</h3>
                <p className="mt-2 text-sm text-ocean-800/75">{passo.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-[2rem] bg-gradient-to-r from-ocean-600 to-ocean-800 px-6 py-10 text-center text-white sm:px-12">
            <h2 className="font-display text-3xl">Pronto para a orla?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ocean-100">
              Abra o chat no celular e pergunte como um local. Sem cadastro neste MVP.
            </p>
            <Link
              href="/chat"
              className="mt-6 inline-flex rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold hover:bg-coral-600"
            >
              Falar com a MaceiôIA
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-700 shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
          <path
            d="M3 15c2.5-1 4.5 1 7 0s4.5-1 7 0 4 1 4 1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4 19c2.2-.8 3.8.8 6.2 0 2.4-.8 4-.8 6.2 0 1.6.6 3 .8 3.6.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="17" cy="7" r="2.2" fill="#fdba74" />
        </svg>
      </span>
      <span className="font-display text-xl tracking-tight text-ocean-950">
        Maceió<span className="text-coral-500">IA</span>
      </span>
    </Link>
  );
}

export function SiteHeader({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        dark
          ? "border-white/10 bg-ocean-950/70"
          : "border-ocean-900/5 bg-sand-50/80"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo className={dark ? "[&_span:last-child]:text-white" : ""} />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#destinos"
            className={`hidden text-sm font-medium sm:inline ${
              dark ? "text-ocean-100/80 hover:text-white" : "text-ocean-800/70 hover:text-ocean-950"
            }`}
          >
            Destinos
          </Link>
          <Link
            href="/#como-funciona"
            className={`hidden text-sm font-medium sm:inline ${
              dark ? "text-ocean-100/80 hover:text-white" : "text-ocean-800/70 hover:text-ocean-950"
            }`}
          >
            Como funciona
          </Link>
          <Link
            href="/chat"
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-coral-500/25 transition hover:bg-coral-600"
          >
            Abrir o chat
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ocean-900/10 bg-ocean-950 text-ocean-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg">
            Maceió<span className="text-coral-400">IA</span>
          </p>
          <p className="mt-1 max-w-md text-sm text-ocean-200/80">
            Agente de turismo para Maceió e o litoral de Alagoas. Respostas em
            português, inglês e espanhol.
          </p>
        </div>
        <p className="text-xs text-ocean-300/70">
          Recomendações de caráter informativo. Confirme marés,
          preços e horários no destino.
        </p>
      </div>
    </footer>
  );
}

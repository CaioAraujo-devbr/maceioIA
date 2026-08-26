import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand-50 text-ocean-950">
      <h1 className="font-display text-4xl">Página não encontrada</h1>
      <p className="mt-4 text-ocean-600">Esta página não existe.</p>
      <Link href="/" className="mt-6 rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600">
        Voltar ao início
      </Link>
    </div>
  );
}

import Image from "next/image";

/** A arte fornecida é preservada; o círculo é apenas um enquadramento em CSS. */
export function OfficialSeal({ className = "", decorative = false }: { className?: string; decorative?: boolean }) {
  return <span className={`official-seal ${className}`}><Image src="/brand/logo-oficial.jpg" width={1024} height={1024} alt={decorative ? "" : "Logo oficial MACEIÓ.IA — Turismo · Alagoas"} sizes="(max-width: 640px) 160px, 300px"/></span>;
}

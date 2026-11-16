"use client";

import Link from "next/link";
import { useRef } from "react";

export function MobileMenu() {
  const menu = useRef<HTMLDetailsElement>(null);
  function close() { if (menu.current) menu.current.open = false; }
  return <details ref={menu} className="mobile-navigation" onKeyDown={(event) => {
    if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus(); }
  }}><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Menu móvel" onClick={close}><Link href="/#destinos">Explorar destinos</Link><Link href="/planejar">Montar roteiro</Link><Link href="/guia">Guia prático</Link><Link href="/minha-viagem">Minha viagem</Link><Link href="/#antes-de-sair">Antes de sair</Link><Link href="/chat">Tirar uma dúvida</Link></nav></details>;
}

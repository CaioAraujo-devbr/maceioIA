"use client";
import { useState } from "react";
import Link from "next/link";
import { SAVED_TRIP_EVENT, SAVED_TRIP_KEY } from "@/lib/saved-trip";

export function PlanActions({ text, path, summary }: { text: string; path: string; summary: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(text); setStatus("Roteiro copiado. Você pode colar em uma mensagem ou nas suas notas."); }
    catch { setStatus("Não foi possível copiar automaticamente. Selecione o texto do roteiro para copiar."); }
  }
  function save() {
    try {
      localStorage.setItem(SAVED_TRIP_KEY, JSON.stringify({ path, summary, savedAt: new Date().toISOString() }));
      window.dispatchEvent(new Event(SAVED_TRIP_EVENT));
      setStatus("Roteiro salvo neste navegador. Acesse Minha viagem para continuar depois.");
    } catch { setStatus("O navegador não permitiu salvar. Baixe o roteiro para guardar uma cópia."); }
  }
  async function share() {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title: "Meu roteiro de Maceió", text }); setStatus("Roteiro compartilhado."); }
    catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setStatus("Não foi possível compartilhar. Use Copiar roteiro ou baixe o arquivo."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "meu-roteiro-maceio.txt"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Arquivo do roteiro preparado para download.");
  }
  return <div className="plan-actions">
    <div><button className="save-trip-button" onClick={save} type="button">Salvar minha viagem</button><button onClick={() => void share()} type="button">Compartilhar roteiro</button><a href="#planejar">Alterar preferências</a></div>
    <details className="plan-export-options"><summary>Copiar, baixar ou imprimir</summary><div><button onClick={() => void copy()} type="button">Copiar roteiro</button><button onClick={download} type="button">Baixar texto</button><button onClick={() => window.print()} type="button">Imprimir / salvar PDF</button></div></details>
    <p role="status" aria-live="polite">{status}</p><Link href="/minha-viagem" className="saved-trip-access">Abrir Minha viagem →</Link>
  </div>;
}

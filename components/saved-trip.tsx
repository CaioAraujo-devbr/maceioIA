"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { readSavedTrip, SAVED_TRIP_EVENT, SAVED_TRIP_KEY } from "@/lib/saved-trip";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SAVED_TRIP_EVENT, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(SAVED_TRIP_EVENT, callback); };
}
function snapshot() { try { return localStorage.getItem(SAVED_TRIP_KEY); } catch { return null; } }
const serverSnapshot = () => null;

export function SavedTrip({ compact = false }: { compact?: boolean }) {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const trip = readSavedTrip(raw);
  const [status, setStatus] = useState("");
  function remove() {
    try { localStorage.removeItem(SAVED_TRIP_KEY); window.dispatchEvent(new Event(SAVED_TRIP_EVENT)); setStatus("Roteiro removido deste navegador."); }
    catch { setStatus("Não foi possível remover. Verifique as configurações de armazenamento do navegador."); }
  }
  if (compact) return trip ? <div className="travel-container saved-trip-return"><Link href={trip.path}>Continuar meu roteiro <span>→</span></Link><p>{trip.summary}</p></div> : null;
  return <><div className="saved-trip-card">{trip ? <><h2>Seu último roteiro</h2><p>{trip.summary}</p><p className="saved-trip-date">Salvo em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(trip.savedAt))}.</p><div className="saved-trip-buttons"><Link className="travel-button" href={trip.path}>Abrir meu roteiro →</Link><button type="button" onClick={remove}>Remover do navegador</button></div></> : <><h2>Seu próximo passeio começa aqui.</h2><p>Monte um roteiro e toque em “Salvar minha viagem” no resultado para encontrar suas escolhas nesta página.</p><Link className="travel-button" href="/planejar">Montar meu roteiro →</Link></>}</div><p className="saved-trip-note">O roteiro fica apenas neste navegador, sem cadastro. Salvar outro substitui o anterior. Ao reabrir, as sugestões são geradas novamente com suas escolhas. Para guardar o texto desta versão, baixe o arquivo.</p><p role="status" aria-live="polite">{status}</p></>;
}

import type { Language } from "./types";

const PT = [
  "praia",
  "praias",
  "onde",
  "melhor",
  "roteiro",
  "passeio",
  "hotel",
  "restaurante",
  "obrigado",
  "olá",
  "oi",
  "quando",
  "como",
  "segurança",
  "uber",
];

const EN = [
  "beach",
  "beaches",
  "where",
  "best",
  "itinerary",
  "tour",
  "hotel",
  "restaurant",
  "thanks",
  "hello",
  "hi",
  "when",
  "how",
  "safety",
  "please",
];

const ES = [
  "playa",
  "playas",
  "dónde",
  "donde",
  "mejor",
  "itinerario",
  "paseo",
  "hotel",
  "restaurante",
  "gracias",
  "hola",
  "cuándo",
  "cuando",
  "cómo",
  "como",
  "seguridad",
];

function score(text: string, words: string[]) {
  return words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
}

export function detectLanguage(text: string): Language {
  const normalized = text.toLowerCase();
  const pt = score(normalized, PT);
  const en = score(normalized, EN);
  const es = score(normalized, ES);

  if (en >= pt && en >= es && en > 0) return "en";
  if (es >= pt && es >= en && es > 0) return "es";
  return "pt";
}

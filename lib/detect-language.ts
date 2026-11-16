import type { Language } from "./types";

// Palavras compartilhadas empatam; nesse caso, preservamos o idioma anterior.
const WORDS: Record<Language, string[]> = {
  pt: ["praia", "praias", "onde", "melhor", "roteiro", "passeio", "obrigado", "ola", "oi", "quando", "seguranca", "quero", "voce", "criancas", "crianca", "dias", "comer", "restaurante", "restaurantes"],
  en: ["beach", "beaches", "where", "best", "itinerary", "tour", "restaurant", "restaurants", "thanks", "hello", "hi", "when", "how", "safety", "please", "want", "children", "kids", "days", "tide", "tides", "tomorrow"],
  es: ["playa", "playas", "donde", "mejor", "itinerario", "paseo", "gracias", "hola", "cuando", "seguridad", "seguro", "quiero", "ninos", "dias", "noche", "comer", "restaurante", "restaurantes", "marea", "mareas", "manana"],
};

export function detectLanguage(text: string, fallback: Language = "pt"): Language {
  const words = new Set(text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z]+/g) ?? []);
  const scores = (Object.keys(WORDS) as Language[]).map((language) => ({
    language,
    score: WORDS[language].reduce((total, word) => total + Number(words.has(word)), 0)
      + (language === "es" && /[¿¡]/.test(text) ? 2 : 0),
  }));
  const best = Math.max(...scores.map(({ score }) => score));
  const winners = scores.filter(({ score }) => score === best);
  return best === 0 || winners.length !== 1 ? fallback : winners[0].language;
}

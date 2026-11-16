import { MAX_MESSAGE_LENGTH } from "./chat-limits";
import { MAX_ITINERARY_DAYS } from "./travel-context";

export type EntryParams = Record<string, string | string[] | undefined>;
export function buildPlannerPrompt(params: EntryParams): string {
  if (typeof params.q === "string") return params.q.trim().slice(0, MAX_MESSAGE_LENGTH);
  const days = typeof params.days === "string" ? Number(params.days) : 0;
  if (!Number.isInteger(days) || days < 1 || days > MAX_ITINERARY_DAYS) return "";
  const profiles: Record<string, string> = { couple: "em casal, sem crianças", family: "com crianças", solo: "sozinho, sem crianças", friends: "com amigos, sem crianças" };
  const budgets: Record<string, string> = { low: "econômico", mid: "intermediário", comfort: "conforto" };
  const months = "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split(" ");
  const lookup = (options: Record<string, string>, key: unknown) => typeof key === "string" && Object.hasOwn(options, key) ? options[key] : undefined;
  const profile = lookup(profiles, params.profile);
  const budget = lookup(budgets, params.budget);
  const month = typeof params.month === "string" && /^([1-9]|1[0-2])$/.test(params.month) ? months[Number(params.month) - 1] : undefined;
  const interests: Record<string, string> = { beach: "praias", food: "gastronomia", culture: "cultura" };
  const interest = lookup(interests, params.interest);
  const transport = params.transport === "car" ? "com carro alugado" : params.transport === "transfer" ? "sem carro" : undefined;
  const places = { gunga: "Gunga", ipioca: "Ipioca", maragogi: "Maragogi" };
  const place = lookup(places, params.place);
  return `Quero um roteiro de ${days} ${days === 1 ? "dia" : "dias"} em Maceió${month ? ` em ${month}` : ""}${profile ? `, ${profile}` : ""}${budget ? `, com orçamento ${budget}` : ""}${transport ? `, ${transport}` : ""}${interest ? `. Prefiro ${interest}` : ""}${place ? `. Quero incluir ${place}` : ""}.`;
}
export function chatHref(question: string) {
  return `/chat?q=${encodeURIComponent(question)}`;
}

/** URL reproduzível: preserva apenas as escolhas reconhecidas pelo formulário. */
export function plannerPath(params: EntryParams): string | null {
  if (!buildPlannerPrompt({ ...params, q: undefined })) return null;
  const clean = new URLSearchParams({ days: String(Number(params.days)) });
  const choices: Record<string, string[]> = {
    month: Array.from({ length: 12 }, (_, index) => String(index + 1)),
    profile: ["couple", "family", "solo", "friends"], budget: ["low", "mid", "comfort"],
    interest: ["beach", "food", "culture"], transport: ["car", "transfer"],
    place: ["gunga", "ipioca", "maragogi"],
  };
  for (const [key, allowed] of Object.entries(choices)) {
    const value = params[key];
    if (typeof value === "string" && allowed.includes(value)) clean.set(key, value);
  }
  return `/planejar?${clean.toString()}#resultado`;
}

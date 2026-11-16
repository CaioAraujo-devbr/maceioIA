import { buildTravelReply, extractTravelContext, isItineraryEdit } from "./travel-context";
import { detectLanguage } from "./detect-language";
import { TOPICS, type TopicId } from "./knowledge";
import type { ChatMessage, Language } from "./types";
import { currentConditionsReply } from "./current-conditions";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreTopic(haystack: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => {
    const needle = normalize(keyword);
    if (!needle) return score;
    if (needle.length <= 3) {
      const bounded = new RegExp(`(?:^|\\s)${needle}(?:$|[\\s!?.,;:])`);
      return bounded.test(haystack) ? score + 2 : score;
    }
    return haystack.includes(needle) ? score + (needle.length > 8 ? 3 : 2) : score;
  }, 0);
}

function pickTopic(userText: string): TopicId {
  const haystack = normalize(userText);
  if (/\b(roteiro|itinerary|itinerario)\b/.test(haystack)) return "itinerary";
  let best: { id: TopicId; score: number } = { id: "fallback", score: 0 };

  for (const topic of TOPICS) {
    if (topic.id === "fallback") continue;
    const score = scoreTopic(haystack, topic.keywords);
    const greetingBoost =
      topic.id === "greeting" && score > 0 && haystack.length < 24 ? 1 : 0;
    const total = score + greetingBoost;
    if (total > best.score) {
      best = { id: topic.id, score: total };
    }
  }

  if (best.score === 0) return "fallback";
  if (best.id === "greeting" && haystack.length > 80) return "fallback";
  return best.id;
}

function findReply(id: TopicId, language: Language) {
  const topic = TOPICS.find((item) => item.id === id) ?? TOPICS[TOPICS.length - 1];
  return topic.replies[language];
}

export function simulateReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const text = lastUser?.content ?? "";
  const language = messages
    .filter((message) => message.role === "user")
    .reduce<Language>((previous, message) => detectLanguage(message.content, previous), "pt");
  const conditions = currentConditionsReply(text, language);
  if (conditions) return conditions;
  let topic = pickTopic(text);

  let previousTopic: TopicId = "fallback";
  for (const message of messages.filter((item) => item.role === "user").slice(0, -1)) {
    const candidate = pickTopic(message.content);
    if (previousTopic === "itinerary" && isItineraryEdit(message.content)) continue;
    const details = Object.keys(extractTravelContext([message])).length > 0;
    if (details && (previousTopic === "itinerary" || previousTopic === "hotels")
      && ["fallback", "season", "beaches", "itinerary"].includes(candidate)) continue;
    if (candidate !== "fallback" && candidate !== "greeting") previousTopic = candidate;
  }
  if (previousTopic === "itinerary" && isItineraryEdit(text)) topic = "itinerary";
  const personalized = buildTravelReply(messages, language, topic, previousTopic);
  if (personalized) return personalized;

  const history = messages.filter((message) => message.role === "user").length;
  let reply = findReply(topic, language);

  if (history > 1 && topic !== "greeting") {
    const followUp =
      language === "en"
        ? "\n\nThese are general tips. Check current tides and conditions before your trip."
        : language === "es"
          ? "\n\nSon consejos generales. Consulta las mareas y condiciones actuales antes del viaje."
          : "\n\nEstas são dicas gerais. Confirme as marés e condições atuais antes do passeio.";
    if (!reply.includes("mês") && !reply.includes("month") && !reply.includes("mes")) {
      reply += followUp;
    }
  }

  return reply;
}

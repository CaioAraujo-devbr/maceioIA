import { detectLanguage } from "./detect-language";
import { TOPICS, type TopicId } from "./knowledge";
import type { ChatMessage, Language } from "./types";

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
  let best: { id: TopicId; score: number } = { id: "fallback", score: 0 };

  for (const topic of TOPICS) {
    if (topic.id === "fallback") continue;
    const score = scoreTopic(haystack, topic.keywords);
    const greetingBoost =
      topic.id === "greeting" && haystack.length < 24 ? 1 : 0;
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
  const language = detectLanguage(text);
  const topic = pickTopic(text);

  const history = messages.filter((message) => message.role === "user").length;
  let reply = findReply(topic, language);

  if (history > 1 && topic !== "greeting") {
    const followUp =
      language === "en"
        ? "\n\nIf you share your travel month, I can also warn you about tides and crowds."
        : language === "es"
          ? "\n\nSi me dices el mes del viaje, te aviso de mareas y afluencia."
          : "\n\nSe você me disser o mês da viagem, eu cruzo com maré e lotação.";
    if (!reply.includes("mês") && !reply.includes("month") && !reply.includes("mes")) {
      reply += followUp;
    }
  }

  return reply;
}

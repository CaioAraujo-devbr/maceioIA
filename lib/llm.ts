import { SYSTEM_PROMPT } from "./system-prompt";
import type { ChatMessage } from "./types";

/** Monta o payload no formato da API de chat — pronto para OpenAI/compatíveis. */
export function buildLlmMessages(messages: ChatMessage[]): ChatMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.filter((message) => message.role !== "system"),
  ];
}

import { MAX_MESSAGE_LENGTH, MAX_MESSAGES, MAX_REQUEST_BYTES } from "./chat-limits";
import type { ChatMessage } from "./types";

export const CHAT_SESSION_KEY = "maceioia:conversation:v1";

export function readChatSession(raw: string | null, prompt: string): { messages: ChatMessage[]; input: string } | null {
  if (!raw || raw.length > MAX_REQUEST_BYTES * 2) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const saved = value as Record<string, unknown>;
    if (saved.prompt !== prompt || typeof saved.input !== "string" || saved.input.length > MAX_MESSAGE_LENGTH
      || !Array.isArray(saved.messages) || saved.messages.length > MAX_MESSAGES) return null;
    const messages: ChatMessage[] = [];
    for (const item of saved.messages) {
      if (!item || typeof item !== "object" || (item.role !== "user" && item.role !== "assistant")
        || typeof item.content !== "string" || !item.content.trim() || item.content.length > MAX_MESSAGE_LENGTH) return null;
      messages.push({ role: item.role, content: item.content });
    }
    return { messages, input: saved.input };
  } catch { return null; }
}

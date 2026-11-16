import { NextResponse } from "next/server";
import { buildLlmMessages } from "@/lib/llm";
import { simulateReply } from "@/lib/simulate-reply";
import { MAX_MESSAGE_LENGTH, MAX_MESSAGES, MAX_REQUEST_BYTES } from "@/lib/chat-limits";
import type { ChatMessage } from "@/lib/types";
import { checkChatRate, isSameOriginRequest } from "@/lib/request-protection";

export const runtime = "nodejs";

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Abra o chat pelo site para continuar." }, { status: 403 });
  const rate = checkChatRate(request);
  if (!rate.allowed) return NextResponse.json({ error: "Muitas mensagens em pouco tempo. Aguarde um minuto e tente novamente." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter), "Cache-Control": "no-store" } });
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "Envie os dados em JSON." }, { status: 415 });
  }

  let body: unknown;
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "JSON inválido." }, { status: 400 });

  try {
    const decoder = new TextDecoder();
    let bytes = 0;
    let json = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: "A conversa é muito grande. Inicie uma nova conversa." }, { status: 413 });
      }
      json += decoder.decode(value, { stream: true });
    }
    body = JSON.parse(json + decoder.decode());
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  } finally {
    reader.releaseLock();
  }

  if (!body || typeof body !== "object" || !("messages" in body)) {
    return NextResponse.json({ error: "Envie uma lista de mensagens." }, { status: 400 });
  }
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES || !messages.every(isMessage)) {
    return NextResponse.json(
      { error: `Envie de 1 a ${MAX_MESSAGES} mensagens válidas, com até ${MAX_MESSAGE_LENGTH} caracteres cada.` },
      { status: 400 },
    );
  }
  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "A última mensagem deve ser do usuário." }, { status: 400 });
  }

  const content = simulateReply(buildLlmMessages(messages));
  return NextResponse.json({
    role: "assistant" as const,
    content,
    simulated: true,
    model: "maceioia-local",
  }, { headers: { "Cache-Control": "no-store" } });
}

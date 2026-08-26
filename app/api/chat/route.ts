import { NextResponse } from "next/server";
import { buildLlmMessages } from "@/lib/llm";
import { simulateReply } from "@/lib/simulate-reply";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages[messages.length - 1];

  if (!last || last.role !== "user" || !last.content?.trim()) {
    return NextResponse.json(
      { error: "Envie uma mensagem de usuário." },
      { status: 400 },
    );
  }

  await delay(650 + Math.floor(Math.random() * 500));

  // MVP: respostas simuladas. Quando OPENAI_API_KEY existir,
  // envie `buildLlmMessages(messages)` para o provedor.
  const prepared = buildLlmMessages(messages);
  const content = simulateReply(prepared);

  return NextResponse.json({
    role: "assistant" as const,
    content,
    simulated: true,
    model: "maceioia-local",
  });
}

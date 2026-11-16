import type { Metadata } from "next";
import { buildPlannerPrompt, type EntryParams } from "@/lib/planner-entry";
import { simulateReply } from "@/lib/simulate-reply";
import type { ChatMessage } from "@/lib/types";
import { ChatShell } from "@/components/chat-shell";

export const metadata: Metadata = {
  title: "Chat",
  robots: { index: false, follow: true },
  description:
    "Converse com a MACEIÓ.IA sobre praias, restaurantes, passeios e roteiros em Maceió.",
};

export default async function ChatPage({ searchParams }: { searchParams: Promise<EntryParams> }) {
  const params = await searchParams;
  const prompt = buildPlannerPrompt(params);
  const initialMessages: ChatMessage[] = params.plan === "1" && prompt
    ? [{ role: "user", content: prompt }, { role: "assistant", content: simulateReply([{ role: "user", content: prompt }]) }]
    : [];
  return <ChatShell key={JSON.stringify(params)} initialPrompt={prompt} initialMessages={initialMessages} />;
}

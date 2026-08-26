import type { Metadata } from "next";
import { ChatShell } from "@/components/chat-shell";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Converse com a MaceiôIA sobre praias, restaurantes, passeios e roteiros em Maceió.",
};

export default function ChatPage() {
  return <ChatShell />;
}

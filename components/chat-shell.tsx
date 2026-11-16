"use client";

import Link from "next/link";
import { OfficialSeal } from "./official-seal";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { MAX_MESSAGE_LENGTH, MAX_MESSAGES } from "@/lib/chat-limits";
import type { ChatMessage } from "@/lib/types";
import { CHAT_SESSION_KEY, readChatSession } from "@/lib/chat-session";

const SUGGESTIONS = [
  "Quero um roteiro de 3 dias",
  "Onde comer frutos do mar?",
  "Roteiro econômico de 4 dias com crianças",
  "Best beaches for families",
  "¿Es seguro Maceió de noche?",
];

function renderContent(content: string) {
  const blocks = content.trim().split(/\n\n+/);

  return blocks.map((block, index) => {
    const lines = block.split("\n");
    const ordered = lines.some((line) => /^\d+\. /.test(line));
    const List = ordered ? "ol" : "ul";
    const isList = lines.every((line) => /^(- |\d+\. )/.test(line) || line.trim() === "");

    if (isList) {
      return (
        <List key={index} className={`my-2 ${ordered ? "list-decimal" : "list-disc"} space-y-2 pl-5`}>
          {lines
            .filter((line) => line.trim())
            .map((line, lineIndex) => (
              <li key={lineIndex}>{emphasize(line.replace(/^(- |\d+\. )/, ""))}</li>
            ))}
        </List>
      );
    }

    return (
      <p key={index} className="my-2 leading-relaxed">
        {emphasize(block)}
      </p>
    );
  });
}

function emphasize(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part.split(/(https:\/\/[^\s<>]+)/g).map((piece, linkIndex) => piece.startsWith("https://")
      ? <a key={linkIndex} href={piece} target="_blank" rel="noreferrer" className="chat-source-link">{new URL(piece).hostname.replace(/^www\./, "")} ↗</a>
      : piece)}</span>;
  });
}

type ChatProps = { initialPrompt?: string; initialMessages?: ChatMessage[] };
const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function ChatShell(props: ChatProps) {
  const hydrated = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
  return hydrated ? <ChatConversation {...props}/> : <div className="brand-chat min-h-[100dvh] p-6"><p role="status">Abrindo seu guia…</p><Link href="/">Voltar ao início</Link></div>;
}

function ChatConversation({ initialPrompt = "", initialMessages = [] }: ChatProps) {
  const [saved] = useState(() => {
    try { return readChatSession(sessionStorage.getItem(CHAT_SESSION_KEY), initialPrompt); }
    catch { return null; }
  });
  const [messages, setMessages] = useState<ChatMessage[]>(saved?.messages ?? initialMessages);
  const [input, setInput] = useState(saved?.input ?? (initialMessages.length ? "" : initialPrompt));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeRequest = useRef<AbortController | null>(null);
  const empty = messages.length === 0;
  const [prepared, setPrepared] = useState(Boolean(initialPrompt) && initialMessages.length === 0);

  useEffect(() => {
    if (loading) return;
    try { sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify({ prompt: initialPrompt, messages, input })); }
    catch { /* Sem armazenamento, mantém o estado na página atual. */ }
  }, [loading, initialPrompt, messages, input]);

  useEffect(() => () => activeRequest.current?.abort(), []);

  function resetConversation() {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setPrepared(false);
    setMessages([]);
    setInput("");
    setError(null);
    setLoading(false);
    try { sessionStorage.removeItem(CHAT_SESSION_KEY); } catch { /* Sem armazenamento. */ }
    inputRef.current?.focus();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || activeRequest.current) return;
    if (content.length > MAX_MESSAGE_LENGTH) {
      setError(`Escreva até ${MAX_MESSAGE_LENGTH} caracteres por mensagem.`);
      return;
    }
    if (messages.length >= MAX_MESSAGES) {
      setError("Você chegou ao limite desta conversa. Inicie uma nova conversa para continuar.");
      return;
    }
    const controller = new AbortController();
    activeRequest.current = controller;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao responder.");
      }

      if (typeof data.content !== "string" || !data.content.trim()) {
        throw new Error("A resposta veio vazia. Tente novamente.");
      }
      if (activeRequest.current !== controller) return;
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.content },
      ]);
    } catch (err) {
      if (activeRequest.current !== controller) return;
      setMessages(messages);
      setInput(content);
      setError(controller.signal.aborted
        ? "A resposta demorou demais. Tente enviar novamente."
        : err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
        inputRef.current?.focus();
      }
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    void send(input);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(input);
    }
  }

  const status = useMemo(
    () => (loading ? "escrevendo…" : "PT · EN · ES"),
    [loading],
  );

  return (
    <div className="brand-chat flex min-h-[100dvh] flex-col bg-sand-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ocean-200/70 to-transparent" />

      <header className="chat-topbar sticky top-0 z-20 border-b border-ocean-900/10 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <OfficialSeal decorative/>
            <div className="chat-wordmark"><p>MACEIÓ<span>.IA</span></p><small>{status}</small></div>
          </Link>
          <button
            type="button"
            onClick={resetConversation}
            className="chat-reset rounded-full border border-ocean-200 px-3 py-1.5 text-xs font-medium text-ocean-800 hover:bg-ocean-50"
          >
            Nova conversa
          </button>
        </div>
      </header>

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-3 pb-[calc(14rem+env(safe-area-inset-bottom))] pt-4 sm:px-4">
        {empty && (
          <div className="my-auto flex flex-col items-center px-2 pb-8 pt-6 text-center">
            <p className="rounded-full bg-coral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-coral-700">
              Guia local de Alagoas
            </p>
            <h1 className="mt-4 font-display text-3xl text-ocean-950 sm:text-4xl">
              {prepared ? "Confira sua pergunta e envie." : "O que você quer descobrir em Maceió?"}
            </h1>
            <p className="mt-3 max-w-md text-sm text-ocean-800/80">
              {prepared
                ? "Confira os detalhes no campo abaixo, ajuste o que quiser e toque em enviar para começar."
                : "Conte quantos dias ficará, o mês e seu perfil. Eu organizo uma sugestão inicial e uso os detalhes desta conversa para ajustar o roteiro."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void send(suggestion)}
                  className="rounded-full border border-ocean-200 bg-white px-3 py-2 text-left text-sm text-ocean-900 shadow-sm transition hover:border-coral-300 hover:bg-coral-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4" role="log" aria-label="Mensagens da conversa" aria-live="polite" aria-relevant="additions" aria-busy={loading}>
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm sm:text-[15px] ${
                message.role === "user"
                  ? "ml-auto bg-ocean-700 text-white shadow-card"
                  : "mr-auto border border-ocean-100 bg-white text-ocean-950 shadow-card"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="prose-chat">{renderContent(message.content)}</div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              )}
            </article>
          ))}

          {loading && (
            <div className="mr-auto flex items-center gap-2 rounded-3xl border border-ocean-100 bg-white px-4 py-3 shadow-card">
              <span className="h-2 w-2 animate-bounce rounded-full bg-ocean-400 [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-coral-400 [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ocean-600" />
              <span className="text-xs text-ocean-600">MACEIÓ.IA está pensando</span>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-2xl bg-coral-50 px-3 py-2 text-sm text-coral-800">{error}</p>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ocean-900/10 bg-white/90 px-3 py-3 backdrop-blur-xl"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            rows={input.length > 80 ? 3 : 1}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-label="Sua mensagem"
            aria-describedby="chat-notice"
            placeholder="Pergunte sobre praias, restaurantes, passeios…"
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-ocean-200 bg-sand-50 px-4 py-3 text-sm text-ocean-950 outline-none ring-coral-400 placeholder:text-ocean-700/40 focus:ring-2"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral-500 text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Enviar mensagem"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="chat-send-label">Enviar</span>
          </button>
        </div>
        <p id="chat-notice" className="mx-auto mt-2 max-w-3xl text-center text-xs text-ocean-700">
          Sem consulta em tempo real. A conversa fica nesta aba; “Nova conversa” apaga o histórico.
        </p>
      </form>
    </div>
  );
}

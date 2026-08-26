# MaceiôIA

Agente de turismo inteligente para **Maceió, Alagoas**. Site em Next.js 14 (App Router) com chat em português, inglês e espanhol.

Neste MVP as respostas são **simuladas** (conhecimento local no servidor, sem API key). O prompt do sistema e o payload `buildLlmMessages` já estão prontos para um provedor depois.

## Rodar localmente

Requisitos: Node.js 18+.

```bash
cd ~/Projects/maceio-ia
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O chat fica em `/chat`.

## Deploy na Vercel

1. Suba o repositório no GitHub.
2. Importe o projeto em [vercel.com/new](https://vercel.com/new) — o preset Next.js detecta `npm run build`.
3. (Opcional) defina `NEXT_PUBLIC_SITE_URL` com a URL de produção.
4. (Futuro) `OPENAI_API_KEY` quando for ligar um LLM de verdade.

Não é obrigatório um `vercel.json`; a estrutura padrão do App Router já funciona.

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm start` — serve o build
- `npm run lint` — ESLint

## Onde está o “cérebro”

- `lib/system-prompt.ts` — persona e conhecimento profundo de Maceió
- `lib/knowledge.ts` — respostas simuladas por tema e idioma
- `lib/simulate-reply.ts` — escolha de tema + idioma
- `app/api/chat/route.ts` — API do chat

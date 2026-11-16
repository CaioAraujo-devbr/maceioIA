const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Executa os módulos TS reais sem acrescentar um runner ao projeto.
const cache = new Map();
function load(relative) {
  const filename = path.resolve(__dirname, "..", relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const localRequire = (id) => {
    if (id.startsWith("@/")) return load(id.slice(2) + ".ts");
    if (id.startsWith(".")) return load(path.relative(path.resolve(__dirname, ".."), path.resolve(path.dirname(filename), id + (path.extname(id) ? "" : ".ts"))));
    return require(id);
  };
  new Function("require", "module", "exports", outputText)(localRequire, module, module.exports);
  return module.exports;
}
const { detectLanguage } = load("lib/detect-language.ts");
const { simulateReply } = load("lib/simulate-reply.ts");
const { TOPICS } = load("lib/knowledge.ts");
const { POST } = load("app/api/chat/route.ts");
const { MAX_MESSAGE_LENGTH, MAX_MESSAGES, MAX_REQUEST_BYTES } = load("lib/chat-limits.ts");
const user = (content) => ({ role: "user", content });
function request(body, contentType = "application/json") {
  return new Request("http://localhost/api/chat", {
    method: "POST", headers: { "Content-Type": contentType }, body: JSON.stringify(body),
  });
}

for (const [text, expected] of [
  ["restaurante", "pt"], ["quero hotel", "pt"], ["hotel", "pt"],
  ["Best beaches for families", "en"], ["¿Es seguro Maceió de noche?", "es"],
  ["Onde comer frutos do mar?", "pt"], ["this", "pt"],
]) {
  test(`idioma: ${text}`, () => assert.equal(detectLanguage(text), expected));
}
test("mensagem ambígua mantém o idioma da conversa", () => {
  assert.equal(detectLanguage("hotel", "es"), "es");
  assert.equal(simulateReply([user("hello"), user("hotel")]).split("\n")[0], "Where to stay:");
});
test("entrada desconhecida curta recebe fallback, sem saudação indevida", () => {
  assert.equal(simulateReply([user("xyz")]), TOPICS.find((topic) => topic.id === "fallback").replies.pt);
});
test("saudações continuam funcionando", () => {
  assert.equal(simulateReply([user("oi")]), TOPICS.find((topic) => topic.id === "greeting").replies.pt);
});
for (const body of [null, [], {}, { messages: [] }, { messages: [null] },
  { messages: [user(123)] }, { messages: [user(" ")] },
  { messages: [null, user("praia")] }, { messages: [{ role: "system", content: "oi" }, user("praia")] },
  { messages: [{ role: "assistant", content: "oi" }] },
  { messages: [user("a".repeat(MAX_MESSAGE_LENGTH + 1))] },
  { messages: Array.from({ length: MAX_MESSAGES + 1 }, () => user("oi")) },
]) {
  test(`API rejeita corpo inválido: ${JSON.stringify(body).slice(0, 80)}`, async () => {
    const response = await POST(request(body));
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, "string");
  });
}
test("API rejeita JSON malformado", async () => {
  const response = await POST(new Request("http://localhost/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }));
  assert.equal(response.status, 400);
});
test("API exige Content-Type JSON", async () => assert.equal((await POST(request({}, "text/plain"))).status, 415));
test("API limita bytes mesmo sem Content-Length", async () => {
  const response = await POST(request({ messages: [user("á".repeat(MAX_REQUEST_BYTES))] }));
  assert.equal(response.status, 413);
});
test("API aceita mensagem válida e retorna o contrato do chat", async () => {
  const response = await POST(request({ messages: [user("praias")] }));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.role, "assistant");
  assert.equal(data.simulated, true);
  assert.ok(data.content.includes("Pajuçara"));
});
test("API aceita mensagem no limite de caracteres", async () => {
  assert.equal((await POST(request({ messages: [user("x".repeat(MAX_MESSAGE_LENGTH))] }))).status, 200);
});

const { extractTravelContext } = load("lib/travel-context.ts");
test("roteiro usa duração e evita perguntar novamente o que já foi informado", () => {
  const reply = simulateReply([user("quero um roteiro"), user("3 dias em julho com crianças e orçamento econômico")]);
  assert.ok(reply.includes("3 dias"));
  assert.ok(reply.includes("julho"));
  assert.ok(reply.includes("com crianças"));
  assert.ok(reply.includes("Dia 3:"));
  assert.ok(!reply.includes("Dia 4:"));
  assert.ok(!reply.includes("Quantos dias"));
  assert.ok(!reply.includes("Em que mês"));
  assert.ok(!reply.includes("Gunga:"));
});
test("detalhes em várias mensagens preservam o planejamento e aceitam correções", () => {
  const history = [user("roteiro de 3 dias em janeiro"), user("com crianças"), user("econômico"), user("na verdade, 5 dias em julho"), user("prefiro cultura")];
  assert.deepEqual(extractTravelContext(history), { days: 5, month: 6, children: true, budget: "low", interest: "culture" });
  const reply = simulateReply(history);
  assert.ok(reply.includes("Dia 5:"));
  assert.ok(reply.includes("Pontal da Barra"));
  assert.ok(reply.includes("julho"));
  assert.ok(!reply.includes("janeiro"));
});
test("não usa detalhes inventados pelo assistente como preferências do visitante", () => {
  assert.deepEqual(extractTravelContext([{ role: "assistant", content: "7 dias em janeiro com crianças" }, user("oi")]), {});
});
test("preferência sem crianças substitui a anterior", () => {
  const context = extractTravelContext([user("3 dias com crianças"), user("agora vamos sem crianças")]);
  assert.equal(context.children, false);
});
test("resposta curta sobre orçamento continua o assunto de hospedagem", () => {
  const reply = simulateReply([user("hotel"), user("econômico com crianças")]);
  assert.ok(reply.startsWith("Hospedagem:"));
  assert.ok(reply.includes("custo total"));
  assert.ok(reply.includes("Com crianças"));
});
test("planejador mantém inglês com continuação ambígua", () => {
  const reply = simulateReply([user("I want an itinerary"), user("three days"), user("July"), user("with kids")]);
  assert.ok(reply.includes("Day 3:"));
  assert.ok(reply.includes("July"));
  assert.ok(reply.includes("with children"));
});
test("planejador usa espanhol e números por extenso", () => {
  const reply = simulateReply([user("Quiero un itinerario"), user("cuatro días con niños en enero")]);
  assert.ok(reply.includes("Día 4:"));
  assert.ok(reply.includes("enero"));
});
test("pedido de roteiro não é substituído por um destino mencionado", () => {
  const reply = simulateReply([user("roteiro de 3 dias com Gunga")]);
  assert.ok(reply.includes("Dia 3:"));
});
test("pergunta direta pode mudar o assunto da conversa", () => {
  const reply = simulateReply([user("roteiro de 3 dias"), user("onde comer frutos do mar?")]);
  assert.ok(reply.startsWith("Comida em Maceió"));
});
test("nova conversa não herda detalhes da anterior", () => {
  simulateReply([user("roteiro de 5 dias em julho com crianças")]);
  const reply = simulateReply([user("quero roteiro")]);
  assert.ok(reply.includes("Quantos dias"));
  assert.ok(!reply.includes("julho"));
});
test("roteiros longos cabem no histórico aceito pela API", async () => {
  const content = simulateReply([user("roteiro econômico de 30 dias em julho com crianças")]);
  assert.ok(content.length <= MAX_MESSAGE_LENGTH, content.length);
  const response = await POST(request({ messages: [user("roteiro de 30 dias"), { role: "assistant", content }, user("prefiro cultura")] }));
  assert.equal(response.status, 200);
});

test("ajustes de interesse não interrompem o roteiro nas próximas mensagens", () => {
  const reply = simulateReply([user("roteiro de 3 dias"), user("prefiro praias"), user("econômico"), user("julho")]);
  assert.ok(reply.includes("Dia 3:"));
  assert.ok(reply.includes("econômico"));
  assert.ok(reply.includes("julho"));
});
test("negação comum não é interpretada como viagem com crianças", () => {
  assert.equal(extractTravelContext([user("não tenho crianças")]).children, false);
});

test("resposta apenas com o número atende à pergunta de duração", () => {
  const reply = simulateReply([user("quero um roteiro"), { role: "assistant", content: "Quantos dias você ficará?" }, user("3")]);
  assert.ok(reply.includes("Dia 3:"));
  assert.ok(!reply.includes("Quantos dias"));
});

test("roteiro de sete dias distribui atividades diferentes", () => {
  const reply = simulateReply([user("roteiro econômico de 7 dias com crianças em julho, prefiro cultura")]);
  const activities = reply.split("\n").filter((line) => /^\d+\./.test(line)).map((line) => line.split(":** ")[1]);
  assert.equal(activities.length, 7);
  assert.equal(new Set(activities).size, 7);
});

const { buildPlannerPrompt, chatHref } = load("lib/planner-entry.ts");
test("formulário prepara um pedido reconhecido pelo planejador", () => {
  const prompt = buildPlannerPrompt({ days: "5", month: "7", profile: "family", budget: "low" });
  assert.deepEqual(extractTravelContext([user(prompt)]), { days: 5, month: 6, children: true, budget: "low" });
  assert.ok(simulateReply([user(prompt)]).includes("Dia 5:"));
});
test("entrada do formulário valida parâmetros e ignora opções desconhecidas", () => {
  assert.equal(buildPlannerPrompt({ days: "-1" }), "");
  assert.equal(buildPlannerPrompt({ days: "3.5" }), "");
  assert.equal(buildPlannerPrompt({ days: ["3", "5"] }), "");
  const prompt = buildPlannerPrompt({ days: "3", month: "13", budget: "<script>", profile: "inventado" });
  assert.equal(prompt, "Quero um roteiro de 3 dias em Maceió.");
});
test("atalhos preservam acentos e caracteres ao preparar o chat", () => {
  const question = "Onde comer? Praia & gastronomia";
  const params = Object.fromEntries(new URL(chatHref(question), "http://localhost").searchParams);
  assert.equal(buildPlannerPrompt(params), question);
  assert.equal(buildPlannerPrompt({ q: "x".repeat(MAX_MESSAGE_LENGTH + 10) }).length, MAX_MESSAGE_LENGTH);
});

const { createItinerary } = load("lib/travel-context.ts");
test("troca Gunga por Ipioca e preserva o restante do contexto", () => {
  const messages = [user("roteiro de 3 dias em julho"), user("troque Gunga por Ipioca")];
  const reply = simulateReply(messages);
  assert.ok(reply.includes("Dia 3:"));
  assert.ok(reply.includes("Ipioca:"));
  assert.ok(!reply.includes("Gunga:"));
  assert.ok(reply.includes("julho"));
  const next = simulateReply([...messages, user("econômico")]);
  assert.ok(next.includes("Ipioca:"));
  assert.ok(!next.includes("Gunga:"));
});
test("exclusão direta evita incluir o destino no roteiro", () => {
  const reply = simulateReply([user("roteiro de 5 dias, não quero ir ao Gunga")]);
  assert.ok(!reply.includes("Gunga:"));
});
test("destino solicitado explicitamente é incluído em viagem econômica", () => {
  const reply = simulateReply([user("roteiro econômico de 3 dias com Gunga")]);
  assert.ok(reply.includes("Gunga:"));
});
test("sem carro evita deslocamentos longos por padrão", () => {
  const prompt = buildPlannerPrompt({ days: "5", transport: "transfer", interest: "culture" });
  const days = createItinerary(extractTravelContext([user(prompt)]));
  assert.equal(days.length, 5);
  assert.ok(!days.some((day) => ["beach", "extra", "maragogi"].includes(day.key)));
  assert.ok(days.some((day) => day.key === "culture"));
});
test("dizer sem carro não exclui um destino solicitado", () => {
  const days = createItinerary(extractTravelContext([user("roteiro de 3 dias sem carro, quero Gunga")]));
  assert.ok(days.some((day) => day.key === "beach"));
});
test("correção de mês na mesma mensagem usa a última menção", () => {
  assert.equal(extractTravelContext([user("julho não, janeiro")]).month, 0);
});
test("entrada do formulário ignora propriedades herdadas de objetos", () => {
  const prompt = buildPlannerPrompt({ days: "3", profile: "constructor", budget: "toString", interest: "__proto__" });
  assert.equal(prompt, "Quero um roteiro de 3 dias em Maceió.");
});
test("planejador entrega dias numerados e marca atividades que dependem da maré", () => {
  const days = createItinerary({ days: 3 });
  assert.deepEqual(days.map((day) => day.day), [1, 2, 3]);
  assert.ok(days.find((day) => day.key === "reefs").tideDependent);
  assert.equal(createItinerary({ days: 0 }).length, 0);
});

test("pedido para incluir um destino continua o roteiro levado ao chat", () => {
  const prompt = buildPlannerPrompt({ days: "3", transport: "transfer" });
  const reply = simulateReply([user(prompt), { role: "assistant", content: simulateReply([user(prompt)]) }, user("Quero incluir Ipioca")]);
  assert.ok(reply.includes("Dia 3:"));
  assert.ok(reply.includes("Ipioca:"));
  assert.ok(reply.includes("Sem carro:"));
});

const { searchVisitorGuides, VISITOR_GUIDES } = load("lib/visitor-guides.ts");
test("guia prático encontra aeroporto, hotel e alimentação", () => {
  assert.equal(searchVisitorGuides("como sair do aeroporto")[0].slug, "transporte");
  assert.equal(searchVisitorGuides("HOTÉIS")[0].slug, "hospedagem");
  assert.equal(searchVisitorGuides("onde comer")[0].slug, "alimentacao");
});
test("busca normaliza acentos e trata consulta vazia ou sem resultado", () => {
  assert.ok(searchVisitorGuides("crianças").some((guide) => guide.slug === "familia"));
  assert.equal(searchVisitorGuides("").length, VISITOR_GUIDES.length);
  assert.equal(searchVisitorGuides("astronauta").length, 0);
  assert.equal(searchVisitorGuides("como onde para").length, 0);
});

const { getItineraryWarnings } = load("lib/travel-context.ts");
test("auditoria: Maragogi tem prioridade em um roteiro de um dia", () => {
  const context = extractTravelContext([user("Quero um roteiro de 1 dia incluindo Maragogi")]);
  const plan = createItinerary(context);
  assert.equal(plan.length, 1);
  assert.equal(plan[0].key, "maragogi");
  assert.ok(simulateReply([user("Quero um roteiro de 1 dia incluindo Maragogi")]).includes("Maragogi:"));
});
test("destinos que não cabem são informados em vez de omitidos silenciosamente", () => {
  const context = { days: 1, preferred: ["maragogi", "gunga"] };
  assert.equal(createItinerary(context)[0].key, "maragogi");
  assert.ok(getItineraryWarnings(context).some((warning) => warning.includes("gunga") && warning.includes("Não couberam")));
});
test("pedido explícito sem carro continua incluindo bate-volta e alerta de logística", () => {
  const reply = simulateReply([user("roteiro econômico de 1 dia sem carro incluindo Maragogi com crianças")]);
  assert.ok(reply.includes("Maragogi:"));
  assert.ok(reply.includes("Sem carro:"));
  assert.ok(reply.includes("Com crianças"));
});
test("formulário e motor só entregam o período completo suportado", () => {
  for (const days of [8, 15, 30]) {
    assert.equal(buildPlannerPrompt({ days: String(days) }), "");
    assert.equal(createItinerary({ days }).length, 0);
    const reply = simulateReply([user(`Quero roteiro de ${days} dias`)]);
    assert.ok(reply.includes("1 a 7 dias"));
    assert.ok(!reply.includes("Dia 1:"));
  }
  for (let days = 1; days <= 7; days++) assert.equal(createItinerary({ days }).length, days);
});
test("destino do formulário sobrevive à passagem para o chat", () => {
  const prompt = buildPlannerPrompt({ days: "1", month: "12", place: "maragogi", transport: "transfer" });
  assert.equal(createItinerary(extractTravelContext([user(prompt)]))[0].key, "maragogi");
  assert.equal(extractTravelContext([user(prompt)]).month, 11);
  assert.equal(buildPlannerPrompt({ days: "3", place: "constructor" }), "Quero um roteiro de 3 dias em Maceió.");
});
test("auditoria: a resposta do Gunga identifica Roteiro em todos os idiomas", () => {
  for (const text of ["Quero visitar Gunga. Em qual cidade fica?", "Where is Gunga?", "¿Dónde está Gunga?"]) {
    const reply = simulateReply([user(text)]);
    assert.ok(reply.includes("Roteiro"));
    assert.ok(!reply.includes("(Barra de São Miguel)"));
  }
});
test("auditoria: pergunta sobre maré atual abre fonte sem fingir consulta", () => {
  for (const text of ["Qual a maré de amanhã?", "tides tomorrow", "¿Marea mañana?"]) {
    const reply = simulateReply([user(text)]);
    assert.ok(reply.includes("https://www.marinha.mil.br/chm/tabuas-de-mare"));
    assert.ok(!reply.includes("Reformule"));
    assert.ok(!/\d{1,2}:\d{2}/.test(reply));
  }
});
test("pergunta de maré muda o assunto sem apagar a possibilidade de ajustar o roteiro", () => {
  const history = [user("roteiro de 3 dias"), user("qual a maré de amanhã?")];
  assert.ok(simulateReply(history).includes("Não consulto previsões"));
  assert.ok(simulateReply([...history, user("troque Gunga por Ipioca")]).includes("Ipioca:"));
});
test("auditoria: cotação de transporte não fornece preço ou tempo inventado", () => {
  const reply = simulateReply([user("Quanto custa um Uber do aeroporto para Ponta Verde?")]);
  assert.ok(reply.includes("Não tenho uma cotação atual"));
  assert.ok(!reply.includes("20–30"));
  assert.ok(!/R\$\s*\d/.test(reply));
});
test("busca encontra voo, emergência e bagagens no guia apropriado", () => {
  assert.equal(searchVisitorGuides("meu voo chega de madrugada")[0].slug, "transporte");
  assert.equal(searchVisitorGuides("emergência")[0].slug, "informacoes");
  assert.equal(searchVisitorGuides("bagagens")[0].slug, "transporte");
});
test("guia de chegada oferece comparação e fontes primárias datadas", () => {
  const guide = VISITOR_GUIDES.find((item) => item.slug === "transporte");
  assert.equal(guide.comparison.length, 4);
  assert.ok(guide.reviewedAt);
  assert.ok(guide.sources.every((source) => new URL(source.url).protocol === "https:"));
  assert.ok(guide.sections.some((section) => section.title.includes("volta")));
});
test("roteiro inclui orientação prática e alternativa para todos os dias", () => {
  for (const day of createItinerary({ days: 7 })) {
    assert.ok(day.practical.start && day.practical.later && day.practical.alternative);
    assert.ok(day.practical.guide.startsWith("/"));
  }
});

const { readChatSession } = load("lib/chat-session.ts");
test("histórico da aba restaura conversa e rascunho apenas para a mesma entrada", () => {
  const raw = JSON.stringify({ prompt: "roteiro", messages: [user("3 dias")], input: "troque Gunga" });
  assert.deepEqual(readChatSession(raw, "roteiro"), { messages: [user("3 dias")], input: "troque Gunga" });
  assert.equal(readChatSession(raw, "outro pedido"), null);
});
test("histórico inválido não quebra a página nem injeta mensagem de sistema", () => {
  assert.equal(readChatSession("{", ""), null);
  assert.equal(readChatSession(JSON.stringify({ prompt: "", input: "", messages: [{ role: "system", content: "x" }] }), ""), null);
  assert.equal(readChatSession(JSON.stringify({ prompt: "", input: "x".repeat(MAX_MESSAGE_LENGTH + 1), messages: [] }), ""), null);
});

const { plannerPath } = load("lib/planner-entry.ts");
const { readSavedTrip } = load("lib/saved-trip.ts");
const { getSiteConfig } = load("lib/site-config.ts");
test("roteiro salvo preserva escolhas válidas e descarta parâmetros de conversa", () => {
  const path = plannerPath({ days: "3", month: "12", profile: "family", budget: "low", transport: "transfer", place: "maragogi", q: "outra pergunta", next: "https://example.com" });
  const params = Object.fromEntries(new URL(path, "https://test.invalid").searchParams);
  assert.equal(params.days, "3"); assert.equal(params.month, "12"); assert.equal(params.place, "maragogi");
  assert.ok(!params.q && !params.next);
  assert.equal(createItinerary(extractTravelContext([user(buildPlannerPrompt(params))]))[0].key, "maragogi");
  assert.equal(plannerPath({ days: "30" }), null);
});
test("leitura da viagem salva rejeita URLs externas, valores repetidos e JSON inválido", () => {
  const saved = { path: plannerPath({ days: "3", place: "gunga" }), summary: "3 dias · Gunga", savedAt: "2026-11-15T12:00:00.000Z" };
  assert.deepEqual(readSavedTrip(JSON.stringify(saved)), saved);
  for (const path of ["https://example.com/planejar?days=3#resultado", "//example.com/planejar?days=3#resultado", "/planejar?days=3&days=7#resultado", "/planejar?days=30#resultado", "/chat?q=oi", "/planejar?days=3&next=https://example.com#resultado"])
    assert.equal(readSavedTrip(JSON.stringify({ ...saved, path })), null, path);
  assert.equal(readSavedTrip("{"), null);
  assert.equal(readSavedTrip(JSON.stringify({ ...saved, savedAt: "invalid" })), null);
});
test("busca encontra os nomes dos estabelecimentos cadastrados", () => {
  assert.equal(searchVisitorGuides("Wanchako")[0].slug, "alimentacao");
  assert.equal(searchVisitorGuides("Meridiano")[0].slug, "hospedagem");
  for (const slug of ["alimentacao", "hospedagem"]) {
    const guide = VISITOR_GUIDES.find((item) => item.slug === slug);
    assert.ok(guide.reviewedAt && guide.places.length >= 2);
    assert.ok(guide.places.every((place) => /^https:/.test(place.source) && /^\+55\d+$/.test(place.phone)));
  }
});
test("configuração do domínio não inventa um endereço público para a prévia", () => {
  assert.deepEqual(getSiteConfig(""), { origin: "http://127.0.0.1:3000", publicSite: false });
  assert.equal(getSiteConfig("http://localhost:3000").publicSite, false);
  assert.equal(getSiteConfig("javascript:alert(1)").publicSite, false);
  assert.equal(getSiteConfig("https://user:password@example.com").publicSite, false);
  assert.deepEqual(getSiteConfig("https://maceio.example.com/algum-caminho"), { origin: "https://maceio.example.com", publicSite: true });
});


const { createRateLimiter, isSameOriginRequest } = load("lib/request-protection.ts");
test("proteção: limite é independente por visitante e libera na expiração", () => {
  const limit = createRateLimiter(2, 1000);
  assert.equal(limit("a", 100).allowed, true);
  assert.equal(limit("a", 200).allowed, true);
  assert.deepEqual(limit("a", 300), { allowed: false, retryAfter: 1 });
  assert.equal(limit("b", 300).allowed, true);
  assert.equal(limit("a", 1100).allowed, true);
});
test("proteção: capacidade limitada não expulsa visitantes para contornar a cota", () => {
  const limit = createRateLimiter(1, 1000, 1);
  assert.equal(limit("a", 0).allowed, true);
  assert.equal(limit("b", 1).allowed, false);
  assert.equal(limit("a", 2).allowed, false);
  assert.equal(limit("b", 1000).allowed, true);
});
test("proteção: aceita mesma origem e rejeita origem externa, nula e cross-site", () => {
  const req = (headers) => new Request("https://maceio.example.com/api/chat", { headers });
  assert.equal(isSameOriginRequest(req({})), true);
  assert.equal(isSameOriginRequest(req({ origin: "https://maceio.example.com" })), true);
  for (const headers of [{ origin: "https://outro.example.com" }, { origin: "null" }, { "sec-fetch-site": "cross-site" }]) assert.equal(isSameOriginRequest(req(headers)), false);
});
test("API rejeita requisição de outra origem sem executar o chat", async () => {
  const req = new Request("http://localhost/api/chat", { method: "POST", headers: { "content-type": "application/json", origin: "https://other.example.com" }, body: JSON.stringify({ messages: [user("oi")] }) });
  assert.equal((await POST(req)).status, 403);
});
test("prévia nunca indexa mesmo com domínio de produção configurado", () => {
  for (const env of ["preview", "development"]) assert.equal(getSiteConfig("https://maceio.example.com", env).publicSite, false);
  assert.equal(getSiteConfig("https://maceio.example.com", "production").publicSite, true);
});
test("configuração aproveita domínio de produção fornecido pela Vercel", () => {
  assert.deepEqual(getSiteConfig("", "production", "maceio-test.vercel.app"), { origin: "https://maceio-test.vercel.app", publicSite: true });
  assert.equal(getSiteConfig("", "preview", "maceio-test.vercel.app").publicSite, false);
  assert.equal(getSiteConfig("http://localhost:3000", "production", "maceio-test.vercel.app").publicSite, false);
});
test("API limita abuso com resposta legível e tempo de espera", async () => {
  let response;
  for (let i = 0; i < 201; i++) {
    response = await POST(request({ messages: [user("oi")] }));
    if (response.status === 429) break;
  }
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok((await response.json()).error.includes("Aguarde"));
});

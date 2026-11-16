import type { ChatMessage, Language } from "./types";
import type { TopicId } from "./knowledge";

export function normalizeText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type Budget = "low" | "mid" | "comfort";
export type PlaceKey = "gunga" | "ipioca" | "maragogi";

type Interest = "beach" | "food" | "culture";
export const MAX_ITINERARY_DAYS = 7;
export type TravelContext = {
  days?: number;
  month?: number;
  children?: boolean;
  budget?: Budget;
  interest?: Interest;
  transport?: "car" | "transfer";
  preferred?: PlaceKey[];
  excluded?: PlaceKey[];
};

const MONTHS = {
  pt: "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split(" "),
  en: "January February March April May June July August September October November December".split(" "),
  es: "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "),
};
const NUMBER_WORDS: Record<string, number> = {
  um: 1, uma: 1, one: 1, un: 1, uno: 1, dois: 2, duas: 2, two: 2, dos: 2,
  tres: 3, three: 3, quatro: 4, four: 4, cuatro: 4, cinco: 5, five: 5,
  seis: 6, six: 6, sete: 7, seven: 7, siete: 7,
};

export function extractTravelContext(messages: ChatMessage[]): TravelContext {
  const context: TravelContext = {};
  for (const message of messages) {
    if (message.role !== "user") continue;
    const text = normalizeText(message.content);
    const duration = text.match(/\b(\d+|um|uma|one|un|uno|dois|duas|two|dos|tres|three|quatro|four|cuatro|cinco|five|seis|six|sete|seven|siete)\s+(?:dias?|days?)\b/);
    if (duration) {
      const days = NUMBER_WORDS[duration[1]] ?? Number(duration[1]);
      if (days >= 1 && days <= 30) context.days = days;
    } else if (/\b(uma semana|one week|una semana)\b/.test(text)) context.days = 7;
    else {
      const answer = text.trim();
      const days = NUMBER_WORDS[answer] ?? (/^\d+$/.test(answer) ? Number(answer) : 0);
      if (days >= 1 && days <= 30) context.days = days;
    }

    const mentionedMonth = Object.values(MONTHS).flatMap((names) => names.map((name, index) => ({ index, position: text.search(new RegExp(`\\b${normalizeText(name)}\\b`)) })))
      .filter(({ position }) => position >= 0).sort((a, b) => a.position - b.position).at(-1);
    if (mentionedMonth) context.month = mentionedMonth.index;
    if (/\b(sem criancas?|nao (?:tenho|tem|levo|vou com|viajo com) criancas?|sin ninos?|without (?:kids|children)|no kids|so adultos|adults only)\b/.test(text)) context.children = false;
    else if (/\b(criancas?|ninos?|kids|children|bebe|baby)\b/.test(text)) context.children = true;
    if (/\b(economic[oa]|economizar|barato|budget|cheap|low cost|bajo presupuesto)\b/.test(text)) context.budget = "low";
    else if (/\b(conforto|comfort|luxo|luxury|lujo)\b/.test(text)) context.budget = "comfort";
    else if (/\b(medio|intermediario|midrange|moderate)\b/.test(text)) context.budget = "mid";
    if (/\b(sem carro|sin coche|without a car|no car|transfer|transfers)\b/.test(text)) context.transport = "transfer";
    else if (/\b(com carro|carro alugado|rental car|with a car|con coche)\b/.test(text)) context.transport = "car";
    const swap = text.match(/\b(?:troque|trocar|substitua|substituir|replace|cambia)\s+(?:o |a )?(gunga|ipioca|maragogi)\s+(?:por|with)\s+(gunga|ipioca|maragogi)\b/);
    for (const place of ["gunga", "ipioca", "maragogi"] as PlaceKey[]) {
      if (!new RegExp(`\\b${place}\\b`).test(text)) continue;
      const negative = new RegExp(`\\b(?:sem|without|avoid|skip|exclua|retire|tire|remova)\\s+(?:(?:o|a)\\s+)?${place}\\b|\\b(?:nao|no)\\s+(?:quero|vamos|vou|quiero)\\s+(?:ir\\s+)?(?:a[oa]?\\s+)?${place}\\b`).test(text) || swap?.[1] === place;
      if (negative) {
        context.excluded = [...new Set([...(context.excluded ?? []), place])];
        if (context.preferred) context.preferred = context.preferred.filter((item) => item !== place);
      } else {
        context.preferred = [...new Set([...(context.preferred ?? []), place])];
        if (context.excluded) context.excluded = context.excluded.filter((item) => item !== place);
      }
    }
    if (/\b(historia|history|cultura|culture|cultural)\b/.test(text)) context.interest = "culture";
    else if (/\b(gastronomia|comida|food|comer|seafood)\b/.test(text)) context.interest = "food";
    else if (/\b(praias?|beaches|beach|playas?)\b/.test(text)) context.interest = "beach";
  }
  return context;
}

const COPY = {
  pt: {
    title: "Sugestão inicial para sua viagem", day: "Dia", days: "dias", month: "mês", kids: "com crianças", adults: "sem crianças",
    budgets: { low: "econômico", mid: "intermediário", comfort: "conforto" }, budget: "orçamento",
    askDays: "Quantos dias você ficará? Organizo roteiros completos de 1 a 7 dias.",
    askMonth: "Em que mês será a viagem?", askProfile: "Você prefere praias, gastronomia ou cultura?",
    shore: "Ponta Verde e Pajuçara: caminhada na orla e tempo livre.",
    reefs: "Pajuçara: piscinas naturais somente se a maré e as condições permitirem; caso contrário, artesanato e gastronomia.",
    beach: "Gunga: reserve o dia para um passeio, com transporte de ida e volta combinado.",
    family: "Dia de praia com pausas e pouca troca de lugar; escolha o trecho conforme as condições locais.",
    local: "Jatiúca: combine uma caminhada na orla com uma pausa para almoço. Volte à região da hospedagem sem incluir outro bate-volta.",
    food: "Gastronomia: almoço e passeio por Ponta Verde ou Jatiúca, respeitando seu orçamento.",
    culture: "Cultura: artesanato no Pontal da Barra; confirme os horários antes de sair.",
    extra: "Ipioca: passeio de dia, com retorno planejado.",
    maragogi: "Maragogi: reserve o dia e combine o transporte de ida e volta; as piscinas dependem da maré e das condições locais.",
    rest: "Dia livre para descansar ou repetir o passeio preferido.",
    familyNote: "Com crianças, mantenha pausas e confirme as condições do mar antes do banho.",
    lowNote: "Para economizar, compare o custo total de alimentação e transporte antes de reservar.",
    comfortNote: "Para mais conforto, considere transfer e intervalos maiores entre passeios; confirme os valores com os prestadores.",
    caveat: "Sugestão automática baseada nas informações desta conversa. Não consulto marés, clima, preços ou disponibilidade em tempo real.",
    hotel: "Hospedagem: comece comparando Pajuçara e Ponta Verde, conforme seus deslocamentos.",
    hotelLow: "Compare o custo total de pousadas e hotéis, incluindo café da manhã e transporte; não tenho tarifas atuais.",
    hotelKids: "Com crianças, confira estrutura, acessibilidade e configuração do quarto diretamente com a hospedagem.",
    hotelAsk: "Qual é o seu orçamento: econômico, intermediário ou conforto?",
  },
  en: {
    title: "A starting plan for your trip", day: "Day", days: "days", month: "month", kids: "with children", adults: "without children",
    budgets: { low: "budget", mid: "midrange", comfort: "comfort" }, budget: "budget",
    askDays: "How many days will you stay? I organize complete itineraries of 1 to 7 days.",
    askMonth: "Which month are you visiting?", askProfile: "Do you prefer beaches, food or culture?",
    shore: "Ponta Verde and Pajuçara: waterfront walk and free time.",
    reefs: "Pajuçara: reef pools only if tides and sea conditions allow; otherwise, crafts and food.",
    beach: "Gunga: allow a full outing and arrange return transport.",
    family: "A beach day with breaks and fewer stops; choose your spot according to local conditions.",
    local: "More time on the waterfront without another long journey.",
    food: "Food: lunch and a walk around Ponta Verde or Jatiúca, within your budget.",
    culture: "Culture: crafts at Pontal da Barra; check opening hours first.",
    extra: "Ipioca: a daytime outing with return transport arranged.",
    maragogi: "Maragogi: allow a full day and arrange return transport; reef pools depend on tides and local conditions.",
    rest: "Free day to rest or repeat your favorite outing.",
    familyNote: "With children, take breaks and check sea conditions before swimming.",
    lowNote: "To keep costs down, compare total food and transport costs before booking.",
    comfortNote: "For comfort, consider transfers and longer breaks; confirm prices with providers.",
    caveat: "An automatic suggestion based on this conversation. I do not check live tides, weather, prices or availability.",
    hotel: "Accommodation: start by comparing Pajuçara and Ponta Verde based on your journeys.",
    hotelLow: "Compare total costs, including breakfast and transport; I do not have current room rates.",
    hotelKids: "With children, check facilities, accessibility and room arrangements with the property.",
    hotelAsk: "What is your budget: budget, midrange or comfort?",
  },
  es: {
    title: "Una propuesta inicial para tu viaje", day: "Día", days: "días", month: "mes", kids: "con niños", adults: "sin niños",
    budgets: { low: "económico", mid: "intermedio", comfort: "confort" }, budget: "presupuesto",
    askDays: "¿Cuántos días te quedas? Organizo itinerarios completos de 1 a 7 días.",
    askMonth: "¿En qué mes viajas?", askProfile: "¿Prefieres playas, gastronomía o cultura?",
    shore: "Ponta Verde y Pajuçara: paseo por la orla y tiempo libre.",
    reefs: "Pajuçara: piscinas naturales solo si la marea y el mar lo permiten; si no, artesanía y gastronomía.",
    beach: "Gunga: reserva el día y organiza el transporte de regreso.",
    family: "Día de playa con pausas y pocas paradas; elige según las condiciones locales.",
    local: "Más tiempo en la orla, sin otro desplazamiento largo.",
    food: "Gastronomía: almuerzo y paseo por Ponta Verde o Jatiúca, según tu presupuesto.",
    culture: "Cultura: artesanía en Pontal da Barra; confirma los horarios antes de salir.",
    extra: "Ipioca: visita de día con regreso organizado.",
    maragogi: "Maragogi: reserva el día y organiza el regreso; las piscinas dependen de la marea y las condiciones locales.",
    rest: "Día libre para descansar o repetir tu paseo favorito.",
    familyNote: "Con niños, haz pausas y consulta las condiciones del mar antes del baño.",
    lowNote: "Para ahorrar, compara el costo total de comida y transporte antes de reservar.",
    comfortNote: "Para mayor comodidad, considera traslados y pausas más largas; confirma los precios.",
    caveat: "Propuesta automática basada en esta conversación. No consulto mareas, clima, precios ni disponibilidad en tiempo real.",
    hotel: "Alojamiento: empieza comparando Pajuçara y Ponta Verde según tus desplazamientos.",
    hotelLow: "Compara el costo total, con desayuno y transporte; no tengo tarifas actuales.",
    hotelKids: "Con niños, confirma instalaciones, accesibilidad y distribución de la habitación con el alojamiento.",
    hotelAsk: "¿Tu presupuesto es económico, intermedio o confort?",
  },
};

export function buildTravelReply(messages: ChatMessage[], language: Language, topic: TopicId, previousTopic: TopicId): string | null {
  const context = extractTravelContext(messages);
  const latest = extractTravelContext(messages.filter((m) => m.role === "user").slice(-1));
  const hasDetails = Object.keys(latest).length > 0;
  const continuing = hasDetails && ["fallback", "season", "itinerary", "beaches"].includes(topic);
  const planning = topic === "itinerary" || (continuing && previousTopic === "itinerary")
    || (latest.days !== undefined && ["fallback", "beaches", "greeting"].includes(topic));
  const hotels = (topic === "hotels" || (continuing && previousTopic === "hotels")) && hasDetails;
  if (!planning && !hotels) return null;
  const copy = COPY[language];
  const summary = [
    context.days && `${context.days} ${context.days === 1 ? copy.day.toLowerCase() : copy.days}`,
    context.month !== undefined && `${copy.month}: ${MONTHS[language][context.month]}`,
    context.children !== undefined && (context.children ? copy.kids : copy.adults),
    context.budget && `${copy.budget}: ${copy.budgets[context.budget]}`,
  ].filter(Boolean).join(" · ");
  const blocks = [hotels ? copy.hotel : `**${copy.title}**`, summary];
  if (hotels) {
    if (context.budget) blocks.push(context.budget === "comfort" ? copy.comfortNote : copy.hotelLow);
    if (context.children) blocks.push(copy.hotelKids);
    if (!context.budget) blocks.push(copy.hotelAsk);
  } else {
    if (!context.days) return [...blocks, copy.askDays].filter(Boolean).join("\n\n");
    if (context.days > MAX_ITINERARY_DAYS) return language === "pt"
      ? "Por enquanto, preparo roteiros completos de 1 a 7 dias. Sua viagem tem mais dias: escolha um bloco de até 7 dias para planejar primeiro. Não vou apresentar uma semana como se fosse o roteiro inteiro."
      : language === "en" ? "I currently prepare complete itineraries of 1 to 7 days. For a longer trip, choose a block of up to 7 days to plan first."
      : "Por ahora preparo itinerarios completos de 1 a 7 días. Para un viaje más largo, elige un bloque de hasta 7 días para empezar.";
    const plans = createItinerary(context, language);
    blocks.push(plans.map((plan) => `${plan.day}. **${copy.day} ${plan.day}:** ${plan.description}`).join("\n"));
    blocks.push(...getItineraryWarnings(context, language));
    if (context.transport === "transfer") blocks.push(language === "pt"
      ? "Sem carro: confirme o transporte de ida e volta dos passeios fora da orla antes de reservar."
      : language === "en" ? "Without a car: confirm return transport for trips outside the waterfront before booking."
      : "Sin coche: confirma el transporte de regreso antes de reservar paseos fuera de la orla.");
    if (context.children) blocks.push(copy.familyNote);
    if (context.budget === "low") blocks.push(copy.lowNote);
    else if (context.budget === "comfort") blocks.push(copy.comfortNote);
    if (context.month === undefined) blocks.push(copy.askMonth);
    else if (!context.interest) blocks.push(copy.askProfile);
  }
  blocks.push(copy.caveat);
  return blocks.filter(Boolean).join("\n\n");
}

export function isItineraryEdit(text: string) {
  return /\b(troque|trocar|substitua|substituir|replace|cambia|inclua|incluir|include|adicione|adicionar|retire|remova|exclua|sem gunga|sem ipioca|sem maragogi|nao quero)\b/.test(normalizeText(text));
}

type ActivityKey = "shore" | "reefs" | "beach" | "family" | "local" | "food" | "culture" | "extra" | "rest" | "maragogi";
const PLACE_ACTIVITY: Record<PlaceKey, ActivityKey> = { gunga: "beach", ipioca: "extra", maragogi: "maragogi" };
const ACTIVITY_TITLES: Record<ActivityKey, string> = {
  shore: "Ponta Verde e Pajuçara", reefs: "Piscinas naturais de Pajuçara", beach: "Praia do Gunga", family: "Praia com crianças",
  local: "Jatiúca e gastronomia na orla", food: "Gastronomia em Ponta Verde e Jatiúca", culture: "Artesanato no Pontal da Barra",
  extra: "Ipioca", rest: "Tempo livre", maragogi: "Maragogi",
};
export function createItinerary(context: TravelContext, language: Language = "pt") {
  if (!context.days || !Number.isInteger(context.days) || context.days < 1 || context.days > MAX_ITINERARY_DAYS) return [];
  const copy = COPY[language];
  const special: ActivityKey = context.interest === "culture" ? "culture" : "food";
  const requested = (context.preferred ?? []).filter((place) => !context.excluded?.includes(place)).map((place) => PLACE_ACTIVITY[place]);
  const excluded = new Set((context.excluded ?? []).map((place) => PLACE_ACTIVITY[place]));
  const nearby = context.budget === "low" || context.transport === "transfer";
  const candidates: ActivityKey[] = [
    ...requested, "shore",
    context.interest === "culture" || context.interest === "food" ? special : "reefs",
    context.children ? "family" : nearby ? "local" : "beach",
    nearby ? "culture" : "extra", "food", "culture", "reefs", "rest", "local", "family", "extra", "beach",
  ];
  const selected = [...new Set(candidates)].filter((key) => !excluded.has(key)
    && (!nearby || !["beach", "extra", "maragogi"].includes(key) || requested.includes(key)));
  return selected.slice(0, context.days).map((key, index) => {
    const details = copy[key].replace(/^[^:]+:\s*/, "");
    return {
      day: index + 1, key, title: ACTIVITY_TITLES[key], description: copy[key],
      details: details.charAt(0).toUpperCase() + details.slice(1),
      needsTransport: ["beach", "extra", "maragogi", "culture"].includes(key),
      tideDependent: key === "reefs" || key === "maragogi",
      practical: PRACTICAL_PLANS[key],
    };
  });
}

const PRACTICAL_PLANS: Record<ActivityKey, { start: string; later: string; alternative: string; guide: string }> = {
  shore: { start: "Escolha Pajuçara ou Ponta Verde como ponto de partida e faça um trecho da orla a pé.", later: "Almoce na mesma região e deixe a outra parte da orla para depois da pausa.", alternative: "Com chuva, substitua a caminhada por uma refeição e uma atividade coberta confirmada no local.", guide: "/destinos/ponta-verde" },
  reefs: { start: "Confirme primeiro a maré para a data e a saída com o jangadeiro. O horário do passeio define o restante do dia.", later: "Reserve o outro período para artesanato e alimentação em Pajuçara.", alternative: "Sem condições para embarcar, mantenha artesanato e gastronomia; não conte com o passeio na água.", guide: "/destinos/pajucara" },
  beach: { start: "Organize a saída para o Gunga, em Roteiro, e confirme transporte, acesso e estrutura antes de partir.", later: "Dedique o dia à praia. Só acrescente um passeio local após conferir duração, valor e condições.", alternative: "Se o passeio for cancelado, fique na cidade; evite improvisar outra praia distante sem transporte definido.", guide: "/destinos/gunga" },
  family: { start: "Escolha um único trecho de praia com a estrutura de que a família precisa.", later: "Faça uma pausa para almoço e descanso, sem marcar outro deslocamento longo.", alternative: "Se as condições não permitirem praia, priorize uma atividade coberta próxima à hospedagem.", guide: "/guia/familia" },
  local: { start: "Explore um trecho da orla de Jatiúca próximo ao local da refeição.", later: "Volte à região da hospedagem para descansar; mantenha os deslocamentos curtos.", alternative: "Com chuva, concentre a saída na refeição e confirme o funcionamento do local.", guide: "/guia/alimentacao" },
  food: { start: "Escolha a região da refeição entre Ponta Verde e Jatiúca e consulte o cardápio antes de sair.", later: "Combine apenas uma caminhada próxima, se o tempo permitir.", alternative: "Mantenha a refeição em local coberto e confirme restrições alimentares diretamente com o restaurante.", guide: "/guia/alimentacao" },
  culture: { start: "Confira o funcionamento dos pontos de artesanato no Pontal da Barra antes de se deslocar.", later: "Reserve tempo para conhecer o filé e comparar peças, com retorno combinado.", alternative: "Se os locais estiverem fechados, reagende a visita e escolha outra atividade confirmada na cidade.", guide: "/guia/transporte" },
  extra: { start: "Escolha o ponto de apoio em Ipioca e confirme acesso e estrutura antes da saída.", later: "Mantenha o dia na mesma região, com alimentação e retorno planejados.", alternative: "Sem condições de praia ou transporte confirmado, use o dia para uma atividade próxima à hospedagem.", guide: "/guia/praias" },
  rest: { start: "Deixe o período livre para descanso ou para repetir um lugar de que gostou.", later: "Use a folga para acomodar uma atividade adiada pelas condições do mar.", alternative: "Não transforme a folga em dois passeios distantes; preserve tempo de retorno e descanso.", guide: "/guia/praias" },
  maragogi: { start: "Reserve o dia para Maragogi e confirme local de embarque, transporte e retorno antes de contratar.", later: "Se houver passeio às piscinas, organize o dia em torno da saída confirmada; a maré pode mudar o horário.", alternative: "Se as piscinas não operarem, combine a alternativa com o prestador antes de sair de Maceió.", guide: "/guia/praias" },
};

export function getItineraryWarnings(context: TravelContext, language: Language = "pt") {
  const warnings: string[] = [];
  const included = new Set(createItinerary(context, language).map((day) => day.key));
  const omitted = (context.preferred ?? []).filter((place) => !context.excluded?.includes(place) && !included.has(PLACE_ACTIVITY[place]));
  if (omitted.length) warnings.push(language === "pt"
    ? `Não couberam neste roteiro: ${omitted.join(", ")}. Aumente os dias ou escolha quais destinos manter; cada bate-volta ocupa um dia.`
    : language === "en" ? `Not included: ${omitted.join(", ")}. Add days or choose which destinations to keep; each day trip takes one day.`
    : `No incluidos: ${omitted.join(", ")}. Añade días o elige qué destinos mantener; cada excursión ocupa un día.`);
  if (included.has("maragogi")) warnings.push(language === "pt"
    ? "Maragogi ocupa um dia de deslocamento e passeio. Confirme ida, volta e saída das piscinas; o roteiro não calcula trânsito nem marés."
    : language === "en" ? "Allow a full day for Maragogi. Confirm return transport and reef-pool departure; traffic and tides are not calculated."
    : "Reserva un día completo para Maragogi. Confirma ida, vuelta y salida a las piscinas; no se calculan tráfico ni mareas.");
  return warnings;
}

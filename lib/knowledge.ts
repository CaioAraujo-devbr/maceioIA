import type { Language } from "./types";

export type TopicId =
  | "greeting"
  | "beaches"
  | "pajucara"
  | "ponta_verde"
  | "ipioca"
  | "gunga"
  | "barra"
  | "restaurants"
  | "tours"
  | "diving"
  | "maragogi"
  | "penedo"
  | "hotels"
  | "itinerary"
  | "season"
  | "safety"
  | "transport"
  | "fallback";

type Topic = {
  id: TopicId;
  keywords: string[];
  replies: Record<Language, string>;
};

export const TOPICS: Topic[] = [
  {
    id: "greeting",
    keywords: [
      "oi",
      "olá",
      "ola",
      "hello",
      "hi",
      "hey",
      "hola",
      "bom dia",
      "boa tarde",
      "boa noite",
      "buenas",
    ],
    replies: {
      pt: `Olá! Eu sou a **MaceiôIA**, seu guia local para Maceió e o litoral de Alagoas.

Posso ajudar com praias (Pajuçara, Ponta Verde, Ipioca, Gunga), restaurantes, passeios (jangada, Maragogi, Penedo), hotéis, roteiros, marés, transporte e dicas de segurança.

Me conta: quantos dias você tem e o que mais te anima — mar calmo, comida, mergulho ou um bate-volta?`,
      en: `Hi! I’m **MaceiôIA**, your local guide for Maceió and the Alagoas coast.

I can help with beaches (Pajuçara, Ponta Verde, Ipioca, Gunga), restaurants, tours (reef pools, Maragogi, Penedo), hotels, itineraries, tides, transport, and safety tips.

How many days do you have, and what’s the vibe — calm sea, food, diving, or a day trip?`,
      es: `¡Hola! Soy **MaceiôIA**, tu guía local de Maceió y la costa de Alagoas.

Puedo ayudarte con playas (Pajuçara, Ponta Verde, Ipioca, Gunga), restaurantes, paseos (piscinas de arrecife, Maragogi, Penedo), hoteles, itinerarios, mareas, transporte y seguridad.

¿Cuántos días tienes y qué te ilusiona más: mar calmo, comida, buceo o una escapada?`,
    },
  },
  {
    id: "pajucara",
    keywords: ["pajuçara", "pajucara", "jangada", "piscinas naturais", "natural pools"],
    replies: {
      pt: `**Pajuçara** é o coração turístico da orla: areia urbana, barracas e o famoso passeio de **jangada até as piscinas naturais**.

Por que ir: em maré baixa os recifes formam piscinas rasas, boas para snorkel (peixes e corais). A travessia leva cerca de 20–30 minutos.

Dica prática: confirme a tábua da maré no hotel ou com o jangadeiro. Se a maré estiver alta, o recife “some” e a experiência decepciona. Leve protetor (reef-safe se possível), dinheiro em espécie e não pise nos corais.

À noite, a feira de artesanato na orla é boa para palha, bordado e lembranças. Para dormir, Pajuçara e Ponta Verde são as bases mais práticas.

Quer que eu monte um meio período (jangada + almoço) ou encaixe isso num roteiro de 3 dias?`,
      en: `**Pajuçara** is the tourist core of the city shore: urban sand, beach stalls, and the classic **raft (jangada) to the natural reef pools**.

Go at **low tide** — that’s when shallow coral pools appear for snorkeling. The ride is about 20–30 minutes. If the tide is high, skip it or reschedule.

Bring reef-safe sunscreen, cash, and don’t stand on coral. In the evening, the waterfront craft market is good for souvenirs. Stay in Pajuçara or neighboring Ponta Verde for walkability.

Want a half-day plan (raft + lunch) or a 3-day outline around this?`,
      es: `**Pajuçara** es el corazón turístico de la orilla: playa urbana, puestos y el clásico **paseo en jangada a las piscinas naturales**.

Ve en **marea baja**: ahí aparecen pozas de arrecife para snorkel. El trayecto dura unos 20–30 minutos. Si la marea está alta, reagenda.

Lleva protector (mejor reef-safe), efectivo y no pises el coral. Por la noche, la feria de artesanía en la orla vale la pena. Dormir en Pajuçara o Ponta Verde es lo más práctico.

¿Quieres un medio día (jangada + almuerzo) o un itinerario de 3 días?`,
    },
  },
  {
    id: "ponta_verde",
    keywords: ["ponta verde", "calçadão", "calcadao", "jatiúca", "jatiuca"],
    replies: {
      pt: `**Ponta Verde** é a minha base favorita para a primeira visita: calçadão sombreado, ciclovia, hotéis, padarias e restaurantes a pé.

O mar ali é de orla urbana (não é o visual de cartão-postal do Gunga), mas a vida é fácil: amanhecer na areia, fim de tarde em Jatiúca vendo o pôr do sol, jantar sem Uber.

Combine Ponta Verde (hospedagem) + Pajuçara (jangada) + um dia em Gunga. Famílias gostam da estrutura; quem busca silêncio absoluto pode preferir Ipioca à noite.

Está viajando a dois, em família ou em grupo? Ajusto hotel e ritmo da orla.`,
      en: `**Ponta Verde** is my favorite base for a first stay: a shaded promenade, bike path, hotels, bakeries, and restaurants on foot.

The beach is urban (not Gunga’s postcard look), but daily life is easy: morning swim, sunset toward Jatiúca, dinner without a car.

Pair it with Pajuçara (reef raft) and a day at Gunga. Families love the infrastructure; if you want quiet nights, look at Ipioca.

Are you a couple, family, or group? I’ll tune hotels and pace.`,
      es: `**Ponta Verde** es mi base favorita para la primera visita: calçadão con sombra, bici, hoteles y restaurantes a pie.

La playa es urbana (no es la postal del Gunga), pero la vida es fácil: baño de mañana, atardecer hacia Jatiúca, cena sin coche.

Combínala con Pajuçara (jangada) y un día en Gunga. A las familias les encanta la estructura; si buscas silencio, mira Ipioca.

¿Viajas en pareja, familia o grupo? Ajusto hotel y ritmo.`,
    },
  },
  {
    id: "ipioca",
    keywords: ["ipioca"],
    replies: {
      pt: `**Ipioca**, ao norte de Maceió (~40–50 min da orla turística), é praia de vilarejo: águas rasas, tombo pequeno e clima mais lento.

Vale para quem já cansou do movimento de Pajuçara e quer um dia de mar calmo, especialmente com crianças. A estrutura é menor — leve água, protetor e cheque o transporte de volta (Uber pode demorar mais).

Não é o melhor ponto para vida noturna nem para as piscinas de jangada (isso fica em Pajuçara). Dá um belo contraste num roteiro de 4+ dias: 1 dia Ipioca, 1 dia Gunga.

Prefere ir de carro alugado ou quer opções de transfer?`,
      en: `**Ipioca**, north of town (~40–50 min from the tourist shore), is a village beach: shallow water, small waves, slower pace.

Great if Pajuçara feels busy and you want a calm-sea day, especially with kids. Amenities are fewer — bring water and sunscreen; return Ubers can take longer.

It’s not the nightlife base or the jangada reef pools (those are in Pajuçara). On a 4+ day trip, spend one day here and one at Gunga.

Rental car or transfer — which do you prefer?`,
      es: `**Ipioca**, al norte (~40–50 min de la orla turística), es playa de pueblo: agua baja, oleaje suave y ritmo lento.

Ideal si Pajuçara te parece movida y quieres mar calmo, sobre todo con niños. Hay menos servicios: lleva agua y protector; el Uber de vuelta puede tardar.

No es base de noche ni de las piscinas en jangada (eso es Pajuçara). En 4+ días, un día aquí y otro en Gunga queda redondo.

¿Coche de alquiler o transfer?`,
    },
  },
  {
    id: "gunga",
    keywords: ["gunga", "praia do gunga", "coqueiro", "duna", "buggy"],
    replies: {
      pt: `A **Praia do Gunga** (município de Barra de São Miguel) é o cartão-postal: milhares de coqueiros, a ponta entre mar e laguna e dunas para buggy.

Logística: 45–70 min de Maceió, conforme trânsito. Chegue cedo (antes das 9h se puder) para estacionamento, sombra e fotos sem lotação. Há cobrança de acesso/estacionamento — leve cartão e um pouco de dinheiro.

Faça o passeio de **buggy** (dunas + mirantes) e, se gostar de água calma, o catamarã ou a área da laguna. O mar aberto pode ter corrente; respeite a orientação local.

Almoço: quiosques na praia ou restaurantes na Barra. Evite deixar o carro com objetos visíveis.

Quer um roteiro só de Gunga (dia inteiro) ou Gunga + Francês no mesmo dia? O segundo fica apertado no verão.`,
      en: `**Praia do Gunga** (Barra de São Miguel) is the postcard: coconut groves, the point between ocean and lagoon, and dunes for a buggy ride.

It’s 45–70 minutes from Maceió. Arrive early (before 9am if you can) for parking, shade, and photos. There’s an access/parking fee — bring a card and some cash.

Do the **buggy** (dunes + lookouts). The open ocean can have current; follow local flags. Lunch at beach kiosks or in Barra town.

Leaving valuables in the car is a bad idea. A full Gunga day is better than rushing Gunga + Francês in peak summer.

Want a timed day plan from Ponta Verde?`,
      es: `**Praia do Gunga** (Barra de São Miguel) es la postal: cocoteros, la punta entre mar y laguna, y dunas en buggy.

Está a 45–70 min de Maceió. Llega temprano (antes de las 9 si puedes) por parking, sombra y fotos. Hay cobro de acceso: lleva tarjeta y algo de efectivo.

Haz el **buggy**. El mar abierto puede tener corriente; respeta las banderas. Almuerzo en la playa o en el pueblo de Barra.

No dejes objetos a la vista en el coche. Un día entero en Gunga rinde más que Gunga + Francês a las corridas en verano.

¿Te armo el día saliendo de Ponta Verde?`,
    },
  },
  {
    id: "barra",
    keywords: ["barra de são miguel", "barra de sao miguel", "niquim"],
    replies: {
      pt: `**Barra de São Miguel** é a cidade-base da Praia do Gunga e de praias como Niquim: ritmo de vila, restaurantes de frutos do mar e pôr do sol mais quieto que a orla de Maceió.

Fique aqui se o foco da viagem for natureza e casal, não vida noturna. De dia você explora Gunga; de noite, jantar simples e cedo.

Maceió continua a 45–70 min — dá para fazer day trip sem mudar de hotel, ou dormir 1–2 noites na Barra no meio de um roteiro maior.

Viaja com crianças ou a dois? Isso muda se vale a pena trocar de base.`,
      en: `**Barra de São Miguel** is the town behind Gunga and beaches like Niquim: village pace, seafood, quieter sunsets than Maceió’s strip.

Stay here for nature and couples, not nightlife. Day at Gunga, early dinner. Maceió is 45–70 minutes away — easy as a day trip, or sleep 1–2 nights mid-itinerary.

Kids or a couple? That changes whether it’s worth switching hotels.`,
      es: `**Barra de São Miguel** es el pueblo base de Gunga y playas como Niquim: ritmo de villa, mariscos y atardeceres más tranquilos.

Quédate si buscas naturaleza y pareja, no fiesta. Maceió queda a 45–70 min: day trip o 1–2 noches en medio del viaje.

¿Niños o en pareja? Cambio la recomendación de hotel.`,
    },
  },
  {
    id: "beaches",
    keywords: [
      "praia",
      "praias",
      "beach",
      "beaches",
      "playa",
      "playas",
      "banho",
      "mar",
      "orla",
    ],
    replies: {
      pt: `Para escolher praia em Maceió, eu separo assim:

- **Pajuçara** — jangada e piscinas naturais (maré baixa).
- **Ponta Verde / Jatiúca** — melhor para ficar hospedado e caminhar na orla.
- **Ipioca** — mar mais calmo, clima de vilarejo, mais longe.
- **Gunga (Barra de São Miguel)** — o visual de filme; vá de dia, cedo.
- **Francês** — águas claras e falésias, ~40 min, combina com Marechal Deodoro.

Se você tem **só 1 dia de praia “especial”**, vá ao Gunga. Se quer **experiência de recife**, Pajuçara. Se viaja com **crianças pequenas**, Ipioca ou trechos rasos da orla no início da manhã.

Me diz se prefere água parada, ondas leves ou paisagem para foto que eu afunilo.`,
      en: `Quick beach map:

- **Pajuçara** — raft to natural reef pools (low tide).
- **Ponta Verde / Jatiúca** — best place to stay and walk the shore.
- **Ipioca** — calmer, village feel, farther north.
- **Gunga** — the cinematic coastline; go early as a day trip.
- **Francês** — clear water and cliffs, pairs with historic Marechal Deodoro.

One “wow” beach day → Gunga. Reef experience → Pajuçara. Little kids → Ipioca or a quiet morning on the city shore.

Still water, light waves, or photos — what’s the priority?`,
      es: `Mapa rápido de playas:

- **Pajuçara** — jangada a piscinas de arrecife (marea baja).
- **Ponta Verde / Jatiúca** — mejor para dormir y caminar.
- **Ipioca** — más calma, pueblo, más lejos.
- **Gunga** — la postal; ve temprano.
- **Francês** — agua clara y acantilados, junto a Marechal Deodoro.

Un día “wow” → Gunga. Arrecife → Pajuçara. Niños pequeños → Ipioca.

¿Prioridad: mar calmo, olas suaves o foto?`,
    },
  },
  {
    id: "restaurants",
    keywords: [
      "restaurante",
      "restaurantes",
      "comer",
      "almoço",
      "almoco",
      "jantar",
      "food",
      "eat",
      "restaurant",
      "comida",
      "sururu",
      "frutos do mar",
      "seafood",
      "mariscos",
    ],
    replies: {
      pt: `Comida em Maceió gira em torno do mar: **peixe frito, camarão, sururu, caranguejo** e, de manhã, **tapioca** com queijo coalho ou coco.

Pedidos que eu faria:

- **Almoço de caranguejo / laguna:** região da **Massagueira** (clima de mesas ao ar livre; vá cedo no fim de semana).
- **Jantar na orla:** Ponta Verde e Jatiúca — peixe na brasa e vista para o calçadão. **Wanchako** (peruano) é o mais concorrido; reserve.
- **Casual:** barracas na areia (água de coco, petisco) e tapiocarias.
- **Doce local:** bolo de goma, suco de cajá e caju.

Evito indicar “o melhor do ano” sem data da sua viagem — cardápios e filas mudam. Prefira casas cheias de família no almoço e peixe do dia.

Tem restrição alimentar ou prefere lugar romântico vs. pé-na-areia?`,
      en: `Maceió food is the sea: **fried fish, shrimp, sururu (mussel stew), crab**, and breakfast **tapioca**.

How I’d book it:

- **Crab / lagoon lunch:** **Massagueira** area — outdoor tables; go early on weekends.
- **Dinner on the shore:** Ponta Verde and Jatiúca. **Wanchako** (Peruvian) is popular — reserve.
- **Casual:** beach stalls (coconut water) and tapioca spots.
- **Local sweet:** bolo de goma; cajá and cashew juices.

I won’t lock a “#1 restaurant” without your dates. Busy family places at lunch are a good sign.

Any diet limits, or romantic vs. toes-in-the-sand?`,
      es: `La comida de Maceió es el mar: **pescado frito, camarón, sururu, cangrejo** y, de mañana, **tapioca**.

Cómo lo armaría:

- **Almuerzo de cangrejo / laguna:** zona de **Massagueira** — mesas al aire; llega temprano el finde.
- **Cena en la orla:** Ponta Verde y Jatiúca. **Wanchako** (peruano) se llena: reserva.
- **Informal:** puestos en la arena (coco) y tapiocas.
- **Dulce local:** bolo de goma, jugos de cajá y caju.

No te “cierro” el mejor restaurante del año sin fechas. Casas llenas de familias al mediodía suelen ser buena señal.

¿Alguna alergia, o prefieres romántico vs. pie en la arena?`,
    },
  },
  {
    id: "diving",
    keywords: [
      "mergulho",
      "snorkel",
      "snorkeling",
      "dive",
      "diving",
      "buceo",
      "batismo",
    ],
    replies: {
      pt: `Para **mergulho e snorkel** perto de Maceió:

1. **Snorkel nas piscinas de Pajuçara** — o mais fácil, barato e típico. Depende 100% da maré baixa.
2. **Batismo / scuba com operadora** — recifes um pouco mais fundos na costa; pergunte se incluem equipamento, briefing e saída do porto. Leve certificado se já for mergulhador.
3. **Upgrade de recife:** **Maragogi** ou **São Miguel dos Milagres** têm piscinas de coral mais abertas (day trip).

Nunca pise no recife, não alimente peixes e use colete se a corrente aparecer. Se você enjoa em barco, tome o remédio 1h antes e escolha manhã de mar calmo.

Já mergulha com certificado ou seria um primeiro snorkel?`,
      en: `**Diving / snorkeling** near Maceió:

1. **Pajuçara reef pools** — easiest, classic, tide-dependent.
2. **Intro scuba with a local shop** — slightly deeper reefs; ask what’s included. Bring your C-card if certified.
3. **Bigger reefs:** **Maragogi** or **São Miguel dos Milagres** as a day trip.

Don’t stand on coral, don’t feed fish, wear a vest if there’s current. Prone to seasickness? Medicate an hour early and go in the morning.

Certified diver or first-time snorkel?`,
      es: `**Buceo y snorkel** cerca de Maceió:

1. **Piscinas de Pajuçara** — lo más fácil; depende de la marea baja.
2. **Bautismo / scuba con operador local** — arrecifes un poco más hondos. Lleva certificación si ya buceas.
3. **Arrecife más amplio:** **Maragogi** o **São Miguel dos Milagres** (day trip).

No pises el coral ni alimentes peces. Si te mareas, medicación 1 h antes y sal por la mañana.

¿Ya tienes certificación o sería tu primer snorkel?`,
    },
  },
  {
    id: "maragogi",
    keywords: ["maragogi", "galés", "gales", "galés", "rota ecológica"],
    replies: {
      pt: `**Maragogi** (as Galés) é o day trip mais pedido fora da cidade: piscinas de recife em alto-mar, água morna e visual de Caribe nordestino.

Saia **muito cedo** de Maceió (~2–2,5 h de estrada). O passeio de barco até as piscinas depende de mar e lotação. Feríados e janeiro ficam cheios — vale pagar um pouco mais por saída menor se puder.

Plano B se o mar fechar: praias da Rota Ecológica / São Miguel dos Milagres (mais tempo de estrada, clima mais pousada) ou voltar e fazer Gunga.

Leve dinheiro, toalha, camisinha de água e estômago vazio se enjoar. Não é obrigatório para uma primeira viagem curta (3 dias) — nesses casos eu priorizo Pajuçara + Gunga.

Quantos dias você tem em Alagoas?`,
      en: `**Maragogi** (the Galés reef pools) is the most requested day trip: warm offshore pools with a Caribbean-Northeast look.

Leave Maceió **very early** (~2–2.5 h). Boat access depends on sea conditions and crowds. Holidays and January are packed.

Plan B if the sea is rough: São Miguel dos Milagres / Eco Route, or stay local and do Gunga.

Bring cash, a towel, and a rash guard. On a tight 3-day first trip I often skip Maragogi and keep Pajuçara + Gunga.

How many days do you have in Alagoas?`,
      es: `**Maragogi** (las Galés) es el day trip más pedido: piscinas de arrecife mar adentro y agua tibia.

Sal **muy temprano** de Maceió (~2–2,5 h). El barco depende del mar y de la gente. Fiestas y enero se llenan.

Plan B si el mar cierra: São Miguel dos Milagres o quedarte y hacer Gunga.

Lleva efectivo y toalla. En un primer viaje de 3 días suelo priorizar Pajuçara + Gunga.

¿Cuántos días tienes en Alagoas?`,
    },
  },
  {
    id: "penedo",
    keywords: ["penedo", "são francisco", "sao francisco", "rio são", "histórico", "historico"],
    replies: {
      pt: `**Penedo** é o contraponto cultural de Maceió: cidade histórica no **Rio São Francisco**, casarões, igrejas e mirante sobre o rio (~2–2,5 h).

Vale como bate-volta de um dia se você gosta de história e fotografia — não de praia. Combine com almoço de peixe de rio. Para a **foz do São Francisco**, o embarque costuma ser em Piaçabuçu (outro passeio; não misture tudo no mesmo dia corrido).

Se o grupo só quer mar, eu deixaria Penedo para uma segunda viagem ou para quem tem 6–7 dias.

O grupo curte cidade histórica ou prefere 100% litoral?`,
      en: `**Penedo** is Maceió’s cultural counterpoint: a historic town on the **São Francisco River** (~2–2.5 h), with churches, old houses, and river views.

Great as a full day if you like history and photos — not a beach day. River-fish lunch is part of the fun. The **river mouth** boats usually leave from Piaçabuçu (don’t cram both into one rushed day).

Sea-only groups can skip it unless you have 6–7 days.

Is the group into historic towns or 100% coast?`,
      es: `**Penedo** es el contraste cultural: pueblo histórico en el **río São Francisco** (~2–2,5 h), iglesias y mirador.

Vale como día completo si te gusta la historia; no es día de playa. La **desembocadura** suele salir de Piaçabuçu: no lo juntes todo atropellado.

Si el grupo solo quiere mar, déjalo para 6–7 días.

¿Os tira más el pueblo histórico o el 100% litoral?`,
    },
  },
  {
    id: "tours",
    keywords: [
      "passeio",
      "passeios",
      "tour",
      "tours",
      "o que fazer",
      "que hacer",
      "what to do",
      "catamarã",
      "catamara",
    ],
    replies: {
      pt: `Passeios que realmente valem a partir de Maceió:

1. **Jangada / piscinas de Pajuçara** — meio período, maré baixa.
2. **Gunga + buggy** — o dia “wow” de paisagem.
3. **Maragogi** — recifes; saia cedo.
4. **Francês + Marechal Deodoro** — praia e centro histórico num raio menor.
5. **Penedo** — rio e história.
6. **Pontal da Barra** — artesanato e lagoa no fim de tarde.

Chuva leve não cancela cidade e gastronomia; mar revolto cancela jangada e Maragogi — tenha Gunga de manhã cedo ou museus/centro como plano B.

Quer que eu priorize esses passeios para 3, 5 ou 7 dias?`,
      en: `Tours that are worth it from Maceió:

1. **Pajuçara raft / reef pools** — half day, low tide.
2. **Gunga + buggy** — the landscape day.
3. **Maragogi** — leave early.
4. **Francês + Marechal Deodoro** — beach + history, shorter drive.
5. **Penedo** — river and heritage.
6. **Pontal da Barra** — crafts and lagoon at sunset.

Light rain doesn’t kill food/city days; rough seas cancel rafts and Maragogi — keep a backup.

Should I rank these for 3, 5, or 7 days?`,
      es: `Paseos que valen desde Maceió:

1. **Jangada / piscinas de Pajuçara** — medio día, marea baja.
2. **Gunga + buggy** — el día de paisaje.
3. **Maragogi** — sal temprano.
4. **Francês + Marechal Deodoro** — playa e historia, menos carretera.
5. **Penedo** — río e historia.
6. **Pontal da Barra** — artesanía y laguna al atardecer.

Lluvia suave no cancela gastronomía; mar feo cancela jangada y Maragogi.

¿Los ordeno para 3, 5 o 7 días?`,
    },
  },
  {
    id: "hotels",
    keywords: [
      "hotel",
      "hotéis",
      "hoteis",
      "hospedagem",
      "pousada",
      "stay",
      "where to stay",
      "dónde dormir",
      "donde dormir",
      "airbnb",
    ],
    replies: {
      pt: `Onde ficar:

- **Primeira vez / sem carro:** **Ponta Verde** (mais conforto e calçadão) ou **Pajuçara** (mais perto das jangadas, um pouco mais agitada).
- **Orla + bares de fim de tarde:** **Jatiúca**.
- **Silêncio e mar raso:** pousadas em **Ipioca** (você vai depender mais de app/carro).
- **Lua de mel natureza:** 1–2 noites em **Barra de São Miguel** perto do Gunga.

Peça café da manhã, piscina se viaja com crianças, e quarto com janela para o mar só se o orçamento aguentar — o “vista mar” encarece rápido.

Me passa **época, orçamento (econômico / médio / conforto) e se tem criança** que eu afunilo o bairro, sem inventar tarifa.`,
      en: `Where to stay:

- **First visit / no car:** **Ponta Verde** (promenade, comfort) or **Pajuçara** (closer to rafts, busier).
- **Sunset bars:** **Jatiúca**.
- **Quiet shallow sea:** **Ipioca** inns (you’ll need Uber/car).
- **Nature honeymoon:** 1–2 nights in **Barra de São Miguel**.

Breakfast + pool matters with kids. Ocean-view rooms jump in price.

Share **dates, budget (budget / mid / comfort), and kids** — I’ll narrow the neighborhood without inventing rates.`,
      es: `Dónde dormir:

- **Primera vez / sin coche:** **Ponta Verde** o **Pajuçara** (más cerca de las jangadas).
- **Bares al atardecer:** **Jatiúca**.
- **Silencio y mar bajo:** **Ipioca**.
- **Naturaleza en pareja:** 1–2 noches en **Barra de São Miguel**.

Desayuno y piscina importan con niños. La vista al mar encarece.

Pásame **fechas, presupuesto y si hay niños** y afino el barrio, sin inventar precios.`,
    },
  },
  {
    id: "itinerary",
    keywords: [
      "roteiro",
      "itinerário",
      "itinerario",
      "itinerary",
      "dias",
      "days",
      "roteiro",
      "semana",
      "3 dias",
      "4 dias",
      "5 dias",
      "7 dias",
    ],
    replies: {
      pt: `Roteiros honestos:

**2–3 dias:** Ponta Verde como base. Dia 1 orla + tapioca. Dia 2 jangada em Pajuçara (maré baixa) + artesanato. Dia 3 Gunga cedo e volta para jantar na orla.

**4–5 dias:** some Ipioca **ou** Francês. Uma noite mais especial na Massagueira ou Wanchako.

**6–7 dias:** inclua **Maragogi** (saída cedo) **ou** **Penedo** (se o grupo curte história). Não force os dois se o ritmo for leve.

Chuva: museus, centro, Pontal da Barra e gastronomia. Mar ruim: cancele recife, mantenha Gunga só se a operadora garantir.

Quantos dias e em que mês você vem? A maré e as férias escolares mudam o plano.`,
      en: `Honest itineraries:

**2–3 days:** Base in Ponta Verde. Day 1 shore stroll. Day 2 Pajuçara raft (low tide). Day 3 early Gunga, dinner back in town.

**4–5 days:** Add Ipioca **or** Francês. One special meal (Massagueira or Wanchako).

**6–7 days:** Add **Maragogi** **or** **Penedo** — not both if you want a relaxed pace.

Rain → museums, downtown, lagoon crafts. Bad sea → skip reefs.

How many days and which month? Tides and school holidays change the plan.`,
      es: `Itinerarios honestos:

**2–3 días:** Base en Ponta Verde. Día 1 orla. Día 2 jangada en Pajuçara. Día 3 Gunga temprano.

**4–5 días:** suma Ipioca **o** Francês. Una cena especial.

**6–7 días:** **Maragogi** **o** **Penedo**, no los dos si quieres ir tranquilo.

Lluvia → museos y gastronomía. Mar feo → cancela arrecife.

¿Cuántos días y en qué mes vienes?`,
    },
  },
  {
    id: "season",
    keywords: [
      "quando ir",
      "melhor época",
      "epoca",
      "clima",
      "chuva",
      "verão",
      "verao",
      "janeiro",
      "dezembro",
      "julho",
      "weather",
      "best time",
      "rain",
      "cuándo ir",
      "cuando ir",
      "temporada",
    ],
    replies: {
      pt: `O mar de Alagoas é **quente o ano inteiro**. O que muda é gente, preço e chuva.

- **Dezembro–março:** alta de verão, sol forte, praia lotada, tarifa alta. Reserve Gunga e hotel cedo.
- **Julho:** férias escolares, segunda alta.
- **Maio–agosto:** mais chuva (geralmente pancadas, não “inverno europeu”), tarifas melhores, orla mais respirável.
- **Carnaval e São João:** caro e cheio.

Piscinas naturais e Maragogi pedem **manhã + maré baixa + mar bom** — isso existe em várias épocas, não só no Réveillon.

Qual mês você está mirando? Eu digo o que priorizar nesse período.`,
      en: `The sea is **warm year-round**. What changes is crowds, price, and rain.

- **Dec–Mar:** peak summer, strong sun, busy beaches, high rates.
- **July:** school holidays, second peak.
- **May–Aug:** more showers (usually passing, not a gray winter), better deals.
- **Carnival and São João:** expensive and packed.

Reef pools need **morning + low tide + decent sea** in any season.

Which month are you targeting?`,
      es: `El mar está **caliente todo el año**. Cambian gente, precio y lluvia.

- **Dic–mar:** alta, sol fuerte, playas llenas.
- **Julio:** vacaciones escolares.
- **Mayo–agosto:** más chubascos, mejores tarifas.
- **Carnaval y São João:** caro y lleno.

Las piscinas de arrecife piden **mañana + marea baja**, en cualquier temporada.

¿Qué mes estás mirando?`,
    },
  },
  {
    id: "safety",
    keywords: [
      "segurança",
      "seguranca",
      "safety",
      "seguro",
      "assalto",
      "perigoso",
      "peligro",
      "safe",
      "cuidado",
    ],
    replies: {
      pt: `Maceió é destino turístico consolidado na orla, mas o básico de cidade grande do Nordeste vale:

- Não deixe celular sozinho na canga; reveze quem entra no mar.
- À noite, fique no **calçadão iluminado** de Ponta Verde/Pajuçara/Jatiúca. Evite areia deserta e atalhos.
- Use **Uber/99** na volta de jantar. Combine pontos visíveis.
- No Gunga e em day trips: nada de valor visível no carro.
- Sol: protetor, água, horário de sombra às 11h–15h com criança.
- Recife: não pise nos corais; observe bandeiras de corrente.
- Emergências: **190** polícia, **192** SAMU, **193** bombeiros.

Quer dicas específicas para viajar sozinho(a) ou com criança?`,
      en: `The tourist shore is established, but treat it like any large Brazilian city:

- Don’t leave phones alone on the sand; take turns swimming.
- At night stay on the **lit promenade** (Ponta Verde / Pajuçara / Jatiúca). Skip empty sand and shortcuts.
- Use **Uber/99** after dinner.
- Day trips: nothing visible in the car.
- Sun is intense; hydrate and seek shade 11am–3pm with kids.
- Don’t stand on coral; watch current flags.
- Emergencies: **190** police, **192** ambulance, **193** fire.

Traveling solo or with kids? I can tailor this.`,
      es: `La orla turística es consolidada, pero aplica sentido común de ciudad grande:

- No dejes el móvil solo en la toalla.
- De noche, **calçadão iluminado**. Evita arena vacía.
- **Uber/99** al volver de cenar.
- En Gunga: nada a la vista en el coche.
- Sol fuerte: sombra 11–15 h con niños.
- No pises el coral.
- Emergencias: **190** policía, **192** SAMU, **193** bomberos.

¿Viajas sola/o o con niños?`,
    },
  },
  {
    id: "transport",
    keywords: [
      "transporte",
      "uber",
      "táxi",
      "taxi",
      "aeroporto",
      "airport",
      "mcz",
      "ônibus",
      "onibus",
      "carro",
      "aluguel",
      "transfer",
      "como chegar",
      "how to get",
      "aeropuerto",
    ],
    replies: {
      pt: `**Aeroporto Zumbi dos Palmares (MCZ)** fica cerca de 20–30 min da orla turística (trânsito varia). Uber/99 e transfer de hotel são o caminho mais simples.

Na orla de Pajuçara–Ponta Verde–Jatiúca você faz quase tudo **a pé**. Para **Gunga, Francês, Ipioca e Maragogi**: transfer, van de agência ou **carro alugado**. Ônibus existe, mas come tempo e não é o melhor para quem tem poucos dias.

Jangadas e buggies se contratam na praia ou pelo hotel — peça o que está incluso (colete, parada, taxa).

Você desembarca de dia ou de madrugada? Isso muda se eu indico Uber na hora vs. transfer pré-pago.`,
      en: `**Zumbi dos Palmares Airport (MCZ)** is about 20–30 minutes from the tourist shore. Uber/99 or a hotel transfer is the easy path.

Pajuçara–Ponta Verde–Jatiúca is mostly **walkable**. For **Gunga, Francês, Ipioca, Maragogi**: agency van, private transfer, or **rental car**. Buses exist but eat time.

Rafts and buggies are booked on the beach or via the hotel — ask what’s included.

Landing daytime or late night? That changes Uber vs. pre-booked transfer.`,
      es: `El **aeropuerto Zumbi dos Palmares (MCZ)** está a unos 20–30 min de la orla. Uber/99 o transfer del hotel es lo simple.

Pajuçara–Ponta Verde–Jatiúca se hace **a pie**. Para **Gunga, Francês, Ipioca, Maragogi**: van, transfer o **coche de alquiler**.

Jangadas y buggies se cierran en la playa o el hotel.

¿Llegas de día o de madrugada?`,
    },
  },
  {
    id: "fallback",
    keywords: [],
    replies: {
      pt: `Posso te guiar em Maceió com bastante detalhe: praias (Pajuçara, Ponta Verde, Ipioca, Gunga, Barra de São Miguel), restaurantes, mergulho, Maragogi, Penedo, hotéis, melhor época, Uber/aeroporto e segurança.

Reformule em uma frase o que você precisa — por exemplo: “3 dias em casal em julho, sem carro” — e eu monto o plano.

O que está em aberto: datas, orçamento ou tipo de passeio?`,
      en: `I can go deep on Maceió: beaches (Pajuçara, Ponta Verde, Ipioca, Gunga, Barra de São Miguel), food, diving, Maragogi, Penedo, hotels, season, airport/Uber, and safety.

Give me one line like “3 days as a couple in July, no car” and I’ll build the plan.

What’s missing: dates, budget, or tour style?`,
      es: `Puedo ayudarte a fondo con Maceió: playas (Pajuçara, Ponta Verde, Ipioca, Gunga, Barra), comida, buceo, Maragogi, Penedo, hoteles, temporada, aeropuerto y seguridad.

Dime en una frase algo como “3 días en pareja en julio, sin coche” y armo el plan.

¿Qué falta: fechas, presupuesto o tipo de paseo?`,
    },
  },
];

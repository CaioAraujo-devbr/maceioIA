import { FOOD_PLACES, STAY_PLACES, type GuidePlace } from "./local-places";

export type VisitorGuide = {
  slug: string; title: string; category: string; description: string; keywords: string; question: string;
  sections: { title: string; items: string[] }[];
  reviewedAt?: string;
  facts?: string[];
  comparison?: { name: string; bestFor: string; check: string }[];
  sources?: { label: string; url: string }[];
  mapQuery?: string;
  places?: GuidePlace[];
  comparisonTitle?: string;
};

export const VISITOR_GUIDES: VisitorGuide[] = [
  {
  "slug": "transporte",
  "title": "Do aeroporto à orla: chegada e transporte",
  "category": "Chegada",
  "description": "Compare as opções para sair do MCZ, chegar à hospedagem e organizar os passeios sem carro.",
  "keywords": "aeroporto MCZ uber taxi táxi transfer carro ônibus onibus chegar transporte deslocamento voo voos avião aviao desembarque rodoviária rodoviaria madrugada bagagem",
  "question": "Como sair do aeroporto e me locomover em Maceió?",
  "reviewedAt": "15/11/2026",
  "facts": [
    "Aeroporto Internacional de Maceió — Zumbi dos Palmares (MCZ).",
    "A Aena informa cerca de 25 km até as redes hoteleiras; o trajeto muda conforme o endereço.",
    "Preço e tempo de viagem devem ser consultados para seu percurso e horário."
  ],
  "comparison": [
    {
      "name": "Aplicativo",
      "bestFor": "Comparar a corrida até o endereço exato.",
      "check": "Preço no momento, categoria, bagagens e instruções de embarque no app."
    },
    {
      "name": "Táxi",
      "bestFor": "Consultar atendimento no terminal.",
      "check": "Valor total até a hospedagem e forma de pagamento antes de embarcar. A Aena lista Astril e Contal."
    },
    {
      "name": "Transfer",
      "bestFor": "Deixar o encontro combinado, principalmente em grupo.",
      "check": "Se é privativo ou compartilhado; espera por atraso, bagagens e ponto de encontro por escrito."
    },
    {
      "name": "Ônibus",
      "bestFor": "Avaliar transporte coletivo quando o percurso atender sua viagem.",
      "check": "A Aena lista a Veleiro em frente ao aeroporto, na seção Rodoviária da cidade. Confirme linha, destino, tarifa e horários; não presuma que vai direto ao hotel."
    }
  ],
  "sections": [
    {
      "title": "Ao desembarcar no MCZ",
      "items": [
        "Tenha o endereço completo da hospedagem, incluindo bairro e número, salvo no celular. Pajuçara e Ponta Verde são regiões; informe o estabelecimento exato.",
        "Consulte o aplicativo ou o atendimento do táxi antes de escolher. No app, siga o ponto de embarque indicado e confira placa e motorista.",
        "Se contratou transfer, confirme o ponto de encontro e avise sobre atraso do voo. Combine antes como funciona a espera."
      ]
    },
    {
      "title": "Chegando de madrugada ou com crianças",
      "items": [
        "Confirme com a hospedagem como será a entrada fora do horário de recepção ou antes do check-in.",
        "Para o transporte, consulte atendimento no horário do voo e confirme a capacidade para pessoas e malas. Não conte com disponibilidade garantida.",
        "Se precisar de equipamento para crianças ou acessibilidade, combine com o prestador antes de contratar."
      ]
    },
    {
      "title": "Da hospedagem para os passeios",
      "items": [
        "Pajuçara e Ponta Verde permitem organizar passeios pela orla. Escolha os trechos conforme a distância da hospedagem e as necessidades do grupo.",
        "Para Gunga, Ipioca ou Maragogi, combine a ida e a volta. Pergunte se o passeio inclui transporte, onde embarca e qual é a alternativa em caso de cancelamento.",
        "Sem carro, comece por um roteiro com deslocamentos próximos. Um bate-volta escolhido por você continua no roteiro e exige transporte combinado."
      ]
    },
    {
      "title": "Quanto custa e quanto demora?",
      "items": [
        "Este guia não oferece cotações. A Uber informa que valores ilustrativos não são tarifas fixas ou garantidas; consulte o percurso e a categoria no aplicativo.",
        "Compare o total para o grupo, incluindo bagagem, eventuais paradas e retorno. Em transfer, confirme exatamente o que está incluído.",
        "Consulte o trajeto no mapa para o horário pretendido. Reserve margem para trânsito, desembarque e bagagens; distância não equivale a tempo garantido."
      ]
    },
    {
      "title": "Na volta para o aeroporto",
      "items": [
        "Confirme o horário de apresentação, despacho e embarque com sua companhia aérea.",
        "Calcule a saída a partir do endereço da hospedagem, considerando o trânsito e uma margem para imprevistos.",
        "Deixe o transporte combinado e confira o destino MCZ antes de partir. Não use o horário de decolagem como horário de chegada ao terminal."
      ]
    }
  ],
  "sources": [
    {
      "label": "Aena Brasil — táxis, ônibus e acesso ao MCZ",
      "url": "https://www.aenabrasil.com.br/pt/aeroportos/aeroporto-internacional-de-maceio-zumbi-dos-palmares/Como-chegar--.html"
    },
    {
      "label": "Aena Brasil — aeroporto e distâncias de referência",
      "url": "https://www.aenabrasil.com.br/pt/aeroportos/aeroporto-internacional-de-maceio-zumbi-dos-palmares/index.html"
    },
    {
      "label": "Uber — informações de viagens para o MCZ",
      "url": "https://www.uber.com/global/pt-br/r/airports/mcz/"
    }
  ],
  "mapQuery": "Aeroporto Internacional Zumbi dos Palmares MCZ Rio Largo Alagoas"
},
  {
    slug: "hospedagem", title: "Onde ficar: compare a região antes do hotel", category: "Hospedagem", description: "Pajuçara ou Ponta Verde? Compare o endereço, os deslocamentos e as condições da hospedagem.",
    reviewedAt: "15/11/2026", places: STAY_PLACES,
    comparisonTitle: "Por onde começar a comparação?",
    comparison: [
      { name: "Pajuçara", bestFor: "Comece por aqui se seus passeios se concentram na orla de Pajuçara.", check: "Veja o endereço da hospedagem em relação ao seu ponto de embarque e às refeições." },
      { name: "Ponta Verde", bestFor: "Compare os endereços na Ponta Verde com as atividades escolhidas para a viagem.", check: "Confirme a distância real até os lugares que pretende visitar; estar no bairro não significa estar à beira-mar." },
    ],
    sources: STAY_PLACES.map((place) => ({ label: `${place.name} — endereço e contato oficial`, url: place.source })),
    keywords: "hotel hotéis hoteis pousada pousadas hospedagem hospedar ficar dormir bairro bairros airbnb",
    question: "Onde ficar hospedado em Maceió?",
    sections: [
      { title: "Comece pelo endereço", items: ["Compare Pajuçara e Ponta Verde como pontos de partida para explorar a orla.", "Antes de escolher, veja a distância da hospedagem até os locais que pretende visitar.", "Para estadias mais afastadas da orla turística, calcule também o transporte para alimentação e passeios."] },
      { title: "Confira antes de reservar", items: ["Verifique o preço total, as condições de cancelamento e o que está incluído.", "Com crianças, confirme a capacidade do quarto e a estrutura disponível.", "Peça as condições de acessibilidade diretamente à hospedagem quando necessário."] },
    ],
  },
  {
    slug: "alimentacao", title: "Onde comer: endereços para começar", category: "Gastronomia", description: "Duas opções com contato oficial em Ponta Verde e Jatiúca, para comparar com seu orçamento e seus passeios.",
    reviewedAt: "15/11/2026", places: FOOD_PLACES,
    sources: FOOD_PLACES.map((place) => ({ label: `${place.name} — endereço e contato oficial`, url: place.source })),
    keywords: "comer comida restaurante restaurantes gastronomia alimentação alimentacao almoço almoco jantar tapioca peixe sururu camarão camarao",
    question: "Onde comer em Maceió e quais comidas locais conhecer?",
    sections: [
      { title: "Entre um passeio e outro", items: ["Pajuçara, Ponta Verde e Jatiúca podem entrar no planejamento de uma refeição durante a visita à orla.", "Se passar o dia em uma praia distante, confira onde vai almoçar e se é permitido levar alimentos.", "Antes de pedir, confirme o cardápio, o valor e o tamanho das porções."] },
      { title: "Comidas e necessidades do grupo", items: ["Tapioca, peixe e preparos com sururu fazem parte da base gastronômica apresentada neste guia.", "Informe alergias e restrições diretamente ao estabelecimento, incluindo cuidados com o preparo.", "Para uma ocasião especial, confirme funcionamento e necessidade de reserva com o restaurante."] },
    ],
  },
  {
    slug: "praias", title: "Praias e piscinas naturais", category: "Passeios", description: "Escolha o destino e confira as condições antes de entrar na água.",
    keywords: "praia praias piscinas naturais jangada jangadas banho mar maré mare pajuçara pajucara ponta verde gunga ipioca",
    question: "Como escolher as praias e organizar o passeio às piscinas naturais?",
    sections: [
      { title: "Escolha o tipo de dia", items: ["Pajuçara e Ponta Verde permitem combinar orla, alimentação e caminhada.", "Para Gunga ou Ipioca, reserve tempo para o deslocamento e confirme como será o retorno.", "Evite juntar muitos destinos distantes no mesmo dia, principalmente com crianças."] },
      { title: "Piscinas naturais", items: ["Consulte a tábua de marés para a data e o local do passeio; não basta olhar o horário do dia anterior.", "Confirme a saída com a operadora e respeite as orientações locais e a sinalização.", "Consulte também a balneabilidade do trecho escolhido. A aparência da água não informa sua qualidade."] },
    ],
  },
  {
    slug: "familia", title: "Viagem com crianças", category: "Em família", description: "Um planejamento com menos trocas de lugar e espaço para pausas.",
    keywords: "criança crianca crianças criancas família familia bebê bebe filhos filho filha carrinho",
    question: "Como organizar um roteiro de Maceió com crianças?",
    sections: [
      { title: "Defina um ritmo possível", items: ["Prefira uma atividade principal por dia e deixe espaço para refeições e descanso.", "Escolha os passeios considerando os deslocamentos e a estrutura de que sua família precisa.", "Mantenha uma alternativa na cidade para dias em que o passeio de praia não puder acontecer."] },
      { title: "Confirme a estrutura", items: ["Verifique com a hospedagem e os prestadores as condições para receber crianças.", "Antes de atividades na água, consulte as condições e siga a orientação do responsável pelo passeio.", "No planejador, marque “Com crianças” para receber uma sugestão com mais pausas."] },
    ],
  },
  {
    slug: "informacoes", title: "Marés e informações oficiais", category: "Antes de sair", description: "Onde consultar marés, qualidade da água e notícias de turismo.",
    keywords: "informações informacoes notícias noticias eventos marés mares balneabilidade água agua condições condicoes tempo hoje emergência emergencia urgência urgencia socorro polícia policia samu bombeiros",
    question: "O que devo conferir antes de sair para um passeio em Maceió?",
    sections: [
      { title: "Consulte a fonte", items: ["Marinha do Brasil: selecione o ano, o porto e a data corretos na tábua de marés.", "IMA/AL: confira a data do boletim de balneabilidade e o ponto de coleta próximo ao trecho da praia.", "Prefeitura de Maceió: acompanhe os comunicados de turismo e confirme datas de eventos com a organização."] },
      { title: "Contatos de emergência", items: ["Polícia Militar: 190.", "SAMU: 192.", "Corpo de Bombeiros: 193.", "Em uma emergência, procure o serviço responsável diretamente; o chat não presta atendimento de emergência."] },
      { title: "Sobre este site", items: ["O MACEIÓ.IA organiza sugestões por regras e não consulta essas condições em tempo real.", "O roteiro não representa reserva, contratação ou confirmação de disponibilidade."] },
    ],
  },
];

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export function searchVisitorGuides(query: string) {
  const ignored = new Set(["como", "onde", "qual", "quais", "para", "uma", "com", "por", "que", "maceio", "alagoas"]);
  const terms = normalize(query.slice(0, 120)).match(/[a-z0-9]+/g)?.filter((term) => term.length > 2 && !ignored.has(term)).map((term) => term.replace(/s$/, "")) ?? [];
  if (!query.trim()) return VISITOR_GUIDES;
  if (!terms.length) return [];
  return VISITOR_GUIDES.map((guide) => {
    const primary = normalize(`${guide.title} ${guide.description} ${guide.keywords}`);
    const content = normalize([
      ...guide.sections.flatMap((section) => [section.title, ...section.items]),
      ...(guide.places ?? []).flatMap((place) => [place.name, place.area, place.address, place.description]),
    ].join(" "));
    const score = terms.reduce((total, term) => total + (primary.includes(term) ? 3 : content.includes(term) ? 1 : 0), 0);
    return { guide, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ guide }) => guide);
}

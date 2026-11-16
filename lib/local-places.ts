export type GuidePlace = {
  name: string;
  area: string;
  address: string;
  description: string;
  check: string;
  source: string;
  phone: string;
};

// Dados dos canais oficiais consultados em 15/11/2026; sem tarifas ou disponibilidade.
export const FOOD_PLACES: GuidePlace[] = [
  { name: "Wanchako", area: "Ponta Verde", address: "Rua Prefeito Abdon Arroxelas, 147, Ponta Verde, Maceió",
    description: "Cozinha peruana. Uma opção para comparar quando a refeição for a atividade principal da saída.",
    check: "Consulte o cardápio, confirme funcionamento e faça a reserva diretamente com a casa.",
    source: "https://www.wanchako.com.br/contato/", phone: "+5582988899634" },
  { name: "Parmegianno — Jatiúca", area: "Jatiúca", address: "Rua José Luiz Calazans, 44, Jatiúca, Maceió",
    description: "Unidade da rede na Jatiúca. Use o endereço desta unidade ao organizar a refeição e o deslocamento.",
    check: "Veja o cardápio da unidade e confirme porções, valores e condições de reserva.",
    source: "https://www.parmegianno.com/jatiuca/", phone: "+5582993279446" },
];

export const STAY_PLACES: GuidePlace[] = [
  { name: "Meridiano Hotel", area: "Pajuçara", address: "Av. Dr. Antônio Gouveia, 677, Pajuçara, Maceió",
    description: "Endereço na orla de Pajuçara para comparar com os passeios e o ponto de partida da sua viagem.",
    check: "Consulte a tarifa total nas suas datas, categoria do quarto, ocupação, café da manhã e cancelamento.",
    source: "https://www.meridianohotel.com.br/contato", phone: "+558232025000" },
  { name: "Hotel Ponta Verde Maceió", area: "Ponta Verde", address: "Av. Álvaro Otacílio, 2933, Ponta Verde, Maceió",
    description: "Unidade de Maceió na Ponta Verde. A rede também tem hotel no Francês; confira qual unidade está reservando.",
    check: "Compare quarto e valor final, incluindo crianças, taxas e condições de alteração da reserva.",
    source: "https://www.hotelpontaverde.com.br/contato", phone: "+558221210990" },
];

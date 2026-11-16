import type { Language } from "./types";

// Responde à limitação de dados diretamente, antes da seleção genérica de assuntos.
export function currentConditionsReply(text: string, language: Language): string | null {
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/\b(roteiro|itinerary|itinerario)\b/.test(normalized)) return null;
  if (/\b(mare|mares|marea|mareas|tide|tides)\b/.test(normalized)) {
    const source = "https://www.marinha.mil.br/chm/tabuas-de-mare";
    return language === "en"
      ? `I do not have live tide predictions, so I cannot confirm today's or tomorrow's tide. Check the Brazilian Navy table for the correct year, station and date: ${source}\n\nFor Maceió, look for Porto de Maceió and check the year inside the document. For other destinations, confirm the appropriate reference with the operator. A low tide alone does not confirm that a tour will run.`
      : language === "es"
        ? `No consulto predicciones de marea en tiempo real; no puedo confirmar la de hoy o mañana. Consulta el año, la estación y la fecha correctos en la tabla de la Marina: ${source}\n\nPara Maceió, busca Porto de Maceió y revisa el año dentro del documento. En otros destinos, confirma la referencia con el operador. La marea baja por sí sola no confirma la salida.`
        : `Não consulto previsões de maré em tempo real e não posso confirmar a maré de hoje ou amanhã. Abra a tábua da Marinha e confira o ano, a estação e a data: ${source}\n\nPara Maceió, procure Porto de Maceió e confira o ano dentro do documento. Para outros destinos, confirme a referência com a operadora. Maré baixa, sozinha, não confirma que o passeio poderá sair.`;
  }
  if (/\b(balneabilidade|propria para banho|impropria|qualidade da agua|water quality)\b/.test(normalized)) {
    const source = "https://www2.ima.al.gov.br/laboratorio/relatorios-de-balneabilidade/balneabilidade-de-praias/";
    return language === "en" ? `I do not check live water-quality reports. Look for the latest IMA/AL report, its sampling date and the exact beach section: ${source}`
      : language === "es" ? `No consulto informes actuales de calidad del agua. Revisa el último informe del IMA/AL, su fecha y el tramo exacto: ${source}`
      : `Não consultei o boletim atual de balneabilidade. Confira a data da coleta e o ponto correspondente ao trecho da praia no relatório mais recente do IMA/AL: ${source}\n\nA aparência da água não substitui essa consulta.`;
  }
  return null;
}

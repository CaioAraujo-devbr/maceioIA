import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { QuickPlanner } from "@/components/quick-planner";
import { PlanActions } from "@/components/plan-actions";
import { buildPlannerPrompt, plannerPath, type EntryParams } from "@/lib/planner-entry";
import { createItinerary, extractTravelContext, getItineraryWarnings } from "@/lib/travel-context";

export const metadata: Metadata = { title: "Montar roteiro de Maceió", description: "Organize os dias em Maceió conforme duração, perfil, orçamento e transporte.", alternates: { canonical: "/planejar" } };
export default async function PlannerPage({ searchParams }: { searchParams: Promise<EntryParams> }) {
  const params = await searchParams;
  const prompt = buildPlannerPrompt({ ...params, q: undefined });
  const context = extractTravelContext(prompt ? [{ role: "user", content: prompt }] : []);
  const itinerary = createItinerary(context);
  const savedPath = plannerPath(params);
  const warnings = getItineraryWarnings(context);
  const chatLink = `/chat?${new URLSearchParams({ q: prompt, plan: "1" }).toString()}`;
  const editExample = itinerary.some((day) => day.key === "beach") ? "Troque Gunga por Ipioca" : itinerary.some((day) => day.key === "maragogi") ? "Troque Maragogi por Ipioca" : "Quero incluir Ipioca";
  const hasQuery = Object.keys(params).length > 0;
  const months = "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split(" ");
  const summary = [context.month !== undefined && `Viagem em ${months[context.month]}`, context.interest === "beach" ? "Praias" : context.interest === "food" ? "Gastronomia" : context.interest === "culture" ? "Cultura" : "", context.days && `${context.days} ${context.days === 1 ? "dia" : "dias"}`, context.children === true ? "Com crianças" : context.children === false ? "Sem crianças" : "Perfil não informado", context.budget === "low" ? "Econômico" : context.budget === "mid" ? "Intermediário" : context.budget === "comfort" ? "Conforto" : "Orçamento não informado", context.transport === "transfer" ? "Sem carro" : context.transport === "car" ? "Com carro" : "Transporte a definir"].filter(Boolean).join(" · ");
  const copy = [`MACEIÓ.IA — Roteiro inicial`, summary, ...itinerary.map((day) => `Dia ${day.day} — ${day.title}\n${day.details}\nComece por: ${day.practical.start}\nDepois: ${day.practical.later}\nAlternativa: ${day.practical.alternative}`), ...warnings, "Sugestões por regras, sem consulta em tempo real. Confirme marés, transporte, preços e horários antes de sair."].join("\n\n");
  return <div className="travel-home planner-page"><SiteHeader/><main id="conteudo" className="travel-container">
    <div className="page-intro"><p className="eyebrow">Maceió.IA / Planejamento</p><h1>Seu roteiro de Maceió.</h1><p>De 1 a 7 dias, com os destinos e o ritmo da sua viagem.</p></div>
    <QuickPlanner key={JSON.stringify(params)} values={params} expanded/>
    {hasQuery && !itinerary.length && <p className="form-feedback" role="alert">Não foi possível gerar o roteiro com esses parâmetros. Escolha de 1 a 7 dias e envie o formulário novamente.</p>}
    {itinerary.length > 0 && <section id="resultado" className="plan-result" aria-labelledby="result-heading"><div className="result-header"><p className="eyebrow">Sua sugestão de viagem</p><h2 id="result-heading">{`Seu roteiro de ${context.days} ${context.days === 1 ? "dia" : "dias"}`}</h2><p>{summary}</p></div>
      <p className="plan-disclosure">Este é um planejamento automático por regras, sem reservas ou consulta de condições em tempo real.</p>
      {warnings.map((warning) => <p className="form-feedback" key={warning}>{warning}</p>)}
      {savedPath && <PlanActions text={copy} path={savedPath} summary={summary}/>}
      <div className="plan-result-grid"><div className="day-list">{itinerary.map((day) => <article className="day-card" key={day.day}><span className="day-number">Dia {day.day}</span><div><h3>{day.title}</h3><p>{day.details}</p><details className="day-practical"><summary>Como organizar este dia</summary><dl><dt>Comece por</dt><dd>{day.practical.start}</dd><dt>Depois</dt><dd>{day.practical.later}</dd><dt>Se precisar mudar</dt><dd>{day.practical.alternative}</dd></dl><Link href={day.practical.guide}>Abrir guia relacionado →</Link></details><div className="day-tags">{day.tideDependent && <Link href="/#antes-de-sair">Consultar maré antes de ir ↗</Link>}{day.needsTransport && <span>Combinar ida e volta</span>}</div></div></article>)}</div>
      <aside className="plan-checklist"><h3>Antes de confirmar o passeio</h3><ul><li>Consulte maré e qualidade da água para o trecho escolhido.</li><li>Confira horários e valores diretamente com os prestadores.</li><li>Combine o transporte de retorno.</li>{context.children && <li>Reserve pausas e verifique a estrutura para crianças.</li>}</ul><Link href="/#antes-de-sair">Abrir fontes oficiais →</Link><h3>Quer mudar um lugar?</h3><p>Seu roteiro e suas preferências vão junto. Experimente: “{editExample}”.</p><Link className="travel-button" href={chatLink}>Ajustar no chat →</Link></aside></div>
    </section>}
  </main><SiteFooter/></div>;
}

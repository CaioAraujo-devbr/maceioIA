import { TravelIcon } from "./travel-icon";
import type { EntryParams } from "@/lib/planner-entry";
import { MAX_ITINERARY_DAYS } from "@/lib/travel-context";

export function QuickPlanner({ values = {}, expanded = false }: { values?: EntryParams; expanded?: boolean }) {
  function value(key: string, allowed: string[], fallback = "") {
    return typeof values[key] === "string" && allowed.includes(values[key]) ? values[key] : fallback;
  }
  const editing = expanded && typeof values.days === "string" && Number.isInteger(Number(values.days)) && Number(values.days) >= 1 && Number(values.days) <= MAX_ITINERARY_DAYS;
  const days = Array.from({ length: MAX_ITINERARY_DAYS }, (_, index) => String(index + 1));
  return <section id="planejar" className="quick-planner" aria-labelledby="planner-heading">
    <div className="planner-heading"><div><h2 id="planner-heading">{editing ? "Ajustar preferências" : "Como será a viagem?"}</h2></div></div>
    <form action="/planejar#resultado" method="get" className={`planner-form ${expanded ? "planner-expanded" : ""}`}>
      <label>Quantos dias?<select name="days" defaultValue={value("days", days, "3")}>{days.map((day) => <option key={day} value={day}>{day} {day === "1" ? "dia" : "dias"}</option>)}</select></label>
      <label>Mês da viagem<select name="month" defaultValue={value("month", Array.from({ length: 12 }, (_, index) => String(index + 1)))}><option value="">Ainda não sei</option>{"Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" ").map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></label>
      <label>Quem vai viajar?<select name="profile" defaultValue={value("profile", ["couple", "family", "solo", "friends"])}><option value="">Não defini</option><option value="couple">Casal, sem crianças</option><option value="family">Com crianças</option><option value="solo">Sozinho(a)</option><option value="friends">Amigos, sem crianças</option></select></label>
      <label>Faixa de orçamento<select name="budget" defaultValue={value("budget", ["low", "mid", "comfort"])}><option value="">Não defini</option><option value="low">Econômico</option><option value="mid">Intermediário</option><option value="comfort">Mais conforto</option></select></label>
      {expanded && <><label>Seu principal interesse<select name="interest" defaultValue={value("interest", ["beach", "food", "culture"])}><option value="">Variar as experiências</option><option value="beach">Praias</option><option value="food">Gastronomia</option><option value="culture">Cultura e artesanato</option></select></label><label>Transporte<select name="transport" defaultValue={value("transport", ["car", "transfer"])}><option value="">Ainda não defini</option><option value="car">Vou estar de carro</option><option value="transfer">Sem carro</option></select></label></>}
      {expanded && <label>Um destino que não pode faltar<select name="place" defaultValue={value("place", ["gunga", "ipioca", "maragogi"])}><option value="">Pode sugerir</option><option value="gunga">Praia do Gunga</option><option value="ipioca">Ipioca</option><option value="maragogi">Maragogi</option></select></label>}
      <button className="travel-button" type="submit">{editing ? "Atualizar roteiro" : "Ver meu roteiro"} <TravelIcon name="arrow"/></button>
    </form>
    <p className="planner-note">{editing ? "As alterações geram uma nova sugestão abaixo." : "O roteiro aparece na próxima tela. Não é preciso conversar ou criar uma conta."}</p>
  </section>;
}

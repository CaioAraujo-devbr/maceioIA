import { plannerPath } from "./planner-entry";

export const SAVED_TRIP_KEY = "maceioia:saved-trip:v1";
export const SAVED_TRIP_EVENT = "maceioia:trip-updated";
export type SavedTrip = { path: string; summary: string; savedAt: string };

export function readSavedTrip(raw: string | null): SavedTrip | null {
  if (!raw || raw.length > 6000) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value.path !== "string" || value.path.length > 1200
      || typeof value.summary !== "string" || !value.summary.trim() || value.summary.length > 400
      || typeof value.savedAt !== "string" || value.savedAt.length > 40 || !Number.isFinite(Date.parse(value.savedAt))) return null;
    const url = new URL(value.path, "https://saved.invalid");
    if (url.origin !== "https://saved.invalid" || url.pathname !== "/planejar") return null;
    // Evita ambiguidades entre múltiplos valores do mesmo parâmetro.
    if (new Set(url.searchParams.keys()).size !== [...url.searchParams.keys()].length) return null;
    const path = plannerPath(Object.fromEntries(url.searchParams));
    if (!path || path !== value.path) return null;
    return { path, summary: value.summary, savedAt: value.savedAt };
  } catch { return null; }
}

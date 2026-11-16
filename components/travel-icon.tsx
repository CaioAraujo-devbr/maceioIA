import type { CSSProperties } from "react";

export type IconName = "spark" | "arrow" | "pin" | "wave" | "food" | "bed" | "car" | "calendar" | "check" | "sun" | "external";
const paths: Record<IconName, React.ReactNode> = {
  spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/><path d="m20 3 .5 1.5L22 5l-1.5.5L20 7l-.5-1.5L18 5l1.5-.5Z"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  wave: <><path d="M2 8c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 14c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 20c3-4 5 4 8 0s5 4 8 0 4 0 4 0"/></>,
  food: <><path d="M5 3v7m4-7v7M3 3v5a4 4 0 0 0 8 0V3M7 12v10M20 22V3c-5 0-5 12 0 12"/></>,
  bed: <><path d="M3 18V5m0 10h18V9a2 2 0 0 0-2-2h-7v8M3 18h18m0-3v7M3 18v4"/><path d="M5 9h5v4H5z"/></>,
  car: <><path d="m4 9 2-5h12l2 5M3 10h18v8H3zM5 18v3m14-3v3"/><path d="M6 14h2m8 0h2"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 5h2m4 0h2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l1.5 1.5m13 13L20 20M4 20l1.5-1.5m13-13L20 4"/></>,
  external: <><path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/></>,
};
export function TravelIcon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>{paths[name]}</svg>;
}

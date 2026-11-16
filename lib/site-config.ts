import { resolveSiteConfig } from "./site-origin.mjs";

export function getSiteConfig(value = process.env.NEXT_PUBLIC_SITE_URL, deployment = process.env.VERCEL_ENV, productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  return resolveSiteConfig(value, deployment, productionHost);
}

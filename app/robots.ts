import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const { origin, publicSite } = getSiteConfig();
  return { rules: publicSite ? { userAgent: "*", allow: "/", disallow: ["/api/", "/chat", "/minha-viagem"] } : { userAgent: "*", disallow: "/" }, sitemap: origin + "/sitemap.xml" };
}

import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/destinations";
import { VISITOR_GUIDES } from "@/lib/visitor-guides";
import { getSiteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const { origin } = getSiteConfig();
  const paths = ["/", "/planejar", "/guia", "/sobre", "/privacidade", ...DESTINATIONS.map((place) => `/destinos/${place.slug}`), ...VISITOR_GUIDES.map((guide) => `/guia/${guide.slug}`)];
  return paths.map((path) => ({ url: origin + path }));
}

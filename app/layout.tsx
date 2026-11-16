import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "./professional.css";
import { getSiteConfig } from "@/lib/site-config";
import { SiteAnalytics } from "@/components/site-analytics";

const bodyFont = Source_Sans_3({
  subsets: ["latin"], variable: "--font-body", display: "swap",
});
const headingFont = Barlow_Condensed({
  subsets: ["latin"], weight: ["600", "700"], variable: "--font-heading", display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MACEIÓ.IA — Turismo em Maceió e Alagoas",
    template: "%s · MACEIÓ.IA",
  },
  description:
    "Planeje de 1 a 7 dias em Maceió, salve seu roteiro e encontre guias de praias, transporte, alimentação e hospedagem.",
  icons: { icon: "/brand/logo-oficial.jpg", apple: "/brand/logo-oficial.jpg" },
  metadataBase: new URL(getSiteConfig().origin),
  robots: { index: getSiteConfig().publicSite, follow: true },
  openGraph: { siteName: "MACEIÓ.IA", locale: "pt_BR", type: "website", title: "MACEIÓ.IA — Planeje sua viagem a Maceió", description: "Roteiros de 1 a 7 dias e guias locais para organizar sua viagem.", images: [{ url: "/brand/logo-oficial.jpg", width: 1024, height: 1024, alt: "MACEIÓ.IA — Turismo em Alagoas" }] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans antialiased`}>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}

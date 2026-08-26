import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "MaceiôIA — agente de turismo para Maceió",
    template: "%s · MaceiôIA",
  },
  description:
    "Pergunte em português, inglês ou espanhol e receba recomendações de praias, restaurantes, passeios, hotéis e roteiros em Maceió, Alagoas.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakarta.variable} ${fraunces.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

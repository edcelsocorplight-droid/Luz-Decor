import type { Metadata } from "next";
import "./globals.css";
import Spotlight from "@/components/Spotlight";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.seudominio.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Luz Decor Brasil | Lustres, Pendentes, Arandelas e Spots para Iluminar sua Casa",
    template: "%s | Luz Decor Brasil"
  },
  description:
    "Curadoria de luminárias para todos os ambientes: lustres, pendentes, arandelas e spots para casa, apartamento e espaços comerciais. Compare e compre com segurança no Mercado Livre e na Shopee.",
  keywords: [
    "luminárias", "lustres", "pendentes", "arandelas", "spots de embutir",
    "iluminação residencial", "iluminação comercial", "decoração", "luz decor"
  ],
  authors: [{ name: "Luz Decor Brasil" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Luz Decor Brasil",
    title: "Luz Decor Brasil | Iluminação para todos os ambientes",
    description:
      "Lustres, pendentes, arandelas e spots selecionados para transformar sua casa ou seu negócio. Veja as ofertas no Mercado Livre e na Shopee.",
    url: siteUrl,
    locale: "pt_BR",
    images: [{ url: "/og-image.jpg" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Luz Decor Brasil | Iluminação para todos os ambientes",
    description: "Lustres, pendentes, arandelas e spots selecionados para casa e comércio.",
    images: ["/og-image.jpg"]
  },
  icons: { icon: "/favicon.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Luz Decor Brasil",
    url: siteUrl,
    description:
      "Curadoria de luminárias e produtos de iluminação para ambientes residenciais e comerciais, com direcionamento para Mercado Livre e Shopee.",
    sameAs: ["https://www.instagram.com/seu_perfil", "https://www.facebook.com/sua_pagina"]
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Spotlight />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

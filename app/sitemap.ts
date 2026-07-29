import type { MetadataRoute } from "next";
import { listarProdutosAtivos } from "@/lib/store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.seudominio.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produtos = await listarProdutosAtivos();

  const paginasProduto: MetadataRoute.Sitemap = produtos.map((p) => ({
    url: `${siteUrl}/produto/${p.slug}`,
    lastModified: p.atualizadoEm || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1
    },
    ...paginasProduto
  ];
}

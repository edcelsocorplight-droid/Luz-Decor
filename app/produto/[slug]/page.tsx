import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { buscarProdutoPorSlug, listarProdutosAtivos } from "@/lib/store";
import { CATEGORIA_LABEL, LOJA_LABEL } from "@/lib/categorias";
import { formatarLoja, formatarPreco } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.seudominio.com.br";

export async function generateStaticParams() {
  const produtos = await listarProdutosAtivos();
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const produto = await buscarProdutoPorSlug(params.slug);
  if (!produto) return { title: "Produto não encontrado" };

  const titulo = `${produto.titulo} | Luz Decor Brasil`;
  const descricao =
    produto.descricao ||
    `${produto.titulo}${produto.ambiente ? ` para ${produto.ambiente}` : ""}. Compare o preço e compre com segurança na ${formatarLoja(produto.loja)}.`;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/produto/${produto.slug}` },
    openGraph: {
      title: titulo,
      description: descricao,
      url: `${siteUrl}/produto/${produto.slug}`,
      images: [{ url: produto.imagem }]
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [produto.imagem]
    }
  };
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const produto = await buscarProdutoPorSlug(params.slug);
  if (!produto) notFound();

  const todos = await listarProdutosAtivos();
  const relacionados = todos
    .filter(
      (p) =>
        p.id !== produto.id &&
        p.categorias.some((c) => produto.categorias.includes(c))
    )
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.titulo,
    image: [produto.imagem],
    description:
      produto.descricao || `${produto.titulo} disponível na ${formatarLoja(produto.loja)}.`,
    offers: {
      "@type": "Offer",
      url: produto.link,
      priceCurrency: "BRL",
      price: (produto.preco || "").replace(/[^\d,]/g, "").replace(",", "."),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: formatarLoja(produto.loja) }
    }
  };

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link> {" › "}
        <Link href="/#catalogo">Catálogo</Link> {" › "}
        <span>{produto.titulo}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail-media">
          {produto.selo && <span className="badge">{produto.selo}</span>}
          <span className={`store-tag ${produto.loja}`} style={{ position: "absolute", top: 10, right: 10 }}>
            {formatarLoja(produto.loja)}
          </span>
          <Image
            src={produto.imagem}
            alt={produto.titulo}
            width={700}
            height={700}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            unoptimized
            priority
          />
        </div>

        <div className="product-detail-info">
          {produto.ambiente && <span className="product-ambiente">{produto.ambiente}</span>}
          <h1>{produto.titulo}</h1>
          <div className="product-detail-cats">
            {produto.categorias.map((c) => (
              <Link key={c} href={`/?cat=${c}#catalogo`}>
                {CATEGORIA_LABEL[c] || c}
              </Link>
            ))}
          </div>

          {produto.preco && (
            <div className="product-price-row">
              {produto.precoDe && <span className="price-old">{formatarPreco(produto.precoDe)}</span>}
              <span className="price-now">{formatarPreco(produto.preco)}</span>
            </div>
          )}

          {produto.descricao && <p className="product-detail-desc">{produto.descricao}</p>}

          <a
            className="product-cta product-detail-cta"
            href={produto.link}
            target="_blank"
            rel="nofollow sponsored noopener"
            data-produto={produto.id}
            data-loja={produto.loja}
          >
            Ver na {formatarLoja(produto.loja)}
          </a>
          <p className="product-detail-hint">
            Você será redirecionado para a loja parceira para concluir a compra com segurança.
          </p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados-title">
          <div className="section-heading related-heading">
            <h2 id="relacionados-title">Você também pode gostar</h2>
          </div>
          <div className="product-grid" style={{ paddingBottom: "var(--gap-xl)" }}>
            {relacionados.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

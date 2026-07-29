import Image from "next/image";
import Link from "next/link";
import { Produto } from "@/lib/types";
import { formatarLoja, formatarPreco } from "@/lib/utils";

export default function ProductCard({ produto }: { produto: Produto }) {
  return (
    <article className="product-card">
      <Link href={`/produto/${produto.slug}`} className="product-media" aria-label={produto.titulo}>
        {produto.selo && <span className="badge">{produto.selo}</span>}
        <span className={`store-tag ${produto.loja}`}>{formatarLoja(produto.loja)}</span>
        <Image
          src={produto.imagem}
          alt={produto.titulo}
          width={400}
          height={400}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          unoptimized
        />
      </Link>
      <div className="product-body">
        {produto.ambiente && <span className="product-ambiente">{produto.ambiente}</span>}
        <Link href={`/produto/${produto.slug}`} className="product-title" style={{ textDecoration: "none" }}>
          {produto.titulo}
        </Link>
        {produto.preco && (
          <div className="product-price-row">
            {produto.precoDe && <span className="price-old">{formatarPreco(produto.precoDe)}</span>}
            <span className="price-now">{formatarPreco(produto.preco)}</span>
          </div>
        )}
        <a
          className="product-cta"
          href={produto.link}
          target="_blank"
          rel="nofollow sponsored noopener"
          data-produto={produto.id}
          data-loja={produto.loja}
        >
          Ver na {formatarLoja(produto.loja)}
        </a>
      </div>
    </article>
  );
}

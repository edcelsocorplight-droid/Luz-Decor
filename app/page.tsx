import { listarProdutosAtivos } from "@/lib/store";
import CatalogoInterativo from "@/components/CatalogoInterativo";

export const revalidate = 60; // regenera a home a cada 60s para refletir o painel

export default async function HomePage() {
  const produtos = await listarProdutosAtivos();

  return (
    <main id="topo">
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero-bg"
          src="https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=1600&q=80"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-inner">
          <span className="eyebrow">Iluminação residencial &amp; comercial</span>
          <h1 id="hero-title">
            Cada cômodo tem <em>uma luz</em> perfeita esperando por ele
          </h1>
          <p className="lead">
            Selecionamos lustres, pendentes, arandelas e spots para você comparar
            e comprar direto no Mercado Livre e na Shopee, com toda a segurança
            dessas plataformas.
          </p>
          <div className="hero-ctas">
            <a href="#catalogo" className="btn btn-primary">Ver luminárias</a>
            <a href="#sobre" className="btn btn-ghost">Como funciona</a>
          </div>
          <div className="trust-row">
            <span>🔒 Compra protegida pelas plataformas</span>
            <span>🚚 Envio via Mercado Livre / Shopee</span>
            <span>✨ Seleção atualizada semanalmente</span>
          </div>
        </div>
      </section>

      <CatalogoInterativo produtos={produtos} />

      <section className="value-props" id="sobre" aria-labelledby="valor-title">
        <div className="container value-grid">
          <div className="value-item">
            <span className="num">01</span>
            <h3>Curadoria de verdade</h3>
            <p>Cada peça é escolhida pensando em ambiente, estilo e custo-benefício — nada de catálogo genérico.</p>
          </div>
          <div className="value-item">
            <span className="num">02</span>
            <h3>Você compra na loja oficial</h3>
            <p>O pagamento e a entrega acontecem sempre dentro do Mercado Livre ou da Shopee, com a proteção ao comprador de cada uma.</p>
          </div>
          <div className="value-item">
            <span className="num">03</span>
            <h3>Para casa e para o negócio</h3>
            <p>De um abajur de quarto a um painel de LED para loja: iluminação residencial e comercial num só lugar.</p>
          </div>
        </div>
      </section>

      <section className="social-cta" aria-labelledby="social-title">
        <div className="container">
          <span className="eyebrow">Fica de olho</span>
          <h2 id="social-title">Novidades e promoções saem primeiro no Instagram</h2>
          <p>Siga a Luz Decor Brasil para ver ambientes decorados, antes/depois e avisos de queda de preço antes de todo mundo.</p>
          <div className="social-links">
            <a href="https://www.instagram.com/seu_perfil" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.facebook.com/sua_pagina" target="_blank" rel="noopener">Facebook</a>
          </div>
        </div>
      </section>
    </main>
  );
}

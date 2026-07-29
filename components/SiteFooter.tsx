import Link from "next/link";

export default function SiteFooter() {
  const ano = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>Luz Decor Brasil</h4>
            <p style={{ color: "var(--text-muted)", maxWidth: "32ch" }}>
              Curadoria de luminárias para transformar a iluminação da sua casa
              ou do seu negócio, com compra segura no Mercado Livre e na Shopee.
            </p>
          </div>
          <div>
            <h4>Categorias</h4>
            <ul>
              <li><Link href="/#catalogo">Decoração</Link></li>
              <li><Link href="/#catalogo">Luminárias para Ambientes</Link></li>
              <li><Link href="/#catalogo">Luminárias</Link></li>
              <li><Link href="/#catalogo">Lâmpadas</Link></li>
              <li><Link href="/#sobre">Sobre</Link></li>
            </ul>
          </div>
          <div>
            <h4>Siga</h4>
            <ul>
              <li><a href="https://www.instagram.com/seu_perfil" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://www.facebook.com/sua_pagina" target="_blank" rel="noopener">Facebook</a></li>
            </ul>
          </div>
        </div>

        <p className="disclosure">
          A Luz Decor Brasil participa de programas de afiliados do Mercado Livre e da Shopee.
          Isso significa que podemos receber uma comissão quando você compra através dos nossos
          links, sem nenhum custo extra para você. Preços e disponibilidade são definidos pelas
          próprias plataformas e podem mudar a qualquer momento.
        </p>

        <div className="footer-bottom">
          <span>© {ano} Luz Decor Brasil. Todos os direitos reservados.</span>
          <span>Feito para iluminar cada cantinho da sua casa.</span>
        </div>
      </div>
    </footer>
  );
}

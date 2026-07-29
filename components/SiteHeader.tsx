"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIAS_GRUPOS } from "@/lib/categorias";

export default function SiteHeader() {
  const [aberto, setAberto] = useState<string | null>(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function fechar(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setAberto(null);
      }
    }
    function fecharEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(null);
    }
    document.addEventListener("click", fechar);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("click", fechar);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/#topo" className="logo">
          Luz Decor <span className="dot">Brasil</span>
        </Link>
        <nav aria-label="Navegação principal" ref={navRef}>
          <ul className="main-nav" style={menuMobileAberto ? { display: "flex", flexDirection: "column", position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg-surface)", padding: "12px 20px", borderBottom: "1px solid var(--border-soft)" } : undefined}>
            {CATEGORIAS_GRUPOS.map((grupo) => (
              <li
                key={grupo.slug}
                className={"has-mega" + (aberto === grupo.slug ? " open" : "")}
                onMouseEnter={() => setAberto(grupo.slug)}
              >
                <button
                  type="button"
                  className="mega-trigger"
                  aria-expanded={aberto === grupo.slug}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAberto((atual) => (atual === grupo.slug ? null : grupo.slug));
                  }}
                >
                  {grupo.titulo} <span className="caret">▾</span>
                </button>
                <div className="mega-panel mega-panel-single">
                  <ul>
                    {grupo.itens.map(([slug, label, tag]) => (
                      <li key={slug}>
                        <Link href={`/?cat=${slug}#catalogo`} data-scroll-cat={slug} onClick={() => setAberto(null)}>
                          {label} {tag && <span className="cat-tag">{tag}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li>
              <Link href="/#sobre">Sobre</Link>
            </li>
          </ul>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/admin" className="admin-toggle" title="Painel administrativo">
            ⚙
          </Link>
          <button
            className="nav-toggle"
            aria-label="Abrir menu"
            aria-expanded={menuMobileAberto}
            onClick={() => setMenuMobileAberto((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

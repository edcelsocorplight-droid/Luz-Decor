"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Produto } from "@/lib/types";
import { CATEGORIA_LABEL, ORDEM_CATEGORIAS } from "@/lib/categorias";
import ProductCard from "./ProductCard";

function CatalogoInterno({ produtos }: { produtos: Produto[] }) {
  const searchParams = useSearchParams();
  const catInicial = searchParams.get("cat") || "todos";
  const [categoriaAtiva, setCategoriaAtiva] = useState(catInicial);

  useEffect(() => {
    setCategoriaAtiva(searchParams.get("cat") || "todos");
  }, [searchParams]);

  const categoriasPresentes = useMemo(() => {
    const set = new Set<string>();
    produtos.forEach((p) => (p.categorias || []).forEach((c) => set.add(c)));
    return set;
  }, [produtos]);

  const categoriasVisiveis = ORDEM_CATEGORIAS.filter(
    (c) => c === "todos" || categoriasPresentes.has(c)
  );

  const listaFiltrada =
    categoriaAtiva === "todos"
      ? produtos
      : produtos.filter((p) => (p.categorias || []).includes(categoriaAtiva));

  return (
    <>
      <div className="container">
        <div className="filters" id="filters-section">
          <div className="filters-inner" role="tablist" aria-label="Filtrar por categoria">
            {categoriasVisiveis.map((cat) => (
              <button
                key={cat}
                type="button"
                className={"filter-chip" + (cat === categoriaAtiva ? " active" : "")}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {CATEGORIA_LABEL[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="catalog container" id="catalogo" aria-labelledby="catalogo-title">
        <div className="section-heading">
          <h2 id="catalogo-title">Encontre a luminária certa para o seu espaço</h2>
          <p>Lustres, pendentes, arandelas e spots para salas, quartos, cozinhas, áreas externas e ambientes comerciais.</p>
        </div>
        <div className="product-grid" aria-live="polite">
          {listaFiltrada.length === 0 ? (
            <div className="empty-state">Nenhum produto nesta categoria no momento. Volte em breve!</div>
          ) : (
            listaFiltrada.map((p) => <ProductCard key={p.id} produto={p} />)
          )}
        </div>
      </section>
    </>
  );
}

export default function CatalogoInterativo({ produtos }: { produtos: Produto[] }) {
  return (
    <Suspense fallback={null}>
      <CatalogoInterno produtos={produtos} />
    </Suspense>
  );
}

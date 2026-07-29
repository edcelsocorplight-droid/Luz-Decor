import { NextRequest, NextResponse } from "next/server";
import { listarProdutos, salvarProdutos } from "@/lib/store";
import { gerarId, gerarSlug } from "@/lib/utils";
import { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const produtos = await listarProdutos();
  return NextResponse.json(produtos);
}

// Autenticação já é garantida pelo middleware.ts para qualquer método
// diferente de GET nesta rota.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { erro: "Formato inválido: esperado uma lista de produtos" },
      { status: 400 }
    );
  }

  const slugsUsados = new Set<string>();
  const agora = new Date().toISOString();

  const produtos: Produto[] = body.map((item: Partial<Produto>) => {
    const titulo = String(item.titulo || "").trim();
    let slug = gerarSlug(item.slug || titulo);
    let sufixo = 2;
    while (slugsUsados.has(slug)) {
      slug = `${gerarSlug(item.slug || titulo)}-${sufixo}`;
      sufixo++;
    }
    slugsUsados.add(slug);

    return {
      id: item.id || gerarId(),
      slug,
      titulo,
      categorias: Array.isArray(item.categorias) ? item.categorias : [],
      ambiente: item.ambiente || "",
      loja: item.loja === "shopee" ? "shopee" : "mercadolivre",
      preco: item.preco || "",
      precoDe: item.precoDe || "",
      selo: item.selo || "",
      imagem: item.imagem || "",
      link: item.link || "",
      ativo: item.ativo !== false,
      descricao: item.descricao || "",
      criadoEm: item.criadoEm || agora,
      atualizadoEm: agora
    };
  });

  await salvarProdutos(produtos);
  return NextResponse.json({ ok: true, total: produtos.length });
}

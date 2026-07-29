export type Loja = "mercadolivre" | "shopee";

export interface Produto {
  id: string;
  slug: string;
  titulo: string;
  categorias: string[];
  ambiente?: string;
  loja: Loja;
  preco?: string;
  precoDe?: string;
  selo?: string;
  imagem: string;
  link: string;
  ativo: boolean;
  /** Texto curto e único sobre o produto — ajuda no SEO da página individual
   *  (evita "conteúdo fino", que o Google penaliza em sites de afiliado). */
  descricao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CategoriaGrupo {
  slug: string;
  titulo: string;
  itens: [string, string, string?][]; // [slug, label, tagOpcional]
}

/**
 * Taxonomia de categorias — fonte única de verdade.
 * Usada para montar: mega menu do cabeçalho, seletor do painel admin,
 * filtros do catálogo e rótulos exibidos.
 * Para adicionar/remover uma categoria, edite só esta lista.
 */
export const CATEGORIAS_GRUPOS: CategoriaGrupo[] = [
  {
    slug: "decoracao",
    titulo: "Decoração",
    itens: [
      ["decor-area-externa", "Área Externa"],
      ["decor-banheiro", "Banheiro"],
      ["decor-cozinha", "Cozinha"],
      ["decor-quarto", "Quarto"],
      ["decor-sala-estar", "Sala de Estar"],
      ["decor-sala-jantar", "Sala de Jantar"],
      ["decor-jardim", "Jardim"],
      ["decor-escritorio", "Escritório"],
      ["decor-hall", "Hall"],
      ["decor-lavabo", "Lavabo"],
      ["decor-closet", "Closet"],
      ["decor-varanda", "Varanda"],
      ["decor-home-office", "Home Office"]
    ]
  },
  {
    slug: "ambiente",
    titulo: "Luminárias para Ambientes",
    itens: [
      ["area-externa", "Área Externa"],
      ["banheiro", "Banheiro"],
      ["cozinha", "Cozinha"],
      ["quarto", "Quarto"],
      ["sala-estar", "Sala de Estar"],
      ["sala-jantar", "Sala de Jantar"],
      ["jardim", "Jardim"],
      ["escritorio", "Escritório"],
      ["hall", "Hall"],
      ["lavabo", "Lavabo"],
      ["closet", "Closet"],
      ["varanda", "Varanda"],
      ["home-office", "Home Office"]
    ]
  },
  {
    slug: "luminarias",
    titulo: "Luminárias",
    itens: [
      ["abajures", "Abajures"],
      ["arandelas", "Arandelas"],
      ["coluna-piso", "Coluna/Luminária de Piso"],
      ["lustres", "Lustres"],
      ["pendentes", "Pendentes"],
      ["plafons", "Plafons"],
      ["spots", "Spots"],
      ["trilhos", "Trilhos"],
      ["ventiladores", "Ventiladores"]
    ]
  },
  {
    slug: "lampadas",
    titulo: "Lâmpadas",
    itens: [
      ["lampada-tubular", "Lâmpada Tubular", "Led"],
      ["lampada-vela", "Lâmpada Vela"],
      ["lampada-filamento", "Lâmpada Filamento"]
    ]
  }
];

export const CATEGORIA_LABEL: Record<string, string> = { todos: "Todos" };
export const ORDEM_CATEGORIAS: string[] = ["todos"];
CATEGORIAS_GRUPOS.forEach((grupo) => {
  grupo.itens.forEach(([slug, label]) => {
    CATEGORIA_LABEL[slug] = label;
    ORDEM_CATEGORIAS.push(slug);
  });
});

export const LOJA_LABEL: Record<string, string> = {
  mercadolivre: "Mercado Livre",
  shopee: "Shopee"
};

export function categoriasDoProduto(categorias: string[] | undefined): string[] {
  return Array.isArray(categorias) ? categorias : [];
}

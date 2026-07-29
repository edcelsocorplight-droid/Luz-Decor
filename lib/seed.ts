import { Produto } from "./types";

// Produto de exemplo, usado só enquanto você não cadastra nada no painel.
// Pode excluí-lo pelo próprio /admin assim que publicar seus produtos reais.
export const PRODUTOS_SEED: Produto[] = [
  {
    id: "exemplo-lustre",
    slug: "lustre-de-cristal-pendente-redondo",
    titulo: "Lustre de Cristal Pendente Redondo",
    categorias: ["lustres", "sala-estar", "sala-jantar"],
    ambiente: "Sala de estar",
    loja: "mercadolivre",
    preco: "R$ 349,90",
    precoDe: "",
    selo: "Exemplo",
    imagem:
      "https://images.unsplash.com/photo-1543198126-b26a2bcf0b3f?auto=format&fit=crop&w=800&q=80",
    link: "https://www.mercadolivre.com.br/",
    ativo: true,
    descricao:
      "Este é um produto de exemplo para você ver como fica no site. Edite ou exclua pelo painel administrativo em /admin."
  }
];

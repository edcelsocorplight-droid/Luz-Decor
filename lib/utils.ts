import { LOJA_LABEL } from "./categorias";

export function gerarSlug(titulo: string): string {
  return (titulo || "produto")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function gerarId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function formatarLoja(loja: string): string {
  return LOJA_LABEL[loja] || loja;
}

/** Garante o "R$" na frente do preço, mesmo se foi digitado só o número. */
export function formatarPreco(valor?: string): string {
  if (!valor) return "";
  const texto = String(valor).trim();
  if (/^r\$/i.test(texto)) return texto.replace(/^r\$\s*/i, "R$ ");
  return "R$ " + texto;
}

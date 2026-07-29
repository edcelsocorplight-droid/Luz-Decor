"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Produto, Loja } from "@/lib/types";
import { CATEGORIAS_GRUPOS, CATEGORIA_LABEL, LOJA_LABEL } from "@/lib/categorias";
import { formatarLoja, formatarPreco, gerarId, gerarSlug } from "@/lib/utils";

type Aba = "formulario" | "lista" | "importar" | "publicar";

const FORM_VAZIO = {
  titulo: "",
  categorias: [] as string[],
  loja: "mercadolivre" as Loja,
  ambiente: "",
  preco: "",
  precoDe: "",
  selo: "",
  imagem: "",
  link: "",
  descricao: "",
  ativo: true
};

export default function AdminApp() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [aba, setAba] = useState<Aba>("formulario");
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroLoja, setFiltroLoja] = useState("todos");
  const [publicando, setPublicando] = useState(false);
  const [sujo, setSujo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    carregarDoServidor();
  }, []);

  async function carregarDoServidor() {
    const resp = await fetch("/api/produtos", { cache: "no-store" });
    const dados = await resp.json();
    setProdutos(dados);
    setCarregado(true);
    setSujo(false);
  }

  function marcarStatus(msg: string, ok = true) {
    setStatus({ msg, ok });
    clearTimeout(statusTimeout.current);
    statusTimeout.current = setTimeout(() => setStatus(null), 3500);
  }

  function limparForm() {
    setForm({ ...FORM_VAZIO });
    setEditandoId(null);
  }

  function preencherForm(p: Produto) {
    setAba("formulario");
    setForm({
      titulo: p.titulo,
      categorias: p.categorias || [],
      loja: p.loja,
      ambiente: p.ambiente || "",
      preco: p.preco || "",
      precoDe: p.precoDe || "",
      selo: p.selo || "",
      imagem: p.imagem,
      link: p.link,
      descricao: p.descricao || "",
      ativo: p.ativo !== false
    });
    setEditandoId(p.id);
  }

  function alternarCategoria(slug: string) {
    setForm((f) => ({
      ...f,
      categorias: f.categorias.includes(slug)
        ? f.categorias.filter((c) => c !== slug)
        : [...f.categorias, slug]
    }));
  }

  function salvarProduto(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) return marcarStatus("Preencha o título do produto", false);
    if (!form.imagem.trim() || !form.link.trim())
      return marcarStatus("Imagem e link de afiliado são obrigatórios", false);
    if (form.categorias.length === 0)
      return marcarStatus("Selecione ao menos uma categoria", false);

    if (editandoId) {
      setProdutos((lista) =>
        lista.map((p) => (p.id === editandoId ? { ...p, ...form, slug: p.slug } : p))
      );
      marcarStatus("Produto atualizado (clique em Publicar para valer no site)");
    } else {
      const novo: Produto = {
        id: gerarId(),
        slug: gerarSlug(form.titulo),
        ...form
      };
      setProdutos((lista) => [novo, ...lista]);
      marcarStatus("Produto adicionado (clique em Publicar para valer no site)");
    }
    setSujo(true);
    limparForm();
  }

  function excluirProduto(id: string) {
    if (!confirm("Excluir este produto do catálogo?")) return;
    setProdutos((lista) => lista.filter((p) => p.id !== id));
    setSujo(true);
    marcarStatus("Produto excluído (clique em Publicar para valer no site)");
  }

  function duplicarProduto(id: string) {
    const p = produtos.find((x) => x.id === id);
    if (!p) return;
    const copia: Produto = {
      ...p,
      id: gerarId(),
      titulo: p.titulo + " (cópia)",
      slug: gerarSlug(p.titulo + "-copia-" + Date.now())
    };
    setProdutos((lista) => [copia, ...lista]);
    setSujo(true);
    marcarStatus("Produto duplicado");
  }

  function alternarAtivo(id: string) {
    setProdutos((lista) =>
      lista.map((p) => (p.id === id ? { ...p, ativo: p.ativo === false } : p))
    );
    setSujo(true);
  }

  async function publicar() {
    setPublicando(true);
    marcarStatus("Publicando...");
    try {
      const resp = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtos)
      });
      if (!resp.ok) {
        const dados = await resp.json().catch(() => ({}));
        throw new Error(dados.erro || "Falha ao publicar");
      }
      await carregarDoServidor();
      marcarStatus("Publicado! Já está valendo no site para todo mundo.");
    } catch (e: any) {
      marcarStatus(e.message || "Erro ao publicar", false);
    } finally {
      setPublicando(false);
    }
  }

  function descartar() {
    if (!confirm("Descartar todas as alterações não publicadas?")) return;
    carregarDoServidor();
    limparForm();
    marcarStatus("Alterações descartadas");
  }

  function importarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(String(reader.result));
        if (!Array.isArray(arr)) throw new Error("formato inválido");
        setProdutos(arr);
        setSujo(true);
        marcarStatus(arr.length + " produtos importados (ainda não publicados)");
      } catch (err: any) {
        marcarStatus("Erro ao importar: " + err.message, false);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const produtosVisiveis = useMemo(
    () =>
      produtos.filter(
        (p) =>
          (filtroCategoria === "todos" || (p.categorias || []).includes(filtroCategoria)) &&
          (filtroLoja === "todos" || p.loja === filtroLoja)
      ),
    [produtos, filtroCategoria, filtroLoja]
  );

  if (!carregado) {
    return (
      <div className="admin-page">
        <div className="container">Carregando painel...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-topbar">
          <h1>Painel — Luz Decor Brasil</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" className="admin-btn admin-btn-ghost admin-btn-sm" target="_blank" rel="noopener">
              Ver site
            </a>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={sair}>
              Sair
            </button>
          </div>
        </div>

        <div className="admin-banner">
          <strong>Modo de edição.</strong> As alterações abaixo ficam só nesta sessão até você
          clicar em <strong>"Publicar no site"</strong> — aí elas valem de verdade para todo mundo,
          imediatamente.
          {sujo && " Você tem alterações não publicadas."}
        </div>

        <div className="admin-tabs" role="tablist">
          {(
            [
              ["formulario", "➕ Adicionar / Editar"],
              ["lista", `📋 Lista de produtos (${produtos.length})`],
              ["importar", "📥 Importar"],
              ["publicar", "🚀 Publicar"]
            ] as [Aba, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              className={"admin-tab-btn" + (aba === id ? " active" : "")}
              onClick={() => setAba(id)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {aba === "formulario" && (
          <div className="admin-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="admin-panel-box" style={{ maxWidth: 640 }}>
              <h3>{editandoId ? "Editando produto" : "Adicionar produto"}</h3>
              <form onSubmit={salvarProduto}>
                <label>Título do produto</label>
                <input
                  type="text"
                  placeholder="Ex: Lustre de Cristal Pendente Redondo"
                  value={form.titulo}
                  onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                />

                <label>Categorias (selecione uma ou mais)</label>
                <div className="cat-checklist">
                  {CATEGORIAS_GRUPOS.map((grupo) => (
                    <div key={grupo.slug}>
                      <div className="grupo-titulo">{grupo.titulo}</div>
                      {grupo.itens.map(([slug, label]) => (
                        <label key={slug}>
                          <input
                            type="checkbox"
                            checked={form.categorias.includes(slug)}
                            onChange={() => alternarCategoria(slug)}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="admin-hint">
                  Marque uma ou mais categorias — assim o produto aparece em todas elas no catálogo.
                </p>

                <div className="admin-row2">
                  <div>
                    <label>Loja</label>
                    <select
                      value={form.loja}
                      onChange={(e) => setForm((f) => ({ ...f, loja: e.target.value as Loja }))}
                    >
                      <option value="mercadolivre">Mercado Livre</option>
                      <option value="shopee">Shopee</option>
                    </select>
                  </div>
                  <div>
                    <label>Ambiente (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Sala de estar, Cozinha, Área externa"
                      value={form.ambiente}
                      onChange={(e) => setForm((f) => ({ ...f, ambiente: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="admin-row2">
                  <div>
                    <label>Preço atual</label>
                    <input
                      type="text"
                      placeholder="R$ 189,90"
                      value={form.preco}
                      onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label>Preço "de" (riscado)</label>
                    <input
                      type="text"
                      placeholder="R$ 259,90 (opcional)"
                      value={form.precoDe}
                      onChange={(e) => setForm((f) => ({ ...f, precoDe: e.target.value }))}
                    />
                  </div>
                </div>

                <label>Selo de destaque (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Mais vendido, Frete grátis, Novidade"
                  value={form.selo}
                  onChange={(e) => setForm((f) => ({ ...f, selo: e.target.value }))}
                />

                <label>URL da imagem</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.imagem}
                  onChange={(e) => setForm((f) => ({ ...f, imagem: e.target.value }))}
                />

                <label>Link de afiliado</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                />

                <label>Descrição curta (opcional, mas recomendado para SEO)</label>
                <textarea
                  placeholder="2-3 frases exclusivas sobre o produto: material, tamanho, para que ambiente combina..."
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                />

                <div className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.ativo}
                    onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.checked }))}
                    id="f-ativo"
                  />
                  <label htmlFor="f-ativo" style={{ margin: 0 }}>Produto ativo (visível no site)</label>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                    {editandoId ? "Salvar alterações" : "Adicionar produto"}
                  </button>
                  {editandoId && (
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={limparForm}>
                      Cancelar
                    </button>
                  )}
                </div>
                {status && (
                  <p className={"admin-status " + (status.ok ? "ok" : "erro")}>{status.msg}</p>
                )}
              </form>
            </div>
          </div>
        )}

        {aba === "lista" && (
          <div className="admin-panel-box">
            <h3>Catálogo em edição ({produtos.length} produtos)</h3>
            <div className="admin-toolbar">
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                <option value="todos">Todas as categorias</option>
                {CATEGORIAS_GRUPOS.map((grupo) => (
                  <optgroup key={grupo.slug} label={grupo.titulo}>
                    {grupo.itens.map(([slug, label]) => (
                      <option key={slug} value={slug}>{label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select value={filtroLoja} onChange={(e) => setFiltroLoja(e.target.value)}>
                <option value="todos">Todas as lojas</option>
                <option value="mercadolivre">Mercado Livre</option>
                <option value="shopee">Shopee</option>
              </select>
            </div>

            {produtosVisiveis.length === 0 ? (
              <div className="admin-empty">Nenhum produto cadastrado ainda.</div>
            ) : (
              <div className="admin-list">
                {produtosVisiveis.map((p) => (
                  <div key={p.id} className={"admin-item" + (p.ativo === false ? " inactive" : "")}>
                    <img src={p.imagem} alt={p.titulo} onError={(e) => (e.currentTarget.style.opacity = "0.2")} />
                    <div>
                      <h4>{p.titulo}</h4>
                      <div className="meta">
                        <span className={"admin-pill " + (p.loja === "shopee" ? "shopee" : "ml")}>
                          {formatarLoja(p.loja)}
                        </span>
                        <span>{(p.categorias || []).map((c) => CATEGORIA_LABEL[c] || c).join(", ") || "—"}</span>
                        {p.preco && <span>{formatarPreco(p.preco)}</span>}
                        <span className={"admin-pill " + (p.ativo === false ? "inativo" : "ativo")}>
                          {p.ativo === false ? "Inativo" : "Ativo"}
                        </span>
                      </div>
                    </div>
                    <div className="row-actions">
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => preencherForm(p)}>
                        Editar
                      </button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => duplicarProduto(p.id)}>
                        Duplicar
                      </button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => alternarAtivo(p.id)}>
                        {p.ativo === false ? "Ativar" : "Ocultar"}
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => excluirProduto(p.id)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {aba === "importar" && (
          <div className="admin-panel-box">
            <h3>Importar lista de produtos</h3>
            <p className="admin-hint">
              Selecione um arquivo <strong>.json</strong> com uma lista de produtos exportada
              anteriormente. Isso substitui a lista em edição (ainda não publicada).
            </p>
            <input ref={fileInputRef} type="file" accept=".json" onChange={importarArquivo} />
          </div>
        )}

        {aba === "publicar" && (
          <div className="admin-panel-box">
            <h3>Publicar alterações</h3>
            <p className="admin-hint" style={{ marginBottom: 12 }}>
              Salva o catálogo em edição no servidor, para todo mundo, imediatamente.
            </p>
            <div className="admin-form-actions" style={{ marginTop: 0 }}>
              <button className="admin-btn admin-btn-primary" onClick={publicar} disabled={publicando}>
                🚀 {publicando ? "Publicando..." : "Publicar no site"}
              </button>
              <button className="admin-btn admin-btn-ghost" onClick={descartar}>
                Descartar alterações
              </button>
            </div>
            {status && <p className={"admin-status " + (status.ok ? "ok" : "erro")}>{status.msg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

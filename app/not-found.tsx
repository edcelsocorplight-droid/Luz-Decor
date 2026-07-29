import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "var(--gap-xl) 0", textAlign: "center" }}>
      <h1>Página não encontrada</h1>
      <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>
        O produto ou a página que você procura não existe ou foi removido.
      </p>
      <Link href="/" className="btn btn-primary">Voltar para o catálogo</Link>
    </main>
  );
}

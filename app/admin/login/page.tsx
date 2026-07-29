"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha })
      });
      const dados = await resp.json();
      if (!resp.ok) {
        setErro(dados.erro || "Não foi possível entrar");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Painel Luz Decor Brasil</h1>
        <p>Digite a senha de administrador para cadastrar e editar produtos.</p>
        {erro && <p className="login-error">{erro}</p>}
        <form onSubmit={entrar}>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoFocus
          />
          <button type="submit" className="admin-btn admin-btn-primary" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

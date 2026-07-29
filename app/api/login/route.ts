import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, criarTokenSessao, senhaConfigurada } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  if (!senhaConfigurada()) {
    return NextResponse.json(
      {
        erro:
          "ADMIN_PASSWORD não configurada no servidor. Defina essa variável de ambiente na Vercel antes de logar."
      },
      { status: 500 }
    );
  }

  const { senha } = await req.json().catch(() => ({ senha: "" }));

  if (typeof senha !== "string" || senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ erro: "Senha incorreta" }, { status: 401 });
  }

  const token = await criarTokenSessao();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14 // 14 dias
  });
  return res;
}

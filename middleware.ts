import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, tokenValido } from "./lib/auth";

export const config = {
  matcher: ["/admin/:path*", "/api/produtos/:path*"]
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // GET em /api/produtos é público (é o catálogo do site) — só protege escrita.
  if (pathname.startsWith("/api/produtos")) {
    if (req.method === "GET") return NextResponse.next();
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (await tokenValido(token)) return NextResponse.next();
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  // /admin/login precisa ficar acessível para você conseguir logar
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await tokenValido(token)) return NextResponse.next();

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("redirecionado", "1");
  return NextResponse.redirect(loginUrl);
}

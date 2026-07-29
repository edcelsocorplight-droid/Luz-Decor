export const ADMIN_COOKIE = "luzdecor_admin_session";

function getSecret(): string {
  // Usa ADMIN_PASSWORD como base do segredo se SESSION_SECRET não for
  // definido, então funciona com apenas uma variável de ambiente — mas
  // definir as duas é mais seguro.
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

async function assinar(valor: string): Promise<string> {
  const secret = getSecret();
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const assinatura = await crypto.subtle.sign("HMAC", key, enc.encode(valor));
  return Buffer.from(assinatura).toString("hex");
}

export async function criarTokenSessao(): Promise<string> {
  const payload = `admin.${Date.now()}`;
  const assinatura = await assinar(payload);
  return `${payload}.${assinatura}`;
}

export async function tokenValido(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const partes = token.split(".");
  if (partes.length !== 3) return false;
  const [prefixo, timestamp, assinatura] = partes;
  if (prefixo !== "admin") return false;
  const esperado = await assinar(`${prefixo}.${timestamp}`);
  if (esperado.length !== assinatura.length) return false;
  // comparação em tempo constante simplificada
  let diff = 0;
  for (let i = 0; i < esperado.length; i++) {
    diff |= esperado.charCodeAt(i) ^ assinatura.charCodeAt(i);
  }
  return diff === 0;
}

export function senhaConfigurada(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

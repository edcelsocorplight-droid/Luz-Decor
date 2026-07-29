import { Produto } from "./types";
import { PRODUTOS_SEED } from "./seed";
import type { RedisClientType } from "redis";

const KV_KEY = "luzdecor:produtos";

// A integração de Redis do Marketplace da Vercel injeta uma única
// variável de conexão: REDIS_URL (ex: redis://default:senha@host:porta).
const REDIS_URL = process.env.REDIS_URL;
const redisConfigurado = Boolean(REDIS_URL);

/**
 * Camada de dados dos produtos.
 * - Em produção na Vercel, conecte um banco Redis (Storage → Create
 *   Database → Redis, via Marketplace) ao projeto. A variável REDIS_URL
 *   é injetada automaticamente.
 * - Em desenvolvimento local (sem Redis configurado), os dados ficam num
 *   arquivo JSON em .data/produtos.json, só para você testar o painel
 *   sem precisar criar um banco antes.
 */

// Reaproveita a conexão entre chamadas na mesma execução serverless,
// em vez de abrir uma conexão TCP nova a cada requisição.
let clientPromise: Promise<RedisClientType> | null = null;

async function getClient(): Promise<RedisClientType> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { createClient } = await import("redis");
      const client = createClient({ url: REDIS_URL }) as RedisClientType;
      client.on("error", (err) => console.error("Erro na conexão com o Redis:", err));
      await client.connect();
      return client;
    })();
  }
  return clientPromise;
}

async function lerArquivoLocal(): Promise<Produto[]> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const file = path.join(process.cwd(), ".data", "produtos.json");
  try {
    const conteudo = await fs.readFile(file, "utf-8");
    return JSON.parse(conteudo);
  } catch {
    return PRODUTOS_SEED;
  }
}

async function salvarArquivoLocal(produtos: Produto[]): Promise<void> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "produtos.json");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(produtos, null, 2), "utf-8");
}

export async function listarProdutos(): Promise<Produto[]> {
  if (redisConfigurado) {
    const client = await getClient();
    const bruto = await client.get(KV_KEY);
    return bruto ? JSON.parse(bruto) : PRODUTOS_SEED;
  }
  return lerArquivoLocal();
}

export async function salvarProdutos(produtos: Produto[]): Promise<void> {
  if (redisConfigurado) {
    const client = await getClient();
    await client.set(KV_KEY, JSON.stringify(produtos));
    return;
  }
  await salvarArquivoLocal(produtos);
}

export async function listarProdutosAtivos(): Promise<Produto[]> {
  const produtos = await listarProdutos();
  return produtos.filter((p) => p.ativo !== false);
}

export async function buscarProdutoPorSlug(slug: string): Promise<Produto | undefined> {
  const produtos = await listarProdutosAtivos();
  return produtos.find((p) => p.slug === slug);
}

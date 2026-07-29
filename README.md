# Luz Decor Brasil

Site de afiliados (Mercado Livre / Shopee) em Next.js, otimizado para SEO no
Google, com painel administrativo protegido por senha em `/admin`.

## O que mudou em relação ao HTML original

- Cada produto agora tem sua **própria página** (`/produto/slug-do-produto`),
  com título, descrição e dados estruturados (JSON-LD) únicos — isso é o que
  mais ajuda a aparecer no Google, porque antes os produtos só existiam dentro
  de um modal sem URL.
- A home é renderizada no servidor (os produtos já vêm prontos no HTML,
  antes de qualquer JavaScript rodar).
- `sitemap.xml` e `robots.txt` são gerados automaticamente a partir do seu
  catálogo — toda vez que você publica um produto novo, ele entra no sitemap.
- O painel `/admin` agora pede **senha** e salva os produtos num banco de
  verdade (Redis via Marketplace da Vercel), não mais no navegador de quem abrir o site.

## Passo a passo para publicar

### 1. Suba este projeto para o GitHub
Crie um repositório novo e envie esta pasta para ele (pode ser privado).

### 2. Importe na Vercel
Em [vercel.com/new](https://vercel.com/new), importe o repositório. Framework
é detectado automaticamente como Next.js — não precisa mudar nada no build.

### 3. Crie o banco de dados (Redis)
A Vercel descontinuou o antigo "Vercel KV" — hoje o caminho é pelo
Marketplace. No projeto, vá em **Storage → Create Database**, escolha uma
opção de **Redis** (ex: Upstash, tem plano gratuito) e conecte ao projeto.
Isso injeta as variáveis `KV_REST_API_URL` / `KV_REST_API_TOKEN` (ou
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, dependendo da
integração) automaticamente — não precisa copiar nada manualmente.

### 4. Configure as variáveis de ambiente
Em **Settings → Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `ADMIN_PASSWORD` | a senha que você vai usar para entrar em `/admin` |
| `SESSION_SECRET` | um valor aleatório grande (ex: gere com `openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | a URL final do site, ex: `https://luzdecorbrasil.com.br` (sem barra no final) |

Depois de adicionar, faça um novo deploy (Redeploy) para elas entrarem em vigor.

### 5. Conecte seu domínio
Em **Settings → Domains**, adicione seu domínio (ex: `luzdecorbrasil.com.br`)
e siga as instruções de DNS mostradas pela Vercel.

### 6. Cadastre seus produtos
Acesse `https://seudominio.com.br/admin`, digite a senha e cadastre os
produtos na aba "Adicionar / Editar". Quando terminar, vá na aba "Publicar"
e clique em **Publicar no site** — as mudanças ficam no ar na hora.

### 7. Envie o site para o Google Search Console
- Crie uma propriedade em [search.google.com/search-console](https://search.google.com/search-console)
  para o seu domínio.
- Envie o sitemap: `https://seudominio.com.br/sitemap.xml`.
- Isso acelera bastante a indexação das páginas de produto.

## Rodando localmente (opcional, para testar antes de publicar)

```bash
npm install
npm run dev
```

Sem `KV_REST_API_URL` configurado, os produtos ficam salvos localmente em
`.data/produtos.json` (não sobe pro Git, é só para teste). Crie um arquivo
`.env.local` (copie de `.env.example`) com `ADMIN_PASSWORD` para conseguir
testar o login em `http://localhost:3000/admin`.

## Itens que valem a pena ajustar depois

- **Imagens do site**: troque `/public/favicon.png` e `/public/og-image.jpg`
  pelos seus arquivos reais (o og-image aparece quando alguém compartilha o
  link no WhatsApp/Instagram/Facebook).
- **Redes sociais**: troque os links `seu_perfil` / `sua_pagina` em
  `components/SiteFooter.tsx`, `app/page.tsx` e `app/layout.tsx` pelos seus.
- **Google Analytics / Meta Pixel**: adicione os scripts em `app/layout.tsx`
  quando tiver os IDs — hoje não há nenhum rastreador incluído.
- **Descrição de cada produto**: preencher o campo "Descrição curta" no
  painel ajuda bastante no SEO da página do produto — evite deixar em
  branco nos produtos mais importantes.

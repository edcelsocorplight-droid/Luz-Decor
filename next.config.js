/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite imagens de qualquer domínio https (fotos de produto vêm de
    // URLs externas cadastradas manualmente no painel). Se quiser travar
    // por segurança/performance depois, troque por remotePatterns específicos.
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
  eslint: { ignoreDuringBuilds: true }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour la production
  compress: true,
  poweredByHeader: false,

  // Configuration des images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Configuration webpack pour supprimer les avertissements Supabase
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Supprimer les avertissements de dépendances critiques
    config.module.exprContextCritical = false
    config.module.unknownContextCritical = false

    return config
  },

  // Configuration pour éviter les erreurs en développement
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configuration pour Replit - gestion des origines cross-origin
  allowedDevOrigins: [
    '*.replit.dev',
    '*.repl.co',
    'localhost:3000',
    '0.0.0.0:3000'
  ],

  // Configuration pour Replit - Server Actions sont activées par défaut
  experimental: {
    // Autres options expérimentales si nécessaire
  },
}

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@imgly/background-removal'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@imgly/background-removal']
    }
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/@imgly/,
      type: 'javascript/auto',
    })
    return config
  },
}

module.exports = nextConfig

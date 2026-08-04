/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/catalogue', destination: '/catalogue/index.html', permanent: false },
    ]
  },
}

module.exports = nextConfig

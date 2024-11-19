/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'lzbjbeovjpnaktxpdfcn.supabase.co',
        protocol: 'https',
      },
      {
        hostname: 'files.edgestore.dev',
        protocol: 'https',
      },
    ],
  },
}

module.exports = nextConfig

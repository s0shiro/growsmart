/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'i.pinimg.com',
        protocol: 'https',
      },
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

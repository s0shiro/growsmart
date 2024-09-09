/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreBuildErrors: true,
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
    ],
  },
}

module.exports = nextConfig

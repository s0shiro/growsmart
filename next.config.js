/** @type {import('next').NextConfig} */
const nextConfig = {
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

import redirects from './redirects.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'disenosgratis.fsn1.your-objectstorage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'disenosgratis.com',
      },
      {
        protocol: 'https',
        hostname: '*.disenosgratis.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.disenosgratis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vmlcdhbnqlipioswzore.supabase.co',
      }
    ],
  },
  async redirects() {
    return redirects
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
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
        hostname: 'images.unsplash.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/tutorials',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tutoriales',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tutorials/:path*',
        destination: '/blog',
        permanent: true,
      }
    ]
  }
}

export default nextConfig
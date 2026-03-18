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
        hostname: 'disenosgratis.com',
      },
      {
        protocol: 'https',
        hostname: '*.disenosgratis.com',
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
      },
      {
        source: '/plantilla-de-loteria-mexicana-para-imprimir-editar-y-sublimar/',
        destination: '/designs/plantilla-de-loteria-mexicana-para-imprimir-editar-y-sublimar',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: 'https://wp.disenosgratis.com/',
          basePath: false,
        },
      ],
      fallback: [
        {
          source: '/:path*',
          destination: 'https://wp.disenosgratis.com/:path*',
          basePath: false,
        },
      ],
    };
  },
}

export default nextConfig
/**
 * Centralized 301 redirects for WordPress → Next.js migration.
 *
 * HOW TO USE:
 * Add entries to the array below. Each entry needs:
 *   source:      The old WordPress URL path (with trailing slash if needed)
 *   destination: The new Next.js URL path
 *   permanent:   true (301 redirect, always)
 *
 * This file is imported by next.config.mjs.
 * You can paste large batches of URLs here without cluttering the main config.
 */

const redirects = [
  // ── Legacy route redirects ──────────────────────────────────────
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

  // ── WordPress post → Next.js silo redirects ─────────────────────
  {
    source: '/plantilla-de-loteria-mexicana-para-imprimir-editar-y-sublimar/',
    destination: '/designs/plantilla-de-loteria-mexicana-para-imprimir-editar-y-sublimar',
    permanent: true,
  },

  // ── ADD NEW WORDPRESS REDIRECTS BELOW THIS LINE ─────────────────
  // Example:
  // {
  //   source: '/old-wordpress-slug/',
  //   destination: '/new-category/new-slug',
  //   permanent: true,
  // },
]

export default redirects

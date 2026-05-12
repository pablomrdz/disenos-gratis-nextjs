#!/usr/bin/env node

/**
 * generate-redirects.js
 * 
 * Reads public/urls-viejas.CSV and generates 301 redirects for redirects.mjs.
 * 
 * Rules:
 * - /tag/[slug]/ → /tags/[slug]/
 * - /[categoria]/ (if in ALLOWED_SLUGS) → /[categoria]/
 * - /[slug]/ (post) → /[inferred-category]/[slug]/
 * 
 * Posts are looked up in Supabase to infer category.
 * Unmatched posts are saved to unmatched-redirects.json for manual review.
 * 
 * Usage: node generate-redirects.js
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// ── Load .env.local manually ────────────────────────────────────
function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found')
    process.exit(1)
  }
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.substring(0, eqIndex).trim()
    const value = trimmed.substring(eqIndex + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Allowed category slugs (same as lib/data.ts) ────────────────
const ALLOWED_SLUGS = [
  'blog',
  'corte-laser',
  'dtf',
  'fondos-y-texturas',
  'plantillas',
  'recursos-graficos',
  'sublimacion',
  'tipografias',
  'vectores',
  'vinil-textil'
]

// ── Static page slugs (not posts, not categories) ───────────────
const STATIC_PAGES = [
  'politica-de-privacidad',
  'contacto',
  'acerca-de',
]

const STATIC_PAGE_MAP = {
  'politica-de-privacidad': '/privacy/',
  'contacto': '/contact/',
  'acerca-de': '/about/',
}

// ── Slugify: strict, no accents, no special chars ───────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')         // trim leading/trailing hyphens
}

// ── Get primary category from raw DB value ──────────────────────
function getPrimaryCategory(rawCategory) {
  if (!rawCategory) return null

  // Try exact match first
  const normalized = rawCategory.toLowerCase().trim().replace(/\s+/g, '-')
  const clean = slugify(normalized)
  if (ALLOWED_SLUGS.includes(clean)) return clean

  // Split by comma and find first valid one
  const parts = rawCategory.split(',').map(p => p.trim())
  for (const part of parts) {
    const partSlug = slugify(part)
    if (ALLOWED_SLUGS.includes(partSlug)) return partSlug
  }

  // Fallback: return first part slugified
  return slugify(parts[0])
}

// ── Parse CSV (simple parser for Title,URL format) ──────────────
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim())
  const entries = []

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle quoted fields: "Title",URL
    let url = ''
    if (line.includes('https://')) {
      const httpsIndex = line.indexOf('https://')
      url = line.substring(httpsIndex).trim()
      // Remove trailing quote or comma if any
      url = url.replace(/[",\s]+$/, '')
    }

    if (url) {
      entries.push(url)
    }
  }

  return entries
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  console.log('📂 Reading public/urls-viejas.CSV...')
  
  const csvPath = path.join(__dirname, 'public', 'urls-viejas.CSV')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const urls = parseCSV(csvContent)
  
  console.log(`📊 Found ${urls.length} URLs to process\n`)

  const redirects = []
  const unmatched = []
  const skipped = []

  // Extract slugs from wp.disenosgratis.com URLs
  const postSlugs = []

  for (const url of urls) {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname.replace(/\/$/, '') // Remove trailing slash
      const slug = pathname.replace(/^\//, '') // Remove leading slash

      if (!slug) {
        // Homepage — skip
        skipped.push({ url, reason: 'Homepage (root URL)' })
        continue
      }

      // Check if it's a static page
      if (STATIC_PAGES.includes(slug)) {
        const dest = STATIC_PAGE_MAP[slug] || '/'
        redirects.push({
          source: `/${slug}/`,
          destination: dest,
          permanent: true,
        })
        console.log(`📄 Static: /${slug}/ → ${dest}`)
        continue
      }

      // Check if it's a tag URL
      if (slug.startsWith('tag/')) {
        const tagSlug = slug.replace('tag/', '')
        redirects.push({
          source: `/tag/${tagSlug}/`,
          destination: `/tags/${tagSlug}/`,
          permanent: true,
        })
        console.log(`🏷️  Tag: /tag/${tagSlug}/ → /tags/${tagSlug}/`)
        continue
      }

      // Check if it's a category slug
      const slugified = slugify(slug)
      if (ALLOWED_SLUGS.includes(slugified)) {
        redirects.push({
          source: `/${slug}/`,
          destination: `/${slugified}/`,
          permanent: true,
        })
        console.log(`📁 Category: /${slug}/ → /${slugified}/`)
        continue
      }

      // It's a post — we need to look it up in Supabase
      postSlugs.push({ slug, url })
    } catch (err) {
      console.error(`❌ Invalid URL: ${url}`)
      unmatched.push({ url, slug: '', reason: 'Invalid URL' })
    }
  }

  // ── Batch lookup posts in Supabase ────────────────────────────
  if (postSlugs.length > 0) {
    console.log(`\n🔍 Looking up ${postSlugs.length} posts in Supabase...`)
    
    // Supabase .in() has a limit, so batch in groups of 50
    const batchSize = 50
    const allResults = new Map()

    for (let i = 0; i < postSlugs.length; i += batchSize) {
      const batch = postSlugs.slice(i, i + batchSize)
      const slugsToQuery = batch.map(p => p.slug)

      const { data, error } = await supabase
        .from('designs')
        .select('slug, category')
        .in('slug', slugsToQuery)

      if (error) {
        console.error(`  ❌ Supabase batch error:`, error.message)
        // Mark all in batch as unmatched
        batch.forEach(p => {
          unmatched.push({ url: p.url, slug: p.slug, reason: `Supabase error: ${error.message}` })
        })
        continue
      }

      if (data) {
        data.forEach(row => {
          allResults.set(row.slug, row.category)
        })
      }
    }

    // Process results
    for (const { slug, url } of postSlugs) {
      const category = allResults.get(slug)

      if (category) {
        const primaryCategory = getPrimaryCategory(category)
        redirects.push({
          source: `/${slug}/`,
          destination: `/${primaryCategory}/${slug}/`,
          permanent: true,
        })
        console.log(`  ✅ Post: /${slug}/ → /${primaryCategory}/${slug}/`)
      } else {
        // Post not found in DB — redirect to home to preserve link juice
        redirects.push({
          source: `/${slug}/`,
          destination: '/',
          permanent: true,
        })
        unmatched.push({ url, slug, reason: 'Not found in Supabase designs table' })
        console.log(`  ⚠️  Unmatched: /${slug}/ → / (not found in DB)`)
      }
    }
  }

  // ── Generate output ───────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`📊 Results:`)
  console.log(`   ✅ Redirects generated: ${redirects.length}`)
  console.log(`   ⚠️  Unmatched (to review): ${unmatched.length}`)
  console.log(`   ⏭️  Skipped: ${skipped.length}`)

  // Build the redirects.mjs content
  const existingRedirects = `  // ── Legacy route redirects ──────────────────────────────────────
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
  },`

  const wpRedirects = redirects
    .map(r => `  {\n    source: '${r.source}',\n    destination: '${r.destination}',\n    permanent: true,\n  }`)
    .join(',\n')

  const fileContent = `/**
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
 * 
 * Auto-generated by generate-redirects.js on ${new Date().toISOString().split('T')[0]}
 */

const redirects = [
${existingRedirects}

  // ── WordPress post → Next.js silo redirects (auto-generated) ──
${wpRedirects}
]

export default redirects
`

  fs.writeFileSync(path.join(__dirname, 'redirects.mjs'), fileContent, 'utf-8')
  console.log(`\n✅ Written to redirects.mjs (${redirects.length} new + legacy redirects)`)

  // Save unmatched for manual review
  if (unmatched.length > 0) {
    fs.writeFileSync(
      path.join(__dirname, 'unmatched-redirects.json'),
      JSON.stringify(unmatched, null, 2),
      'utf-8'
    )
    console.log(`⚠️  Written unmatched-redirects.json (${unmatched.length} entries for manual review)`)
  }

  if (skipped.length > 0) {
    console.log(`\n⏭️  Skipped URLs:`)
    skipped.forEach(s => console.log(`   - ${s.url} (${s.reason})`))
  }

  console.log('\n🏁 Done!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

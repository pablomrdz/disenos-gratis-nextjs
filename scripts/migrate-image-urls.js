#!/usr/bin/env node

/**
 * migrate-image-urls.js
 * 
 * Migrates image URLs in the Supabase `designs` table from the old WordPress
 * domain to the new Hetzner assets server.
 * 
 * What it does:
 * 1. Fetches all designs from Supabase
 * 2. For each design, replaces the old domain in image_url, and gallery_urls
 * 3. Converts .png and .jpg extensions to .webp
 * 4. Updates the row in Supabase
 * 
 * Old domain: https://disenosgratis.com/wp-content/uploads/
 * New domain: https://assets.disenosgratis.com/uploads/
 * 
 * Usage: node scripts/migrate-image-urls.js [--dry-run]
 * 
 * Options:
 *   --dry-run   Preview changes without writing to database
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// ── Load .env.local ─────────────────────────────────────────────
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local')
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
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Configuration ───────────────────────────────────────────────
const OLD_DOMAIN = 'https://disenosgratis.com/wp-content/uploads/'
const OLD_DOMAIN_ALT = 'https://wp.disenosgratis.com/wp-content/uploads/'
const NEW_DOMAIN = 'https://assets.disenosgratis.com/uploads/'

// Also handle variations with http:// or www.
const OLD_PATTERNS = [
  OLD_DOMAIN,
  OLD_DOMAIN_ALT,
  'http://disenosgratis.com/wp-content/uploads/',
  'http://wp.disenosgratis.com/wp-content/uploads/',
  'https://www.disenosgratis.com/wp-content/uploads/',
]

// ── URL transformer ─────────────────────────────────────────────
function transformUrl(url) {
  if (!url || typeof url !== 'string') return { url, changed: false }

  let newUrl = url
  let changed = false

  // Replace old domain patterns
  for (const pattern of OLD_PATTERNS) {
    if (newUrl.includes(pattern)) {
      newUrl = newUrl.replace(pattern, NEW_DOMAIN)
      changed = true
      break
    }
  }

  // Convert image extensions to .webp
  if (changed) {
    newUrl = newUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    // Handle URLs with query params or sizes like image-300x200.png
    newUrl = newUrl.replace(/\.(png|jpg|jpeg)(\?)/i, '.webp$2')
  }

  return { url: newUrl, changed }
}

// ── Transform gallery URLs array ────────────────────────────────
function transformGalleryUrls(gallery) {
  if (!Array.isArray(gallery) || gallery.length === 0) return { gallery, changed: false }

  let anyChanged = false
  const newGallery = gallery.map(url => {
    const result = transformUrl(url)
    if (result.changed) anyChanged = true
    return result.url
  })

  return { gallery: newGallery, changed: anyChanged }
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const isDryRun = process.argv.includes('--dry-run')

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE — No changes will be written to the database\n')
  }

  console.log('📂 Fetching all designs from Supabase...')

  // Fetch all designs (paginated if needed)
  let allDesigns = []
  let offset = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('designs')
      .select('id, slug, image_url, gallery_urls')
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('❌ Error fetching designs:', error.message)
      process.exit(1)
    }

    if (!data || data.length === 0) break
    allDesigns = allDesigns.concat(data)
    if (data.length < pageSize) break
    offset += pageSize
  }

  console.log(`📊 Found ${allDesigns.length} designs total\n`)

  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0
  const changes = []

  for (const design of allDesigns) {
    const updates = {}
    const changeDetails = { id: design.id, slug: design.slug, fields: [] }

    // Check image_url
    const imgResult = transformUrl(design.image_url)
    if (imgResult.changed) {
      updates.image_url = imgResult.url
      changeDetails.fields.push({
        field: 'image_url',
        from: design.image_url,
        to: imgResult.url,
      })
    }


    // Check gallery_urls
    const galleryResult = transformGalleryUrls(design.gallery_urls)
    if (galleryResult.changed) {
      updates.gallery_urls = galleryResult.gallery
      changeDetails.fields.push({
        field: 'gallery_urls',
        from: `[${(design.gallery_urls || []).length} URLs]`,
        to: `[${galleryResult.gallery.length} URLs migrated]`,
      })
    }

    // Skip if nothing to update
    if (Object.keys(updates).length === 0) {
      skippedCount++
      continue
    }

    changes.push(changeDetails)

    if (!isDryRun) {
      const { error } = await supabase
        .from('designs')
        .update(updates)
        .eq('id', design.id)

      if (error) {
        console.error(`  ❌ Error updating ${design.slug}:`, error.message)
        errorCount++
        continue
      }
    }

    updatedCount++
    const fieldsStr = changeDetails.fields.map(f => f.field).join(', ')
    console.log(`  ✅ ${design.slug} → updated: ${fieldsStr}`)
  }

  // ── Summary ─────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`📊 Migration Summary${isDryRun ? ' (DRY RUN)' : ''}:`)
  console.log(`   ✅ Updated: ${updatedCount}`)
  console.log(`   ⏭️  Skipped (no WP URLs): ${skippedCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📦 Total designs: ${allDesigns.length}`)

  // Save a detailed log
  const logPath = path.join(__dirname, '..', 'migration-image-urls-log.json')
  fs.writeFileSync(logPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    isDryRun,
    summary: { updated: updatedCount, skipped: skippedCount, errors: errorCount, total: allDesigns.length },
    changes,
  }, null, 2), 'utf-8')
  console.log(`\n📝 Detailed log saved to migration-image-urls-log.json`)

  if (isDryRun) {
    console.log(`\n🔁 To execute for real, run: node scripts/migrate-image-urls.js`)
  }

  console.log('\n🏁 Done!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

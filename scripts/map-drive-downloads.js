#!/usr/bin/env node

/**
 * map-drive-downloads.js
 * 
 * Maps Google Drive download URLs to designs in Supabase by matching
 * file names to design slugs.
 * 
 * Input: A CSV file (drive-links.csv) with two columns:
 *   filename,drive_url
 * 
 * Example CSV:
 *   filename,drive_url
 *   diseno-bluey-bingo-cumpleanos-sublimacion-playeras,https://drive.google.com/file/d/ABC123/view?usp=sharing
 *   pack-disenos-stitch-sublimacion-corte-gratis,https://drive.google.com/file/d/DEF456/view?usp=sharing
 * 
 * The script:
 * 1. Reads the CSV
 * 2. For each row, queries Supabase for a design with matching slug
 * 3. If found, updates the download_url field
 * 4. Logs matches and mismatches
 * 
 * Usage: node scripts/map-drive-downloads.js [--dry-run]
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

// ── Convert Google Drive share URL to direct download URL ───────
function toDirectDownloadUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== 'string') return driveUrl

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileIdMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  const openIdMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (openIdMatch) {
    return `https://drive.google.com/uc?export=download&id=${openIdMatch[1]}`
  }

  // Pattern 3: Already a direct download URL
  if (driveUrl.includes('uc?export=download')) {
    return driveUrl
  }

  // Pattern 4: Google Drive folder — return as-is (can't make direct download)
  if (driveUrl.includes('/folders/')) {
    return driveUrl
  }

  // Return original if we can't parse it
  return driveUrl
}

// ── Slugify (for fuzzy matching) ────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Parse CSV ───────────────────────────────────────────────────
function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim())
  const entries = []

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV split (handles basic cases)
    // Format: filename,drive_url
    const firstComma = line.indexOf(',')
    if (firstComma === -1) continue

    const filename = line.substring(0, firstComma).trim().replace(/^"|"$/g, '')
    const driveUrl = line.substring(firstComma + 1).trim().replace(/^"|"$/g, '')

    if (filename && driveUrl) {
      entries.push({ filename: slugify(filename), driveUrl })
    }
  }

  return entries
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const isDryRun = process.argv.includes('--dry-run')
  const csvPath = path.join(__dirname, '..', 'drive-links.csv')

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE — No changes will be written to the database\n')
  }

  // Check if CSV exists
  if (!fs.existsSync(csvPath)) {
    console.log('📝 No drive-links.csv found. Creating a template...\n')
    
    const template = `filename,drive_url
diseno-bluey-bingo-cumpleanos-sublimacion-playeras,https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view?usp=sharing
pack-disenos-stitch-sublimacion-corte-gratis,https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view?usp=sharing
`
    fs.writeFileSync(csvPath, template, 'utf-8')
    console.log('✅ Template created at drive-links.csv')
    console.log('   Fill it with your actual filenames and Drive URLs, then run this script again.')
    console.log('')
    console.log('   Format: filename (slug format), Google Drive share URL')
    console.log('   The filename should match the slug in the designs table.')
    console.log('')

    // Also fetch and display all current slugs for reference
    console.log('📋 Current design slugs in database (for reference):\n')
    
    const { data, error } = await supabase
      .from('designs')
      .select('slug, title, download_url')
      .order('slug')

    if (error) {
      console.error('  ❌ Error fetching slugs:', error.message)
    } else if (data) {
      const withoutUrl = data.filter(d => !d.download_url)
      const withUrl = data.filter(d => d.download_url)
      
      console.log(`   Total designs: ${data.length}`)
      console.log(`   ✅ With download_url: ${withUrl.length}`)
      console.log(`   ❌ Without download_url: ${withoutUrl.length}\n`)
      
      if (withoutUrl.length > 0) {
        console.log('   Designs needing download URLs:')
        withoutUrl.forEach(d => {
          console.log(`     ${d.slug}`)
        })
      }
    }

    return
  }

  // Read and parse CSV
  console.log('📂 Reading drive-links.csv...')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const entries = parseCSV(csvContent)
  console.log(`📊 Found ${entries.length} entries in CSV\n`)

  if (entries.length === 0) {
    console.log('⚠️  No entries found in CSV. Check the format.')
    return
  }

  // Fetch all design slugs for matching
  console.log('🔍 Fetching design slugs from Supabase...')
  const { data: allDesigns, error } = await supabase
    .from('designs')
    .select('id, slug, download_url')

  if (error) {
    console.error('❌ Error fetching designs:', error.message)
    process.exit(1)
  }

  // Build slug → id map
  const slugMap = new Map()
  allDesigns.forEach(d => {
    slugMap.set(d.slug, d)
    // Also map without trailing numbers etc for fuzzy matching
    slugMap.set(slugify(d.slug), d)
  })

  console.log(`📊 ${allDesigns.length} designs in database\n`)

  let matchCount = 0
  let noMatchCount = 0
  let alreadySetCount = 0
  let errorCount = 0
  const unmatched = []

  for (const { filename, driveUrl } of entries) {
    const design = slugMap.get(filename) || slugMap.get(slugify(filename))

    if (!design) {
      noMatchCount++
      unmatched.push({ filename, driveUrl, reason: 'No matching slug in database' })
      console.log(`  ⚠️  No match: ${filename}`)
      continue
    }

    if (design.download_url) {
      alreadySetCount++
      console.log(`  ⏭️  Already set: ${design.slug}`)
      continue
    }

    const directUrl = toDirectDownloadUrl(driveUrl)

    if (!isDryRun) {
      const { error: updateError } = await supabase
        .from('designs')
        .update({ download_url: directUrl })
        .eq('id', design.id)

      if (updateError) {
        errorCount++
        console.error(`  ❌ Error updating ${design.slug}:`, updateError.message)
        continue
      }
    }

    matchCount++
    console.log(`  ✅ ${design.slug} → ${directUrl.substring(0, 60)}...`)
  }

  // Summary
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`📊 Download URL Mapping Summary${isDryRun ? ' (DRY RUN)' : ''}:`)
  console.log(`   ✅ Matched & updated: ${matchCount}`)
  console.log(`   ⏭️  Already had URL: ${alreadySetCount}`)
  console.log(`   ⚠️  No match found: ${noMatchCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)

  if (unmatched.length > 0) {
    const unmatchedPath = path.join(__dirname, '..', 'unmatched-drive-links.json')
    fs.writeFileSync(unmatchedPath, JSON.stringify(unmatched, null, 2), 'utf-8')
    console.log(`\n⚠️  Unmatched entries saved to unmatched-drive-links.json`)
  }

  if (isDryRun) {
    console.log(`\n🔁 To execute for real, run: node scripts/map-drive-downloads.js`)
  }

  console.log('\n🏁 Done!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

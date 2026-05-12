#!/usr/bin/env node

/**
 * upload-to-hetzner.js
 * 
 * Pipeline completa en memoria:
 * 1. Lee migration-image-urls-log.json (from → to mappings)
 * 2. Descarga cada imagen del servidor antiguo (Hostinger)
 * 3. Convierte a WebP con sharp (quality: 80, effort: 6)
 * 4. Sube al bucket S3 de Hetzner Object Storage
 * 
 * Control de flujo: procesa en lotes de 5 para no saturar red/memoria.
 * Tolerancia a fallos: si una imagen falla, se reporta y continúa.
 * 
 * Variables de entorno (.env.local):
 *   HETZNER_S3_ENDPOINT     - ej: https://fsn1.your-objectstorage.com
 *   HETZNER_S3_REGION       - ej: fsn1
 *   HETZNER_S3_BUCKET       - ej: disenosgratis
 *   HETZNER_S3_ACCESS_KEY   - Access Key de Hetzner
 *   HETZNER_S3_SECRET_KEY   - Secret Key de Hetzner
 * 
 * Usage:
 *   node scripts/upload-to-hetzner.js              # Ejecutar
 *   node scripts/upload-to-hetzner.js --dry-run     # Solo previsualizar
 *   node scripts/upload-to-hetzner.js --limit 5     # Procesar solo 5 imágenes (para test)
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const sharp = require('sharp')
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')

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

// ── Validate env vars ───────────────────────────────────────────
const HETZNER_ENDPOINT = process.env.HETZNER_S3_ENDPOINT
const HETZNER_REGION = process.env.HETZNER_S3_REGION || 'fsn1'
const HETZNER_BUCKET = process.env.HETZNER_S3_BUCKET
const HETZNER_ACCESS_KEY = process.env.HETZNER_S3_ACCESS_KEY
const HETZNER_SECRET_KEY = process.env.HETZNER_S3_SECRET_KEY

const missingVars = []
if (!HETZNER_ENDPOINT) missingVars.push('HETZNER_S3_ENDPOINT')
if (!HETZNER_BUCKET) missingVars.push('HETZNER_S3_BUCKET')
if (!HETZNER_ACCESS_KEY) missingVars.push('HETZNER_S3_ACCESS_KEY')
if (!HETZNER_SECRET_KEY) missingVars.push('HETZNER_S3_SECRET_KEY')

if (missingVars.length > 0) {
  console.error(`❌ Missing environment variables in .env.local:`)
  missingVars.forEach(v => console.error(`   - ${v}`))
  console.error(`\nAdd these to your .env.local file:`)
  console.error(`   HETZNER_S3_ENDPOINT=https://fsn1.your-objectstorage.com`)
  console.error(`   HETZNER_S3_REGION=fsn1`)
  console.error(`   HETZNER_S3_BUCKET=disenosgratis`)
  console.error(`   HETZNER_S3_ACCESS_KEY=your-access-key`)
  console.error(`   HETZNER_S3_SECRET_KEY=your-secret-key`)
  process.exit(1)
}

// ── S3 Client ───────────────────────────────────────────────────
const s3 = new S3Client({
  endpoint: HETZNER_ENDPOINT,
  region: HETZNER_REGION,
  credentials: {
    accessKeyId: HETZNER_ACCESS_KEY,
    secretAccessKey: HETZNER_SECRET_KEY,
  },
  forcePathStyle: true, // Required for Hetzner S3-compatible storage
})

// ── Constants ───────────────────────────────────────────────────
const BATCH_SIZE = 5
const ASSETS_DOMAIN = 'https://assets.disenosgratis.com'
const DOWNLOAD_TIMEOUT_MS = 30000 // 30 seconds per image

// ── Helpers ─────────────────────────────────────────────────────

/**
 * Extract the S3 object key from the new URL.
 * Input:  https://assets.disenosgratis.com/uploads/2025/09/image.webp
 * Output: uploads/2025/09/image.webp
 */
function extractS3Key(newUrl) {
  try {
    const url = new URL(newUrl)
    // Remove leading slash
    return url.pathname.replace(/^\//, '')
  } catch {
    // Fallback: extract path after domain
    return newUrl.replace(ASSETS_DOMAIN + '/', '').replace(/^\//, '')
  }
}

/**
 * Download image as Buffer with timeout and retry.
 */
async function downloadImage(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: DOWNLOAD_TIMEOUT_MS,
        headers: {
          'User-Agent': 'Mozilla/5.0 (DisenosGratis Migration Bot)',
        },
        // Follow redirects
        maxRedirects: 5,
      })
      return Buffer.from(response.data)
    } catch (err) {
      if (attempt < retries) {
        const waitMs = (attempt + 1) * 2000
        console.log(`      ⏳ Retry ${attempt + 1}/${retries} in ${waitMs}ms...`)
        await sleep(waitMs)
        continue
      }
      throw err
    }
  }
}

/**
 * Convert image buffer to WebP using sharp.
 * quality: 80, effort: 6 — optimal compression without visual loss.
 */
async function convertToWebP(inputBuffer) {
  return sharp(inputBuffer)
    .webp({ quality: 80, effort: 6 })
    .toBuffer()
}

/**
 * Upload buffer to Hetzner S3.
 */
async function uploadToS3(buffer, key) {
  const command = new PutObjectCommand({
    Bucket: HETZNER_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/webp',
    // Public read so the CDN/subdomain can serve them
    ACL: 'public-read',
    // Cache for 1 year (immutable assets)
    CacheControl: 'public, max-age=31536000, immutable',
  })

  await s3.send(command)
}

/**
 * Check if an object already exists in S3.
 */
async function objectExists(key) {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: HETZNER_BUCKET,
      Key: key,
    }))
    return true
  } catch {
    return false
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// ── Process a single image ──────────────────────────────────────
async function processImage(entry, isDryRun) {
  const { from: oldUrl, to: newUrl, slug } = entry
  const s3Key = extractS3Key(newUrl)

  // Check if already uploaded
  if (!isDryRun) {
    const exists = await objectExists(s3Key)
    if (exists) {
      return { status: 'skipped', slug, reason: 'Already exists in S3', s3Key }
    }
  }

  if (isDryRun) {
    return { status: 'dry-run', slug, oldUrl, s3Key }
  }

  // Step 1: Download from Hostinger
  let originalBuffer
  try {
    originalBuffer = await downloadImage(oldUrl)
  } catch (err) {
    const statusCode = err.response?.status || 'unknown'
    return { status: 'error', slug, phase: 'download', error: `HTTP ${statusCode}: ${err.message}`, oldUrl }
  }

  const originalSize = originalBuffer.length

  // Step 2: Convert to WebP
  let webpBuffer
  try {
    webpBuffer = await convertToWebP(originalBuffer)
  } catch (err) {
    return { status: 'error', slug, phase: 'convert', error: err.message, oldUrl }
  }

  const webpSize = webpBuffer.length
  const savings = ((1 - webpSize / originalSize) * 100).toFixed(1)

  // Free original buffer from memory
  originalBuffer = null

  // Step 3: Upload to Hetzner S3
  try {
    await uploadToS3(webpBuffer, s3Key)
  } catch (err) {
    return { status: 'error', slug, phase: 'upload', error: err.message, s3Key }
  }

  // Free webp buffer
  webpBuffer = null

  return {
    status: 'success',
    slug,
    s3Key,
    originalSize,
    webpSize,
    savings: `${savings}%`,
  }
}

// ── Process a batch of images concurrently ──────────────────────
async function processBatch(batch, isDryRun) {
  return Promise.all(batch.map(entry => processImage(entry, isDryRun)))
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const isDryRun = process.argv.includes('--dry-run')
  const limitArg = process.argv.indexOf('--limit')
  const limit = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity

  console.log('═══════════════════════════════════════════════════════════')
  console.log('  🚀 Hetzner Image Migration Pipeline')
  console.log('═══════════════════════════════════════════════════════════')
  if (isDryRun) console.log('  🔍 DRY RUN MODE — no uploads will be performed')
  if (limit < Infinity) console.log(`  🔢 Processing limit: ${limit} images`)
  console.log(`  📦 Bucket: ${HETZNER_BUCKET}`)
  console.log(`  🌐 Endpoint: ${HETZNER_ENDPOINT}`)
  console.log(`  📐 WebP quality: 80, effort: 6`)
  console.log(`  📦 Batch size: ${BATCH_SIZE}`)
  console.log('═══════════════════════════════════════════════════════════\n')

  // Read migration log
  const logPath = path.join(__dirname, '..', 'migration-image-urls-log.json')
  if (!fs.existsSync(logPath)) {
    console.error('❌ migration-image-urls-log.json not found')
    console.error('   Run: node scripts/migrate-image-urls.js --dry-run')
    process.exit(1)
  }

  const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'))

  // Flatten changes to individual image entries
  const entries = []
  for (const change of logData.changes) {
    for (const field of change.fields) {
      if (field.field === 'image_url' || field.field === 'gallery_urls') {
        entries.push({
          slug: change.slug,
          from: field.from,
          to: field.to,
        })
      }
    }
  }

  const totalEntries = Math.min(entries.length, limit)
  const entriesToProcess = entries.slice(0, totalEntries)

  console.log(`📊 ${totalEntries} images to process (${entries.length} total in log)\n`)

  // Stats
  const stats = {
    success: 0,
    skipped: 0,
    errors: 0,
    dryRun: 0,
    totalOriginalBytes: 0,
    totalWebpBytes: 0,
  }
  const errors = []
  const startTime = Date.now()

  // Process in batches
  for (let i = 0; i < entriesToProcess.length; i += BATCH_SIZE) {
    const batch = entriesToProcess.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(entriesToProcess.length / BATCH_SIZE)

    console.log(`── Batch ${batchNum}/${totalBatches} (${batch.length} images) ──`)

    const results = await processBatch(batch, isDryRun)

    for (const result of results) {
      switch (result.status) {
        case 'success':
          stats.success++
          stats.totalOriginalBytes += result.originalSize
          stats.totalWebpBytes += result.webpSize
          console.log(`  ✅ ${result.slug} → ${result.s3Key}`)
          console.log(`     ${formatBytes(result.originalSize)} → ${formatBytes(result.webpSize)} (${result.savings} saved)`)
          break

        case 'skipped':
          stats.skipped++
          console.log(`  ⏭️  ${result.slug} (already in S3)`)
          break

        case 'dry-run':
          stats.dryRun++
          console.log(`  🔍 ${result.slug}: ${result.oldUrl}`)
          console.log(`     → s3://${HETZNER_BUCKET}/${result.s3Key}`)
          break

        case 'error':
          stats.errors++
          errors.push(result)
          console.log(`  ❌ ${result.slug} [${result.phase}]: ${result.error}`)
          break
      }
    }

    // Small pause between batches to be kind to the network
    if (i + BATCH_SIZE < entriesToProcess.length) {
      await sleep(500)
    }
  }

  // ── Summary ─────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const totalSavings = stats.totalOriginalBytes > 0
    ? ((1 - stats.totalWebpBytes / stats.totalOriginalBytes) * 100).toFixed(1)
    : '0'

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 Migration Summary${isDryRun ? ' (DRY RUN)' : ''}`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`   ✅ Uploaded:        ${stats.success}`)
  console.log(`   ⏭️  Skipped:        ${stats.skipped}`)
  console.log(`   ❌ Errors:          ${stats.errors}`)
  if (isDryRun) console.log(`   🔍 Previewed:       ${stats.dryRun}`)
  console.log(`   ⏱️  Time:           ${elapsed}s`)

  if (stats.success > 0) {
    console.log(`\n   📐 Size reduction:`)
    console.log(`      Original total: ${formatBytes(stats.totalOriginalBytes)}`)
    console.log(`      WebP total:     ${formatBytes(stats.totalWebpBytes)}`)
    console.log(`      Savings:        ${totalSavings}%`)
  }

  // Save error report
  if (errors.length > 0) {
    const errorLogPath = path.join(__dirname, '..', 'hetzner-upload-errors.json')
    fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2), 'utf-8')
    console.log(`\n   ⚠️  Error details: hetzner-upload-errors.json`)
  }

  console.log(`\n🏁 Done!`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

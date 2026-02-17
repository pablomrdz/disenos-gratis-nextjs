import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * On-Demand Revalidation API
 *
 * Usage:
 *   GET /api/revalidate?secret=YOUR_SECRET&path=/
 *   GET /api/revalidate?secret=YOUR_SECRET&path=/designs/my-slug
 *
 *   POST /api/revalidate
 *   Headers: { "x-revalidation-secret": "YOUR_SECRET" }
 *   Body:    { "paths": ["/", "/blog", "/designs/my-slug"] }
 */

interface RevalidateRequestBody {
    path?: string
    paths?: string[]
}

interface RevalidateResponse {
    revalidated: boolean
    paths?: string[]
    message?: string
}

function getSecret(request: NextRequest): string | null {
    // 1. Check query param
    const secretParam = request.nextUrl.searchParams.get('secret')
    if (secretParam) return secretParam

    // 2. Check header
    const secretHeader = request.headers.get('x-revalidation-secret')
    if (secretHeader) return secretHeader

    return null
}

function validateSecret(secret: string | null): boolean {
    const envSecret = process.env.REVALIDATION_SECRET
    if (!envSecret) {
        console.error('[Revalidate] REVALIDATION_SECRET is not configured in environment')
        return false
    }
    return secret === envSecret
}

// ── GET handler ─────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<NextResponse<RevalidateResponse>> {
    try {
        const secret = getSecret(request)

        if (!validateSecret(secret)) {
            return NextResponse.json(
                { revalidated: false, message: 'Invalid or missing secret token' },
                { status: 401 }
            )
        }

        const path = request.nextUrl.searchParams.get('path')

        if (!path) {
            return NextResponse.json(
                { revalidated: false, message: 'Missing "path" query parameter' },
                { status: 400 }
            )
        }

        revalidatePath(path)

        return NextResponse.json({
            revalidated: true,
            paths: [path],
            message: `Successfully revalidated: ${path}`,
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('[Revalidate] GET error:', errorMessage)

        return NextResponse.json(
            { revalidated: false, message: `Revalidation failed: ${errorMessage}` },
            { status: 500 }
        )
    }
}

// ── POST handler ────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse<RevalidateResponse>> {
    try {
        const secret = getSecret(request)

        if (!validateSecret(secret)) {
            return NextResponse.json(
                { revalidated: false, message: 'Invalid or missing secret token' },
                { status: 401 }
            )
        }

        let body: RevalidateRequestBody

        try {
            body = await request.json()
        } catch {
            return NextResponse.json(
                { revalidated: false, message: 'Invalid JSON body' },
                { status: 400 }
            )
        }

        // Collect paths from body
        const pathsToRevalidate: string[] = []

        if (body.path) {
            pathsToRevalidate.push(body.path)
        }

        if (body.paths && Array.isArray(body.paths)) {
            pathsToRevalidate.push(...body.paths)
        }

        if (pathsToRevalidate.length === 0) {
            return NextResponse.json(
                { revalidated: false, message: 'No paths provided. Use "path" (string) or "paths" (array)' },
                { status: 400 }
            )
        }

        // Deduplicate
        const uniquePaths = [...new Set(pathsToRevalidate)]

        // Revalidate all paths
        for (const p of uniquePaths) {
            revalidatePath(p)
        }

        return NextResponse.json({
            revalidated: true,
            paths: uniquePaths,
            message: `Successfully revalidated ${uniquePaths.length} path(s)`,
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('[Revalidate] POST error:', errorMessage)

        return NextResponse.json(
            { revalidated: false, message: `Revalidation failed: ${errorMessage}` },
            { status: 500 }
        )
    }
}

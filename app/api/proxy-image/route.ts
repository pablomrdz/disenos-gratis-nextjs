import { NextRequest, NextResponse } from 'next/server'

function getSupabaseHost(): string | null {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!raw) return null

    try {
        return new URL(raw).hostname
    } catch {
        return null
    }
}

function isAllowedImageSource(source: URL): boolean {
    if (source.protocol !== 'https:') return false

    const supabaseHost = getSupabaseHost()
    const allowedExactHosts = new Set([
        'disenosgratis.fsn1.your-objectstorage.com',
        'fsn1.your-objectstorage.com',
        ...(supabaseHost ? [supabaseHost] : []),
    ])

    if (!allowedExactHosts.has(source.hostname)) return false

    // The path-style Hetzner endpoint must stay inside our bucket.
    if (
        source.hostname === 'fsn1.your-objectstorage.com' &&
        !source.pathname.startsWith('/disenosgratis/')
    ) {
        return false
    }

    return true
}

export async function GET(req: NextRequest) {
    const rawUrl = req.nextUrl.searchParams.get('url')

    if (!rawUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let source: URL

    try {
        source = new URL(rawUrl)
    } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    if (!isAllowedImageSource(source)) {
        return NextResponse.json(
            { error: 'Image source is not allowed' },
            { status: 403 }
        )
    }

    try {
        // Fabric needs the final image response to include CORS headers.
        // A 307 redirect is not enough because the destination response may
        // omit those headers, so we stream the image through this endpoint.
        const upstream = await fetch(source.toString(), {
            redirect: 'follow',
            cache: 'force-cache',
            headers: {
                Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
        })

        if (!upstream.ok) {
            console.error(
                '[proxy-image] Upstream image failed:',
                upstream.status,
                source.toString()
            )

            return NextResponse.json(
                { error: 'Image source returned an error' },
                { status: 502 }
            )
        }

        const contentType = upstream.headers.get('content-type') || ''

        if (!contentType.startsWith('image/')) {
            console.error(
                '[proxy-image] Refused non-image response:',
                contentType,
                source.toString()
            )

            return NextResponse.json(
                { error: 'Source did not return an image' },
                { status: 415 }
            )
        }

        const body = await upstream.arrayBuffer()

        return new NextResponse(body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
                ...(upstream.headers.get('etag')
                    ? { ETag: upstream.headers.get('etag') as string }
                    : {}),
            },
        })
    } catch (error) {
        console.error('[proxy-image] Error fetching image:', error)

        return NextResponse.json(
            { error: 'Failed to proxy image' },
            { status: 500 }
        )
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
    })
}

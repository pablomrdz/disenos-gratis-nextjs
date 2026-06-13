import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch image mapping to status ${response.status}`)
        }

        const buffer = await response.arrayBuffer()
        const contentType = response.headers.get('content-type') || 'image/png'

        // Return the image with CORS headers
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
        })
    } catch (error) {
        console.error('[proxy-image] Error fetching image:', error)
        return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 })
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
    })
}

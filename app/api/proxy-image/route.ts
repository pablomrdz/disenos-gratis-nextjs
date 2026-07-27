import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
        // Redirección permanente/temporal directa a la fuente original (Hetzner / Storage)
        // Vercel NO procesa ni transmite el buffer de la imagen. Consumo = 0 MB.
        return NextResponse.redirect(url, {
            status: 307,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        console.error('[proxy-image] Error redirecting image:', error)
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
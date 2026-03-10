import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
    const folder = req.nextUrl.searchParams.get('folder')

    if (!folder) {
        return NextResponse.json({ error: 'folder param is required' }, { status: 400 })
    }

    try {
        const supabase = createServerSupabaseClient()

        // Special mode: list all root-level folders in the bucket
        if (folder === '__list__') {
            const { data, error } = await supabase.storage
                .from('template-assets')
                .list('', { limit: 200, sortBy: { column: 'name', order: 'asc' } })

            if (error) {
                console.error('[template-assets] Storage list error:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            // Folders have id = null in Supabase storage list responses
            const folders = (data || [])
                .filter(item => item.id === null)
                .map(item => item.name)

            return NextResponse.json({ folders }, {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
            })
        }

        const { data, error } = await supabase.storage
            .from('template-assets')
            .list(folder, {
                limit: 100,
                sortBy: { column: 'name', order: 'asc' },
            })

        if (error) {
            console.error('[template-assets] Storage list error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Filter out folder placeholders (.emptyFolderPlaceholder) and non-image files
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']
        const files = (data || [])
            .filter(file => {
                const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
                return imageExtensions.includes(ext)
            })
            .map(file => {
                const { data: urlData } = supabase.storage
                    .from('template-assets')
                    .getPublicUrl(`${folder}/${file.name}`)

                return {
                    name: file.name,
                    url: urlData.publicUrl,
                }
            })

        return NextResponse.json({ files }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        })
    } catch (err) {
        console.error('[template-assets] Unexpected error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

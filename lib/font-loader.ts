/**
 * Utility to load custom fonts dynamically using the FontFace API.
 * This ensures the font is ready before Fabric.js tries to render it.
 */
export async function loadFont(fontFamily: string, url?: string): Promise<boolean> {
    // If no URL is provided, we assume it's a system font or already loaded via CSS
    if (!url) {
        try {
            await document.fonts.load(`1em "${fontFamily}"`);
            return document.fonts.check(`1em "${fontFamily}"`);
        } catch {
            return false;
        }
    }

    // Check if already loaded
    if (document.fonts.check(`1em "${fontFamily}"`)) {
        return true;
    }

    try {
        const cleanUrl = url.split(/[?#]/)[0];
        let formatStr = '';
        if (cleanUrl.toLowerCase().endsWith('.otf')) {
            formatStr = " format('opentype')";
        } else if (cleanUrl.toLowerCase().endsWith('.ttf')) {
            formatStr = " format('truetype')";
        } else if (cleanUrl.toLowerCase().endsWith('.woff2')) {
            formatStr = " format('woff2')";
        } else if (cleanUrl.toLowerCase().endsWith('.woff')) {
            formatStr = " format('woff')";
        }

        const fontFace = new FontFace(fontFamily, `url(${url})${formatStr}`);
        const loadedFace = await fontFace.load();
        document.fonts.add(loadedFace);

        console.log("🟢 FONT LOADER - Fuente registrada oficialmente:", loadedFace.family, "- Status:", loadedFace.status);
        console.log("📋 FONT LOADER - Inventario completo en memoria:", Array.from(document.fonts).map(f => f.family));

        return true;
    } catch (error) {
        console.error("❌ FONT LOADER - Error crítico en el registro nativo:", error);
        console.error(`[FontLoader] Failed to load font "${fontFamily}" from ${url}:`, error);
        return false;
    }
}

export const DESIGN_FONTS = [
    { name: 'Inter', url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { name: 'Roboto', url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2' },
    { name: 'Montserrat', url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm453RRSOseX7rAc-527noWr.woff2' },
    { name: 'Playfair Display', url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_43_60HPc851KByYeX25dcisW64.woff2' },
    { name: 'Bebas Neue', url: 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2' },
    { name: 'Dancing Script', url: 'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-RwS6783rLESqYecS.woff2' },
    { name: 'Arial', system: true },
    { name: 'Georgia', system: true },
    { name: 'Times New Roman', system: true },
    { name: 'Courier New', system: true },
]

const pendingFontPromises = new Map<string, Promise<string>>();

export async function loadCustomFontFromSupabase(fontRef: string): Promise<string> {
    console.log("📥 FONT LOADER - Función invocada. Pasando las compuertas con ref:", fontRef);
    
    if (!fontRef) return 'Roboto';

    // Clean any rogue quotes from database or string manipulation
    const cleanFontRef = fontRef.replace(/['"]/g, "").trim();

    // Parse the file name and desired font family name
    const isFile = /\.(ttf|otf|woff2?)$/i.test(cleanFontRef);
    const fileName = isFile ? cleanFontRef : `${cleanFontRef}.ttf`;
    const fontFamily = cleanFontRef.replace(/\.[^/.]+$/, "");

    if (pendingFontPromises.has(fontFamily)) {
        console.log("⚡ FONT LOADER - Caché hit (en proceso/cargado) para:", fontFamily);
        return pendingFontPromises.get(fontFamily)!;
    }

    const loadPromise = (async () => {
        console.log("⏳ FONT LOADER - Intentando obtener URL de Supabase...");
        const url = `https://vmlcdhbnqlipioswzore.supabase.co/storage/v1/object/public/fonts/${fileName}`;
        console.log("📍 FONT LOADER - URL obtenida:", url);

        console.log("⏳ FONT LOADER - Iniciando fetch nativo del binario...");
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fallo de red: HTTP ${res.status}`);
            
            const contentType = res.headers.get("content-type") || "";
            
            // Si nos devuelve texto o json, el archivo está corrupto en el storage
            if (contentType.includes("text") || contentType.includes("json")) {
                console.error("❌ FONT LOADER - El archivo en Supabase está corrupto o es un error enmascarado. Type:", contentType);
                throw new Error("Archivo inválido en el storage");
            }

            const fontBuffer = await res.arrayBuffer();
            const fontFace = new FontFace(fontFamily, fontBuffer);
            await fontFace.load();
            document.fonts.add(fontFace);

            // Add it to our global catalog so the toolbar dropdown displays it
            if (!DESIGN_FONTS.find(f => f.name === fontFamily)) {
                DESIGN_FONTS.unshift({ name: fontFamily, url });
            }
            return fontFamily;
        } catch (error) {
            console.error(`[FontLoader] Error loading ${fontRef} from Supabase:`, error);
            pendingFontPromises.delete(fontFamily);
            return "";
        }
    })();

    pendingFontPromises.set(fontFamily, loadPromise);
    return loadPromise;
}

export async function fetchAllFontsFromSupabase() {
    try {
        // We will make a direct public storage API request to list files in the 'fonts' bucket
        const response = await fetch('https://vmlcdhbnqlipioswzore.supabase.co/storage/v1/object/list/fonts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Using the anon key is required for listing public buckets if not fully public via RLS,
                // but since we don't have it in this file easily without process.env, 
                // we'll fetch from the public endpoint using the standard REST API
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                prefix: '',
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch fonts list');
        }

        const files = await response.json();
        const newFonts: { name: string, url: string }[] = [];

        for (const file of files) {
            if (file.name === '.emptyFolderPlaceholder' || !file.name) continue;

            const isFont = /\.(ttf|otf|woff2?)$/i.test(file.name);
            if (isFont) {
                const fontFamily = file.name.replace(/['"]/g, "").replace(/\.[^/.]+$/, "").trim();
                const url = `https://vmlcdhbnqlipioswzore.supabase.co/storage/v1/object/public/fonts/${file.name}`;

                // Prevent duplicates
                if (!DESIGN_FONTS.find(f => f.name === fontFamily)) {
                    newFonts.push({ name: fontFamily, url });
                }
            }
        }

        // Add all found fonts to the global catalog
        DESIGN_FONTS.unshift(...newFonts);
        return newFonts;
    } catch (error) {
        console.error('[FontLoader] Error fetching all fonts from Supabase:', error);
        return [];
    }
}

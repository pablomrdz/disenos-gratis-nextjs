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
        const fontFace = new FontFace(fontFamily, `url(${url})`);
        const loadedFace = await fontFace.load();
        document.fonts.add(loadedFace);
        return true;
    } catch (error) {
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

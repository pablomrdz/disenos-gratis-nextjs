export type MockupSlug = 'mvp-1' | 'mvp-2'

export interface MockupPreset {
  slug: MockupSlug
  title: string
  description: string
  backgroundUrl: string
  width: number
  height: number
  printArea: {
    left: number
    top: number
    width: number
    height: number
  }
}

export const MOCKUP_PRESETS: Record<MockupSlug, MockupPreset> = {
  'mvp-1': {
    slug: 'mvp-1',
    title: 'Mockup de playera vertical',
    description: 'Formato vertical 9:16 para historias de Instagram.',
    backgroundUrl:
      'https://fsn1.your-objectstorage.com/disenosgratis/uploads/2026/10/background-mvp-1.webp',
    width: 1080,
    height: 1920,
    // Punto de partida; se ajustará después de la validación visual.
    printArea: { left: 316, top: 650, width: 448, height: 520 },
  },
  'mvp-2': {
    slug: 'mvp-2',
    title: 'Mockup de playera cuadrado',
    description: 'Formato cuadrado 1:1 para publicaciones de Instagram.',
    backgroundUrl:
      'https://fsn1.your-objectstorage.com/disenosgratis/uploads/2026/10/background-mvp-2.webp',
    width: 1080,
    height: 1080,
    // Punto de partida; se ajustará después de la validación visual.
    printArea: { left: 316, top: 345, width: 448, height: 430 },
  },
}

export function getMockupPreset(slug: string): MockupPreset | undefined {
  return MOCKUP_PRESETS[slug as MockupSlug]
}

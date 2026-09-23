'use client'

import { useMemo, useState } from 'react'
import { Gauge, Layers3, Thermometer, Timer } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type MaterialKey = 'cotton' | 'polyester' | 'blend' | 'performance'

const MATERIALS = {
  cotton: {
    label: '100% Cotton',
    tempF: '310–325°F',
    tempC: '154–163°C',
    time: '12–15 sec',
    pressure: 'Medium–high',
    note: 'Cotton can usually tolerate the higher end of common DTF pressing ranges.',
  },
  polyester: {
    label: '100% Polyester',
    tempF: '275–290°F',
    tempC: '135–143°C',
    time: '8–12 sec',
    pressure: 'Medium',
    note: 'Start lower to reduce dye migration and heat marks, then test before production.',
  },
  blend: {
    label: 'Cotton / Polyester Blend',
    tempF: '290–310°F',
    tempC: '143–154°C',
    time: '10–15 sec',
    pressure: 'Medium',
    note: 'Use the garment care label and transfer supplier instructions to choose the safer starting point.',
  },
  performance: {
    label: 'Performance Polyester',
    tempF: '260–285°F',
    tempC: '127–141°C',
    time: '8–10 sec',
    pressure: 'Light–medium',
    note: 'Heat-sensitive performance fabrics should be tested at the lowest effective setting.',
  },
} satisfies Record<MaterialKey, {
  label: string
  tempF: string
  tempC: string
  time: string
  pressure: string
  note: string
}>

export function DtfPressSettingsTool() {
  const [material, setMaterial] = useState<MaterialKey>('cotton')
  const [unit, setUnit] = useState<'F' | 'C'>('F')
  const result = useMemo(() => MATERIALS[material], [material])

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Fabric</span>
          <select
            value={material}
            onChange={(event) => {
              const value = event.target.value as MaterialKey
              setMaterial(value)
              trackEvent('tool_interaction', { tool_name: 'dtf_press_settings', material: value })
            }}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          >
            {Object.entries(MATERIALS).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </label>

        <div className="flex rounded-xl border border-border bg-muted/40 p-1">
          {(['F', 'C'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setUnit(value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${unit === value ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              °{value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ResultCard icon={<Thermometer className="h-5 w-5" />} label="Temperature" value={unit === 'F' ? result.tempF : result.tempC} />
        <ResultCard icon={<Timer className="h-5 w-5" />} label="Press time" value={result.time} />
        <ResultCard icon={<Gauge className="h-5 w-5" />} label="Pressure" value={result.pressure} />
        <ResultCard icon={<Layers3 className="h-5 w-5" />} label="Peel" value="Film-specific" />
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Starting point, not a universal recipe.</strong> DTF film, powder, press calibration and garment chemistry can change the correct settings. {result.note} Always follow the transfer supplier's peel instructions.
      </div>
    </div>
  )
}

function ResultCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/25 p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-bold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-3 text-xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

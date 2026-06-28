import type { StringState } from '@kretoffer/guitar-audio-kit'

interface FretboardProps {
  frets: number[]
  fingers?: (number | null)[]
  showNumbers?: boolean
  mode?: 'diagram' | 'full'
  startFret?: number
  endFret?: number
  stringStates?: StringState[]
  showFretMarkers?: boolean
  className?: string
}

const STRING_COLORS: Record<string, string> = {
  inactive: '#ffffff',
  correct: '#22c55e',
  wrong: '#ef4444',
  muted: '#6b7280',
  extra: '#3b82f6',
}

const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17]

const SVG_W = 320
const SVG_H = 200
const STRING_SPACING = 26
const FRET_SPACING = 36
const MARGIN_L = 20
const MARGIN_T = 30
const NUM_STRINGS = 6
const NUM_FRETS = 5

export function Fretboard({
  frets,
  fingers = [],
  showNumbers = true,
  mode = 'diagram',
  startFret = 1,
  endFret = 5,
  stringStates,
  showFretMarkers = true,
  className = '',
}: FretboardProps) {
  const visualFrets = mode === 'diagram' ? NUM_FRETS : 12

  const stringY = (si: number) => MARGIN_T + si * STRING_SPACING
  const fretX = (fi: number) => MARGIN_L + fi * FRET_SPACING

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className={`w-full max-w-sm ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x={0} y={0} width={SVG_W} height={SVG_H} rx={8} className="fretboard-bg" />

      {showFretMarkers &&
        FRET_MARKERS.filter((m) => m <= endFret).map((marker) => {
          const fretPos = marker - startFret + 1
          if (fretPos < 0 || fretPos > visualFrets) return null
          const cx = fretX(fretPos) - FRET_SPACING / 2
          const cy = MARGIN_T + ((NUM_STRINGS - 1) * STRING_SPACING) / 2
          if (marker === 12) {
            return (
              <g key={marker}>
                <circle cx={cx} cy={cy - 8} r={4} fill="#333" />
                <circle cx={cx} cy={cy + 8} r={4} fill="#333" />
              </g>
            )
          }
          return <circle key={marker} cx={cx} cy={cy} r={4} fill="#333" />
        })}

      {Array.from({ length: visualFrets + 1 }).map((_, fi) => (
        <line
          key={`fret-${fi}`}
          x1={fretX(fi)}
          y1={MARGIN_T - 8}
          x2={fretX(fi)}
          y2={MARGIN_T + (NUM_STRINGS - 1) * STRING_SPACING + 8}
          stroke={fi === 0 ? '#333' : '#999'}
          strokeWidth={fi === 0 ? 3 : 1}
        />
      ))}

      {Array.from({ length: NUM_STRINGS }).map((_, si) => {
        const state = stringStates?.[si]
        const color = state ? STRING_COLORS[state.status] : '#ffffff'
        const opacity = state?.status === 'inactive' ? 0.4 : 0.9
        return (
          <line
            key={`string-${si}`}
            x1={fretX(0)}
            y1={stringY(si)}
            x2={fretX(visualFrets)}
            y2={stringY(si)}
            stroke={color}
            strokeWidth={1.5 + (5 - si) * 0.4}
            opacity={opacity}
            strokeLinecap="round"
          />
        )
      })}

      {frets.map((fret, si) => {
        if (fret === -1 || fret === undefined) return null
        const isOpen = fret === 0
        const fretPos = fret - startFret + 1
        if (fretPos < 0 || fretPos > visualFrets) return null
        const cx = isOpen ? fretX(0) - 12 : fretX(fretPos) - FRET_SPACING / 2
        const cy = stringY(si)
        const r = isOpen ? 5 : 8
        const finger = fingers[si]

        return (
          <g key={`dot-${si}`}>
            {isOpen ? (
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth={2} />
            ) : (
              <circle cx={cx} cy={cy} r={r} fill="#fff" opacity={0.9} />
            )}
            {!isOpen && showNumbers && finger != null && (
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontSize={9}
                fill="#333"
                fontWeight="bold"
              >
                {finger}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

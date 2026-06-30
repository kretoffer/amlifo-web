import type { StringState } from '@kretoffer/guitar-audio-kit'
import { getInstrumentChords } from '@/data/chords.ts'
import { useAppStore } from '@/store/index.ts'

interface ChordDiagramProps {
  chordName: string
  stringStates?: StringState[]
  className?: string
}

const STRING_SPACING = 20
const FRET_SPACING = 28
const MARGIN_L = 30
const MARGIN_T = 40
const MARKER_R = 7

const STRING_COLORS: Record<string, string> = {
  inactive: '#ffffff',
  correct: '#22c55e',
  wrong: '#ef4444',
  muted: '#6b7280',
  extra: '#3b82f6',
}

export function ChordDiagram({ chordName, stringStates, className = '' }: ChordDiagramProps) {
  const instrumentName = useAppStore((s) => s.instrumentName)
  const tuningName = useAppStore((s) => s.tuningName)
  const chord = getInstrumentChords(instrumentName, tuningName)[chordName]
  const showNumbers = useAppStore((s) => s.showFingerNumbers)
  if (!chord) return <div className="text-red-400">Chord not found: {chordName}</div>

  const frets = chord.frets
  const fingers = chord.fingers
  const stringCount = frets.length
  const numFrets = 5
  const svgH = MARGIN_T + (stringCount - 1) * STRING_SPACING + 30
  const svgW = MARGIN_L + numFrets * FRET_SPACING + 10

  const stringY = (si: number) => MARGIN_T + (stringCount - 1 - si) * STRING_SPACING
  const fretX = (fi: number) => MARGIN_L + fi * FRET_SPACING

  const minFret = Math.min(...frets.filter((f) => f > 0))
  const startFret = minFret > 0 ? minFret : 1

  const indicatorX = fretX(0) - 14

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
        {chordName}
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[200px]">
        <rect x={0} y={0} width={svgW} height={svgH} rx={6} className="fretboard-bg" />

        {Array.from({ length: numFrets + 1 }).map((_, fi) => (
          <line
            key={`fret-${fi}`}
            x1={fretX(fi)}
            y1={MARGIN_T - 8}
            x2={fretX(fi)}
            y2={MARGIN_T + (stringCount - 1) * STRING_SPACING + 8}
            stroke={fi === 0 ? '#333' : '#999'}
            strokeWidth={fi === 0 ? 2.5 : 1}
          />
        ))}

        {startFret > 1 && (
          <text x={fretX(0) + 3} y={MARGIN_T - 14} fontSize={11} fill="#999" fontWeight="bold">
            {startFret}fr
          </text>
        )}

        {Array.from({ length: stringCount }).map((_, si) => {
          const state = stringStates?.[si]
          const color = state ? STRING_COLORS[state.status] : '#ffffff'
          const opacity = state?.status === 'inactive' ? 0.35 : 0.9
          return (
            <line
              key={`string-${si}`}
              x1={fretX(0)}
              y1={stringY(si)}
              x2={fretX(numFrets)}
              y2={stringY(si)}
              stroke={color}
              strokeWidth={1.5 + (stringCount - 1 - si) * 0.25}
              opacity={opacity}
              strokeLinecap="round"
            />
          )
        })}

        {frets.map((fret, si) => {
          if (fret === undefined) return null

          const state = stringStates?.[si]
          const indicatorOpacity = state?.status === 'inactive' ? 0.35 : 0.9

          if (fret === -1) {
            return (
              <text
                key={`indicator-${si}`}
                x={indicatorX}
                y={stringY(si) + 4}
                textAnchor="middle"
                fontSize={12}
                fill="#999"
                opacity={indicatorOpacity}
              >
                ✕
              </text>
            )
          }

          if (fret === 0) {
            return (
              <circle
                key={`indicator-${si}`}
                cx={indicatorX}
                cy={stringY(si)}
                r={4.5}
                fill="none"
                stroke="#fff"
                strokeWidth={2}
                opacity={indicatorOpacity}
              />
            )
          }

          const fretPos = fret - startFret + 1
          if (fretPos < 0 || fretPos > numFrets) return null

          const cx = fretX(fretPos) - FRET_SPACING / 2
          const cy = stringY(si)
          const finger = fingers[si]

          return (
            <g key={`dot-${si}`}>
              <circle cx={cx} cy={cy} r={MARKER_R} fill="#fff" opacity={0.9} />
              {showNumbers && finger != null && (
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#333"
                  fontWeight="bold"
                >
                  {finger}
                </text>
              )}
            </g>
          )
        })}

        {Array.from({ length: numFrets }).map((_, fi) => {
          const fretNum = startFret + fi
          return (
            <text
              key={`fretnum-${fi}`}
              x={fretX(fi + 1) - FRET_SPACING / 2}
              y={MARGIN_T + (stringCount - 1) * STRING_SPACING + 20}
              textAnchor="middle"
              fontSize={9}
              fill="#888"
            >
              {fretNum}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

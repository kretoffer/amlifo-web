import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { AudioEngine, Tuner, PitchDetector, noteToFrequency, getTuning } from '@kretoffer/guitar-audio-kit'
import type { TuningResult } from '@kretoffer/guitar-audio-kit'
import { useAppStore } from '@/store/index.ts'
import { useAudioFeedback, warmUpAudio } from '@/hooks/useAudioFeedback.ts'

function parseNote(name: string): { note: string; octave: number } {
  const m = name.match(/^([A-G]#?)(\d+)$/)
  if (!m) return { note: 'A', octave: 4 }
  return { note: m[1], octave: parseInt(m[2]) }
}

function centsBetween(f1: number, f2: number): number {
  return 1200 * Math.log2(f1 / f2)
}

function buildStringLabels(notes: string[], lang: string): { note: string; octave: number; label: string }[] {
  const total = notes.length
  return notes.map((n, i) => {
    const { note, octave } = parseNote(n)
    let label = `${n}`
    if (lang === 'ru') {
      label = `${total - i}-я (${note.replace('#', '♯')})`
    } else {
      const pos = total - i
      const suffix = pos === 1 ? 'st' : pos === 2 ? 'nd' : pos === 3 ? 'rd' : 'th'
      label = `${pos}${suffix} (${n})`
    }
    return { note, octave, label }
  })
}

export function TunerPage() {
  const { t, i18n } = useTranslation()
  const instrumentName = useAppStore((s) => s.instrumentName)
  const tuningName = useAppStore((s) => s.tuningName)
  const [active, setActive] = useState(false)
  const [autoDetect, setAutoDetect] = useState(true)
  const [result, setResult] = useState<TuningResult | null>(null)
  const [selectedString, setSelectedString] = useState(-1)
  const engineRef = useRef<AudioEngine | null>(null)
  const tunerRef = useRef<Tuner | null>(null)
  const pitchDetectorRef = useRef<PitchDetector | null>(null)
  const rafRef = useRef<number>(0)
  const stringRef = useRef(selectedString)
  const activeRef = useRef(active)
  const autoDetectRef = useRef(autoDetect)
  const lastTunedRef = useRef(false)
  const mountedRef = useRef(true)
  const { playTuned } = useAudioFeedback()

  const tuningNotes = useMemo(() => getTuning(instrumentName, tuningName), [instrumentName, tuningName])
  const strings = useMemo(() => buildStringLabels(tuningNotes, i18n.language), [tuningNotes, i18n.language])

  const findClosestString = useMemo(() => {
    return (freq: number): number | null => {
      let best = -1
      let bestCents = Infinity
      for (let i = 0; i < tuningNotes.length; i++) {
        const { note, octave } = parseNote(tuningNotes[i])
        const target = noteToFrequency(note, octave)
        const c = Math.abs(centsBetween(freq, target))
        if (c < bestCents) { bestCents = c; best = i }
      }
      return bestCents <= 100 ? best : null
    }
  }, [tuningNotes])

  stringRef.current = selectedString
  activeRef.current = active
  autoDetectRef.current = autoDetect

  // auto-select middle string when tuning changes
  if (selectedString === -1 || selectedString >= strings.length) {
    setSelectedString(Math.max(0, Math.floor(strings.length / 2)))
  }

  useEffect(() => {
    mountedRef.current = true

    async function init() {
      try {
        const engine = new AudioEngine()
        await engine.init()
        if (!mountedRef.current) { engine.destroy(); return }
        engineRef.current = engine
        tunerRef.current = new Tuner(engine)
        pitchDetectorRef.current = new PitchDetector(engine)

        function loop() {
          if (!mountedRef.current) return
          rafRef.current = requestAnimationFrame(loop)

          const tun = tunerRef.current
          if (!tun) return
          const currentStrings = getTuning(
            useAppStore.getState().instrumentName,
            useAppStore.getState().tuningName
          )

          if (autoDetectRef.current) {
            const rawFreq = pitchDetectorRef.current?.detect(60, 1500)
            if (rawFreq != null) {
              const idx = findClosestString(rawFreq)
              if (idx !== null && idx !== stringRef.current) {
                stringRef.current = idx
                setSelectedString(idx)
              }
            }
          }

          const idx = stringRef.current
          if (idx >= 0 && idx < currentStrings.length) {
            const { note, octave } = parseNote(currentStrings[idx])
            tun.setTarget(note, octave)
          }
          const r = tun.detect()
          setResult(r)
          if (r?.isInTune && !lastTunedRef.current) playTuned()
          lastTunedRef.current = r?.isInTune ?? false
        }
        rafRef.current = requestAnimationFrame(loop)
      } catch (e) { console.error('Tuner init failed:', e) }
    }

    if (active) init()
    else { engineRef.current?.destroy(); engineRef.current = null; tunerRef.current = null; pitchDetectorRef.current = null; setResult(null) }

    return () => {
      mountedRef.current = false
      cancelAnimationFrame(rafRef.current)
      engineRef.current?.destroy()
    }
  }, [active, playTuned, findClosestString])

  const cents = result?.cents ?? 0
  const isInTune = result?.isInTune ?? false
  const hasSignal = result !== null
  const barW = Math.min(100, Math.abs(cents) * 1.2)

  return (
    <div className="space-y-6 text-center">
      <Helmet>
        <title>{t('meta.tunerTitle')}</title>
        <meta name="description" content={t('meta.tunerDesc')} />
        <meta property="og:title" content={t('meta.tunerTitle')} />
        <meta property="og:description" content={t('meta.tunerDesc')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amlifo.web.app/tuner" />
      </Helmet>

      <h1 className="text-2xl font-bold">{t('tuner.title')}</h1>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {strings.map((s, i) => (
          <button key={i} onClick={() => { setSelectedString(i); setAutoDetect(false) }}
            className={`rounded-lg px-3 py-1 text-sm ${selectedString === i ? 'bg-blue-500 text-white' : ''}`}
            style={{ backgroundColor: selectedString === i ? undefined : 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
        <span className="text-sm">{t('tuner.autoDetect')}</span>
        <button
          onClick={() => setAutoDetect(a => !a)}
          className={`relative h-6 w-11 rounded-full transition-colors ${autoDetect ? 'bg-blue-500' : 'bg-gray-600'}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${autoDetect ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <button onClick={async () => { if (!active) await warmUpAudio(); setActive(a => !a) }}
        className={`rounded-full px-8 py-3 text-lg font-bold text-white ${active ? 'bg-red-500' : 'bg-blue-500'}`}
      >{active ? t('tuner.disableMic') : t('tuner.enableMic')}</button>

      {active && (
        <div className="space-y-4">
          <div className={`text-6xl font-bold ${hasSignal ? '' : 'opacity-30'}`}>
            {hasSignal ? `${result!.note}${result!.octave}` : '—'}
          </div>

          {hasSignal ? (
            <>
              <div className={`text-lg ${isInTune ? 'text-green-400' : Math.abs(cents) > 25 ? 'text-red-400' : 'text-yellow-400'}`}>
                {cents > 0 ? '+' : ''}{cents}¢{isInTune ? ' ✓' : ''}
              </div>
              <div className="mx-auto h-5 w-64 max-w-full rounded-full bg-gray-700 overflow-hidden relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/40 -translate-x-1/2" />
                <div className={`h-full rounded-full transition-all duration-75 ${isInTune ? 'bg-green-400' : Math.abs(cents) > 25 ? 'bg-red-400' : 'bg-yellow-400'}`}
                  style={{ width: `${barW}%`, marginLeft: cents > 0 ? '50%' : `${50 - barW}%` }}
                />
              </div>
              {autoDetect && selectedString >= 0 && selectedString < strings.length && (
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('tuner.detected')} {strings[selectedString].label}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t('tuner.pluckString')}</div>
          )}
        </div>
      )}
    </div>
  )
}

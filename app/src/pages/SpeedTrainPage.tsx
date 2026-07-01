import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ChordDiagram } from '@/components/ChordDiagram.tsx'
import { getInstrumentChords } from '@/data/chords.ts'
import { useAppStore } from '@/store/index.ts'
import { AudioEngine, StringAnalyzer, getTuning } from '@kretoffer/guitar-audio-kit'
import { useAudioFeedback, warmUpAudio } from '@/hooks/useAudioFeedback.ts'

export function SpeedTrainPage() {
  const { t } = useTranslation()
  const instrumentName = useAppStore(s => s.instrumentName)
  const tuningName = useAppStore(s => s.tuningName)
  const stringStates = useAppStore(s => s.stringStates)
  const setStringStates = useAppStore(s => s.setStringStates)
  const highScoreSpeed = useAppStore(s => s.highScoreSpeed)
  const setSpeedHighScore = useAppStore(s => s.setSpeedHighScore)

  const [mode, setMode] = useState<'diagram' | 'name'>('diagram')
  const [chordQueue, setChordQueue] = useState<string[]>([])
  const [maxBpm, setMaxBpm] = useState(80)
  const [screen, setScreen] = useState<'setup' | 'playing' | 'results'>('setup')
  const [currentChord, setCurrentChord] = useState<string | null>(null)
  const [speed, setSpeed] = useState(10)
  const [chordIndex, setChordIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [fullSpeedCycles, setFullSpeedCycles] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timeLimit, setTimeLimit] = useState(0)
  const [result, setResult] = useState<'complete' | 'stopped' | null>(null)
  const [chordKey, setChordKey] = useState(0)

  const engineRef = useRef<AudioEngine | null>(null)
  const analyzerRef = useRef<StringAnalyzer | null>(null)
  const rafId = useRef(0)
  const mounted = useRef(false)
  const chordNameRef = useRef<string | null>(null)
  const correctCount = useRef(0)
  const onCooldown = useRef(false)
  const missStreak = useRef(0)
  const speedRef = useRef(10)
  const chordIndexRef = useRef(0)
  const cycleCountRef = useRef(0)
  const fullSpeedCyclesRef = useRef(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef(0)
  const startTimeRef = useRef(0)
  const chordQueueRef = useRef(chordQueue)
  const maxBpmRef = useRef(maxBpm)
  const nextChordTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { chordQueueRef.current = chordQueue }, [chordQueue])
  useEffect(() => { maxBpmRef.current = maxBpm }, [maxBpm])

  const { playCorrectChord } = useAudioFeedback()

  const chordLib = useMemo(() => getInstrumentChords(instrumentName, tuningName), [instrumentName, tuningName])
  const hasChords = Object.keys(chordLib).length > 0
  const availableChords = useMemo(() => Object.keys(chordLib), [chordLib])

  const calcTimeLimit = useCallback((s: number) => {
    return (60 / maxBpmRef.current) * (100 / s)
  }, [])

  const addToQueue = useCallback((chord: string) => {
    setChordQueue(prev => [...prev, chord])
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setChordQueue(prev => prev.filter((_, i) => i !== index))
  }, [])

  const moveInQueue = useCallback((index: number, direction: 'up' | 'down') => {
    setChordQueue(prev => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return next
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  const stopTraining = useCallback(() => {
    cancelAnimationFrame(rafId.current)
    if (nextChordTimeout.current) clearTimeout(nextChordTimeout.current)
    engineRef.current?.destroy()
    engineRef.current = null
    analyzerRef.current = null
    setStringStates([])
    setCurrentChord(null)
    chordNameRef.current = null
    setFeedback(null)
    setResult('stopped')
    setScreen('results')
    setSpeedHighScore(fullSpeedCyclesRef.current)
    setTimeLeft(0)
  }, [setStringStates, setSpeedHighScore])

  const nextChordInQueue = useCallback(() => {
    if (!mounted.current || !engineRef.current) return

    const queue = chordQueueRef.current
    if (queue.length === 0) return

    const qi = (chordIndexRef.current + 1) % queue.length
    chordIndexRef.current = qi
    setChordIndex(qi)

    if (qi === 0) {
      const cyc = cycleCountRef.current + 1
      cycleCountRef.current = cyc
      setCycleCount(cyc)

      if (speedRef.current >= 100) {
        const fsc = fullSpeedCyclesRef.current + 1
        fullSpeedCyclesRef.current = fsc
        setFullSpeedCycles(fsc)

        if (fsc >= 5) {
          cancelAnimationFrame(rafId.current)
          engineRef.current?.destroy()
          engineRef.current = null
          analyzerRef.current = null
          setStringStates([])
          setCurrentChord(null)
          chordNameRef.current = null
          setFeedback(null)
          setResult('complete')
          setSpeedHighScore(5)
          setTimeLeft(0)
          setScreen('results')
          return
        }
      } else {
        fullSpeedCyclesRef.current = 0
        setFullSpeedCycles(0)
      }
    }

    const name = queue[qi]
    setCurrentChord(name)
    setChordKey(k => k + 1)
    chordNameRef.current = name
    const chordShape = chordLib[name]
    if (chordShape) analyzerRef.current?.setTarget(chordShape.frets)

    elapsedRef.current = 0
    onCooldown.current = false
    correctCount.current = 0
    setFeedback(t('speedTrain.playChord'))
  }, [chordLib, t, setStringStates, setSpeedHighScore])

  function startTraining() {
    setResult(null)
    setScreen('playing')
    setSpeed(10)
    speedRef.current = 10
    setChordIndex(0)
    chordIndexRef.current = 0
    setCycleCount(0)
    cycleCountRef.current = 0
    setFullSpeedCycles(0)
    fullSpeedCyclesRef.current = 0
    setFeedback(null)
    setTimeLeft(0)
    setTimeLimit(0)
    missStreak.current = 0
    correctCount.current = 0
    onCooldown.current = false
    elapsedRef.current = 0
    lastTimeRef.current = 0

    ;(async () => {
      try {
        const engine = new AudioEngine()
        await engine.init()
        engineRef.current = engine

        const currentTuning = getTuning(
          useAppStore.getState().instrumentName,
          useAppStore.getState().tuningName
        )
        const analyzer = new StringAnalyzer(engine, {
          tuning: currentTuning,
          silenceThreshold: 0.015,
        })
        analyzerRef.current = analyzer

        const name = chordQueueRef.current[0]
        setCurrentChord(name)
        setChordKey(k => k + 1)
        chordNameRef.current = name
        const chordShape = chordLib[name]
        if (chordShape) analyzer.setTarget(chordShape.frets)

        startTimeRef.current = performance.now()
        lastTimeRef.current = performance.now()

        function loop() {
          if (!mounted.current || !analyzerRef.current) return
          rafId.current = requestAnimationFrame(loop)

          const now = performance.now()
          const dt = (now - lastTimeRef.current) / 1000
          lastTimeRef.current = now

          const queuedChordName = chordNameRef.current
          if (!queuedChordName) return

          const result = analyzerRef.current.analyse()
          setStringStates(result.strings)

          if (onCooldown.current) return

          const currentTimeLimit = calcTimeLimit(speedRef.current)
          const remaining = Math.max(0, currentTimeLimit - elapsedRef.current)
          setTimeLimit(currentTimeLimit)

          if (Math.floor(elapsedRef.current * 10) !== Math.floor((elapsedRef.current - dt) * 10)) {
            setTimeLeft(remaining)
          }

          if (!result.isSilent && result.confidence >= 0.75) {
            correctCount.current++
            if (correctCount.current >= 8) {
              onCooldown.current = true
              setFeedback(t('speedTrain.correct'))
              playCorrectChord()

              speedRef.current = Math.min(100, speedRef.current + 3)
              setSpeed(speedRef.current)
              missStreak.current = 0
              setTimeLeft(0)

              nextChordTimeout.current = setTimeout(() => {
                nextChordInQueue()
              }, 800)
              return
            }
          } else {
            correctCount.current = 0
          }

          elapsedRef.current += dt

          if (elapsedRef.current >= currentTimeLimit) {
            onCooldown.current = true
            missStreak.current++
            setFeedback(t('speedTrain.missed'))

            if (missStreak.current >= 2) {
              speedRef.current = Math.max(10, speedRef.current - 7)
              setSpeed(speedRef.current)
            }
            setTimeLeft(0)

            nextChordTimeout.current = setTimeout(() => {
              nextChordInQueue()
            }, 500)
          }
        }

        rafId.current = requestAnimationFrame(loop)
      } catch (e) { console.error('Speed train init failed:', e) }
    })()
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      cancelAnimationFrame(rafId.current)
      if (nextChordTimeout.current) clearTimeout(nextChordTimeout.current)
      engineRef.current?.destroy()
    }
  }, [])

  const effectiveBpm = Math.round(maxBpm * (speed / 100))
  const currentTimeLimit = timeLimit || calcTimeLimit(speed)
  const progress = currentTimeLimit > 0 ? timeLeft / currentTimeLimit : 0
  const speedColor = speed < 40 ? '#ef4444' : speed < 70 ? '#eab308' : '#22c55e'
  const timerColor = progress > 0.5 ? '#22c55e' : progress > 0.25 ? '#eab308' : '#ef4444'

  if (screen === 'setup') {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>{t('speedTrain.title')} — Amlifo</title>
          <meta name="description" content={t('meta.trainDesc')} />
        </Helmet>

        <h1 className="text-2xl font-bold text-center">{t('speedTrain.title')}</h1>

        {!hasChords && (
          <div className="rounded-lg px-4 py-3 text-sm text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700">
            {t('instrument.noChordsWarning')}
          </div>
        )}

        <div className="space-y-4 text-center">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <button onClick={() => setMode('diagram')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === 'diagram' ? 'bg-blue-500 text-white' : ''}`}
                style={{ backgroundColor: mode === 'diagram' ? undefined : 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >{t('speedTrain.byDiagram')}</button>
              <button onClick={() => setMode('name')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === 'name' ? 'bg-blue-500 text-white' : ''}`}
                style={{ backgroundColor: mode === 'name' ? undefined : 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >{t('speedTrain.byName')}</button>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-2">{t('speedTrain.buildQueue')}</h3>

            {chordQueue.length > 0 && (
              <div className="flex flex-col items-center gap-1.5 mb-3">
                {chordQueue.map((chord, i) => (
                  <div key={`${chord}-${i}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
                    style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <span className="font-mono text-xs opacity-50 w-4 text-left">{i + 1}</span>
                    <span className="font-semibold w-12 text-left">{chord}</span>
                    <button onClick={() => moveInQueue(i, 'up')} disabled={i === 0}
                      className="text-xs px-1.5 py-0.5 rounded disabled:opacity-30 hover:bg-white/10">↑</button>
                    <button onClick={() => moveInQueue(i, 'down')} disabled={i === chordQueue.length - 1}
                      className="text-xs px-1.5 py-0.5 rounded disabled:opacity-30 hover:bg-white/10">↓</button>
                    <button onClick={() => removeFromQueue(i)}
                      className="text-xs px-1.5 py-0.5 rounded text-red-400 hover:bg-white/10">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-1.5">
              {availableChords.map(k => (
                <button key={k} onClick={() => addToQueue(k)}
                  className="rounded-lg px-2.5 py-1 text-xs transition-colors hover:bg-blue-500/20"
                  style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >+ {k}</button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <label className="text-sm font-semibold">
              {t('speedTrain.maxTempo')} <span className="text-blue-400">{maxBpm}</span>
            </label>
            <input type="range" min={30} max={240} value={maxBpm} onChange={e => setMaxBpm(Number(e.target.value))}
              className="w-full mt-2 accent-blue-500" />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              <span>30</span><span>240</span>
            </div>
          </div>

          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {t('speedTrain.highScore')} {highScoreSpeed}
          </div>

          <button onClick={async () => { await warmUpAudio(); startTraining() }}
            disabled={chordQueue.length < 2 || !hasChords}
            className="rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-white disabled:opacity-50"
          >{chordQueue.length < 2 ? t('speedTrain.needAtLeastTwo') : t('speedTrain.start')}</button>
        </div>
      </div>
    )
  }

  if (screen === 'results') {
    const duration = ((performance.now() - startTimeRef.current) / 1000).toFixed(1)

    return (
      <div className="space-y-6 text-center">
        <Helmet>
          <title>{t('speedTrain.title')} — Amlifo</title>
        </Helmet>

        <h1 className="text-2xl font-bold">{t('speedTrain.title')}</h1>

        {result === 'complete' ? (
          <>
            <div className="text-2xl font-bold text-green-400">{t('speedTrain.complete')}</div>
            <div className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {duration}s · {t('speedTrain.cycle')} {cycleCount}
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-yellow-400">{t('speedTrain.stopped')}</div>
            <div className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {t('speedTrain.bestSpeed')} {Math.round(speed)}%
            </div>
          </>
        )}

        <div className="text-md font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          {t('speedTrain.highScore')} {highScoreSpeed}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={startTraining}
            className="rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-white"
          >{t('speedTrain.playAgain')}</button>
          <button onClick={() => setScreen('setup')}
            className="rounded-full bg-blue-500 px-8 py-3 text-lg font-bold text-white"
          >{t('speedTrain.settings')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-center">
      <Helmet>
        <title>{t('speedTrain.title')} — Amlifo</title>
      </Helmet>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            <span>{t('speedTrain.speed')}</span>
            <span style={{ color: speedColor }} className="font-bold">{Math.round(speed)}% ({effectiveBpm} BPM)</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${speed}%`, backgroundColor: speedColor }} />
          </div>
        </div>
        <button onClick={stopTraining} className="text-sm text-red-400 whitespace-nowrap">{t('train.stop')}</button>
      </div>

      <div key={chordKey} className="animate-chord-pop">
        {mode === 'diagram'
          ? currentChord && <ChordDiagram chordName={currentChord} stringStates={stringStates.length > 0 ? stringStates : undefined} />
          : <div className="text-5xl font-bold py-8">{currentChord}</div>
        }
      </div>

      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {chordIndex + 1}/{chordQueue.length} · {t('speedTrain.cycle')} {cycleCount + 1}
        {fullSpeedCycles >= 1 && <span className="ml-2 text-orange-400">🔥 {fullSpeedCycles}/5</span>}
      </div>

      <div className="w-full max-w-xs mx-auto">
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          <div className="h-full rounded-full transition-all duration-150 ease-linear"
            style={{ width: `${progress * 100}%`, backgroundColor: timerColor }} />
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {stringStates.length > 0 && (
        <div className="flex items-center justify-center gap-1.5">
          {stringStates.map((s, i) => (
            <div key={i}
              className="w-4 h-4 rounded-full border-2 transition-colors"
              style={{
                backgroundColor: s.status === 'correct' ? '#22c55e' : s.status === 'wrong' ? '#ef4444' : s.status === 'extra' ? '#3b82f6' : s.status === 'muted' ? '#6b7280' : 'transparent',
                borderColor: s.status === 'inactive' ? '#6b7280' : s.status === 'correct' ? '#22c55e' : s.status === 'wrong' ? '#ef4444' : s.status === 'extra' ? '#3b82f6' : '#6b7280',
              }}
            />
          ))}
        </div>
      )}

      <div className="text-sm font-semibold" style={{
        color: feedback === t('speedTrain.correct') ? '#22c55e'
          : feedback === t('speedTrain.missed') ? '#ef4444'
          : 'var(--color-text-secondary)'
      }}>
        {feedback || t('speedTrain.playChord')}
      </div>
    </div>
  )
}

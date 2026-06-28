import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ChordDiagram } from '@/components/ChordDiagram.tsx'
import { CHORD_LIBRARY } from '@/data/chords.ts'
import { useAppStore } from '@/store/index.ts'
import { AudioEngine, StringAnalyzer } from '@kretoffer/guitar-audio-kit'
import { useAudioFeedback, warmUpAudio } from '@/hooks/useAudioFeedback.ts'

export function ChordTrainPage() {
  const { t } = useTranslation()
  const selectedChords = useAppStore(s => s.selectedChords)
  const toggleChord = useAppStore(s => s.toggleChord)
  const score = useAppStore(s => s.score)
  const highScoreDiagram = useAppStore(s => s.highScoreDiagram)
  const highScoreName = useAppStore(s => s.highScoreName)
  const incrementScore = useAppStore(s => s.incrementScore)
  const resetScore = useAppStore(s => s.resetScore)
  const setHighScore = useAppStore(s => s.setHighScore)
  const stringStates = useAppStore(s => s.stringStates)
  const setStringStates = useAppStore(s => s.setStringStates)
  const [mode, setMode] = useState<'diagram' | 'name'>('diagram')
  const [currentChord, setCurrentChord] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(40)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [screen, setScreen] = useState<'setup' | 'playing' | 'results'>('setup')
  const [streak, setStreak] = useState(0)
  const [chordKey, setChordKey] = useState(0)
  const engineRef = useRef<AudioEngine | null>(null)
  const analyzerRef = useRef<StringAnalyzer | null>(null)
  const rafId = useRef(0)
  const mounted = useRef(false)
  const chordName = useRef<string | null>(null)
  const correctCount = useRef(0)
  const onCooldown = useRef(false)
  const streakRef = useRef(0)
  const { playCorrectChord } = useAudioFeedback()

  function nextChord(): string | null {
    if (selectedChords.length === 0) return null
    return selectedChords[Math.floor(Math.random() * selectedChords.length)]
  }

  const stopTraining = useCallback(() => {
    cancelAnimationFrame(rafId.current)
    engineRef.current?.destroy()
    engineRef.current = null
    analyzerRef.current = null
    setStringStates([])
    setCurrentChord(null)
    chordName.current = null
    setIsPlaying(false)
    setFeedback(null)
    setScreen('setup')
  }, [setStringStates])

  function startTraining() {
    resetScore()
    setTimeLeft(40)
    setStreak(0)
    streakRef.current = 0
    setScreen('playing')
    setIsPlaying(true)
    setFeedback(null)
    correctCount.current = 0
    onCooldown.current = false

    ;(async () => {
      try {
        const engine = new AudioEngine()
        await engine.init()
        engineRef.current = engine

        const analyzer = new StringAnalyzer(engine, {
          tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
          silenceThreshold: 0.015,
        })
        analyzerRef.current = analyzer

        const name = nextChord()
        if (!name) return
        setCurrentChord(name)
        setChordKey(k => k + 1)
        chordName.current = name
        analyzer.setTarget(CHORD_LIBRARY[name].frets)

        function loop() {
          if (!mounted.current || !analyzerRef.current) return
          rafId.current = requestAnimationFrame(loop)

          const result = analyzerRef.current.analyse()
          setStringStates(result.strings)

          if (onCooldown.current || result.isSilent) {
            if (result.isSilent) correctCount.current = 0
            return
          }

          const chord = CHORD_LIBRARY[chordName.current!]
          if (!chord) return

          if (result.confidence >= 0.75) {
            correctCount.current++
          } else {
            correctCount.current = 0
          }

          if (correctCount.current >= 8) {
            onCooldown.current = true
            setFeedback(t('train.correct'))
            incrementScore()
            playCorrectChord()

            streakRef.current++
            if (streakRef.current >= 5) {
              setTimeLeft(t => t + 5)
              streakRef.current = 0
            }
            setStreak(streakRef.current)

            setTimeout(() => {
              const next = nextChord()
              if (!next) return
              setCurrentChord(next)
              setChordKey(k => k + 1)
              chordName.current = next
              setFeedback(null)
              correctCount.current = 0
              onCooldown.current = false
              analyzerRef.current?.setTarget(CHORD_LIBRARY[next].frets)
            }, 1200)
          }
        }
        rafId.current = requestAnimationFrame(loop)
      } catch (e) { console.error('Train init failed:', e) }
    })()
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      cancelAnimationFrame(rafId.current)
      engineRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft <= 0) {
        cancelAnimationFrame(rafId.current)
        engineRef.current?.destroy()
        engineRef.current = null
        analyzerRef.current = null
        setStringStates([])
        setCurrentChord(null)
        chordName.current = null
        setIsPlaying(false)
        setFeedback(null)
        setScreen('results')
        const { score: finalScore } = useAppStore.getState()
        setHighScore(finalScore, mode)
      }
      return
    }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [isPlaying, timeLeft, setStringStates, setHighScore])

  if (screen === 'setup') {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>{t('meta.trainTitle')}</title>
          <meta name="description" content={t('meta.trainDesc')} />
          <meta property="og:title" content={t('meta.trainTitle')} />
          <meta property="og:description" content={t('meta.trainDesc')} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://amlifo.web.app/train" />
        </Helmet>

        <h1 className="text-2xl font-bold text-center">{t('train.title')}</h1>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setMode('diagram')}
              className={`rounded-lg px-4 py-2 ${mode === 'diagram' ? 'bg-blue-500 text-white' : ''}`}
              style={{ backgroundColor: mode === 'diagram' ? undefined : 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
            >{t('train.byDiagram')}</button>
            <button onClick={() => setMode('name')}
              className={`rounded-lg px-4 py-2 ${mode === 'name' ? 'bg-blue-500 text-white' : ''}`}
              style={{ backgroundColor: mode === 'name' ? undefined : 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
            >{t('train.byName')}</button>
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {t('train.highScore')} {t('train.byDiagram')}: {highScoreDiagram} &middot; {t('train.byName')}: {highScoreName}
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-2">{t('train.selectChords')}</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(CHORD_LIBRARY).map(k => (
                <button key={k} onClick={() => toggleChord(k)}
                  className={`rounded-lg px-3 py-1 text-sm ${selectedChords.includes(k) ? 'bg-blue-500 text-white' : ''}`}
                  style={{ backgroundColor: selectedChords.includes(k) ? undefined : 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >{k}</button>
              ))}
            </div>
          </div>
          <button onClick={async () => { await warmUpAudio(); startTraining() }} disabled={selectedChords.length === 0}
            className="rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-white disabled:opacity-50"
          >{t('train.start')}</button>
        </div>
      </div>
    )
  }

  if (screen === 'results') {
    return (
      <div className="space-y-6 text-center">
        <Helmet>
          <title>{t('meta.trainTitle')}</title>
          <meta name="description" content={t('meta.trainDesc')} />
        </Helmet>

        <h1 className="text-2xl font-bold">{t('train.title')}</h1>
        <div className="text-2xl font-bold">{t('train.timeUp')}</div>
        <div className="text-lg">{t('train.score')} {score}</div>
        <div className="text-md font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          {t('train.highScore')} {mode === 'diagram' ? highScoreDiagram : highScoreName}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={startTraining}
            className="rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-white"
          >{t('train.playAgain')}</button>
          <button onClick={() => setScreen('setup')}
            className="rounded-full bg-blue-500 px-8 py-3 text-lg font-bold text-white"
          >{t('train.settings')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-center">
      <Helmet>
        <title>{t('meta.trainTitle')}</title>
        <meta name="description" content={t('meta.trainDesc')} />
      </Helmet>

      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{timeLeft}{t('metronome.seconds')}</div>
        <div>
          <div className="text-lg font-bold">{score}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{t('train.highScore')} {mode === 'diagram' ? highScoreDiagram : highScoreName}</div>
        </div>
        <button onClick={stopTraining} className="text-sm text-red-400">{t('train.stop')}</button>
      </div>

      <div key={chordKey} className="animate-chord-pop">
        {mode === 'diagram'
          ? currentChord && <ChordDiagram chordName={currentChord} stringStates={stringStates.length > 0 ? stringStates : undefined} />
          : <div className="text-4xl font-bold py-8">{currentChord}</div>
        }
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 transition-colors"
            style={{
              backgroundColor: i < streak ? '#22c55e' : 'transparent',
              borderColor: i < streak ? '#22c55e' : '#6b7280',
            }}
          />
        ))}
      </div>

      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {feedback || t('train.playChord')}
      </div>
    </div>
  )
}

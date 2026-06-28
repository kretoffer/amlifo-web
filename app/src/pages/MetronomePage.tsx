import { useState, useRef, useEffect, useCallback } from 'react'

let ctx: AudioContext | null = null
let warmed = false

function beep(freq: number, duration: number, vol: number) {
  if (!ctx || ctx.state !== 'running') return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    const t = ctx.currentTime
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.start(t)
    osc.stop(t + duration)
  } catch {}
}

function playTimerEnd() {
  const play = (f: number, delay: number) => setTimeout(() => beep(f, 0.3, 0.5), delay * 400)
  play(440, 0)
  play(440, 1)
  play(880, 2)
}

async function startAudio() {
  if (warmed) return
  try {
    if (ctx && ctx.state === 'closed') ctx = null
    if (!ctx) {
      ctx = new AudioContext()
      if (ctx.state === 'suspended') await ctx.resume()
    }
    if (ctx.state !== 'running') return
    beep(660, 0.08, 0.4)
    warmed = true
  } catch {
    ctx = null
  }
}

export function MetronomePage() {
  const [bpm, setBpm] = useState(120)
  const [beat, setBeat] = useState(4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [timerMode, setTimerMode] = useState(false)
  const [timerDuration, setTimerDuration] = useState(60)
  const [timerRemaining, setTimerRemaining] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)
  const beatRef = useRef(beat)
  const bpmRef = useRef(bpm)

  beatRef.current = beat
  bpmRef.current = bpm

  const stopAll = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null }
    setIsPlaying(false)
    setCurrentBeat(0)
    setTimerRemaining(0)
  }, [])

  const scheduleBeat = useCallback(() => {
    const interval = 60000 / bpmRef.current
    let beatCount = 0
    setIsPlaying(true)
    setCurrentBeat(0)
    beep(1000, 0.04, 0.6)

    intervalRef.current = window.setInterval(() => {
      beatCount = (beatCount + 1) % beatRef.current
      setCurrentBeat(beatCount)
      beep(beatCount === 0 ? 1000 : 800, 0.04, 0.5)
    }, interval)
  }, [])

  const startMetronome = useCallback(() => {
    scheduleBeat()
    if (timerMode && timerDuration > 0) {
      setTimerRemaining(timerDuration)
      timerIntervalRef.current = window.setInterval(() => {
        setTimerRemaining(prev => {
          if (prev > 1) return prev - 1
          if (prev === 1) {
            clearInterval(timerIntervalRef.current!)
            timerIntervalRef.current = null
            stopAll()
            playTimerEnd()
            return 0
          }
          return prev
        })
      }, 1000)
    }
  }, [scheduleBeat, timerMode, timerDuration, stopAll])

  useEffect(() => {
    if (!isPlaying) return
    stopAll()
    startMetronome()
  }, [bpm, beat, isPlaying, stopAll, startMetronome])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [])

  const togglePlay = async () => {
    if (isPlaying) stopAll()
    else { await startAudio(); startMetronome() }
  }

  const handleSliderCommit = () => {
    if (!isPlaying) return
    stopAll()
    startMetronome()
  }

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-2xl font-bold">Метроном</h1>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBpm(b => Math.max(30, b - 1))}
          className="rounded-lg px-4 py-2 text-xl font-bold"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          −
        </button>
        <div className="text-center">
          <div className="text-5xl font-bold tabular-nums">{bpm}</div>
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>BPM</div>
        </div>
        <button
          onClick={() => setBpm(b => Math.min(300, b + 1))}
          className="rounded-lg px-4 py-2 text-xl font-bold"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={30}
        max={300}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        onMouseUp={handleSliderCommit}
        onTouchEnd={handleSliderCommit}
        onKeyUp={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') handleSliderCommit() }}
        className="w-full max-w-xs"
      />

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Размер:</span>
        {[2, 3, 4, 6].map((n) => (
          <button
            key={n}
            onClick={() => setBeat(n)}
            className={`rounded-lg px-3 py-1 text-sm ${beat === n ? 'bg-blue-500 text-white' : ''}`}
            style={{
              backgroundColor: beat === n ? undefined : 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            {n}/4
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: beat }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-8 rounded-full transition-all ${
              isPlaying && currentBeat === i
                ? i === 0 ? 'bg-blue-500 scale-125' : 'bg-green-400'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={togglePlay}
          className={`rounded-full px-8 py-3 text-lg font-bold text-white ${isPlaying ? 'bg-red-500' : 'bg-blue-500'}`}
        >
          {isPlaying ? 'Стоп' : 'Старт'}
        </button>
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <label className="flex items-center justify-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={timerMode}
            onChange={() => setTimerMode(!timerMode)}
            className="w-4 h-4"
          />
          <span className="text-sm">Таймер</span>
        </label>
        {timerMode && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setTimerDuration(d => Math.max(10, d - 10))}
              className="rounded px-2 py-1 text-sm"
              style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              −
            </button>
            <span className="text-lg font-bold tabular-nums">
              {timerDuration >= 60 ? `${Math.floor(timerDuration / 60)}:${String(timerDuration % 60).padStart(2, '0')}` : `${timerDuration}с`}
            </span>
            <button
              onClick={() => setTimerDuration(d => Math.min(600, d + 10))}
              className="rounded px-2 py-1 text-sm"
              style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              +
            </button>
            {isPlaying && timerRemaining > 0 && (
              <span className="text-sm ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                Осталось: {timerRemaining >= 60 ? `${Math.floor(timerRemaining / 60)}:${String(timerRemaining % 60).padStart(2, '0')}` : `${timerRemaining}с`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

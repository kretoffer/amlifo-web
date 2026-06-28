import { useRef, useCallback } from 'react'

let ctx: AudioContext | null = null
let warmed = false

export async function warmUpAudio(): Promise<void> {
  if (warmed) return
  try {
    if (ctx && ctx.state === 'closed') ctx = null
    if (!ctx) {
      ctx = new AudioContext()
      if (ctx.state === 'suspended') await ctx.resume()
    }
    if (ctx.state !== 'running') return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    const t = ctx.currentTime
    gain.gain.setValueAtTime(0.3, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.start(t)
    osc.stop(t + 0.09)
    warmed = true
  } catch {
    ctx = null
  }
}

export function useAudioFeedback() {
  const lastPlayedRef = useRef(0)

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.5) => {
    const now = Date.now()
    if (now - lastPlayedRef.current < 80) return
    lastPlayedRef.current = now
    if (!ctx || ctx.state !== 'running') return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.value = freq
      const t = ctx.currentTime
      gain.gain.setValueAtTime(volume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
      osc.start(t)
      osc.stop(t + duration)
    } catch {}
  }, [])

  const playCorrectChord = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.35)
    setTimeout(() => playTone(659, 0.1, 'sine', 0.35), 100)
    setTimeout(() => playTone(784, 0.15, 'sine', 0.35), 200)
  }, [playTone])

  const playTuned = useCallback(() => {
    playTone(880, 0.15, 'sine', 0.3)
    setTimeout(() => playTone(880, 0.3, 'sine', 0.3), 150)
  }, [playTone])

  const playTimerEnd = useCallback(() => {
    const beep = (f: number, t: number) => setTimeout(() => playTone(f, 0.3, 'square', 0.5), t * 400)
    beep(440, 0)
    beep(440, 1)
    beep(880, 2)
  }, [playTone])

  const playClick = useCallback((freq = 800, vol = 0.45) => {
    playTone(freq, 0.04, 'sine', vol)
  }, [playTone])

  return { playCorrectChord, playTuned, playTimerEnd, playClick }
}

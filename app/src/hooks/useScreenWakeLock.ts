import { useEffect, useRef } from 'react'

function createWakeVideo(): HTMLVideoElement {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const stream = canvas.captureStream(1)

  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.loop = true
  video.setAttribute('webkit-playsinline', '')
  video.setAttribute('disablePictureInPicture', '')
  video.srcObject = stream
  Object.assign(video.style, {
    position: 'absolute',
    left: '-100%',
    top: '-100%',
    width: '1px',
    height: '1px',
    pointerEvents: 'none',
  })
  return video
}

export function useScreenWakeLock() {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)
  const busyRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const warmedRef = useRef(false)

  useEffect(() => {
    const hasWakeLock = 'wakeLock' in navigator

    const acquire = async () => {
      if (sentinelRef.current || busyRef.current || !hasWakeLock) return
      busyRef.current = true
      try {
        const s = await navigator.wakeLock.request('screen')
        sentinelRef.current = s
        s.addEventListener('release', () => {
          sentinelRef.current = null
          if (document.visibilityState === 'visible') acquire()
        })
      } catch {
      } finally {
        busyRef.current = false
      }
    }

    if (hasWakeLock) acquire()

    const onInteraction = async () => {
      if (hasWakeLock) acquire()

      if (!warmedRef.current) {
        warmedRef.current = true
        try {
          const ctx = new AudioContext()
          if (ctx.state === 'suspended') await ctx.resume()
          if (ctx.state !== 'running') { ctx.close(); return }

          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = 80
          gain.gain.setValueAtTime(0.001, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03)
          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 0.04)

          setTimeout(() => { try { ctx.close() } catch {} }, 2000)
        } catch {}
      }

      if (!videoRef.current) {
        const video = createWakeVideo()
        videoRef.current = video
        document.body.appendChild(video)
        video.play().catch(() => {})
      }

      document.removeEventListener('pointerdown', onInteraction)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      if (hasWakeLock) acquire()
      const v = videoRef.current
      if (v?.paused) v.play().catch(() => {})
    }

    document.addEventListener('pointerdown', onInteraction)
    document.addEventListener('visibilitychange', onVisibilityChange)

    const interval = hasWakeLock ? window.setInterval(acquire, 15_000) : null

    return () => {
      document.removeEventListener('pointerdown', onInteraction)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (interval !== null) clearInterval(interval)
      sentinelRef.current?.release()
      sentinelRef.current = null
      videoRef.current?.pause()
      videoRef.current?.remove()
      videoRef.current = null
    }
  }, [])
}

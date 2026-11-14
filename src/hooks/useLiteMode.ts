import { useState, useEffect } from 'react'

let globalLiteMode: boolean | null = null
const listeners = new Set<(isLite: boolean) => void>()

function setGlobalLite(val: boolean) {
  if (globalLiteMode === val) return
  globalLiteMode = val
  listeners.forEach(fn => fn(val))
}

export function useLiteMode() {
  const [isLite, setIsLite] = useState<boolean>(() => {
    if (globalLiteMode !== null) return globalLiteMode

    if (typeof window === 'undefined') return false

    // Hardware checks
    const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4
    const lowMemory = typeof (navigator as any).deviceMemory === 'number' && (navigator as any).deviceMemory <= 4
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (lowCores || lowMemory || prefersReducedMotion) {
      globalLiteMode = true
      return true
    }
    return false
  })

  useEffect(() => {
    const handler = (val: boolean) => setIsLite(val)
    listeners.add(handler)

    // If already lite, don't run FPS monitor
    if (globalLiteMode === true) {
      return () => {
        listeners.delete(handler)
      }
    }

    // FPS monitor: track frames. If FPS < 40 (frame duration > 25ms) for > 2 seconds, switch to lite
    let frameCount = 0
    let lastTime = performance.now()
    let slowTimeAccumulator = 0
    let animId: number

    const checkFps = (now: number) => {
      const delta = now - lastTime
      lastTime = now
      frameCount++

      // If frame took longer than 25ms (~40fps)
      if (delta > 25) {
        slowTimeAccumulator += delta
        if (slowTimeAccumulator > 2000) {
          setGlobalLite(true)
          return
        }
      } else {
        // Recover gradually if frames are fast
        slowTimeAccumulator = Math.max(0, slowTimeAccumulator - delta * 0.5)
      }

      animId = requestAnimationFrame(checkFps)
    }

    animId = requestAnimationFrame(checkFps)

    return () => {
      listeners.delete(handler)
      cancelAnimationFrame(animId)
    }
  }, [])

  return isLite
}

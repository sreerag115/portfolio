import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Clean up any stale Lenis instance from StrictMode or previous mount
    if ((window as any).lenis) {
      try {
        ;(window as any).lenis.destroy()
      } catch (e) {}
      delete (window as any).lenis
    }

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    ;(window as any).lenis = lenis

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    lenis.scrollTo(0, { immediate: true })

    lenis.on('scroll', ScrollTrigger.update)

    // Single scroll driver: Lenis pumped exclusively via gsap.ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      if ((window as any).lenis === lenis) {
        delete (window as any).lenis
      }
    }
  }, [])
}

import React, { createContext, useContext, useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from '../data/sections'

gsap.registerPlugin(ScrollTrigger)
if (typeof window !== 'undefined') {
  ;(window as any).ScrollTrigger = ScrollTrigger
  ;(window as any).gsap = gsap
}

interface NavigationContextType {
  activeSection: string
  activeSectionNumber: string
  scrollProgress: number
  scrollToSection: (id: string) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('hero')
  const [activeSectionNumber, setActiveSectionNumber] = useState('01')
  const [scrollProgress, setScrollProgress] = useState(0)

  const activeSectionRef = useRef('hero')

  // Smooth scroll to section via Lenis with 1.1s duration
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.1 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Handle URL hash sync (replaceState only, no jumping)
  const updateActiveSection = useCallback((id: string) => {
    if (activeSectionRef.current === id) return
    activeSectionRef.current = id
    setActiveSection(id)

    const sec = SECTIONS.find((s) => s.id === id)
    if (sec) {
      setActiveSectionNumber(sec.number)
    }

    // Sync URL hash with replaceState
    if (typeof window !== 'undefined') {
      const newHash = id === 'hero' ? '' : `#${id}`
      const newUrl = window.location.pathname + window.location.search + newHash
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', newUrl)
      }
    }
  }, [])

  // Listen to popstate (back/forward buttons) to scroll to section
  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        scrollToSection(hash)
      } else {
        scrollToSection('hero')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [scrollToSection])

  // Single useLayoutEffect managing minimal, non-pinned ScrollTriggers inside gsap.context
  useLayoutEffect(() => {
    // Initial Page Load / Refresh Guarantee: page starts at the Hero
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
      }
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      const forceScrollTop = () => {
        window.scrollTo(0, 0)
        const lenis = (window as any).lenis
        if (lenis) {
          lenis.scrollTo(0, { immediate: true })
        }
      }
      forceScrollTop()
      requestAnimationFrame(forceScrollTop)
      setTimeout(forceScrollTop, 50)
      ScrollTrigger.clearScrollMemory('manual')
    }

    const ctx = gsap.context(() => {
      // 1. Top Scroll Progress Bar (direct transform, zero React state re-render cascades)
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const bar = document.getElementById('scroll-progress-bar')
          if (bar) {
            bar.style.transform = `scaleX(${self.progress})`
          }
          if (self.progress === 0 || window.scrollY <= 10) {
            updateActiveSection('hero')
          }
        },
      })

      // 2. Active Section ScrollTriggers (Non-pinned, single source of truth for nav highlighting)
      SECTIONS.forEach((sec) => {
        ScrollTrigger.create({
          trigger: '#' + sec.id,
          endTrigger: sec.id === 'experience' ? '#achievements' : undefined,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => updateActiveSection(sec.id),
          onEnterBack: () => updateActiveSection(sec.id),
        })
      })

      // 3. Clean Heading Reveals (integer transforms with clearProps, no scrub)
      const headings = document.querySelectorAll('h2')
      headings.forEach((heading) => {
        if (heading.closest('#projects')) return

        gsap.fromTo(
          heading,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onComplete: () => {
              gsap.set(heading, { clearProps: 'transform' })
            },
          }
        )
      })
    })

    const handleRefresh = () => {
      ScrollTrigger.refresh()
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(handleRefresh)
    }

    if (document.readyState === 'complete') {
      handleRefresh()
    } else {
      window.addEventListener('load', handleRefresh, { once: true })
    }

    const timer1 = setTimeout(handleRefresh, 150)
    const timer2 = setTimeout(handleRefresh, 600)

    return () => {
      ctx.revert()
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('load', handleRefresh)
    }
  }, [updateActiveSection])

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        activeSectionNumber,
        scrollProgress,
        scrollToSection,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return ctx
}

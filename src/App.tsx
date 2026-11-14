import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import MouseReactiveBackground from './components/MouseReactiveBackground'
import CustomCursor from './components/CustomCursor'
import ScrollInteractionLayer from './components/ScrollInteractionLayer'
import { useLenis } from './hooks/useLenis'
import { useFadeObserver } from './hooks/useFadeObserver'
import { NavigationProvider } from './context/NavigationContext'

export default function App() {
  useLenis()
  useFadeObserver()

  return (
    <NavigationProvider>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-[#FF5B1F] text-white rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B1F]"
      >
        Skip to content
      </a>

      {/* 1. Mouse-Reactive Canvas Dot Grid Background (fixed behind all content) */}
      <MouseReactiveBackground />

      {/* 2. Desktop Custom Cursor (single global mount above all content) */}
      <CustomCursor />

      {/* 3. Scroll Interaction Layer (Progress Bar, Section Counter 01 / 06 & Magnetic Pull) */}
      <ScrollInteractionLayer />

      {/* 4. Navigation (Home, About, Work, Skills, Experience, Contact) */}
      <Navbar />

      {/* 5. Main Content Sections (transparent backgrounds so dot canvas shows everywhere) */}
      <main id="main-content" className="relative z-10 bg-transparent">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </NavigationProvider>
  )
}

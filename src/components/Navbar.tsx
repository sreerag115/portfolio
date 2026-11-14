import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigation } from '../context/NavigationContext'
import { SECTIONS } from '../data/sections'

export default function Navbar() {
  const { activeSection, scrollToSection } = useNavigation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/[0.92] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        {/* Brand Link scrolls to Home */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="text-sm font-semibold tracking-tight text-[#F5F5F7] hover:text-[#FF5B1F] transition-colors h-11 flex items-center px-1"
        >
          Sreerag K
        </a>

        {/* Desktop Nav Links with Sliding Active Indicator: Home, About, Work, Skills, Experience, Contact */}
        <nav className="hidden md:flex items-center gap-1 relative p-1 bg-white/[0.02] border border-white/5 rounded-full">
          {SECTIONS.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`relative text-xs font-medium tracking-tight transition-colors h-9 px-3.5 rounded-full flex items-center gap-1.5 z-10 ${
                  isActive ? 'text-[#F5F5F7]' : 'text-[#86868B] hover:text-[#F5F5F7]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-sliding-indicator"
                    className="absolute inset-0 bg-[#16181B] border border-white/10 rounded-full -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="navbar-sliding-dot"
                    className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_8px_#FF5B1F]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{link.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href="/Sreerag_K_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#FF5B1F] text-white rounded-full hover:bg-[#FF5B1F]/90 active:scale-95 transition-all glow-accent inline-flex items-center justify-center"
          >
            Resume
          </a>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-11 h-11 flex items-center justify-center text-[#F5F5F7] focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E0F11] border-b border-white/[0.08] px-6 py-4 space-y-3">
          {SECTIONS.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`min-h-[44px] flex items-center justify-between py-2 text-sm font-medium ${
                  isActive ? 'text-[#FF5B1F]' : 'text-[#86868B]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#FF5B1F]" />}
              </a>
            )
          })}
        </div>
      )}
    </header>
  )
}

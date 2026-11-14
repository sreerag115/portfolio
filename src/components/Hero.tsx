import { motion } from 'framer-motion'
import DeveloperBadge from './DeveloperBadge'

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[calc(100svh-56px)] pt-[72px] pb-10 flex flex-col justify-center relative overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-4">
          {/* Left Column: Keynote Typography & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10">
            {/* Hard Fact Row in Mono */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mono text-xs sm:text-sm text-[#86868B] flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF5B1F] shrink-0" />
              <span>Open to entry-level software and data roles · B.Tech CS, KTU · Malappuram, Kerala</span>
            </motion.div>

            {/* Huge Headline: "Sreerag K." */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-[-0.04em] text-[#F5F5F7] leading-[0.92] mb-6"
            >
              Sreerag K<span className="text-[#FF5B1F]">.</span>
            </motion.h1>

            {/* One Plain Line Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl sm:text-2xl text-[#86868B] max-w-xl font-normal tracking-tight leading-relaxed mb-8"
            >
              I build web and mobile apps backed by data and machine learning.
            </motion.p>

            {/* Exactly Two Buttons */}
            <motion.div
              id="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href="#projects"
                className="px-7 py-3.5 bg-[#FF5B1F] text-white font-medium text-sm rounded-full text-center hover-lift press-scale glow-accent"
              >
                View my work
              </a>
              <a
                href="/Sreerag_K_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-transparent border border-white/15 text-[#F5F5F7] font-medium text-sm rounded-full text-center hover:border-white/40 hover-lift press-scale"
              >
                Download resume
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hanging Developer ID Badge */}
          <div className="lg:col-span-5 w-full relative flex items-center justify-start sm:justify-center">
            <DeveloperBadge />
          </div>
        </div>
      </div>
    </section>
  )
}

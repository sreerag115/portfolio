import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import QRCode from 'qrcode'

export default function DeveloperBadge() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // State
  const [inView, setInView] = useState(true)
  const [tabHidden, setTabHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [qrSvg, setQrSvg] = useState<string>('')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [sheen, setSheen] = useState({ x: 50, y: 50 })

  // Track drag distance to differentiate click vs drag
  const dragDistance = useRef(0)

  // Motion values for drag and strap physics
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Rotate card as it is dragged laterally (pendulum tilt)
  const dragRotate = useTransform(x, [-120, 120], [-14, 14])

  // Strap SVG dynamic path updated via motion values
  const strapPath = useTransform([x, y], (latest: (string | number)[]) => {
    const latestX = Number(latest[0]) || 0
    const latestY = Number(latest[1]) || 0
    const startX = 150
    const startY = 0
    const endX = 150 + latestX
    const endY = 68 + latestY
    const ctrlX = startX + latestX * 0.25
    const ctrlY = startY + (endY - startY) * 0.5
    return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`
  })

  // Detect screen size and prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handleMQ = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handleMQ)

    const handleVisibility = () => {
      setTabHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('resize', checkMobile)
      mq.removeEventListener('change', handleMQ)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // Pause sway when off-screen
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Generate lightweight vector QR code for https://github.com/sreerag115
  useEffect(() => {
    QRCode.toString('https://github.com/sreerag115', {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#F5F5F7',
        light: '#00000000',
      },
    })
      .then((svg) => setQrSvg(svg))
      .catch((err) => console.error('Failed to generate QR Code:', err))
  }, [])

  // Mouse tilt toward cursor & sheen moving opposite
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isMobile) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width
    const mouseY = (e.clientY - rect.top) / rect.height
    const normX = (mouseX - 0.5) * 2
    const normY = (mouseY - 0.5) * 2

    // Max 8 degrees tilt toward cursor
    setTilt({
      x: Math.round(-normY * 8 * 10) / 10,
      y: Math.round(normX * 8 * 10) / 10,
    })

    // Sheen moves opposite cursor
    setSheen({
      x: Math.round((1 - mouseX) * 100),
      y: Math.round((1 - mouseY) * 100),
    })
  }

  const handleMouseEnter = () => {
    if (!prefersReducedMotion && !isMobile) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setSheen({ x: 50, y: 50 })
  }

  // Flip toggle
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  // Click card to flip (only if not dragged)
  const handleCardClick = () => {
    if (dragDistance.current > 6) {
      dragDistance.current = 0
      return
    }
    handleFlip()
  }

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleFlip()
    }
  }

  // Determine if idle sway should run
  const canSway = inView && !tabHidden && !isHovered && !isDragging && !prefersReducedMotion

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center select-none w-[240px] sm:w-[260px] lg:w-[280px] xl:w-[300px]"
    >
      {/* 1. Lanyard Strap SVG coming from top edge of screen/section */}
      <div className="relative w-full h-[68px] sm:h-[76px] pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 300 76"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Ember Orange Lanyard Strap Ribbon */}
          <motion.path
            d={strapPath}
            stroke="#FF5B1F"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle Contrast Stitching Highlight */}
          <motion.path
            d={strapPath}
            stroke="#FFA07A"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
        </svg>
      </div>

      {/* 2. Hanging Assembly (Idle Pendulum Sway around top anchor) */}
      <motion.div
        animate={
          canSway
            ? { rotate: [-1.8, 1.8, -1.8] }
            : { rotate: 0 }
        }
        transition={
          canSway
            ? { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3, ease: 'easeOut' }
        }
        style={{ transformOrigin: '50% -70px' }}
        className="relative flex flex-col items-center w-full"
      >
        {/* 3. Drag Container & Spring Bounce Entrance */}
        <motion.div
          drag={!isMobile && !prefersReducedMotion}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.65}
          dragTransition={{ bounceStiffness: 220, bounceDamping: 15 }}
          style={{
            x,
            y,
            rotate: !prefersReducedMotion ? dragRotate : 0,
          }}
          onDragStart={() => {
            dragDistance.current = 0
            setIsDragging(true)
          }}
          onDrag={(_, info) => {
            dragDistance.current += Math.hypot(info.delta.x, info.delta.y)
          }}
          onDragEnd={() => {
            setIsDragging(false)
          }}
          initial={
            prefersReducedMotion
              ? { y: 0, opacity: 1 }
              : { y: -340, opacity: 0 }
          }
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 14,
            stiffness: 90,
            mass: 1.05,
          }}
          className="relative flex flex-col items-center w-full touch-pan-y"
        >
          {/* Metal Clip & Loop connecting Lanyard to Card */}
          <div className="relative -mb-3 z-30 flex flex-col items-center pointer-events-none">
            {/* Metallic Ring Loop */}
            <div className="w-2.5 h-3.5 border-2 border-[#86868B] rounded-full -mb-1 shadow-sm" />
            {/* Matte Gunmetal Clip */}
            <div className="w-5 h-6 rounded-[4px] bg-gradient-to-b from-[#4A4D54] to-[#25272B] border border-white/20 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-3 bg-[#16181B] rounded-xs" />
            </div>
          </div>

          {/* 4. Badge Card Button (Interactive, Flip on Click / Enter / Space) */}
          <div
            ref={cardRef}
            role="button"
            tabIndex={0}
            aria-label="Developer ID badge, press to flip"
            aria-pressed={isFlipped}
            data-cursor="Drag"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-[240px] sm:w-[260px] lg:w-[280px] xl:w-[300px] h-[370px] sm:h-[400px] lg:h-[430px] xl:h-[440px] relative cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B1F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506] rounded-[24px]"
            style={{ perspective: 1200 }}
          >
            {/* Soft static radial ember glow behind the ID badge (CSS radial-gradient, no blur filter) */}
            <div
              className="absolute -inset-4 sm:-inset-6 pointer-events-none rounded-[36px] -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 91, 31, 0.12) 0%, transparent 72%)',
              }}
            />

            {/* 3D Flip Layer */}
            <motion.div
              style={{
                transformStyle: 'preserve-3d',
                transform: prefersReducedMotion
                  ? undefined
                  : `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
                transition: isHovered && !isDragging
                  ? 'transform 0.1s ease-out'
                  : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="relative w-full h-full rounded-[24px]"
            >
              {/* ================= FRONT SIDE ================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className={`absolute inset-0 w-full h-full rounded-[24px] border border-white/10 bg-gradient-to-b from-[#16181B] via-[#0E0F11] to-[#0A0A0C] p-4 sm:p-5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,91,31,0.06)] overflow-hidden transition-opacity duration-300 ${
                  prefersReducedMotion && isFlipped
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                {/* Soft White Sheen moving opposite cursor */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[24px] z-30 transition-opacity duration-200"
                  style={{
                    opacity: isHovered && !isFlipped ? 0.75 : 0,
                    background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.13) 0%, transparent 65%)`,
                  }}
                />

                {/* Top Slot Punch-Hole */}
                <div className="w-8 h-1.5 rounded-full bg-[#050506] border border-white/15 mx-auto mb-1 shrink-0" />

                {/* 1. Header: DEVELOPER label with accent dot and 2026 */}
                <div className="flex items-center justify-between mono text-[10px] text-[#86868B] font-semibold tracking-wider pt-0.5">
                  <div className="flex items-center gap-1.5 text-[#F5F5F7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_6px_#FF5B1F]" />
                    <span>DEVELOPER</span>
                  </div>
                  <span>2026</span>
                </div>

                {/* 2. Photo Area: Profile photo or Monogram "K" with soft radial glow */}
                {/* Slot for profile photo: drop profile.jpg into public/profile.jpg */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto my-1 rounded-2xl overflow-hidden border border-white/10 bg-[#16181B] relative flex items-center justify-center shrink-0 shadow-inner">
                  {!imgFailed ? (
                    <img
                      src="/profile.jpg"
                      alt="Sreerag K"
                      onError={() => setImgFailed(true)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,91,31,0.28)_0%,transparent_70%)] pointer-events-none" />
                      <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7] select-none z-10">
                        K
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Name & Role */}
                <div className="text-center my-0.5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#F5F5F7]">
                    Sreerag K
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#86868B] font-medium mt-0.5">
                    Full-stack developer
                  </p>
                </div>

                {/* 4. Hairline Divider & Mono Rows */}
                <div className="border-t border-white/[0.08] pt-2 space-y-1">
                  <div className="flex items-center justify-between mono text-[9.5px] sm:text-[10px] text-[#86868B]">
                    <span className="uppercase text-[#86868B]/70 tracking-wider">BASED IN</span>
                    <span className="text-[#F5F5F7] font-medium">Malappuram, Kerala</span>
                  </div>
                  <div className="flex items-center justify-between mono text-[9.5px] sm:text-[10px] text-[#86868B]">
                    <span className="uppercase text-[#86868B]/70 tracking-wider">STACK</span>
                    <span className="text-[#F5F5F7] font-medium truncate ml-1.5">
                      Python · React · Flutter · BigQuery
                    </span>
                  </div>
                </div>

                {/* 5. Bottom Row: QR Code + GitHub */}
                <div className="border-t border-white/[0.08] pt-2 flex items-center gap-2.5">
                  {/* Small QR Code linking to GitHub */}
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-md bg-white/[0.04] border border-white/10 p-0.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="mono text-[8.5px] text-[#86868B]/80 uppercase tracking-wider">
                      GITHUB
                    </span>
                    <span className="mono text-[9px] sm:text-[9.5px] text-[#F5F5F7] font-semibold leading-tight truncate">
                      github.com/sreerag115
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= BACK SIDE ================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: prefersReducedMotion ? undefined : 'rotateY(180deg)',
                }}
                className={`absolute inset-0 w-full h-full rounded-[24px] border border-white/10 bg-gradient-to-b from-[#16181B] via-[#0E0F11] to-[#0A0A0C] p-5 sm:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,91,31,0.06)] overflow-hidden transition-opacity duration-300 ${
                  prefersReducedMotion && !isFlipped
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                {/* Top Slot Punch-Hole */}
                <div className="w-8 h-1.5 rounded-full bg-[#050506] border border-white/15 mx-auto mb-1 shrink-0" />

                {/* Top Section Tag */}
                <div className="flex items-center justify-between mono text-[10px] text-[#86868B] font-semibold tracking-wider">
                  <span className="text-[#FF5B1F]">AVAILABILITY</span>
                  <span>STATUS</span>
                </div>

                {/* Back Content Center: Three Short Lines */}
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 my-2">
                  {/* Line 1: Role Status */}
                  <div className="space-y-1">
                    <div className="w-2 h-2 rounded-full bg-[#FF5B1F] mx-auto animate-pulse" />
                    <p className="text-sm sm:text-base font-semibold text-[#F5F5F7] max-w-[210px] leading-snug">
                      Open to entry-level software and data roles
                    </p>
                  </div>

                  {/* Line 2: Direct Email Link */}
                  <div className="pt-1">
                    <span className="mono text-[9px] text-[#86868B] uppercase tracking-wider block mb-1">
                      Direct Contact
                    </span>
                    <a
                      href="mailto:sreeragmadhav.k@gmail.com"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={isFlipped ? 0 : -1}
                      className="mono text-xs sm:text-[13px] text-[#FF5B1F] hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#FF5B1F] rounded px-1"
                    >
                      sreeragmadhav.k@gmail.com
                    </a>
                  </div>

                  {/* Line 3: Download Resume CTA */}
                  <div className="pt-1">
                    <a
                      href="/Sreerag_K_Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={isFlipped ? 0 : -1}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16181B] border border-white/20 text-xs font-semibold text-[#F5F5F7] hover:border-[#FF5B1F] hover:text-white transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-[#FF5B1F]"
                    >
                      <span>Download resume</span>
                      <span className="text-[#FF5B1F]">↗</span>
                    </a>
                  </div>
                </div>

                {/* Flip Hint */}
                <div className="border-t border-white/[0.08] pt-2 text-center">
                  <span className="mono text-[9px] text-[#86868B]/60">
                    Click or press Space to flip back
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

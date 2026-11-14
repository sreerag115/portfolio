import React, { useState, useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'

interface VisualProps {
  id: number
  className?: string
  image?: string
  inView?: boolean
}

function useIsActive(ref: React.RefObject<HTMLDivElement | null>, propInView?: boolean) {
  const [isVisible, setIsVisible] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(typeof document !== 'undefined' ? !document.hidden : true)

  useEffect(() => {
    const handleVisChange = () => setIsTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisChange)
    return () => document.removeEventListener('visibilitychange', handleVisChange)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return (propInView ?? true) && isVisible && isTabVisible
}

// 01: Second Sight - Real Phone Screen with Sequenced Bounding Boxes & TTS
export const SecondSightUI = memo(function SecondSightUI({
  className = '',
  image,
  inView: propInView,
}: {
  className?: string
  image?: string
  inView?: boolean
}) {
  const [boxStep, setBoxStep] = useState(0)
  const [imgFailed, setImgFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const active = useIsActive(containerRef, propInView)

  // Sequenced detection loop: Box 1 appears, then Box 2 appears, voice banner reads aloud
  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => {
      setBoxStep((prev) => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(timer)
  }, [active])

  if (image && !imgFailed) {
    return (
      <div className={`relative w-full h-full bg-[#0A0A0C] overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={image}
          alt="Second Sight screen"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-gradient-to-b from-[#111215] to-[#0A0A0C] overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}>
      {/* Dynamic Island & Telemetry Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] mono text-[#86868B] px-1">
          <span>9:41</span>
          <div className="w-16 h-3.5 bg-black rounded-full" />
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <div className="w-3.5 h-2 border border-[#86868B] rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-[#86868B]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] mono pt-1 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-[#FF5B1F] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] animate-ping" />
            VISION ACTIVE
          </span>
          <span className="text-[#86868B]">ON-DEVICE · ML KIT</span>
        </div>
      </div>

      {/* Live Camera Viewfinder with Depth Geometry */}
      <div className="relative flex-1 my-3 rounded-2xl border border-white/5 bg-[#070709] overflow-hidden p-3 flex flex-col justify-between">
        {/* Optical Perspective Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full border border-white/10" />
          <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 border border-white/5" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10" />
        </div>

        {/* Bounding Box 1: Doorway */}
        <motion.div
          animate={{
            opacity: boxStep >= 1 ? 1 : 0.2,
            scale: boxStep >= 1 ? 1 : 0.95,
            borderColor: boxStep >= 1 ? '#FF5B1F' : 'rgba(255,255,255,0.15)',
          }}
          transition={{ duration: 0.4 }}
          className="absolute top-4 left-4 w-28 sm:w-32 h-36 sm:h-40 border-2 rounded-lg bg-[#FF5B1F]/5 p-1.5 flex flex-col justify-between transition-colors"
        >
          <span className="mono text-[10px] font-bold text-white bg-[#FF5B1F] px-1.5 py-0.5 rounded-xs self-start">
            Doorway
          </span>
          <div className="flex justify-between text-[9px] mono text-[#FF5B1F] font-semibold">
            <span>DETECTED</span>
            <span>CLEAR</span>
          </div>
        </motion.div>

        {/* Bounding Box 2: Chair */}
        <motion.div
          animate={{
            opacity: boxStep >= 2 ? 1 : 0.15,
            scale: boxStep >= 2 ? 1 : 0.95,
            borderColor: boxStep >= 2 ? '#F5F5F7' : 'rgba(255,255,255,0.1)',
          }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-6 right-4 w-24 sm:w-28 h-24 sm:h-28 border rounded-lg bg-white/5 p-1.5 flex flex-col justify-between transition-colors"
        >
          <span className="mono text-[10px] font-medium text-white/90 bg-white/20 px-1 py-0.5 rounded-xs self-start">
            Chair
          </span>
          <span className="mono text-[9px] text-[#86868B] self-end">OBSTACLE</span>
        </motion.div>
      </div>

      {/* Voice Feedback Banner */}
      <motion.div
        animate={{
          scale: boxStep === 3 ? [1, 1.02, 1] : 1,
          borderColor: boxStep === 3 ? 'rgba(255,91,31,0.5)' : 'rgba(255,255,255,0.1)',
        }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full bg-[#16181B] border border-white/10 rounded-xl p-3 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-[#FF5B1F] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v18l-6-6H3V9h3l6-6zm7 9c0-2.83-1.44-5.32-3.64-6.75l-.71 1.23C16.32 7.67 17.5 9.7 17.5 12s-1.18 4.33-2.85 5.52l.71 1.23C17.56 17.32 19 14.83 19 12z"/>
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] mono text-[#86868B] uppercase tracking-wider">Voice Feedback</div>
          <div className="text-xs font-semibold text-white truncate">
            "Doorway detected ahead"
          </div>
        </div>
      </motion.div>

      {/* Bottom Home Bar */}
      <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-3" />
    </div>
  )
})

// 02: SmartFind - Browser Screen with Lost Items Catalog & CLIP Match Panel
export const SmartFindUI = memo(function SmartFindUI({
  className = '',
  image,
  inView: propInView,
}: {
  className?: string
  image?: string
  inView?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const active = useIsActive(containerRef, propInView)

  if (image && !imgFailed) {
    return (
      <div className={`relative w-full h-full bg-[#0A0A0C] overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={image}
          alt="SmartFind screen"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#0E0F11] overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}
    >
      {/* Top Search Filter Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex-1 h-9 bg-[#16181B] border border-white/10 rounded-lg px-3 flex items-center gap-2 text-xs text-[#86868B]">
          <svg className="w-3.5 h-3.5 text-[#FF5B1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span className="text-[#F5F5F7]">Search lost item...</span>
        </div>
        <span className="mono text-[10px] text-[#FF5B1F] px-2.5 py-1.5 bg-[#FF5B1F]/10 rounded border border-[#FF5B1F]/20 font-semibold shrink-0">
          CLIP 512-D
        </span>
      </div>

      {/* Lost Items Grid with Expanded Match */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3 flex-1">
        {/* Expanded Possible Match Panel */}
        <motion.div
          animate={
            active
              ? {
                  borderColor: ['rgba(255,91,31,0.3)', 'rgba(255,91,31,0.8)', 'rgba(255,91,31,0.3)'],
                }
              : { borderColor: 'rgba(255,91,31,0.5)' }
          }
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          className="bg-[#16181B] border-2 border-[#FF5B1F] rounded-xl p-3.5 flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-white">Black Backpack</span>
              <span className="mono text-[10px] font-bold text-[#FF5B1F] bg-[#FF5B1F]/15 px-2 py-0.5 rounded">
                Best match
              </span>
            </div>
            <p className="text-xs text-[#86868B] leading-tight">
              Found on campus
            </p>

            {/* Dark Placeholder Image Area */}
            <div className="w-full h-16 my-2 bg-[#0E0F11] border border-white/5 rounded-lg flex items-center justify-center text-[#86868B]/40">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-[11px] mono text-[#86868B]">
              <span>Vector similarity</span>
              <span className="text-[#FF5B1F] font-semibold">High confidence</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[92%] h-full bg-[#FF5B1F]" />
            </div>
            <div
              aria-hidden="true"
              className="w-full py-1.5 text-center text-[11px] font-semibold text-white bg-[#FF5B1F] rounded-lg select-none"
            >
              Notify owner via SMTP
            </div>
          </div>
        </motion.div>

        {/* Second Item Waiting */}
        <div className="bg-[#16181B]/70 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-white">Leather Wallet</span>
              <span className="mono text-[10px] text-[#86868B]">Reported</span>
            </div>
            <p className="text-xs text-[#86868B] leading-tight">
              Found on campus
            </p>

            {/* Dark Placeholder Image Area */}
            <div className="w-full h-16 my-2 bg-[#0E0F11] border border-white/5 rounded-lg flex items-center justify-center text-[#86868B]/40">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="mono text-[11px] text-[#86868B] pt-2 border-t border-white/5 flex items-center justify-between">
            <span>Vector similarity</span>
            <span className="text-white/60">Awaiting match...</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] mono text-[#86868B]">
        <span>FastAPI + Supabase Embeddings</span>
        <span className="text-white font-medium">Auto-Index Ready</span>
      </div>
    </div>
  )
})

// 03: Pharmacy Billing - FEFO Batch Priority Table with Cursor Click & Invoice Slide-in
export const PharmacyBillingUI = memo(function PharmacyBillingUI({
  className = '',
  image,
  inView: propInView,
}: {
  className?: string
  image?: string
  inView?: boolean
}) {
  const [showInvoice, setShowInvoice] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const active = useIsActive(containerRef, propInView)

  // Stage-show animation: cursor clicks button, invoice slides in, then resets
  useEffect(() => {
    if (!active) return
    let t1: number
    let t2: number
    const loop = setInterval(() => {
      // Step 1: click
      t1 = window.setTimeout(() => setShowInvoice(true), 1600)
      // Step 2: hide
      t2 = window.setTimeout(() => setShowInvoice(false), 4600)
    }, 5500)
    return () => {
      clearInterval(loop)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [active])

  if (image && !imgFailed) {
    return (
      <div className={`relative w-full h-full bg-[#0A0A0C] overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={image}
          alt="Pharmacy billing screen"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-[#0E0F11] overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}>
      {/* Action Header */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs mono text-[#86868B]">
          <span className="text-white font-semibold">Terminal 01 · FEFO Mode</span>
          <span className="text-[#FF5B1F] bg-[#FF5B1F]/10 px-2 py-0.5 rounded border border-[#FF5B1F]/20">
            OFFLINE POS
          </span>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-5 text-[10px] mono text-[#86868B] uppercase py-2.5 border-b border-white/5">
          <span>Item</span>
          <span>Batch</span>
          <span>Expiry</span>
          <span>Qty</span>
          <span className="text-right">Price</span>
        </div>

        {/* Row 1 - Highlighted FEFO Batch */}
        <motion.div
          animate={{
            backgroundColor: ['rgba(255,91,31,0.06)', 'rgba(255,91,31,0.18)', 'rgba(255,91,31,0.06)'],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="grid grid-cols-5 items-center py-2.5 px-2 rounded-lg border border-[#FF5B1F]/40 my-1.5 text-xs"
        >
          <div className="font-semibold text-white truncate">Amoxicillin 500</div>
          <div className="mono text-[10px] text-[#FF5B1F]">BT-4029</div>
          <div className="mono text-[10px] text-[#FF5B1F] font-bold">08/26 (FEFO)</div>
          <div className="text-white font-medium">2</div>
          <div className="text-right font-semibold text-white">₹140.00</div>
        </motion.div>

        {/* Row 2 */}
        <div className="grid grid-cols-5 items-center py-2 px-2 text-xs text-[#86868B]">
          <div className="truncate text-white/90">Paracetamol 650</div>
          <div className="mono text-[10px]">BT-8812</div>
          <div className="mono text-[10px]">11/27</div>
          <div>1</div>
          <div className="text-right text-white/90">₹30.00</div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-5 items-center py-2 px-2 text-xs text-[#86868B]">
          <div className="truncate text-white/90">Cetirizine 10mg</div>
          <div className="mono text-[10px]">BT-1094</div>
          <div className="mono text-[10px]">02/28</div>
          <div>3</div>
          <div className="text-right text-white/90">₹75.00</div>
        </div>
      </div>

      {/* Total & Generate Invoice Button */}
      <div className="relative pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="text-xs text-[#86868B]">
          Total: <span className="text-white font-bold text-base ml-1">₹245.00</span>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="px-4 py-2 bg-[#FF5B1F] text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5"
          >
            <span>Generate invoice</span>
            <span>→</span>
          </div>

          {/* Animated Cursor clicking button */}
          <motion.div
            animate={{
              x: [35, 0, 0, 35],
              y: [30, 0, 0, 30],
              scale: [1, 1, 0.88, 1],
            }}
            transition={{ repeat: Infinity, duration: 5.5, times: [0, 0.25, 0.35, 1], ease: 'easeInOut' }}
            className="absolute -bottom-1 -right-1 pointer-events-none z-20"
          >
            <svg className="w-5 h-5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4L7 18V2z"/>
            </svg>
          </motion.div>
        </div>

        {/* Slide-in Invoice Preview Modal */}
        <motion.div
          animate={{
            y: showInvoice ? 0 : 80,
            opacity: showInvoice ? 1 : 0,
            scale: showInvoice ? 1 : 0.95,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 bg-[#16181B] border border-[#FF5B1F] rounded-xl p-3 shadow-2xl z-30 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
              <span className="text-xs font-bold text-white">Invoice #2026-0814 Ready</span>
            </div>
            <div className="mono text-[10px] text-[#86868B] mt-0.5">
              Total ₹245.00 · FEFO Verified · jsPDF Generated
            </div>
          </div>
          <span className="mono text-[10px] bg-[#FF5B1F]/20 text-[#FF5B1F] font-bold px-2.5 py-1 rounded">
            PRINT PDF
          </span>
        </motion.div>
      </div>
    </div>
  )
})

// 04: School Website - Browser Window with Self-Scrolling Landing Page
export const SchoolWebsiteUI = memo(function SchoolWebsiteUI({
  className = '',
  image,
  inView: propInView,
}: {
  className?: string
  image?: string
  inView?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const active = useIsActive(containerRef, propInView)

  if (image && !imgFailed) {
    return (
      <div className={`relative w-full h-full bg-[#0A0A0C] overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={image}
          alt="School website screen"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#0E0F11] overflow-hidden select-none ${className}`}
    >
      {/* Self-scrolling inner container (animates only when active & in view) */}
      <motion.div
        animate={active ? { y: [0, -65, 0] } : { y: 0 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="p-4 sm:p-5 space-y-4"
      >
        {/* School Banner Header */}
        <div className="p-3.5 bg-gradient-to-r from-[#16181B] to-[#1F2228] border border-white/10 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-tight">
              Govt. Higher Secondary School
            </span>
            <div className="flex gap-2 text-[10px] mono text-[#86868B]">
              <span className="text-[#FF5B1F] font-semibold">Portal</span>
              <span>Faculty</span>
              <span>Admin</span>
            </div>
          </div>
          <div className="text-xs text-[#86868B]">
            Malappuram District · Kerala State Education Portal
          </div>
        </div>

        {/* Notices Ledger List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] uppercase text-[#86868B] tracking-wider font-semibold">
              Official Circulars & Announcements
            </span>
            <span className="mono text-[9px] text-[#FF5B1F]">LIVE FEED</span>
          </div>

          {/* Highlighted Notice 1 */}
          <motion.div
            animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,91,31,0.6)', 'rgba(255,255,255,0.1)'] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="p-3 bg-[#16181B] border border-white/10 rounded-xl flex items-center justify-between"
          >
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold text-white truncate">
                Board Exam Schedule 2026
              </div>
              <div className="text-[10px] mono text-[#86868B]">
                Published by Principal Office
              </div>
            </div>
            <span className="mono text-[9px] font-bold px-2 py-0.5 rounded bg-[#FF5B1F]/15 text-[#FF5B1F] shrink-0">
              PDF
            </span>
          </motion.div>

          {/* Notice 2 */}
          <div className="p-3 bg-[#16181B]/80 border border-white/5 rounded-xl flex items-center justify-between text-xs text-[#86868B]">
            <div>
              <div className="text-white/95 font-medium truncate">Merit Scholarship Window</div>
              <div className="text-[10px] mono text-[#86868B]">Kerala State Portal Application</div>
            </div>
            <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-white/5">Circular</span>
          </div>

          {/* Notice 3 */}
          <div className="p-3 bg-[#16181B]/60 border border-white/5 rounded-xl flex items-center justify-between text-xs text-[#86868B]">
            <div>
              <div className="text-white/90 truncate">Vocational Results Published</div>
              <div className="text-[10px] mono text-[#86868B]">Official Gazetted Ledger</div>
            </div>
            <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-white/5">Notices</span>
          </div>
        </div>

        {/* Portal Footer row */}
        <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] mono text-[#86868B]">
          <span>Kerala State Education Board</span>
          <span className="text-white font-medium">Verified Official Site</span>
        </div>
      </motion.div>
    </div>
  )
})

// 05: Hush Chat - WhatsApp-style Mobile Messaging App
export const HushChatUI = memo(function HushChatUI({
  className = '',
  image,
  inView: propInView,
}: {
  className?: string
  image?: string
  inView?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const [isReduced, setIsReduced] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const active = useIsActive(containerRef, propInView)

  useEffect(() => {
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (image && !imgFailed) {
    return (
      <div className={`relative w-full h-full bg-[#0A0A0C] overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={image}
          alt="Hush Chat screen"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setCycleKey((k) => k + 1)}
      className={`relative w-full h-full bg-gradient-to-b from-[#111215] to-[#0A0A0C] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 select-none ${className}`}
    >
      <style>{`
        @keyframes hushType {
          0%, 15% { width: 0; opacity: 0; }
          20% { opacity: 1; }
          48%, 62% { width: 88px; opacity: 1; }
          65%, 100% { width: 0; opacity: 0; }
        }
        @keyframes hushPlaceholder {
          0%, 15% { opacity: 1; }
          22%, 62% { opacity: 0; }
          67%, 100% { opacity: 1; }
        }
        @keyframes hushBtnPress {
          0%, 58% { transform: scale(1); }
          62% { transform: scale(0.86); }
          68%, 100% { transform: scale(1); }
        }
        @keyframes hushBubbleSlide {
          0%, 64% {
            opacity: 0;
            transform: translateY(12px);
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-top: 0;
            pointer-events: none;
          }
          70%, 88% {
            opacity: 1;
            transform: translateY(0);
            max-height: 50px;
            padding-top: 8px;
            padding-bottom: 8px;
            margin-top: 6px;
          }
          94%, 100% {
            opacity: 0;
            transform: translateY(-4px);
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-top: 0;
          }
        }
      `}</style>

      {/* Top Dynamic Island / Phone Telemetry Header */}
      <div className="space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] mono text-[#86868B] px-1">
          <span>9:41</span>
          <div className="w-16 h-3.5 bg-black rounded-full" />
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <div className="w-3.5 h-2 border border-[#86868B] rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-[#86868B]" />
            </div>
          </div>
        </div>

        {/* Top App Bar: Back arrow, round avatar 'A', name 'Alex' (NO status/online text) */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#16181B] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <div className="w-8 h-8 rounded-full bg-[#FF5B1F]/20 border border-[#FF5B1F]/40 flex items-center justify-center text-xs font-bold text-[#FF5B1F] shrink-0">
              A
            </div>
            <span className="text-sm font-semibold text-[#F5F5F7] tracking-tight">Alex</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#86868B] pr-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Message Area: exactly 3 base bubbles + animated sent bubble */}
      <div key={cycleKey} className="flex-1 my-2 rounded-2xl border border-white/5 bg-[#070709] p-3 flex flex-col justify-end gap-2.5 overflow-hidden">
        {/* Bubble 1 (received: 'Hey, are you free later?') */}
        <div className="self-start max-w-[84%] px-3.5 py-2 rounded-2xl rounded-tl-sm bg-[#181A1D] border border-white/5 text-xs text-[#F5F5F7] leading-relaxed shadow-sm">
          Hey, are you free later?
        </div>

        {/* Bubble 2 (sent: 'Yes, let\'s talk after 6' with single small check icon) */}
        <div className="self-end max-w-[84%] px-3.5 py-2 rounded-2xl rounded-tr-sm bg-[#FF5B1F]/20 border border-[#FF5B1F]/40 text-xs text-[#F5F5F7] leading-relaxed shadow-sm flex items-end gap-1.5">
          <span>Yes, let's talk after 6</span>
          <svg className="w-3.5 h-3.5 text-[#FF5B1F] shrink-0 pb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Bubble 3 (one more short received line) */}
        <div className="self-start max-w-[84%] px-3.5 py-2 rounded-2xl rounded-tl-sm bg-[#181A1D] border border-white/5 text-xs text-[#F5F5F7] leading-relaxed shadow-sm">
          Sounds good!
        </div>

        {/* Bubble 4 (animated slide up bubble sent on loop) */}
        {!isReduced && (
          <div
            style={{
              animationPlayState: active ? 'running' : 'paused',
              animation: 'hushBubbleSlide 3.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
            }}
            className="self-end max-w-[84%] px-3.5 rounded-2xl rounded-tr-sm bg-[#FF5B1F]/20 border border-[#FF5B1F]/40 text-xs text-[#F5F5F7] leading-relaxed shadow-sm flex items-end gap-1.5 overflow-hidden"
          >
            <span>See you then</span>
            <svg className="w-3.5 h-3.5 text-[#FF5B1F] shrink-0 pb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Composer: text field 'Type a message' and round accent send button */}
      <div key={`comp-${cycleKey}`} className="pt-1 shrink-0">
        <div className="flex items-center gap-2">
          {/* Text Field */}
          <div className="flex-1 min-w-0 h-10 px-3.5 bg-[#16181B] border border-white/10 rounded-full flex items-center relative overflow-hidden text-xs">
            <span
              style={{
                animationPlayState: active ? 'running' : 'paused',
                animation: isReduced ? 'none' : 'hushPlaceholder 3.6s ease-in-out infinite',
              }}
              className="text-[#86868B] truncate pointer-events-none absolute left-3.5 select-none"
            >
              Type a message
            </span>

            {!isReduced && (
              <div
                style={{
                  animationPlayState: active ? 'running' : 'paused',
                  animation: 'hushType 3.6s ease-in-out infinite',
                }}
                className="text-[#F5F5F7] whitespace-nowrap overflow-hidden flex items-center"
              >
                <span>See you then</span>
                <span className="w-1.5 h-3.5 bg-[#FF5B1F] ml-0.5 inline-block" />
              </div>
            )}
          </div>

          {/* Round accent send button */}
          <div
            style={{
              animationPlayState: active ? 'running' : 'paused',
              animation: isReduced ? 'none' : 'hushBtnPress 3.6s ease-in-out infinite',
            }}
            className="w-10 h-10 rounded-full bg-[#FF5B1F] flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(255,91,31,0.35)]"
          >
            <svg className="w-4 h-4 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
})

// Router component to pick corresponding visual (memoized)
const ProjectVisual = memo(function ProjectVisual({ id, className = '', image, inView }: VisualProps) {
  switch (id) {
    case 1:
      return <SecondSightUI className={className} image={image} inView={inView} />
    case 2:
      return <SmartFindUI className={className} image={image} inView={inView} />
    case 3:
      return <PharmacyBillingUI className={className} image={image} inView={inView} />
    case 4:
      return <SchoolWebsiteUI className={className} image={image} inView={inView} />
    case 5:
      return <HushChatUI className={className} image={image} inView={inView} />
    default:
      return <SmartFindUI className={className} image={image} inView={inView} />
  }
})

export default ProjectVisual

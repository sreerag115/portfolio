import React, { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const aboutStatement =
  'Final-year Computer Science student building full-stack web and mobile apps backed by data and machine learning.'

function ScrollWord({
  word,
  range,
  progress,
  isReduced,
}: {
  word: string
  range: [number, number]
  progress: any
  isReduced: boolean
}) {
  const opacity = useTransform(progress, range, [0.35, 1])
  const color = useTransform(progress, range, ['#86868B', '#F5F5F7'])

  if (isReduced) {
    return <span className="inline-block mr-2 text-[#F5F5F7]">{word}</span>
  }

  return (
    <motion.span style={{ opacity, color }} className="inline-block mr-2 sm:mr-2.5 transition-colors">
      {word}
    </motion.span>
  )
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statementRef = useRef<HTMLHeadingElement>(null)
  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ['start 92%', 'center 50%'],
  })

  const words = aboutStatement.split(' ')

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-[clamp(48px,7vh,80px)] bg-transparent border-t border-white/[0.08] scroll-mt-14"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        {/* ========================================================= */}
        {/* 1. SECTION LABEL                                          */}
        {/* ========================================================= */}
        <div className="fade-block mb-6">
          <div className="flex items-center gap-2">
            <span className="mono text-[12px] uppercase tracking-widest text-[#FF5B1F] font-semibold">
              02 // About
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_8px_#FF5B1F]" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. BIG STATEMENT (clamp(26px, 3.2vw, 44px), line-height 1.2) */}
        {/* ========================================================= */}
        <div className="fade-block mb-10 max-w-5xl">
          <h2
            ref={statementRef}
            data-cursor="hover"
            style={{
              fontSize: 'clamp(26px, 3.2vw, 44px)',
              lineHeight: 1.2,
            }}
            className="font-semibold tracking-[-0.03em] text-[#F5F5F7]"
          >
            {words.map((word, i) => {
              const start = (i / words.length) * 0.85
              const end = start + (1 / words.length) * 0.85
              return (
                <React.Fragment key={i}>
                  <ScrollWord
                    word={word}
                    range={[start, end]}
                    progress={scrollYProgress}
                    isReduced={isReduced}
                  />
                  {' '}
                </React.Fragment>
              )
            })}
          </h2>
        </div>

        {/* ========================================================= */}
        {/* 3. TWO-COLUMN LAYOUT (Single column on mobile)            */}
        {/* Left: Paragraph (16px, line-height 1.65)                  */}
        {/* Right: 3 Info Blocks in Skills tile style (24px radius)   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch mb-5">
          {/* LEFT COLUMN: Editorial Paragraph Card */}
          <div
            onPointerMove={handlePointerMove}
            className="fade-block bento-tile lg:col-span-7 bg-[#0E0F11] border border-white/[0.08] rounded-[24px] p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <span className="mono text-[12px] uppercase tracking-wider text-[#86868B] font-semibold block mb-4">
                BACKGROUND & APPROACH
              </span>
              <p
                style={{ fontSize: '16px', lineHeight: 1.65 }}
                className="text-[#86868B] font-normal"
              >
                I work across the stack: React and Node on the web, Flutter for mobile, and FastAPI with Python for ML-backed services. I have built an object-detection app for visually impaired users, a lost-and-found platform that matches items with image and text embeddings, an offline pharmacy billing system, a school website, and a WhatsApp-style messaging app that I am still building. Through internships I have worked with Google BigQuery for data warehousing, Python development and front-end web development. I am looking for an entry-level software or data role.
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.06] mt-6 flex items-center justify-between mono text-[12px] text-[#86868B]">
              <span className="flex items-center gap-1.5 text-[#F5F5F7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F]" />
                <span>Entry-level Software & Data</span>
              </span>
              <span>KTU CS · 2027</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3 Compact Info Blocks */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {/* a) FOCUS */}
            <div
              onPointerMove={handlePointerMove}
              className="fade-block bento-tile bg-[#0E0F11] border border-white/[0.08] rounded-[24px] p-5 flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <span className="mono text-[12px] uppercase tracking-wider text-[#FF5B1F] font-semibold">
                  FOCUS
                </span>
                <span className="mono text-[11px] text-[#86868B]/70 font-semibold">01</span>
              </div>
              <ul className="space-y-1.5 text-sm text-[#F5F5F7] font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F]" />
                  <span>Full-stack web and mobile</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F]" />
                  <span>Data warehousing with BigQuery</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F]" />
                  <span>ML and computer vision</span>
                </li>
              </ul>
            </div>

            {/* b) EDUCATION */}
            <div
              onPointerMove={handlePointerMove}
              className="fade-block bento-tile bg-[#0E0F11] border border-white/[0.08] rounded-[24px] p-5 flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <span className="mono text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
                  EDUCATION
                </span>
                <span className="mono text-[11px] text-[#86868B]/70 font-semibold">02</span>
              </div>
              <ul className="space-y-1.5 text-sm text-[#F5F5F7] font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86868B] mt-1.5 shrink-0" />
                  <span>B.Tech Computer Science, KTU (2023 – 2027, expected)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86868B] mt-1.5 shrink-0" />
                  <span>Higher Secondary, Ezhur Govt. Higher Secondary School</span>
                </li>
              </ul>
            </div>

            {/* c) BEYOND CODE */}
            <div
              onPointerMove={handlePointerMove}
              className="fade-block bento-tile bg-[#0E0F11] border border-white/[0.08] rounded-[24px] p-5 flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <span className="mono text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
                  BEYOND CODE
                </span>
                <span className="mono text-[11px] text-[#86868B]/70 font-semibold">03</span>
              </div>
              <ul className="space-y-1.5 text-sm text-[#F5F5F7] font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86868B] mt-1.5 shrink-0" />
                  <span>Smart India Hackathon, institution-level selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86868B] mt-1.5 shrink-0" />
                  <span>FugenHack 4.0, participant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86868B] mt-1.5 shrink-0" />
                  <span>Techfest & KETCON 2024 cloud security workshop</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. SLIM STAT ROW (3 small stat tiles with real counts)    */}
        {/* ========================================================= */}
        <div className="fade-block grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div
            onPointerMove={handlePointerMove}
            className="bento-tile bg-[#0E0F11] border border-white/[0.08] rounded-[20px] p-4 flex items-center gap-4"
          >
            <span className="mono text-2xl font-bold text-[#FF5B1F]">3</span>
            <div className="flex flex-col">
              <span className="text-sm text-[#F5F5F7] font-medium">internships</span>
              <span className="mono text-[11px] text-[#86868B]">completed</span>
            </div>
          </div>

          <div
            onPointerMove={handlePointerMove}
            className="bento-tile bg-[#0E0F11] border border-white/[0.08] rounded-[20px] p-4 flex items-center gap-4"
          >
            <span className="mono text-2xl font-bold text-[#FF5B1F]">5</span>
            <div className="flex flex-col">
              <span className="text-sm text-[#F5F5F7] font-medium">projects</span>
              <span className="mono text-[11px] text-[#86868B]">featured</span>
            </div>
          </div>

          <div
            onPointerMove={handlePointerMove}
            className="bento-tile bg-[#0E0F11] border border-white/[0.08] rounded-[20px] p-4 flex items-center gap-4"
          >
            <span className="mono text-2xl font-bold text-[#FF5B1F]">3</span>
            <div className="flex flex-col">
              <span className="text-sm text-[#F5F5F7] font-medium">hackathons and workshops</span>
              <span className="mono text-[11px] text-[#86868B]">attended</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

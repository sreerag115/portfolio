import { achievements } from '../data/achievements'

export default function Achievements() {
  const featured = achievements[0]
  const credentials = achievements.slice(3) // Cloud security, SCAD 2026, IEDC, AI fundamentals

  return (
    <section id="achievements" className="py-[clamp(48px,7vh,80px)] bg-transparent border-b border-white/[0.08] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Eyebrow & Headline */}
        <div className="fade-block mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#86868B] block mb-3">
            05 // ACHIEVEMENTS & CREDENTIALS
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F5F5F7]">
            Proof of execution.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#86868B] max-w-2xl leading-relaxed">
            Competitive results and verified credentials in software engineering, data systems, and applied artificial intelligence.
          </p>
        </div>

        {/* Highlight Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Featured Distinction Card */}
          <div
            data-cursor="hover"
            className="fade-block lg:col-span-6 bg-[#0E0F11]/80 border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col justify-between hover-lift"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#FF5B1F] bg-[#FF5B1F]/10 px-3 py-1 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F]" />
                  First Prize Gold
                </span>
                <span className="font-mono text-xs text-[#86868B]">
                  2026
                </span>
              </div>
              <div className="text-6xl sm:text-7xl font-bold tracking-tight text-[#FF5B1F] mb-4">
                1st
              </div>
              <h3 className="text-2xl font-semibold text-[#F5F5F7] tracking-tight mb-2">
                {featured.event}
              </h3>
              <p className="text-sm font-mono text-[#86868B] mb-4">
                {featured.organization}
              </p>
            </div>
            <p className="text-sm sm:text-base text-[#86868B] leading-relaxed border-t border-white/[0.08] pt-6 mt-4">
              {featured.description}
            </p>
          </div>

          {/* Secondary Metric Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* SIH Card */}
            <div data-cursor="hover" className="fade-block bg-[#0E0F11]/80 border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between hover-lift">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#86868B]">
                    National Hackathon
                  </span>
                  <span className="font-mono text-xs text-[#86868B]">
                    2024
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7] mb-3">
                  SIH
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F7] tracking-tight mb-1">
                  Institutional Selection
                </h3>
                <p className="text-xs font-mono text-[#86868B]">
                  Smart India Hackathon · AICTE
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed border-t border-white/[0.08] pt-4 mt-6">
                Selected at institution level to represent the college for nationwide engineering problem statements.
              </p>
            </div>

            {/* Sprints & Workshops Card */}
            <div data-cursor="hover" className="fade-block bg-[#0E0F11]/80 border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between hover-lift">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#86868B]">
                    Events & Sprints
                  </span>
                  <span className="font-mono text-xs text-[#86868B]">
                    2024 – 2026
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7] mb-3">
                  4
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F7] tracking-tight mb-1">
                  Hackathons & Summits
                </h3>
                <p className="text-xs font-mono text-[#86868B]">
                  FugenHack, KSUM, Techfest
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed border-t border-white/[0.08] pt-4 mt-6">
                Active participant in 24-hour sprint hackathons, startup summits, and cloud security labs.
              </p>
            </div>
          </div>
        </div>

        {/* Certifications & Conferences List */}
        <div className="fade-block mt-16">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[#86868B] mb-6">
            Certifications & Conferences
          </h3>
          <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
            {credentials.map((item) => (
              <div
                key={item.id}
                className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-colors duration-200 hover:bg-[#0E0F11]/40 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="text-base sm:text-lg font-medium text-[#F5F5F7]">
                      {item.title}
                    </span>
                    <span className="text-sm text-[#86868B]">
                      · {item.organization}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#86868B] line-clamp-1">
                    {item.event}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-[#86868B] border border-white/[0.08] px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                  <span className="font-mono text-xs text-[#86868B]">
                    {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

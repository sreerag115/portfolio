import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="py-[clamp(48px,7vh,80px)] bg-transparent border-b border-white/[0.08] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Eyebrow & Headline */}
        <div className="fade-block mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#86868B] block mb-3">
            05 // EXPERIENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F5F5F7]">
            Work experience.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#86868B] max-w-2xl leading-relaxed">
            Three industry internships focused on data warehousing, backend logic, and responsive web systems.
          </p>
        </div>

        {/* 3 Full-Width Rows */}
        <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
          {experiences.map((exp) => (
            <article
              key={exp.id}
              data-cursor="hover"
              className="fade-block py-10 md:py-12 group transition-colors duration-300 hover:bg-[#0E0F11]/40 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                {/* Date Column */}
                <div className="md:col-span-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#86868B] font-medium block pt-1">
                    {exp.period}
                  </span>
                </div>

                {/* Role, Company, Location & Points */}
                <div className="md:col-span-9">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#F5F5F7] tracking-tight">
                      {exp.role}
                    </h3>
                    <span className="text-[#86868B] text-base sm:text-lg font-normal">
                      · {exp.company}
                    </span>
                    <span className="font-mono text-[11px] text-[#86868B] border border-white/[0.08] px-2.5 py-0.5 rounded-full ml-auto sm:ml-0">
                      {exp.location}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mt-3">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#86868B] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shrink-0 mt-2" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

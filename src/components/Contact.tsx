import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!form.email.trim()) {
      errs.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim()) errs.message = 'Please enter a message.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:sreeragmadhav.k@gmail.com?subject=${subject}&body=${body}`
  }

  const scrollToTop = () => {
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer id="contact" className="py-[clamp(40px,6vh,64px)] bg-transparent border-t border-white/[0.08] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-between min-h-[calc(100svh-120px)] lg:min-h-0">
        {/* Two Columns Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-10 sm:pb-12">
          {/* Left Column: Heading, Intro, Email & Links */}
          <div className="fade-block lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#86868B] block mb-2">
                06 // CONTACT
              </span>
              <h2 className="text-[clamp(36px,5vw,72px)] font-bold tracking-tight text-[#F5F5F7] leading-[1.08] mb-3">
                Let's build something<span className="text-[#FF5B1F]">.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#86868B] leading-relaxed max-w-md">
                Open to full-time engineering roles, data warehousing positions, and applied machine learning projects.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#86868B] block mb-1">
                  Direct Email
                </span>
                <a
                  href="mailto:sreeragmadhav.k@gmail.com"
                  data-cursor="hover"
                  className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-[#F5F5F7] hover:text-white underline-draw py-1 inline-flex items-center min-h-[44px]"
                >
                  sreeragmadhav.k@gmail.com
                </a>
              </div>

              {/* Text Links */}
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-mono text-[#86868B] pt-1">
                <a
                  href="https://www.linkedin.com/in/sreeragk2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="hover:text-[#FF5B1F] transition-colors inline-flex items-center gap-1.5 py-1 min-h-[44px]"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://github.com/SreeragK2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="hover:text-[#FF5B1F] transition-colors inline-flex items-center gap-1.5 py-1 min-h-[44px]"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
                <a
                  href="/Sreerag_K_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="hover:text-[#FF5B1F] transition-colors inline-flex items-center gap-1.5 py-1 min-h-[44px]"
                >
                  <span>Resume</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Compact Form */}
          <div className="fade-block lg:col-span-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#86868B] mb-5">
              Send a message
            </h3>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-[#86868B] mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  placeholder="Your name"
                  className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F5F7] text-sm sm:text-base py-2.5 px-0 placeholder-[#86868B]/40 focus:outline-none focus:border-[#FF5B1F] focus:ring-0 transition-colors"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-[#FF5B1F] font-mono">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-[#86868B] mb-1">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  placeholder="your.email@example.com"
                  className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F5F7] text-sm sm:text-base py-2.5 px-0 placeholder-[#86868B]/40 focus:outline-none focus:border-[#FF5B1F] focus:ring-0 transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#FF5B1F] font-mono">{errors.email}</p>
                )}
              </div>

              {/* Message (3 rows) */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-[#86868B] mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: '' })
                  }}
                  placeholder="Tell me about your role or project"
                  className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F5F7] text-sm sm:text-base py-2 px-0 placeholder-[#86868B]/40 focus:outline-none focus:border-[#FF5B1F] focus:ring-0 transition-colors resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-[#FF5B1F] font-mono">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                data-cursor="hover"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FF5B1F] text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#ff6c36] active:scale-[0.98] transition-all shadow-md shadow-[#FF5B1F]/20 cursor-pointer min-h-[44px]"
              >
                Send message
              </button>
            </form>
          </div>
        </div>

        {/* Footer: One slim row about 64px */}
        <div className="fade-block fade-block--no-out h-16 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#86868B]">
          <div>
            Sreerag K · Malappuram, Kerala · 2026
          </div>
          <button
            onClick={scrollToTop}
            data-cursor="hover"
            className="hover:text-[#F5F5F7] transition-colors cursor-pointer py-2 px-3 rounded hover:bg-white/[0.04] min-h-[44px] flex items-center"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}

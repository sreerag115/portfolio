import React, { useRef, useCallback, memo } from 'react'

// ============================================================================
// OFFICIAL CRISP LOGOS & LUCIDE SOFT SKILL ICONS (28px SVGs)
// ============================================================================

const Logos: Record<string, () => React.JSX.Element> = {
  // --- TECHNICAL LOGOS (28px authentic brand vectors) ---
  Python: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#3776AB" d="M11.927 0C8.356 0 8.587 1.545 8.587 1.545l.006 1.6H12v.48H4.664S2 3.322 2 6.943c0 3.623 2.327 3.5 2.327 3.5h1.391V8.47s-.075-2.378 2.336-2.378h3.987s2.26.037 2.26-2.204V1.545S14.54 0 11.927 0zm-1.89 1.157a.71.71 0 1 1 0 1.42.71.71 0 0 1 0-1.42z" />
      <path fill="#FFD43B" d="M12.073 24c3.57 0 3.34-1.545 3.34-1.545l-.006-1.6H12v-.48h7.336s2.664.303 2.664-3.318c0-3.623-2.327-3.5-2.327-3.5h-1.391v1.973s.075 2.378-2.336 2.378h-3.987s-2.26-.037-2.26 2.204v2.342S9.46 24 12.073 24zm1.89-1.157a.71.71 0 1 1 0-1.42.71.71 0 0 1 0-1.42z" />
    </svg>
  ),
  SQL: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#00758F" d="M12 3C7.58 3 4 4.34 4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6c0-1.66-3.58-3-8-3zm0 2c3.87 0 6 1.05 6 1s-2.13 1-6 1-6-1.05-6-1 2.13-1 6-1zm6 13c0 .05-2.13 1-6 1s-6-.95-6-1v-2.19c1.55.74 3.7 1.19 6 1.19s4.45-.45 6-1.19V18zm0-4c0 .05-2.13 1-6 1s-6-.95-6-1v-2.19c1.55.74 3.7 1.19 6 1.19s4.45-.45 6-1.19V14zm0-4c0 .05-2.13 1-6 1s-6-.95-6-1V7.81c1.55.74 3.7 1.19 6 1.19s4.45-.45 6-1.19V10z" />
    </svg>
  ),
  Dart: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#0175C2" d="M4.1 4.1h7.8L2.4 13.5l1.7-9.4zm15.8 4.7L15.2 4.1H7.4l12.5 12.5v-7.8z" />
      <path fill="#02569B" d="M19.9 8.8L12.5 1.4H4.7l15.2 15.2v-7.8z" />
      <path fill="#40C4FF" d="M19.9 16.6L12.5 24H4.7l7.8-7.8 7.4.4z" />
    </svg>
  ),
  JavaScript: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path fill="#000000" d="M6.5 18.2l2.3-1.4c.5.8 1 1.4 1.8 1.4.9 0 1.5-.4 1.5-1.4V10h2.9v6.8c0 2.5-1.5 3.6-3.8 3.6-2 0-3.3-1-4.7-2.2zm9.1-1.2l2.3-1.3c.6.9 1.4 1.6 2.5 1.6 1.1 0 1.8-.5 1.8-1.2 0-.8-.7-1.1-2-1.7l-.7-.3c-2-.9-3.3-1.9-3.3-4.1 0-2.1 1.6-3.6 4.1-3.6 1.8 0 3.1.6 4.1 2.2l-2.2 1.4c-.5-.8-1-1.2-1.9-1.2-.9 0-1.5.5-1.5 1.1 0 .7.6 1 1.8 1.5l.7.3c2.3 1 3.5 2.1 3.5 4.3 0 2.5-1.9 3.8-4.5 3.8-2.6 0-4.1-1.2-4.7-2.9z" />
    </svg>
  ),
  Java: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#5382A1" d="M9.1 17.5c-.8.1-1.5.1-2.2.1-2.7 0-3.4-.6-3.4-1.4 0-.6.4-1.2 1.5-1.6.4-.1.8-.3 1.3-.4-1.8.4-2.8 1.1-2.8 2 0 1.3 1.7 2 4.5 2 1 0 1.8 0 2.4-.2l-1.3-.5z" />
      <path fill="#ED8B00" d="M14.5 11.2c.4-1.8-.3-3.6-1.5-4.8-.4-.4-.8-.7-1.3-1 .2.7.2 1.5-.1 2.2-.4 1-1.2 1.8-1.5 2.9-.4 1.1-.3 2.5.4 3.5.7 1 1.9 1.5 3 2.1 1.2.6 2.3 1.4 2.8 2.7.1.3.2.7.2 1 1-.9 1.6-2.3 1.4-3.6-.3-1.8-2.2-2.9-3.5-3.6-1.1-.6-1.5-1.3-1.3-2 .2-.6.7-1 1.4-1.4z" />
      <path fill="#5382A1" d="M18.8 16.9c-.8-.5-2.2-.8-3.7-.8-1.2 0-2.5.2-3.6.4l.6.6c.9-.2 1.9-.3 2.9-.3 1.3 0 2.4.2 3.1.6.8.5.8 1.1.2 1.5-1 .7-3.1 1-5.6 1-1.8 0-3.5-.2-4.7-.6-.2-.1-.5-.1-.7-.2l-.6.6c.7.2 1.7.4 2.7.5 1.5.2 3.1.2 4.7.1 2.9-.1 5.3-.6 6.5-1.5 1.3-.9 1.1-2-.1-2.9z" />
      <path fill="#ED8B00" d="M10.8 1.8c.3.8.3 1.8-.1 2.6-.5.9-1.3 1.6-1.8 2.5-.5.9-.6 2.1-.2 3.1.5 1.2 1.5 1.9 2.5 2.7 1.3 1 2.5 2.2 2.6 3.8.1.5 0 1.1-.2 1.6 1.1-.9 1.6-2.3 1.3-3.7-.4-1.8-2-2.9-3.3-3.8-.9-.7-1.5-1.4-1.4-2.2.1-.8.7-1.4 1.3-2 .5-.5.7-1.1.6-1.7-.1-.9-.6-1.8-1.3-2.9z" />
    </svg>
  ),
  'C++': () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#00599C" d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21c3.1 0 5.86-1.49 7.6-3.8l-2.93-2.2c-1.15 1.38-2.8 2.2-4.67 2.2-3.15 0-5.7-2.55-5.7-5.7s2.55-5.7 5.7-5.7c1.87 0 3.52.82 4.67 2.2l2.93-2.2C17.36 3.49 14.6 2 11.5 2zm9 7v2h2v1h-2v2h-1v-2h-2v-1h2V9h1zm-5 0v2h2v1h-2v2h-1v-2h-2v-1h2V9h1z" />
    </svg>
  ),
  C: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#00599C" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c3.27 0 6.18-1.57 8-4l-3.08-2.31C15.7 17.15 13.97 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.97 0 3.7.85 4.92 2.31L20 6c-1.82-2.43-4.73-4-8-4z" />
    </svg>
  ),
  HTML: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#E34F26" d="M2 3l2 18 8 2 8-2 2-18H2zm15.4 5.3h-7l.2 2.2h6.6l-.6 6.3-4.6 1.3-4.6-1.3-.3-3.6h2.2l.1 1.8 2.6.7 2.6-.7.3-3.3H5.8L5.2 6h12.5l-.3 2.3z" />
    </svg>
  ),
  CSS: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#1572B6" d="M2 3l2 18 8 2 8-2 2-18H2zm15.4 5.3h-7l.2 2.2h6.6l-.6 6.3-4.6 1.3-4.6-1.3-.3-3.6h2.2l.1 1.8 2.6.7 2.6-.7.3-3.3H5.8L5.2 6h12.5l-.3 2.3z" />
    </svg>
  ),
  BigQuery: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18h-2v-1.07A6 6 0 0 1 6.07 12H5v-2h1.07A6 6 0 0 1 11 4.93V4h2v.93A6 6 0 0 1 17.93 10H19v2h-1.07A6 6 0 0 1 13 16.93zM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5z" />
      <circle cx="12" cy="12" r="2.5" fill="#669DF6" />
    </svg>
  ),
  PyTorch: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#EE4C2C" d="M12.7 1.2a9.6 9.6 0 0 0-4.6 1.2L9.4 4a8 8 0 1 1-5.6 7.7H2a9.8 9.8 0 0 0 10.7 9.8 9.9 9.9 0 0 0 9.8-9.9c0-5.4-4.4-9.9-9.8-10.4zm2.1 4.3a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
    </svg>
  ),
  'OpenAI CLIP': () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="#10A37F">
      <path d="M22.28 9.87a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.1a6.05 6.05 0 0 0-3.3 6.3 5.98 5.98 0 0 0 .52 4.91 6.05 6.05 0 0 0 6.51 2.9 6.07 6.07 0 0 0 10.27-2.14 6.05 6.05 0 0 0 3.3-6.2zm-9.02 11.23a4.57 4.57 0 0 1-2.92-1.05l.14-.08 4.8-2.77a.75.75 0 0 0 .38-.65v-6.78l2.04 1.18v5.57a4.59 4.59 0 0 1-4.44 4.58zm-7.65-3.41a4.56 4.56 0 0 1-.55-3.05l.14.09 4.8 2.77a.75.75 0 0 0 .76 0l5.87-3.39v2.36l-4.83 2.79a4.59 4.59 0 0 1-6.19-1.57zm-1.42-7.53a4.55 4.55 0 0 1 2.37-2l.01.16v5.54a.75.75 0 0 0 .38.65l5.87 3.39-2.04 1.18-4.83-2.79a4.59 4.59 0 0 1-1.76-6.13zm13.1-2.16l-4.8 2.77a.75.75 0 0 0-.76 0L5.86 7.38V5.02l4.83-2.79a4.59 4.59 0 0 1 6.19 1.57c.4.7.63 1.48.66 2.27l-.14-.09zm2.84 5.21a4.55 4.55 0 0 1-2.37 2v-5.54a.75.75 0 0 0-.38-.65L11.58 6.1l2.04-1.18 4.83 2.79a4.59 4.59 0 0 1 1.68 4.3zM9.54 13.5l2.46-1.42 2.46 1.42v2.84l-2.46 1.42-2.46-1.42z" />
    </svg>
  ),
  'Sentence Transformers': () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#FFD21E" />
      <path fill="#000" d="M8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-7.6 3.8a.7.7 0 0 1 1-.2c1.9 1.2 4.3 1.2 6.2 0a.7.7 0 1 1 .8 1.2c-2.3 1.5-5.3 1.5-7.8 0a.7.7 0 0 1-.2-1z" />
      <path fill="#FF9D00" d="M4 14c1 2 3 4 5 4s3-1 3-3-1-2-3-2-4 0-5 1zm16 0c-1 2-3 4-5 4s-3-1-3-3 1-2 3-2 4 0 5 1z" opacity="0.6" />
    </svg>
  ),
  'Scikit-learn': () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#F89939" d="M12 2l-7 8 7 4 4-5-4-7z" />
      <path fill="#3499CD" d="M12 22l7-8-7-4-4 5 4 7z" />
      <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
    </svg>
  ),
  'Google ML Kit': () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.3L18.1 8 12 11.7 5.9 8 12 4.3z" />
      <path fill="#34A853" d="M5 9.3l6 3.7v7.2L5 16.5V9.3z" />
      <path fill="#EA4335" d="M13 13v7.2l6-3.7V9.3l-6 3.7z" />
    </svg>
  ),
  React: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
    </svg>
  ),
  Flutter: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#02569B" d="M14.314 0L2.3 12 6 15.7 21.686 0z" />
      <path fill="#0175C2" d="M14.314 10.686L8.614 16.386 12.314 20.086 21.686 10.686z" />
      <path fill="#29B6F6" d="M8.614 16.386L12.314 12.686 16.014 16.386 12.314 20.086z" />
      <path fill="#01579B" d="M12.314 20.086L16.014 23.786 21.686 18.114 18 14.4z" />
    </svg>
  ),
  Firebase: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#FFA000" d="M3.89 15.672L6.255.461A.54.54 0 0 1 7.27.24l3.543 6.643-6.923 8.79z" />
      <path fill="#F57C00" d="M13.843 8.749L10.813 3.09a.542.542 0 0 0-.965 0l-8.03 15.04 12.025-9.38z" />
      <path fill="#FFCA28" d="M22.185 18.13L19.467 4.975a.541.541 0 0 0-.934-.287L1.818 18.13l9.025 5.11a2.38 2.38 0 0 0 2.314 0l9.028-5.11z" />
    </svg>
  ),
  Supabase: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#3ECF8E" d="M11.35 0c-.4 0-.75.25-.88.63L7.04 10.27a.93.93 0 0 0 .88 1.23h5.95l-5.22 11.87a.93.93 0 0 0 1.63.85l9.25-11.41a.93.93 0 0 0-.72-1.51h-5.46l4.77-10.68A.93.93 0 0 0 17.25 0H11.35z" />
    </svg>
  ),
  FastAPI: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#05998B" />
      <path fill="#FFFFFF" d="M12.8 4L6 13.5h5.2L10.2 20 18 10.5h-5.2L12.8 4z" />
    </svg>
  ),
  'Node.js': () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#5FA04E" d="M12 1.5l10 5.8v11.4l-10 5.8-10-5.8V7.3L12 1.5zm0 2.3L4 8.4v9.2l8 4.6 8-4.6V8.4l-8-4.6z" />
      <path fill="#5FA04E" d="M11 7h2v10h-2z" />
    </svg>
  ),
  'Express.js': () => (
    /* Crisp light variant for dark UI */
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="5" fill="#20232A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="12" y="16" fill="#F5F5F7" fontSize="11" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">ex</text>
    </svg>
  ),
  MongoDB: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#47A248" d="M12 1.5s-5.5 5.5-5.5 11c0 4.1 3.4 7.5 5.5 10 2.1-2.5 5.5-5.9 5.5-10 0-5.5-5.5-11-5.5-11zm0 18.5c-.5 0-1-.2-1.3-.6-.7-.8-1.7-2.3-1.7-4.4 0-2.8 3-6.8 3-6.8s3 4 3 6.8c0 2.1-1 3.6-1.7 4.4-.3.4-.8.6-1.3.6z" />
    </svg>
  ),
  SQLite: () => (
    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
      <path fill="#003B57" d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 2c4.42 0 8 1.57 8 3s-3.58 3-8 3-8-1.57-8-3 3.58-3 8-3zm8 13c0 1.43-3.58 3-8 3s-8-1.57-8-3v-2.2c1.78 1.34 4.7 2.2 8 2.2s6.22-.86 8-2.2V17zm0-4c0 1.43-3.58 3-8 3s-8-1.57-8-3v-2.2c1.78 1.34 4.7 2.2 8 2.2s6.22-.86 8-2.2V13z" />
      <path fill="#00A9E0" d="M12 4c4.42 0 8 1.57 8 3s-3.58 3-8 3-8-1.57-8-3 3.58-3 8-3z" />
    </svg>
  ),

  // --- 7 SOFT SKILL ACCENT LINE ICONS (20px Lucide specs, stroke #FF5B1F) ---
  Communication: () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  Teamwork: () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  'Problem-Solving': () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.439 7.85c-.049-.955-.24-1.226-1.07-1.426l-2.49-.603c-.352-.085-.607-.384-.632-.746a3.5 3.5 0 0 0-6.494 0c-.025.362-.28.661-.632.746l-2.49.603c-.83.2-1.021.471-1.07 1.426l-.248 4.814c-.019.363-.264.667-.61.76a3.5 3.5 0 0 0 0 6.55c.346.093.591.397.61.76l.248 4.814c.049.955.24 1.226 1.07 1.426l2.49.603c.352.085.607.384.632.746a3.5 3.5 0 0 0 6.494 0c.025-.362.28-.661.632-.746l2.49-.603c.83-.2 1.021-.471 1.07-1.426l.248-4.814c.019-.363.264-.667.61-.76a3.5 3.5 0 0 0 0-6.55c-.346-.093-.591-.397-.61-.76z" />
    </svg>
  ),
  Adaptability: () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  ),
  'Time Management': () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Leadership: () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  ),
  'Analytic Thinking': () => (
    <svg className="w-5 h-5 text-[#FF5B1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
}

// ============================================================================
// BENTO TILE CONTAINER COMPONENT
// ============================================================================

function BentoTile({
  children,
  className = '',
  featured = false,
  style = {},
  count,
  title,
}: {
  children: React.ReactNode
  className?: string
  featured?: boolean
  style?: React.CSSProperties
  count?: string
  title: string
}) {
  const tileRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const clientX = e.clientX
    const clientY = e.clientY
    rafRef.current = requestAnimationFrame(() => {
      const el = tileRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - rect.left}px`)
      el.style.setProperty('--my', `${clientY - rect.top}px`)
    })
  }, [])

  return (
    <div
      ref={tileRef}
      onPointerMove={handlePointerMove}
      data-cursor="hover"
      style={{
        ...style,
        background: featured
          ? 'radial-gradient(circle at 80% 20%, rgba(255, 91, 31, 0.08) 0%, rgba(14, 15, 17, 1) 70%)'
          : '#0E0F11',
      }}
      className={`bento-tile fade-block flex flex-col justify-between ${
        featured ? 'border-[#FF5B1F]/60 shadow-[0_20px_50px_-15px_rgba(255,91,31,0.15)]' : 'border-white/[0.08]'
      } ${className}`}
    >
      <div className="flex-1 flex flex-col">
        {/* Tile Header: Title & Mono Count Badge */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-5 shrink-0">
          <div className="flex items-center gap-2">
            {featured && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_8px_#FF5B1F]" />}
            <h3 className={`text-sm sm:text-base font-semibold tracking-tight ${featured ? 'text-[#FF5B1F]' : 'text-[#F5F5F7]'}`}>
              {title}
            </h3>
          </div>
          {count && (
            <span className="mono text-xs font-bold text-[#86868B] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {count}
            </span>
          )}
        </div>

        {/* Tile Content */}
        <div className="flex-1 flex flex-col justify-start">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CHIP COMPONENT (Shared across all tiles including Soft Skills)
// Equal heights, radius, border, body font, hover lift 2px with accent border
// ============================================================================

const Chip = memo(function Chip({ name }: { name: string }) {
  const Icon = Logos[name]
  return (
    <div
      data-cursor="hover"
      className="bento-chip min-h-[48px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#16181B]/70 border border-white/5 cursor-pointer w-full"
    >
      <div className="w-7 h-7 shrink-0 flex items-center justify-center">
        {Icon ? <Icon /> : <span className="w-2 h-2 rounded-full bg-[#FF5B1F]" />}
      </div>
      <span className="text-xs sm:text-sm font-medium text-[#F5F5F7] tracking-tight truncate">
        {name}
      </span>
    </div>
  )
})

// ============================================================================
// SKILLS BENTO GRID SECTION
// ============================================================================

export default function Skills() {
  const languages = ['Python', 'SQL', 'Dart', 'JavaScript', 'Java', 'C++', 'C', 'HTML', 'CSS']
  const dataML = ['BigQuery', 'PyTorch', 'OpenAI CLIP', 'Sentence Transformers', 'Scikit-learn', 'Google ML Kit']
  const frameworks = ['React', 'Flutter', 'Firebase', 'Supabase']
  const backend = ['FastAPI', 'Node.js', 'Express.js', 'MongoDB', 'SQLite']
  // EXACTLY the seven soft skills from the resume
  const softSkills = [
    'Communication',
    'Teamwork',
    'Problem-Solving',
    'Adaptability',
    'Time Management',
    'Leadership',
    'Analytic Thinking',
  ]

  return (
    <section id="skills" className="py-[clamp(48px,7vh,80px)] bg-transparent border-t border-white/[0.08] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* ========================================================= */}
        {/* SECTION HEADER                                            */}
        {/* ========================================================= */}
        <div className="fade-block mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="mono text-xs uppercase tracking-widest text-[#FF5B1F] font-semibold">
              03 // Skills
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_8px_#FF5B1F]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] text-[#F5F5F7]">
            Technical stack.
          </h2>
        </div>

        {/* ========================================================= */}
        {/* 12-COLUMN BENTO GRID WITH TWO STRETCHED COLUMNS           */}
        {/* Desktop / Tablet (md: and up): 7 cols Left, 5 cols Right  */}
        {/* Both columns end at the exact same bottom line.           */}
        {/* Mobile (<768px): Single column ordered:                   */}
        {/* 1. Data & ML -> 2. Languages -> 3. Frameworks ->          */}
        {/* 4. Backend   -> 5. Soft Skills                            */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[14px] items-stretch">
          {/* ======================================================= */}
          {/* LEFT COLUMN: 7 cols on md+ (Languages + Frameworks/Backend) */}
          {/* ======================================================= */}
          <div className="contents md:flex md:flex-col md:col-span-7 md:gap-[14px] items-stretch">
            {/* TILE 1: Languages (Top of Left column, Order 2 on mobile) */}
            <BentoTile
              title="Languages"
              count="09"
              className="order-2 md:order-none flex-none"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {languages.map((item) => (
                  <Chip key={item} name={item} />
                ))}
              </div>
            </BentoTile>

            {/* Bottom Row in Left Column: Frameworks (4/7) and Backend (3/7) */}
            <div className="contents md:flex md:gap-[14px] md:flex-1 items-stretch">
              {/* TILE 2: Frameworks (4/7 width on desktop, Order 3 on mobile) */}
              <BentoTile
                title="Frameworks"
                count="04"
                className="order-3 md:order-none md:flex-[4] flex-1 flex flex-col justify-between"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {frameworks.map((item) => (
                    <Chip key={item} name={item} />
                  ))}
                </div>
              </BentoTile>

              {/* TILE 3: Backend (3/7 width on desktop, Order 4 on mobile) */}
              <BentoTile
                title="Backend"
                count="05"
                className="order-4 md:order-none md:flex-[3] flex-1 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-2.5">
                  {backend.map((item) => (
                    <Chip key={item} name={item} />
                  ))}
                </div>
              </BentoTile>
            </div>
          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: 5 cols on md+ (Data & ML + Soft Skills)   */}
          {/* ======================================================= */}
          <div className="contents md:flex md:flex-col md:col-span-5 md:gap-[14px] items-stretch">
            {/* TILE 4: Data & Machine Learning (Featured, Top of Right column, Order 1 on mobile) */}
            <BentoTile
              title="Data & Machine Learning"
              count="06"
              featured={true}
              className="order-1 md:order-none flex-none"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dataML.map((item) => (
                  <Chip key={item} name={item} />
                ))}
              </div>

              {/* Mono Strip with CSS Blinking Cursor */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#86868B] bg-[#0A0A0C]/60 p-3 rounded-xl border border-white/5">
                <div className="flex items-center overflow-hidden">
                  <span className="text-[#FF5B1F] select-none mr-2">$</span>
                  <span className="text-[#F5F5F7] truncate">SELECT * FROM dataset.table;</span>
                  <span className="inline-block w-1.5 h-3.5 bg-[#FF5B1F] ml-1 animate-pulse" />
                </div>
                <span className="text-[10px] text-[#86868B] uppercase tracking-wider shrink-0 ml-2">SQL</span>
              </div>
            </BentoTile>

            {/* TILE 5: Soft Skills (Bottom of Right column, Order 5 on mobile) */}
            <BentoTile
              title="Soft Skills"
              count="07"
              className="order-5 md:order-none md:flex-1 flex flex-col justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {softSkills.map((skill) => (
                  <Chip key={skill} name={skill} />
                ))}
              </div>
            </BentoTile>
          </div>
        </div>
      </div>
    </section>
  )
}

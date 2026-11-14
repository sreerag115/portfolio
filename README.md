# Sreerag K — Editorial Magazine Portfolio

A calm, confident, print-inspired personal portfolio for **Sreerag K** — Full-Stack Developer, Data Warehousing Enthusiast & ML Builder.

Designed in the style of an independent design monograph or architectural journal: warm tactile paper (`#F4EFE6`), card surface paper (`#EBE4D6`), carbon ink typography (`#141414`), vermilion red accents (`#C8442B`), hairline rules, generous whitespace, and high-contrast editorial typography.

---

## 🎨 Editorial Design System

- **Paper Background**: `#F4EFE6`
- **Surface / Card Paper**: `#EBE4D6`
- **Carbon Ink Text**: `#141414`
- **Vermilion Accent**: `#C8442B` (used sparingly for issue highlights, links, numbers)
- **Muted Graphite**: `#8C8577`
- **Hairline Rules**: `rgba(20, 20, 20, 0.15)`
- **Typography**:
  - Headings: `Fraunces` & `Instrument Serif` (tight leading, roman + italic mix)
  - Body: `Inter`
  - Small Meta / Telemetry: `JetBrains Mono`

---

## 📖 Sections & Features

1. **Newspaper Masthead Navigation**:
   - Thin top bar header with `"SREERAG K"`, `"Issue 01 — 2026"`, and section text links (`About`, `Work`, `Skills`, `Experience`, `Honors`, `Contact`).
   - Hairline bottom divider; active section gets an animated vermilion underline.
   - Smoothly compacts padding on scroll.
2. **Hero Spread**:
   - Giant serif headline: `Sreerag` *`K`*`.` spanning the page width with a vermilion period.
   - Three-column editorial breakdown: Short bio narrative, animated role cyclist (*Full-Stack Developer*, *Data Warehousing Enthusiast*, *ML & Computer Vision Builder*), and Dispatch Station (*Malappuram, Kerala, India*).
   - Underlined magnetic action links (*View Selected Work →*, *Download Resume ↓*).
   - Horizontal slow marquee ticker of skills separated by hairline rules.
3. **About & Background Spread**:
   - Two-column editorial spread with an italic vermilion drop cap.
   - Large pull-quote in italic serif.
   - Sidebar education block styled like an academic journal listing (*KTU B.Tech CSE & Class 12 distinction*).
4. **Selected Works (3D Coverflow Carousel)**:
   - 3D Coverflow rotating cylinder perspective: center card is in focus with realistic paper shadow; side cards rotate in Y, scale down, and fade to muted paper tones.
   - **Multi-modal navigation**: Click side cards, arrow buttons, mouse drag/touch swipe, mouse wheel scrolling, and keyboard arrow keys (`←` / `→` / `Enter`).
   - Specular soft white sheen following cursor tilt (no neon glare).
   - Designated screenshot drop-slot on each card.
   - Full-screen article spread modal on click with two-column layout, numbered key capabilities, mono tags, and demo links.
   - Progress counter: `01 / 04` with a thin drawing hairline line.
5. **Competency Index (Skills)**:
   - Directory-style index layout with hairline column dividers.
   - Skill names in large serif that shift to italic vermilion with arrow offset on hover.
   - Soft skills appendix covering analytical and collaborative practices.
6. **Table of Contents (Experience Timeline)**:
   - Chronological ledger with mono date column, large serif role title, and company imprint.
   - Scroll progress draws an elegant vermilion vertical rule.
   - Interactive chapter expansion on click/hover for detailed deliverables.
7. **Accolades "By The Numbers"**:
   - Featured gold distinction box for **First Prize at INCEPTRA – SUTRA 2026**.
   - Big serif numerals with animated count-up for key project and internship metrics.
   - Secondary certification and hackathon cards (*Smart India Hackathon, SCAD 2026, IEDC Summit, AI Fundamentals*).
8. **Correspondence & Colophon (Contact)**:
   - Huge serif statement: *"Let's build something good."* with *good.* in italic vermilion.
   - Giant underlined email link: `sreeragmadhav.k@gmail.com`.
   - Minimal underline-only form inputs.
   - Colophon imprint and smooth "Back to Top ↑" trigger.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 3. Build & Preview
```bash
npm run build
npm run preview
```

---

## 🛠️ Content Customization

All content is preserved in data files under `src/data/`:
- `src/data/projects.ts`: Update case studies, links, and screenshots (`/public/assets/projects/{id}.png`).
- `src/data/skills.ts`: Modify languages, frameworks, and proficiencies.
- `src/data/experience.ts`: Update internship chapters and accomplishments.
- `src/data/achievements.ts`: Update competition awards and certifications.
- `src/data/education.ts`: Update academic credentials.
- `public/Sreerag_K_Resume.pdf`: Drop your updated resume PDF here.

---

## 📦 Deploy to Vercel

```bash
# Push to GitHub, then import into Vercel or run:
npx vercel
```
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 📄 License
MIT © Sreerag K. Set in Fraunces, Inter & JetBrains Mono.

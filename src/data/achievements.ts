export interface Achievement {
  id: number;
  title: string;
  category: "Award" | "Hackathon" | "Certification" | "Workshop";
  event: string;
  organization: string;
  year: string;
  icon: string;
  badge: string;
  color: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: 1,
    title: "First Prize Winner",
    category: "Award",
    event: "“Margadarsi” Logistics Strategy Game",
    organization: "INCEPTRA – SUTRA 2026, Rajagiri College",
    year: "2026",
    icon: "🏆",
    badge: "1st Place Gold",
    color: "#22E4FF",
    description: "Secured 1st Prize tackling complex algorithmic logistics supply-chain optimization challenges under high pressure.",
  },
  {
    id: 2,
    title: "Selected at Institution Level",
    category: "Hackathon",
    event: "Smart India Hackathon (SIH)",
    organization: "Ministry of Education / AICTE",
    year: "2024",
    icon: "🚀",
    badge: "National Finalist Qual.",
    color: "#7C5CFF",
    description: "Qualified at the institutional level to represent the college for nationwide real-world engineering problem statements.",
  },
  {
    id: 3,
    title: "Hackathon Competitor",
    category: "Hackathon",
    event: "FugenHack 4.0",
    organization: "SNGCE Ernakulam",
    year: "2024",
    icon: "⚡",
    badge: "24h Sprint",
    color: "#FF3DCB",
    description: "Built end-to-end rapid prototype software addressing real-world civic and operational challenges in 24 hours.",
  },
  {
    id: 4,
    title: "Cloud Security Specialist",
    category: "Workshop",
    event: "“Securing the Cloud” Workshop",
    organization: "Techfest & KETCON 2024",
    year: "2024",
    icon: "🔐",
    badge: "Certified Training",
    color: "#22E4FF",
    description: "Intensive hands-on training on cloud infrastructure protection, IAM policies, and cloud attack surface mitigation.",
  },
  {
    id: 5,
    title: "SCAD 2026 Certification",
    category: "Certification",
    event: "International Conference on Smart Computing, AI & Data Engineering",
    organization: "SCAD 2026 Committee",
    year: "2026",
    icon: "📜",
    badge: "Intl. Conference",
    color: "#7C5CFF",
    description: "Accredited certification in state-of-the-art Deep Learning, Data Engineering, and Smart Computing paradigms.",
  },
  {
    id: 6,
    title: "IEDC Summit 2024 Delegate",
    category: "Certification",
    event: "Kerala Startup Mission (KSUM)",
    organization: "NIT Calicut",
    year: "2024",
    icon: "🌟",
    badge: "Innovation Ecosystem",
    color: "#22E4FF",
    description: "Selected delegate representing student technological innovation and tech entrepreneurship at premier startup summit.",
  },
  {
    id: 7,
    title: "AI Fundamentals Certified",
    category: "Certification",
    event: "AI Fundamentals Professional Training",
    organization: "Head Held High Foundation",
    year: "2026",
    icon: "🧠",
    badge: "AI Practitioner",
    color: "#FF3DCB",
    description: "Comprehensive qualification in generative AI foundations, prompt engineering, and production ML pipelines.",
  },
];

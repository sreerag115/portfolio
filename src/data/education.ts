export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  period: string;
  score?: string;
  details: string;
  highlights: string[];
  color: string;
}

export const educationList: EducationItem[] = [
  {
    id: 1,
    institution: "APJ Abdul Kalam Technological University (KTU)",
    degree: "B.Tech in Computer Science and Engineering",
    period: "2023 – 2027 (Expected)",
    details: "Final-year B.Tech CSE student specializing in Data Engineering, Machine Learning, and Full-Stack Web/Mobile Systems.",
    highlights: [
      "Core focus on Data Structures & Algorithms, OS, DBMS, Computer Networks, and AI",
      "Lead developer across multiple departmental hackathons and technical competitions",
      "First Prize Winner in Logistics Strategy Competition at INCEPTRA – SUTRA 2026",
    ],
    color: "#7C5CFF",
  },
  {
    id: 2,
    institution: "Ezhur Govt. Higher Secondary School",
    degree: "Higher Secondary (Class 12) — Science Stream",
    period: "2021 – 2023",
    score: "Score: 8.4",
    details: "Strong academic foundation in Mathematics, Physics, Chemistry, and Computer Science with distinction.",
    highlights: [
      "Rigorous foundations in advanced mathematics and computer fundamentals",
      "Active participant in science exhibitions and school coding clubs",
      "Graduated with 8.4 GPA distinction",
    ],
    color: "#22E4FF",
  },
];

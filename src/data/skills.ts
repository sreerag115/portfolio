export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  tag?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    name: "Languages",
    color: "#7C5CFF",
    description: "Core programming & scripting languages used across systems and models",
    skills: [
      { name: "Python", level: 92, tag: "Primary" },
      { name: "SQL", level: 90, tag: "Data" },
      { name: "JavaScript", level: 88, tag: "Web" },
      { name: "Dart", level: 82, tag: "Mobile" },
      { name: "Java", level: 80, tag: "OOP" },
      { name: "C++", level: 78, tag: "Algorithms" },
      { name: "C", level: 75, tag: "Low-level" },
      { name: "HTML", level: 95, tag: "Markup" },
      { name: "CSS", level: 90, tag: "Styling" },
    ],
  },
  {
    id: "frameworks",
    name: "Frameworks & Libraries",
    color: "#22E4FF",
    description: "Modern web, mobile, and cloud-connected UI engines",
    skills: [
      { name: "React", level: 90, tag: "Frontend" },
      { name: "Flutter", level: 85, tag: "Mobile" },
      { name: "Firebase", level: 82, tag: "BaaS" },
      { name: "Supabase", level: 84, tag: "PostgreSQL BaaS" },
    ],
  },
  {
    id: "data-ml",
    name: "Data & ML",
    color: "#FF3DCB",
    description: "Big data engineering, vector embeddings, and computer vision architectures",
    skills: [
      { name: "Google BigQuery", level: 90, tag: "Data Warehouse" },
      { name: "PyTorch", level: 80, tag: "Deep Learning" },
      { name: "OpenAI CLIP", level: 82, tag: "Multimodal AI" },
      { name: "Sentence Transformers", level: 84, tag: "NLP Vectors" },
      { name: "Scikit-learn", level: 85, tag: "Statistical ML" },
      { name: "Google ML Kit", level: 86, tag: "Edge CV" },
    ],
  },
  {
    id: "backend",
    name: "Backend & Databases",
    color: "#7C5CFF",
    description: "High-performance microservices, REST APIs, and database engines",
    skills: [
      { name: "FastAPI", level: 88, tag: "Async Python" },
      { name: "Node.js", level: 85, tag: "Runtime" },
      { name: "Express.js", level: 84, tag: "REST API" },
      { name: "MongoDB", level: 82, tag: "NoSQL Document" },
      { name: "SQLite", level: 86, tag: "Embedded DB" },
    ],
  },
  {
    id: "soft-skills",
    name: "Soft Skills & Leadership",
    color: "#22E4FF",
    description: "Engineering leadership, agile collaboration, and critical problem solving",
    skills: [
      { name: "Problem-Solving", level: 95, tag: "Analytical" },
      { name: "Analytic Thinking", level: 92, tag: "Architecture" },
      { name: "Teamwork", level: 90, tag: "Collaboration" },
      { name: "Communication", level: 88, tag: "Interpersonal" },
      { name: "Leadership", level: 85, tag: "Initiative" },
      { name: "Adaptability", level: 90, tag: "Agile" },
      { name: "Time Management", level: 88, tag: "Delivery" },
    ],
  },
];

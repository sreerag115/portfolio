export interface Project {
  id: number;
  title: string;
  status?: string;
  subtitle: string;
  description: string;
  tech: string[];
  features: string[];
  color: string;
  accentColor: string;
  githubUrl: string;
  liveUrl?: string;
  stats: { label: string; value: string }[];
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Second Sight",
    subtitle: "Real-time navigation assistance app for visually impaired people.",
    description:
      "A mobile application that assists visually impaired people during daily navigation. It runs object detection on live camera frames and announces obstacles with low-latency speech feedback.",
    tech: [
      "Flutter",
      "Dart",
      "Google ML Kit",
      "Object Detection",
      "Text-to-Speech",
      "Computer Vision",
    ],
    features: [
      "Edge object detection on live frames via Google ML Kit",
      "Directional spoken cues through native Text-to-Speech",
      "Distance estimation to warn about immediate collision risks",
      "Fully offline mobile pipeline without server latency",
    ],
    color: "#FF5B1F",
    accentColor: "#FF5B1F",
    githubUrl: "https://github.com/sreerag115",
    stats: [
      { label: "Inference", value: "On-device" },
      { label: "Platform", value: "Flutter" },
      { label: "Model", value: "ML Kit" },
    ],
    image: "/assets/projects/1.png",
  },
  {
    id: 2,
    title: "SmartFind",
    subtitle: "Lost and found web platform powered by multimodal AI embeddings.",
    description:
      "A community platform where users report and find lost items. Uses OpenAI CLIP image embeddings and Sentence Transformers to match items across images and descriptions automatically.",
    tech: [
      "React",
      "CSS",
      "FastAPI",
      "Supabase",
      "PyTorch",
      "OpenAI CLIP",
      "Sentence Transformers",
      "Scikit-learn",
      "SMTP Email Service",
    ],
    features: [
      "Cross-modal retrieval pairing photos with textual descriptions using CLIP",
      "Cosine similarity scoring with vector indexing",
      "Live lost-and-found board backed by Supabase PostgreSQL",
      "Automated email notifications to the owner when a strong match is found",
    ],
    color: "#FF5B1F",
    accentColor: "#FF5B1F",
    githubUrl: "https://github.com/sreerag115",
    stats: [
      { label: "Embeddings", value: "512-d CLIP" },
      { label: "Indexing", value: "Supabase" },
      { label: "Backend", value: "FastAPI" },
    ],
    image: "/assets/projects/2.png",
  },
  {
    id: 3,
    title: "Pharmacy Inventory & Billing System",
    subtitle: "Offline point-of-sale system with First-Expiry-First-Out dispensing.",
    description:
      "An offline inventory and billing terminal built for pharmacies. Automatically sells the earliest-expiring batch first and produces print-ready PDF invoices.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "SQLite",
      "jsPDF",
    ],
    features: [
      "Automated FEFO (First-Expiry-First-Out) batch allocation",
      "Fast keyboard-driven checkout with instant barcode lookup",
      "Instant client-side PDF invoice generation with jsPDF",
      "Embedded SQLite database for zero-latency offline operation",
    ],
    color: "#FF5B1F",
    accentColor: "#FF5B1F",
    githubUrl: "https://github.com/sreerag115",
    stats: [
      { label: "Storage", value: "SQLite" },
      { label: "Algorithm", value: "FEFO" },
      { label: "Format", value: "PDF" },
    ],
    image: "/assets/projects/3.png",
  },
  {
    id: 4,
    title: "Government School Official Website",
    subtitle: "Public portal and content management system for a local school.",
    description:
      "A responsive website and administration portal for a local government school. Enables administrators to update student announcements, academic notices, and staff directories.",
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    features: [
      "Protected dashboard for publishing exam schedules and notices",
      "Mobile-friendly interface built with high contrast for accessibility",
      "Filterable staff directory and school facilities overview",
      "MongoDB document database for event circulars and media",
    ],
    color: "#FF5B1F",
    accentColor: "#FF5B1F",
    githubUrl: "https://github.com/sreerag115",
    stats: [
      { label: "Database", value: "MongoDB" },
      { label: "Stack", value: "Node/Express" },
      { label: "Target", value: "Web" },
    ],
    image: "/assets/projects/4.png",
  },
  {
    id: 5,
    title: "Hush Chat",
    status: "In progress",
    subtitle: "A WhatsApp-inspired mobile messaging app built with Flutter.",
    description:
      "A WhatsApp-style messaging app I am building. You can already send a message from one person to another, and I am working on the rest.",
    tech: [
      "Flutter",
      "Dart",
      "Firebase",
      "Cloud Firestore",
      "Node.js",
      "TypeScript",
    ],
    features: [
      "Send a message to another person",
      "Direct one-on-one conversation threads",
      "Firebase backend integration",
      "Local message caching with Hive",
    ],
    color: "#FF5B1F",
    accentColor: "#FF5B1F",
    githubUrl: "https://github.com/sreerag115/hush-chat",
    stats: [
      { label: "Status", value: "In Progress" },
      { label: "Platform", value: "Flutter" },
      { label: "Backend", value: "Firebase" },
    ],
    image: "/assets/projects/5.png",
  },
];

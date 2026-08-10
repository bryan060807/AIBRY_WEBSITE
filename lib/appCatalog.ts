export type AibryApp = {
  slug: string;
  name: string;
  tagline: string;
  status: "Live" | "Beta" | "Experimental" | "Operator" | "Focused";
  href?: string;
  summary: string;
  features: string[];
  stack: string[];
  role: string;
};

export const apps: AibryApp[] = [
  {
    slug: "aibry-id",
    name: "AIBRY ID",
    tagline: "Identity and account access across the AIBRY ecosystem.",
    status: "Focused",
    summary:
      "AIBRY ID is the shared identity platform used by AIBRY applications. Its public TaskMaster authentication flow has been verified end to end, while the provider remains a distinct system from the main website account experience.",
    features: [
      "Shared login foundation for AIBRY apps",
      "Verified TaskMaster authentication flow",
      "Server-side identity and provider integration",
      "Foundation for future ecosystem account features",
    ],
    stack: ["Identity provider", "OAuth-style app clients", "AIBRY apps", "Server-side auth"],
    role: "Identity platform",
  },
  {
    slug: "taskmaster",
    name: "TaskMaster",
    tagline: "Project planning and task execution for real work.",
    status: "Live",
    href: "https://taskmaster.aibry.shop",
    summary:
      "TaskMaster is an AIBRY productivity app for organizing projects, tasks, priorities, and workflow state across active work.",
    features: [
      "Task and project organization",
      "AIBRY ID authentication integration",
      "Production app/API runtime",
      "Focused workflow surface for active projects",
    ],
    stack: ["Next.js", "Node.js", "Postgres", "AIBRY ID"],
    role: "Productivity app",
  },
  {
    slug: "trackmaster",
    name: "TrackMaster",
    tagline: "Browser-based audio mastering, editing, and export.",
    status: "Live",
    href: "https://trackmaster.aibry.shop",
    summary:
      "TrackMaster is an audio mastering program for editing audio files in the browser, shaping the final sound, and exporting mastered tracks.",
    features: [
      "Audio file editing workflow",
      "Mastering-focused track processing",
      "Export mastered audio files",
      "AIBRY ID login and dedicated app/API runtime",
    ],
    stack: ["Next.js", "Express", "Audio processing", "AIBRY ID"],
    role: "Audio mastering app",
  },
  {
    slug: "chordmaster",
    name: "ChordMaster",
    tagline: "Songwriting and chord workflow tools.",
    status: "Live",
    href: "https://chordmaster.aibry.shop",
    summary:
      "ChordMaster is a creative utility for capturing song ideas, chords, and writing structures without breaking flow.",
    features: [
      "Song and chord organization",
      "Creative writing workflow support",
      "Persistent app data",
      "Simple tool-first interface",
    ],
    stack: ["React", "Node.js", "API runtime", "Persistent storage"],
    role: "Music utility",
  },
  {
    slug: "lyricsync",
    name: "LyricSync",
    tagline: "Lyric alignment and video-export workflow for finished songs.",
    status: "Focused",
    summary:
      "LyricSync is a music-production utility for aligning lyrics to finished audio and exporting synchronized visual/video output. It has become one of the most frequently used AIBRY tools in day-to-day music work.",
    features: [
      "Lyric alignment workflow",
      "Synchronized lyric timing",
      "Video export pipeline",
      "Practical day-to-day music production utility",
    ],
    stack: ["React", "Vite", "Node.js", "Media export"],
    role: "Lyric and video utility",
  },
  {
    slug: "app-autopsy",
    name: "AppAutopsy",
    tagline: "Technical due diligence and brutally honest product reviews.",
    status: "Experimental",
    summary:
      "AppAutopsy accepts a live application URL or public GitHub repository and produces an evidence-driven technical and commercial review, including scored findings, recommendations, market context, pricing analysis, and prioritized next actions.",
    features: [
      "Live URL or public repository intake",
      "Explicit authorization before analysis",
      "Technical, UX, security, and market scoring",
      "Recommendations, pricing analysis, and action plans",
    ],
    stack: ["React", "Vite", "Express", "OpenAI Responses API", "Web search"],
    role: "AI product-analysis tool",
  },
  {
    slug: "garage-admin",
    name: "Otis / Garage Admin",
    tagline: "Operator console and review-gated memory for the AIBRY garage.",
    status: "Operator",
    summary:
      "Otis is the current operator-facing control surface for AIBRY infrastructure. It combines service visibility, guarded administrative workflows, and the Garage Admin memory system used to preserve current operational context.",
    features: [
      "Service health and operational visibility",
      "Guarded administrative workflows",
      "Review-gated Garage Admin memory",
      "Host-aware infrastructure operations",
    ],
    stack: ["Next.js", "Node.js", "PM2", "Garage Admin memory", "Host-aware control plane"],
    role: "Infrastructure operator system",
  },
];

export const appsHub = {
  name: "AIBRY Apps",
  href: "https://aibrylabs.com/apps",
  tagline: "AIBRY products, platforms, experiments, and operator systems.",
};

export function getAppBySlug(slug: string) {
  return apps.find((app) => app.slug === slug);
}

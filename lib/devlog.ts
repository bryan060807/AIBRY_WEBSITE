import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type DevlogMeta = {
  title: string;
  slug: string;
  date: string;          // ISO string
  tags?: string[];
  order?: number;
};

export type Devlog = DevlogMeta & {
  content: string;
};

const DEVLOG_DIR = path.join(
  process.cwd(),
  'content',
  'blackbox',
  'devlog'
);

function loadDevlogFile(fileName: string): Devlog {
  const fullPath = path.join(DEVLOG_DIR, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const meta: DevlogMeta = {
    title: data.title ?? fileName,
    slug: data.slug ?? fileName.replace(/\.mdx?$/, ''),
    date: data.date ?? new Date().toISOString(),
    tags: data.tags ?? [],
    order: data.order ?? undefined,
  };

  return { ...meta, content };
}

export function getAllDevlogs(): Devlog[] {
  const files = fs.readdirSync(DEVLOG_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const devlogs = files.map(loadDevlogFile);

  devlogs.sort((a, b) => {
    if (a.order != null && b.order != null) {
      return a.order - b.order;
    }
    // fallback: newest first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return devlogs;
}

export function getDevlogBySlug(slug: string): Devlog | null {
  const all = getAllDevlogs();
  const found = all.find(d => d.slug === slug);
  return found ?? null;
}

export function getAllDevlogSlugs(): string[] {
  return getAllDevlogs().map(d => d.slug);
}

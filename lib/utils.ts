export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function paginate<T>(items: T[], page = 1, perPage = 12) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * perPage;
  const end = start + perPage;
  return {
    items: items.slice(start, end),
    total,
    pages,
    current,
    hasPrev: current > 1,
    hasNext: current < pages,
  };
}

export const CATEGORY_LABELS: Record<string, string> = {
  music: "Music & Analog",
  ai: "AI & Tech",
  pop: "Pop Culture",
  opinion: "Opinion / Essays",
  community: "Community",
};

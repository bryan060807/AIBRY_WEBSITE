// app/api/github/files/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { owner, repo, ref = 'main', paths } = body;

  if (!owner || !repo || !Array.isArray(paths)) {
    return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }

  const results = await Promise.all(
    paths.map(async (path: string) => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        return { path, error: `Failed to fetch: ${res.status}` };
      }

      const data = await res.json();

      return {
        path,
        content: data.content,
        encoding: data.encoding,
        sha: data.sha,
      };
    })
  );

  return NextResponse.json({ files: results });
}

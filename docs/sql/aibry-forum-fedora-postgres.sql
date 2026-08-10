-- Draft Fedora Postgres forum schema.
-- Review and apply on Fedora only after the target auth identity model is final.

create table if not exists public.forum_profiles (
  id uuid primary key,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.forum_profiles(id) on delete restrict,
  topic text not null check (topic in ('story', 'hope', 'support')),
  title text not null check (char_length(title) <= 160),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id uuid not null references public.forum_profiles(id) on delete restrict,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_likes (
  user_id uuid not null references public.forum_profiles(id) on delete cascade,
  comment_id uuid not null references public.forum_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);

create index if not exists forum_posts_topic_created_at_idx
  on public.forum_posts (topic, created_at desc);

create index if not exists forum_comments_post_created_at_idx
  on public.forum_comments (post_id, created_at asc);

# Forum Fedora Auth and Storage Contract

The Next.js app runs on Windows. Fedora should own durable auth, forum
persistence, object storage, ingress, backups, and restore procedures.

## Current Path

- Forum auth boundary: `lib/server/auth.ts`
- Forum data boundary: `lib/server/forum.ts`
- Forum object storage boundary: `lib/server/storage/forumStorage.ts`
- Auth/data source: Fedora-owned website/forum API
- Browser-side forum writes: not used for posts, comments, or comment likes

The website should not contain a database-owned auth or storage compatibility
layer. Fedora is the target source of truth for forum auth, forum data, and
forum object storage.

## Target Fedora Path

The forum adapter should be repointed to Fedora-owned services after those
services exist and are verified:

- `AIBRY_FORUM_API_URL`
- `AIBRY_FORUM_API_KEY`
- `AIBRY_AUTH_API_URL`
- `AIBRY_AUTH_API_KEY`
- `AIBRY_STORAGE_DRIVER`
- `AIBRY_S3_ENDPOINT`
- `AIBRY_S3_REGION`
- `AIBRY_S3_BUCKET`
- `AIBRY_S3_ACCESS_KEY_ID`
- `AIBRY_S3_SECRET_ACCESS_KEY`
- `AIBRY_MEDIA_PUBLIC_URL`

Do not expose API keys, database credentials, S3 credentials, service tokens, or
auth headers to the browser.

## Required Fedora Forum API Shape

The first Fedora API can be small and server-to-server only:

- `GET /forum/topics/:topic/posts`
- `GET /forum/topics/:topic/posts/:postId`
- `POST /forum/topics/:topic/posts`
- `POST /forum/topics/:topic/posts/:postId/comments`
- `POST /forum/topics/:topic/posts/:postId/comments/:commentId/like-toggle`

Final authorization must happen on Fedora or in a trusted server boundary that
validates Fedora auth. The browser should never submit a user id as authority.

## Object Key Scope

Forum attachment keys should stay stable and scoped:

- `forum/{userId}/{postId}/{timestamp}.{ext}`

The browser may receive public media URLs or short-lived signed URLs. It must
not receive storage credentials.

## Schema

If Fedora Postgres does not already contain the forum tables, use the draft SQL
in `docs/sql/aibry-forum-fedora-postgres.sql` as the review starting point.

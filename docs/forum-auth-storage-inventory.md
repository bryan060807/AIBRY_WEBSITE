# Forum Auth and Storage Inventory

This inventory is retained as a migration note. It was updated after the website-side removal of the old external auth/storage runtime.

## Forum Routes

- `/forum`
- `/forum/story`
- `/forum/hope`
- `/forum/support`
- `/forum/[topic]/[postId]`

## Current Direction

- Auth source: Fedora-owned auth service behind `lib/server/auth.ts`.
- Forum data source: Fedora-owned API behind `lib/server/forum.ts`.
- Forum storage source: Fedora MinIO/S3-compatible storage behind `lib/server/storage/forumStorage.ts`.
- Final authorization for forum posts, comments, and likes happens server-side.

## Removal Note

The old website-side auth/storage compatibility clients, callback routes, avatar adapter, and direct browser reads/writes have been removed. Current website code should use same-origin `/api/*` routes and server-only Fedora adapters.

No secrets or credential values should be copied into this document.

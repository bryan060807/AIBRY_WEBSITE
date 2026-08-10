# Website Fedora API Cutover

The Windows-hosted Next.js website now uses the Fedora `aibry-website-api`
service as the source of truth for account, session, forum, profile, and avatar
write paths.

## Required Runtime Env

- `AIBRY_BACKEND_BASE_URL`: preferred server-only base URL for the Fedora
  website API.
- `AIBRY_WEBSITE_API_URL`: compatibility fallback for older runtime configs.

Do not expose Fedora API secrets, database URLs, storage keys, or auth headers to
browser code. Browser auth/profile requests use same-origin Next.js routes under
`/api/auth/*`, `/api/profile`, `/api/storage/*`, `/api/forum/*`,
`/api/contact-messages`, and `/api/testimonials`, which forward cookies to
Fedora and copy session cookies back to the browser where needed.

## Windows PM2 Deploy / Env Checks

The Windows frontend runs under PM2 as `aibry-website` on port `3015`.
`pm2 env` expects a numeric process id, not the app name.

Use:

```powershell
cd C:\Users\bryan\aibry\projects\aibry_website
npm run lint
npm run build
pm2 list
pm2 env <numeric-id>
pm2 startOrReload ecosystem.config.cjs --only aibry-website --update-env
pm2 save --force
pm2 status aibry-website
netstat -ano | Select-String ':3015'
curl.exe -I http://127.0.0.1:3015/
```

Expected non-secret URL env names for the PM2 runtime:

- `AIBRY_BACKEND_BASE_URL`
- `AIBRY_WEBSITE_API_URL`

## AIBRY ID Deploy Prep

The canonical public AIBRY ID flow starts at `/auth/aibry-id/login` and returns
to `/auth/aibry-id/callback`. Do not use `/api/auth/aibry-id/*` for the public
browser flow, and do not store provider tokens in the Windows frontend.

Required Website API environment names:

- `AIBRY_WEBSITE_AIBRY_ID_ENABLED`
- `AIBRY_WEBSITE_AIBRY_ID_ISSUER`
- `AIBRY_WEBSITE_AIBRY_ID_CLIENT_ID`
- `AIBRY_WEBSITE_AIBRY_ID_REDIRECT_URI`
- `AIBRY_WEBSITE_AIBRY_ID_STATE_COOKIE_SECRET`
- `AIBRY_WEBSITE_AIBRY_ID_SUCCESS_REDIRECT`
- `AIBRY_WEBSITE_AIBRY_ID_SELF_PROVISIONING`
- `AIBRY_WEBSITE_TRUST_PROXY`

Required production route ownership:

- `aibrylabs.com/auth/aibry-id/*` -> Fedora/Optiplex 3040 Website API
  `127.0.0.1:3008`.
- `aibrylabs.com/api/*` remains Website API. At minimum, this must cover
  `/api/auth/*`, `/api/profile*`, `/api/storage/*`, `/api/forum/*`,
  `/api/contact-messages`, and `/api/testimonials` before the Windows frontend
  fallback.
- `aibrylabs.com/` remains the Windows frontend.

Public AIBRY ID signup is still disabled. Website UI should only invite users to
continue with an existing AIBRY ID account until signup is explicitly enabled.

## Expected Fedora Endpoints

- `POST /api/auth/register`
  - Request JSON: `{ email, password, display_name?, newsletter_opt_in? }`
  - Response JSON: `{ user, session }`
- `POST /api/auth/login`
  - Request JSON: `{ email, password }`
  - Response JSON: `{ user, session }`
- `POST /api/auth/logout`
  - Response JSON: `{ ok: true }`
- `GET /api/auth/me`
  - Response JSON: `{ user }`
- `GET /api/auth/session`
  - Response JSON: `{ user }`
- `GET /api/forum/topics`
- `GET /api/forum/topics/:topicId/posts`
  - `topicId` must be one of `story`, `hope`, or `support` for website routes.
- `POST /api/forum/topics/:topicId/posts`
  - Request JSON: `{ title, body }`
  - Response JSON: `{ post }`
- `GET /api/forum/posts/:postId`
  - Response JSON: `{ post }`, with comments nested at `post.comments`.
- `POST /api/forum/posts/:postId/comments`
  - Request JSON: `{ body, parentCommentId? }`
  - Response JSON: `{ comment }`
- `POST /api/forum/comments/:commentId/like`
- `DELETE /api/forum/comments/:commentId/like`
  - Response JSON: `{ comment }`
- `GET /api/profile`
  - Response JSON: `{ user }`, with the profile nested at `user.profile`.
- `PUT /api/profile`
  - Request JSON: camelCase profile fields such as `displayName`,
    `newsletterOptIn`, and social URL fields. The Fedora API also accepts the
    website's legacy snake_case aliases.
  - Response JSON: `{ user }`, with the profile nested at `user.profile`.
- `PUT /api/profile/avatar`
  - Request body: raw image bytes, not multipart form data.
  - Required headers: image `Content-Type`; `X-File-Name` is supported.
  - Response JSON: `{ user, avatar }`.

Public profile pages (`/u/[username]` and `/user/[id]`) currently show a friendly
unavailable state until Fedora exposes a public profile lookup endpoint.

- `POST /api/contact-messages`
  - Request JSON: `{ name, email, message }`
  - Public endpoint; must not require a Website session.

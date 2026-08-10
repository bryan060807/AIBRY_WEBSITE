# Fedora Auth, Profile, Avatar, and Storage Contract

The website no longer owns auth, profile persistence, avatar processing, or object-storage writes. The Next.js app exposes same-origin routes under `/api/*` and proxies them to Fedora from server-side code only.

## Server-only environment

- `AIBRY_BACKEND_BASE_URL`: Fedora website backend base URL.
- `AIBRY_BACKEND_INTERNAL_TOKEN`: optional server-only token passed as `x-aibry-internal-token`.
- `AIBRY_WEBSITE_API_URL`: compatibility fallback for older runtime configs.
- `NEXT_PUBLIC_AIBRY_MEDIA_URL`: optional browser-safe public media origin for returned avatar paths.

Do not expose backend internal tokens, database credentials, storage keys, session secrets, or refresh tokens through `NEXT_PUBLIC_*`.

## Website routes

- `POST /api/auth/register` -> Fedora `POST /api/v1/auth/register`
- `POST /api/auth/login` -> Fedora `POST /api/v1/auth/login`
- `POST /api/auth/logout` -> Fedora `POST /api/v1/auth/logout`
- `GET /api/auth/me` -> Fedora `GET /api/v1/auth/me`
- `GET /api/profile` -> Fedora `GET /api/v1/profile`
- `PATCH /api/profile` -> Fedora `PATCH /api/v1/profile`
- `POST /api/profile/avatar` -> Fedora `POST /api/v1/profile/avatar`
- `DELETE /api/profile/avatar` -> Fedora `DELETE /api/v1/profile/avatar`
- `GET /api/storage/*` -> Fedora `GET /api/v1/storage/*`

## Auth payloads

Register request:

```json
{
  "email": "user@example.com",
  "password": "minimum-policy-owned-by-fedora",
  "displayName": "Display Name",
  "username": "username"
}
```

Login request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Successful auth responses should include a profile-shaped user object:

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "displayName": "Display Name",
    "username": "username",
    "avatarUrl": "/api/storage/avatars/user-id/avatar.webp"
  }
}
```

Fedora should set a secure `HttpOnly` session cookie on login/register and clear it on logout. The website forwards incoming cookies server-side and copies Fedora `Set-Cookie` headers back to the browser.

## Profile payloads

Profile responses may return either `{ "profile": { ... } }` or the profile object directly. Supported fields:

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "displayName": "Display Name",
  "username": "username",
  "bio": "Short public bio",
  "avatarUrl": "/api/storage/avatars/user-id/avatar.webp",
  "instagram": "",
  "tiktok": "",
  "spotify": "",
  "soundcloud": "",
  "facebook": "",
  "newsletterOptIn": false
}
```

`PATCH /api/v1/profile` accepts the editable profile fields above except `id` and `email`.

## Avatar upload

`POST /api/v1/profile/avatar` receives `multipart/form-data` with an `avatar` file field. The website validates JPG, PNG, or WebP and a maximum size of 5 MB before upload; Fedora must revalidate type and size, transform/store the object, update persistence, and return the updated profile.

`DELETE /api/v1/profile/avatar` removes or clears the current avatar and returns the updated profile. Returned avatar URLs should include a changed path or version when cache invalidation is required.

## Error format

Use a stable JSON error shape:

```json
{
  "code": "AUTH_REQUIRED",
  "message": "Sign in is required."
}
```

The website fails closed on auth/profile errors and does not fabricate a signed-in state.

## Removal note

Supabase packages, clients, auth callback routes, storage helpers, and public env variables have been removed from the website. Any remaining Fedora backend work should implement the endpoints above with Postgres and server-side storage credentials on Fedora only.

Old Supabase-auth accounts are not automatically usable in the Fedora auth system. They need an explicit migration or a Fedora password reset/re-registration path; the website should treat new Fedora accounts as the active auth system and should not reintroduce Supabase clients as a fallback.

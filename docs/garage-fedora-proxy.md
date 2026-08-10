# Garage/Fedora Proxy Runtime Plan

This site remains a Windows-owned Next.js runtime. Garage/Fedora should own ingress, TLS, durable storage, database services, backups, and secret distribution. Do not put Fedora worker services or storage credentials in browser-visible state.

## Current Runtime Assumptions

- Framework: Next.js 14.2.32.
- Package scripts:
  - `npm run dev` -> `next dev`
  - `npm run build` -> `next build`
  - `npm run start` -> `next start`
  - `npm run lint` -> `next lint`
- Observed local PM2 config: `ecosystem.config.cjs` starts `next start -p 3015` as `aibry-website`.
- Expected production upstream for Garage/Fedora proxy: `http://127.0.0.1:3015`.
- The current PM2 draft does not explicitly pass `-H 127.0.0.1`; verify the listener before exposing through ingress. Prefer loopback bind for the Windows runtime unless there is a specific LAN-only reason to widen it.

## Proxy Contract

Fedora/Garage ingress should terminate HTTPS and proxy to the Windows runtime over the existing private path. The app should see the public origin as `https://aibrylabs.com`.

Required forwarded headers:

- `Host: aibrylabs.com`
- `X-Forwarded-Host: aibrylabs.com`
- `X-Forwarded-Proto: https`
- `X-Forwarded-Port: 443`
- `X-Real-IP` or `X-Forwarded-For` for request provenance

Keep auth/session cookie behavior aligned to the public HTTPS origin. Fedora is now the backend authority for account sessions, so website auth routes should proxy to Fedora from server-side code and preserve secure cookie headers.

## Upload And Body Size Notes

Avatar uploads now go through website server routes and then Fedora-owned storage processing. Preserve a stable object-path convention where practical:

- `avatars/{user_id}/avatar.{ext}`

Ingress should allow avatar upload bodies large enough for expected profile images. A conservative first pass is 10 MB at the Fedora/nginx layer, with tighter application validation added before enabling direct S3-compatible uploads.

## Media Host

The first-pass code supports a public media base URL through:

- `NEXT_PUBLIC_AIBRY_MEDIA_URL`
- server-only alias for Next image config: `AIBRY_MEDIA_PUBLIC_URL`

If set, relative avatar object paths such as `avatars/{user_id}/avatar.png` resolve against that media host. If unset, the website uses its local avatar fallback and waits for Fedora to return a browser-safe avatar URL.

## Rollback

- To roll back media hosting, unset `NEXT_PUBLIC_AIBRY_MEDIA_URL` and `AIBRY_MEDIA_PUBLIC_URL`, rebuild, and restart the Windows PM2 app.
- To roll back ingress, point Fedora/Garage routing back to the previous upstream or bypass route after verifying the Windows listener.

## Verification Checklist

- Windows: verify PM2 status for `aibry-website`.
- Windows: verify listener on `127.0.0.1:3015` or identify if it is bound more broadly.
- Windows: smoke `http://127.0.0.1:3015`.
- Fedora/Garage: verify ingress route and headers.
- Public: verify `https://aibrylabs.com`, login redirect behavior, static images, avatar images, and one protected route.

# Supabase Removal Note

Supabase has been removed from the website runtime. Historical migration notes that referred to Supabase fallback behavior are obsolete unless they are explicitly being used as audit history.

Current authority:

- Fedora owns auth, profile records, avatar processing, storage access, and persistence.
- The website calls same-origin `/api/*` routes that proxy to Fedora from server-side code.
- Browser code must not contain database credentials, object-storage credentials, service keys, refresh tokens, or backend internal tokens.

See `docs/fedora-auth-profile-storage-contract.md` for the active contract.

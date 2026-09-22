# Security Changelog — UniConnect

## 2026-09-22 — Security audit & remediation

Full audit of RLS policies, web client (Next.js), Android client, storage,
dependencies, and git history. All data in the repo confirmed mock/synthetic
(no real credentials or PII; `.env` never committed).

### Critical fixed
- **C1 — Privilege escalation via `profiles`.** The UPDATE policy only checked
  ownership, so any user could PATCH `role='admin'` (unlocking all grades,
  course management, private help requests) or rewrite their `email`.
  Fix: new BEFORE UPDATE trigger `guard_profile_write()` locks `email` and
  allows `role` to be set exactly once during first onboarding, restricted to
  `student`/`faculty`. Manual-insert policy now also blocks `admin`.
  File: `supabase/migrations/20240601000013_security_hardening.sql`

### High fixed
- **H1 — Joining arbitrary conversations.** `conversation_members` INSERT had
  `with check (true)`; any user could add themselves to any DM/group and read
  it. Fix: direct inserts restricted to self; legitimate adds go through the
  `create_conversation()` SECURITY DEFINER RPC. Web DM creation migrated to
  that RPC (`web/src/app/(app)/messages/page.tsx`).
- **H2 — Joining servers as owner/admin.** `server_members` INSERT did not
  constrain `role`. Fix: joining is always `member`; `owner` only for the
  server creator.
- **H3 — Open redirect in auth callback.** `next` query param now validated:
  only same-origin relative paths accepted (`web/src/app/(auth)/auth/callback/route.ts`).
- **H4 — Storage upload abuse.** Uploads were unrestricted in path/extension on
  public buckets (overwrite other users' files, stored-XSS via .html/.svg).
  Fix: uploads scoped to `<own-user-id>/…` with an allowlist of extensions.

### Medium fixed
- **M1 — Announcement forgery.** Any student could insert (or later edit)
  `type='announcement'`. Fix: insert AND update policies now require
  faculty/admin role for announcements.
- **M2 — `mark_conversation_read` missing membership check.** SECURITY DEFINER
  RPC could flip read-state in any conversation. Fix: membership guard added,
  search_path pinned.
- **M3 — Missing security headers.** `next.config.ts` now sets X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **M4 — Vulnerable dependencies.** `npm audit` went from 8 vulns (1 critical,
  6 high) to **0** (next 16.2.9 → 16.3.5 + transitive fixes). Verified:
  `tsc --noEmit` passes.

### Low — noted / config-side
- **L1** — `supabase/config.toml` disables email confirmations (fine for local
  dev). **Action required on the hosted Supabase project:** enable "Confirm
  email" in Auth settings, otherwise anyone can register with anyone else's
  email address.
- **L2** — Android `allowBackup` set to `false` (was leaking session tokens
  into device backups).
- **L3** — Login/register have no app-side rate limiting; Supabase GoTrue's
  built-in limiter applies server-side. Acceptable for now.

### Known residual items (flagged, not changed)
- **M5** — `profiles` SELECT exposes every user's email to every authenticated
  user. Left as-is because the UI renders it (profile page); hiding it is a
  product decision + UI change.
- Legacy vanilla-JS SPA at repo root uses `innerHTML` on static templates only
  (mock data, no user input interpolated) — low risk, superseded by `/web`.

### How to apply
Run `supabase/migrations/20240601000013_security_hardening.sql` against your
Supabase project (SQL Editor or `supabase db push`). The migration is
idempotent (drop-if-exists / create-or-replace throughout).
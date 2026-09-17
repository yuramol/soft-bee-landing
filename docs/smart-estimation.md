# Smart Estimation (feature)

Public landing feature that turns a short project brief (text and/or file) into an AI-backed **hours/price estimate** and a downloadable **PPTX** proposal.

Backend work runs on **Railway** (`ESTIMATOR_*`). This Next.js app is the **browser-facing proxy**: UI, captcha, ownership cookies, rate limits, and ops logging.

---

## User flow

1. User opens the Smart Estimation section (home / case-studies surfaces).
2. Enters project text (≥ 10 chars) and/or attaches a supported file.
3. Submits → invisible **reCAPTCHA v3** → `POST /api/presentation/generate`.
4. Loading UI polls job status until `completed` or `failed`.
5. On success: shows estimate ranges and downloads the PPTX (auto + manual).
6. Refresh / return: `GET /api/presentation/active` can resume an in-flight or just-completed job for this browser.

Local resume helper: `sessionStorage` key `estimator_active_job_id` (UX only; real auth is the signed ownership cookie).

---

## Architecture

```text
Browser (SmartEstimation)
  → lib/api/presentation/*          # client fetch helpers (no direct Railway)
  → /api/presentation/*             # Next.js route handlers
  → lib/estimator/*                 # Railway client, captcha, validation, cookies
  → Railway ESTIMATOR_BASE_URL      # create / status / download
  → Supabase estimation_logs        # service-role ops log + IP quota
```

| Layer | Role |
|-------|------|
| `src/components/sections/home/smart-estimation/` | UI: input, loading modal, result |
| `src/lib/api/presentation/` | Browser → Next API |
| `src/app/api/presentation/` | Server routes |
| `src/lib/estimator/` | Shared server helpers + Railway HTTP |
| `src/lib/api/estimation-logs/` | Supabase logging / IP counts |
| `fixtures/estimator/` | Sample briefs for manual / e2e use |

---

## API

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/presentation/generate` | Create job (multipart: `text`, `file`, `captchaToken`) |
| `GET` | `/api/presentation/active` | Latest owned in-progress/completed job for this cookie |
| `GET` | `/api/presentation/[jobId]` | Poll status + estimate |
| `GET` | `/api/presentation/[jobId]/download` | Stream PPTX |

Optional request header on create: `Idempotency-Key` (forwarded to Railway). The UI sends a new `crypto.randomUUID()` per submit.

### Create response

```json
{ "jobId": "…", "status": "queued" }
```

### Status response (shape)

```json
{
  "jobId": "…",
  "status": "analyzing|completed|failed|…",
  "progress": 0,
  "stage": "…",
  "estimate": {
    "hoursMin": 24,
    "hoursMax": 40,
    "priceMin": 960,
    "priceMax": 1600
  },
  "error": null
}
```

---

## Inputs

| Input | Rules |
|-------|--------|
| Text | Optional if file present; min **10** characters; max **32,000** characters |
| File | Optional if text present; max **10 MB** |
| Types | PDF, TXT, Markdown, DOC, DOCX |

Client validates metadata early; server also sniffs content before forwarding to Railway.

---

## Environment

See `.example.env`. Required for the feature:

| Variable | Where | Notes |
|----------|--------|--------|
| `ESTIMATOR_BASE_URL` | server | Railway base URL |
| `ESTIMATOR_API_KEY` | server | Bearer to Railway |
| `SITE_HMAC_SECRET` | server | HMAC for ownership, poll, and contact rate-limit cookies (**all envs**) |
| `SITE_ALLOWED_ORIGINS` | server | Comma-separated prod origins (estimation + contact) |
| `RECAPTCHA_SECRET` | server | siteverify |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | client | Invisible v3 |
| `SUPABASE_*` / service role | server | `estimation_logs` writes + IP counts |

Set the same keys in Vercel Project Env (Production + Preview as needed).

---

## Data: `estimation_logs`

Migration: `supabase/migrations/20260915105427_create_estimation_logs.sql`.

Stores create attempts (`queued` → `completed` / `failed`), request text, file name, IP, errors. Used for ops review and **IP rate limits**. RLS denies anon/authenticated; writes use the service role.

---

## Testing

```bash
yarn test          # Vitest: estimator helpers
yarn test:e2e      # Playwright: mocked /api/presentation/* + stubbed reCAPTCHA
```

E2E targets the case-studies page with fixtures under `fixtures/estimator/`.

---

## Related docs

- [Smart Estimation security](./smart-estimation-security.md) — authz, abuse controls, WAF ops
- Root [README.md](../README.md) — quick env + smoke checklist

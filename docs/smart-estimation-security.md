# Smart Estimation security

Security model for the public Smart Estimation form and `/api/presentation/*` proxy. Feature behaviour lives in [smart-estimation.md](./smart-estimation.md).

**Goal:** anonymous users can run estimates without accounts, without letting strangers read each other’s jobs or burn unbounded LLM/Railway cost.

---

## Threat model (summary)

| Threat | Mitigation |
|--------|------------|
| Steal another user’s estimate / PPTX | HMAC-signed ownership cookie; status/download require ownership |
| CSRF / off-site browser POST | Allowlisted `Origin` (required in production) |
| Scripted spam / cost abuse | reCAPTCHA v3 + IP burst/daily caps + cookie UX cap + edge WAF |
| Junk captcha spam | Quota reserved **before** `siteverify` |
| Malicious upload | MIME↔extension, double-ext block, magic-byte sniff on server |
| Status poll amplification | Signed poll-rate cookie (30 / 60s) |
| Secret leakage | Railway key + ownership secret server-only; upstream 401/403 → 502 |

---

## Controls

### 1. Origin / CSRF

- **Production:** request must send `Origin` in `SITE_ALLOWED_ORIGINS`. Referer-only is rejected.
- **Development:** localhost Origin/Referer allowed.
- Spoofable by non-browser clients; captcha + IP limits are the real gates for scripts.

Code: `src/lib/estimator/origin.ts`.

### 2. reCAPTCHA v3

Before Railway:

- Google `siteverify`
- Score ≥ `0.5`
- Action `estimate_create` (when Google returns `action`)
- `hostname` must be allowlisted (from `SITE_ALLOWED_ORIGINS`; localhost in development)

Fail closed if `RECAPTCHA_SECRET` is missing.

Code: `src/lib/estimator/recaptcha.ts`, `recaptcha-client.ts`.

### 3. Job ownership (no IDOR via jobId alone)

After a successful create, the server sets httpOnly cookie `estimator_jobs`:

- Payload: `{ v: 1, jobs: [{ id, exp }, …] }` (capped, expired pruned)
- Value: `base64url(json).HMAC-SHA256` with `SITE_HMAC_SECRET`
- Verified with `timingSafeEqual`

`GET …/[jobId]`, `…/download`, and `…/active` call `ownsJobId` / `getLatestOwnedJobId`. Unauthorized → **404**.

**No hardcoded secret fallback** — missing `SITE_HMAC_SECRET` → generate returns 500; ownership checks fail closed.

Code: `ownership-token.ts`, `ownership.ts`, `secrets.ts`.

### 4. Rate limits (app layer)

| Limit | Value | Store |
|-------|--------|--------|
| Burst by IP | **5 / 10 minutes** | `estimation_logs` count |
| Daily by IP | **10 / 24 hours** | `estimation_logs` count |
| Soft daily (UX) | **10 / calendar day** | unsigned cookie `rate_limit_presentation` |
| Status / active poll | **30 / 60 seconds** | signed cookie `estimator_poll_rate` |

Generate flow:

1. Origin + ownership secret configured + client IP present (else 503)
2. Cookie + IP burst + IP daily checks
3. **Reserve** a row in `estimation_logs` (counts toward IP limits)
4. Re-check burst/daily after reserve
5. Bump cookie
6. Captcha → validate upload → Railway
7. Attach `job_id` on success; mark `failed` on captcha/validation/upstream errors

Failed captcha/validation **still consume** IP/cookie quota. Missing IP or DB count errors → **503** (fail closed).

Constants: `src/lib/estimator/constants.ts`.

### 5. Upload hardening

Server path: `validateEstimatorUploadWithContent`

- Size ≤ 10 MB
- Project text ≤ `ESTIMATOR_MAX_TEXT_CHARS` (32,000) when provided
- MIME must match extension when MIME present
- Dangerous trailing extensions (e.g. `.pdf.exe`) rejected
- Magic sniff: PDF `%PDF-`, DOC OLE, DOCX ZIP/`PK`, text/markdown non-binary

Client keeps sync metadata validation for UX only.

### 6. Idempotency

UI sends `Idempotency-Key: <uuid>` per submit; Next forwards it to Railway. Dedup of retries with the **same** key is Railway’s responsibility. A new submit always gets a new UUID.

### 7. Logging / PII

`estimation_logs` may store `request_text`, `file_name`, `ip`, errors. Service-role writes; RLS denies client roles. Treat as sensitive ops data (retention/access is an ops concern).

---

## Edge WAF (ops — required for production)

App limits run **after** the serverless invoke. Edge rules are cheaper and stop bursts before captcha/DB.

**Vercel** → Project → **Firewall** → **Configure**:

1. Path `/api/presentation/generate` + method `POST` → Rate limit **5 / hour / IP** → Deny 429  
2. Optional: Bot Protection / Attack Challenge  
3. Optional: second rule **20 / day / IP**  
4. Enable on **Production** (and Preview if estimator is live there)

**Verify:** scripted POSTs past the edge limit return 429 **without** new `estimation_logs` rows; normal UI submit still works.

If **Cloudflare** is in front: equivalent rate rule + bot mode. Prefer one primary edge limiter to avoid confusing double limits.

---

## Checklist vs common abuse criteria

| Criterion | Status |
|-----------|--------|
| Origin / CSRF-style check | ✅ Prod Origin allowlist |
| Rate limit by IP (short window) | ✅ 5 / 10 min |
| Rate limit by IP (daily) | ✅ 10 / 24h |
| WAF / bot protection | ⚠️ Ops (Vercel/CF) — not in repo |
| CAPTCHA before expensive op | ✅ reCAPTCHA v3 |
| Hard AI input/output token caps | ✅ Partial in Next — text ≤ 32k chars, file ≤ 10 MB; **output / model token caps on Railway** |
| Global spend budget | ✅ Railway-side (not in this Next.js repo) |
| Idempotency key | ✅ Forwarded; storage on Railway |

---

## Residuals (accepted)

- Poll cookie can be cleared → poll throttle resets (ownership still required).
- Parallel creates can still race slightly; reservation + recount shrinks the window (no DB advisory lock yet).
- DOCX magic accepts generic ZIP; `.doc` accepts OLE — coarse type gate only.
- Next caps **input size** (text chars + file bytes), not tokenizer-accurate tokens. Model output / spend limits stay on **Railway**.

---

## Key files

| Area | Path |
|------|------|
| Generate + quota | `src/app/api/presentation/generate/route.ts` |
| Status / download / active | `src/app/api/presentation/[jobId]/`, `…/download/`, `active/` |
| Ownership HMAC | `src/lib/estimator/ownership-token.ts` |
| Poll throttle | `src/lib/estimator/poll-rate-limit.ts` |
| Captcha | `src/lib/estimator/recaptcha.ts` |
| Uploads | `src/lib/estimator/validate-upload.ts` |
| IP logs | `src/lib/api/estimation-logs/client.ts` |
| Unit tests | `src/lib/estimator/estimator.test.ts` |

---

## Local / deploy secrets

```bash
# required everywhere (no dev fallback)
SITE_HMAC_SECRET=$(openssl rand -base64 32)
```

Also set `ESTIMATOR_BASE_URL`, `ESTIMATOR_API_KEY`, `SITE_ALLOWED_ORIGINS`, reCAPTCHA keys, and Supabase service role. Never commit live keys.

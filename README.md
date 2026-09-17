# Soft Bee Landing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Estimation

AI-backed project estimate + PPTX download (Railway backend, Next.js proxy).

| Doc | Contents |
|-----|----------|
| [docs/smart-estimation.md](./docs/smart-estimation.md) | Feature: flow, API, env, testing |
| [docs/smart-estimation-security.md](./docs/smart-estimation-security.md) | Security: ownership, rate limits, captcha, WAF ops |

Quick env list: see `.example.env` and the feature doc. PRs for this work should target `dev`, not `main`.

### Smoke checklist

1. Railway `/health` OK  
2. From the prod domain: reCAPTCHA → create → poll → download PPTX  
3. Reject before Railway: bad captcha, bad Origin, over IP/cookie caps (429)  
4. Vercel Firewall rule on `POST /api/presentation/generate` (see security doc)  
5. Do not commit live API keys  

### Tests

```bash
yarn test       # Vitest — estimator helpers
yarn test:e2e   # Playwright — mocked presentation APIs
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

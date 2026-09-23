# EGY-Skills — Student Platform

A modern, minimal, youth-oriented student platform for learning programming,
Arduino and robotics. Rebuilt as a clean React 18 + Vite SPA with a strict
black & green design system, feature-first folder structure, route-level code
splitting and a small reusable UI kit.

## Tech stack

- React 18 (function components + hooks)
- Vite 5
- react-router-dom v6
- lucide-react (monochrome icons)
- Plain CSS + CSS variables

## Folder structure

```
src/
  components/    shared UI kit
  features/      auth, courses, dashboard, profile, settings
  hooks/         shared hooks
  layouts/       MainLayout, AuthLayout, TopBar, Sidebar
  lib/           apiClient, constants, logger, format
  router.jsx
  styles/        globals.css, utilities.css
  App.jsx
  main.jsx
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

## Run locally

```bash
npm ci
npm run dev
```

## Deploy

This project deploys **only to GitHub Pages**, via GitHub Actions.

See [DEPLOY.md](./DEPLOY.md) for the full guide.

Quick summary:
1. Push the repository to GitHub (`main` branch).
2. Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` auto-deploys.

## Git quickstart

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

## License

MIT — see [LICENSE](./LICENSE).

# EGY-Skills — Student Platform

Modern, minimal, youth-oriented React 18 + Vite SPA in a strict black & green
design system. Feature-first folder structure, route-level code splitting, and
a small reusable UI kit.

## Stack
- React 18 (function components + hooks only)
- Vite 5
- react-router-dom v6
- lucide-react (monochrome, currentColor)
- Plain CSS + CSS variables

## Structure
```
src/
  components/     shared UI kit
  features/       auth, courses, dashboard, profile, settings
  hooks/          useAuth, useUI, useToast, ...
  layouts/        MainLayout, AuthLayout, TopBar, Sidebar
  lib/            apiClient, constants, logger, format
  router.jsx
  styles/         globals.css, utilities.css
  App.jsx
  main.jsx
```

## Scripts
| Command           | Purpose                        |
| ----------------- | ------------------------------ |
| npm run dev       | Dev server on :5173            |
| npm run build     | Production build → dist/       |
| npm run preview   | Preview dist/ on :4173         |
| npm run lint      | ESLint                         |
| npm run zip       | Create a source tarball        |
| npm run deploy    | Deploy to Vercel (needs CLI)   |

## Deploy
See DEPLOY.md.

## License
MIT — see LICENSE.

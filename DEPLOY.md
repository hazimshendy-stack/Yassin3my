# Deployment — GitHub Pages

The only supported deployment target is **GitHub Pages**, via the official
GitHub Actions workflow at `.github/workflows/deploy.yml`.

---

## How it works

On every push to `main`:

1. The workflow installs dependencies (`npm ci`).
2. It runs `npm run build` with `VITE_BASE` set to `/<repo-name>/`
   (required because GitHub Pages serves from a subpath).
3. It copies `dist/index.html` to `dist/404.html` (SPA deep-link fallback).
4. It adds `.nojekyll` so Jekyll doesn't strip files starting with `_`.
5. It uploads the artifact and publishes it with `actions/deploy-pages`.

No `gh-pages` branch, no `gh-pages` npm package, no external services.

---

## First-time setup

1. Push your code to `main`:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

2. On GitHub, open the repo → **Settings** → **Pages**.

3. Under **Build and deployment** → **Source**, choose **GitHub Actions**.

4. Go to the **Actions** tab. The `Deploy to GitHub Pages` workflow should
   already be running. Wait for it to finish (about 1 minute).

5. Your site will be live at:
   ```
   https://<user>.github.io/<repo>/
   ```

---

## Updating the site

```bash
git add .
git commit -m "your change"
git push
```

The workflow re-runs automatically and re-publishes.

You can also trigger it manually from **Actions → Deploy to GitHub Pages → Run workflow**.

---

## Local preview (matches what gets deployed)

```bash
npm ci
npm run build
npm run preview
# → http://localhost:4173
```

---

## Custom domain (optional)

1. Repo → **Settings** → **Pages** → **Custom domain**.
2. Enter your domain (e.g. `egy-skills.com`).
3. At your DNS provider, add:
   - `A` records to `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
   - `CNAME` record `www` → `<user>.github.io`
4. Add a file `public/CNAME` containing your domain (single line).
5. Commit and push — the workflow will pick it up.

---

## Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| Blank page after deploy | `VITE_BASE` wrong | Confirm repo name matches — the workflow reads it automatically |
| 404 on `/courses` | Missing `404.html` | `.github/workflows/deploy.yml` creates it; check that step ran |
| `_next`/`_assets` missing | Jekyll stripped files | Ensure `public/.nojekyll` exists (created automatically) |
| Workflow doesn't start | Pages source not set to Actions | Settings → Pages → Source: **GitHub Actions** |
| Old deploy still visible | Cache | Hard-refresh (Ctrl+Shift+R) or check the Actions run logs |

---

## What was removed

This project intentionally does **not** support:
- Vercel
- Netlify
- Docker / Nginx
- Cloudflare Pages
- Surge
- Firebase Hosting

All configuration files and scripts for those targets have been deleted.

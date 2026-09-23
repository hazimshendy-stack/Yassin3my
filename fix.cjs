#!/usr/bin/env node
"use strict";
/* =============================================================================
 * fix.cjs — Keep ONLY GitHub Pages deployment
 * Removes: Vercel, Netlify, Docker, Cloudflare, Surge, Firebase, gh-pages branch
 * Adds:    .github/workflows/deploy.yml (official GitHub Pages action)
 * ============================================================================= */

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const SELF = path.basename(__filename);

const C = {
  r: "\x1b[0m",
  b: "\x1b[1m",
  red: "\x1b[31m",
  grn: "\x1b[32m",
  yel: "\x1b[33m",
  cyn: "\x1b[36m",
  gry: "\x1b[90m",
};
const TTY = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (c, s) => (TTY ? c + s + C.r : String(s));
const ok = (m) => console.log(paint(C.grn, "✓") + " " + m);
const warn = (m) => console.log(paint(C.yel, "⚠") + " " + m);
const err = (m) => console.log(paint(C.red, "✗") + " " + m);
const info = (m) => console.log(paint(C.cyn, "ℹ") + " " + m);
const step = (m) => console.log("\n" + paint(C.b + C.cyn, "▶ " + m));
const hr = () => console.log(paint(C.gry, "─".repeat(60)));

// ---------- FS helpers ----------
const exists = (p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
};
const readF = (p) => {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
};
const writeF = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, "utf8");
};
const rm = (rel) => {
  const full = path.join(ROOT, rel);
  try {
    if (exists(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
};
const ask = (q) =>
  new Promise((res) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(q, (a) => {
      rl.close();
      res(a.trim());
    });
  });

// ---------- Backup ----------
function backup() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const dir = path.join(
    ROOT,
    ".backup-" +
      d.getFullYear() +
      pad(d.getMonth() + 1) +
      pad(d.getDate()) +
      "-" +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds())
  );
  const skipD = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage",
    "out",
    ".cache",
    ".vite",
    ".turbo",
  ]);
  const skipF = new Set([SELF, "errors.txt", ".DS_Store", "Thumbs.db"]);
  try {
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    (function walk(s, t) {
      let es;
      try {
        es = fs.readdirSync(s, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of es) {
        if (
          skipD.has(e.name) ||
          skipF.has(e.name) ||
          e.name.startsWith(".backup-")
        )
          continue;
        const sp = path.join(s, e.name),
          tp = path.join(t, e.name);
        if (e.isDirectory()) {
          fs.mkdirSync(tp, { recursive: true });
          walk(sp, tp);
        } else if (e.isFile()) {
          try {
            fs.copyFileSync(sp, tp);
            n++;
          } catch {}
        }
      }
    })(ROOT, dir);
    ok("Backup: " + paint(C.cyn, path.basename(dir)) + " (" + n + " files)");
  } catch (e) {
    warn("backup skipped: " + e.message);
  }
}

// =============================================================================
// 1. DELETE ALL NON-GITHUB DEPLOY ARTIFACTS
// =============================================================================
const KILL_FILES = [
  // Hosting configs
  "vercel.json",
  "netlify.toml",
  "netlify.json",
  "Dockerfile",
  "Dockerfile.dev",
  ".dockerignore",
  "docker-compose.yml",
  "docker-compose.yaml",
  "firebase.json",
  ".firebaserc",
  "fly.toml",
  "render.yaml",
  "railway.json",
  "app.yaml",
  "static.json",
  // Deploy scripts
  "deploy-to-github.cjs",
  "deploy.cjs",
  "deploy.js",
  "scripts/deploy-interactive.cjs",
  "scripts/zip-project.cjs",
  "scripts/deploy.js",
  "scripts/deploy.cjs",
  // CI/CD (old)
  ".github/workflows/ci.yml",
  ".github/workflows/deploy-pages.yml",
  ".github/workflows/deploy-vercel.yml",
  ".github/workflows/release.yml",
  ".github/workflows/dependency-review.yml",
  // Backup leftovers
  "surge.log",
  ".surgeignore",
];

const KILL_DIRS = [".vercel", ".netlify", "out"];

function killArtifacts() {
  step("Removing non-GitHub deployment artifacts");
  let n = 0;

  for (const f of KILL_FILES) {
    if (f === SELF) continue;
    if (rm(f)) {
      info("removed " + f);
      n++;
    }
  }
  for (const d of KILL_DIRS) {
    if (rm(d)) {
      info("removed dir " + d + "/");
      n++;
    }
  }

  // Kill any *.cjs at root that starts with "deploy" (except self)
  try {
    for (const name of fs.readdirSync(ROOT)) {
      if (name === SELF) continue;
      if (
        /^deploy/i.test(name) &&
        (name.endsWith(".cjs") ||
          name.endsWith(".js") ||
          name.endsWith(".sh") ||
          name.endsWith(".bat"))
      ) {
        if (rm(name)) {
          info("removed " + name);
          n++;
        }
      }
    }
  } catch {
    /* ignore */
  }

  // Kill any workflow that isn't going to be our deploy.yml
  const wfDir = path.join(ROOT, ".github", "workflows");
  if (exists(wfDir)) {
    try {
      for (const name of fs.readdirSync(wfDir)) {
        if (name === "deploy.yml") continue;
        try {
          fs.unlinkSync(path.join(wfDir, name));
          info("removed workflow " + name);
          n++;
        } catch {}
      }
    } catch {
      /* ignore */
    }
  }

  // Remove gh-pages branch folder if it was deployed locally (rare)
  const ghPagesDir = path.join(ROOT, "node_modules", ".cache", "gh-pages");
  if (exists(ghPagesDir)) {
    try {
      fs.rmSync(ghPagesDir, { recursive: true, force: true });
      n++;
    } catch {}
  }

  ok("Removed " + n + " item(s)");
}

// =============================================================================
// 2. PATCH vite.config.js → use VITE_BASE env (default '/')
// =============================================================================
function patchViteConfig() {
  step("Patching vite.config.js (base from VITE_BASE env)");
  const p = path.join(ROOT, "vite.config.js");
  if (!exists(p)) {
    warn("vite.config.js not found — skipping");
    return false;
  }
  let src = readF(p);

  // Remove any existing `base:` line
  src = src.replace(/^\s*base\s*:\s*[^\n]+,?\s*\n/gm, "");

  // Insert base right after `defineConfig({` (or `return {`)
  const baseExpr = "base: process.env.VITE_BASE || '/',";
  if (/defineConfig\s*\(\s*\{/.test(src)) {
    src = src.replace(/(defineConfig\s*\(\s*\{)/, "$1\n    " + baseExpr);
  } else if (/return\s*\{/.test(src)) {
    src = src.replace(/(return\s*\{)/, "$1\n    " + baseExpr);
  } else {
    warn("Could not find defineConfig({ — add manually: " + baseExpr);
    return false;
  }

  writeF(p, src);
  ok("base = process.env.VITE_BASE || '/'");
  return true;
}

// =============================================================================
// 3. PATCH package.json — remove deploy:* + gh-pages + predeploy/deploy
// =============================================================================
function patchPackageJson() {
  step("Cleaning package.json");
  const p = path.join(ROOT, "package.json");
  if (!exists(p)) {
    warn("package.json not found");
    return false;
  }
  let pkg;
  try {
    pkg = JSON.parse(readF(p));
  } catch (e) {
    warn("invalid package.json: " + e.message);
    return false;
  }

  // Remove deploy-related scripts
  if (pkg.scripts) {
    const kill = [];
    for (const k of Object.keys(pkg.scripts)) {
      if (/^deploy/i.test(k) || k === "predeploy" || k === "zip") kill.push(k);
    }
    for (const k of kill) delete pkg.scripts[k];
  }

  // Remove gh-pages devDep
  if (pkg.devDependencies && pkg.devDependencies["gh-pages"]) {
    delete pkg.devDependencies["gh-pages"];
  }

  writeF(p, JSON.stringify(pkg, null, 2) + "\n");
  ok("removed deploy:* scripts + gh-pages");
  return true;
}

// =============================================================================
// 4. CREATE .github/workflows/deploy.yml
// =============================================================================
const DEPLOY_YML = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci --no-audit --no-fund

      - name: Lint (soft)
        run: npm run lint
        continue-on-error: true

      - name: Build
        env:
          NODE_ENV: production
          VITE_BASE: /\${{ github.event.repository.name }}/
        run: npm run build

      - name: Verify build output
        run: |
          test -f dist/index.html || (echo "dist/index.html missing" && exit 1)
          echo "✓ Build verified"

      - name: Add .nojekyll (bypass Jekyll)
        run: touch dist/.nojekyll

      - name: Add 404 fallback for SPA
        run: cp dist/index.html dist/404.html

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

function createWorkflow() {
  step("Creating .github/workflows/deploy.yml");
  writeF(path.join(ROOT, ".github", "workflows", "deploy.yml"), DEPLOY_YML);
  ok(".github/workflows/deploy.yml created");
}

// =============================================================================
// 5. CREATE public/.nojekyll + public/404.html
// =============================================================================
function createPublicAssets() {
  step("Creating public/.nojekyll + public/404.html");
  const publicDir = path.join(ROOT, "public");
  fs.mkdirSync(publicDir, { recursive: true });

  // .nojekyll — tells GitHub Pages not to run Jekyll (which breaks _-prefixed files)
  writeF(path.join(publicDir, ".nojekyll"), "");

  // 404.html — SPA fallback. Redirect all unknown paths to root preserving hash.
  const fallback404 = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>EGY-Skills</title>
    <script>
      // SPA fallback: preserve the requested path so React Router can read it after redirect.
      (function () {
        var path = location.pathname || '/';
        var parts = path.split('/').filter(Boolean);
        // First segment is the repo base (e.g. "/egy-skills/")
        var base = parts.length ? '/' + parts[0] + '/' : '/';
        var rest = path.slice(base.length) || '';
        sessionStorage.setItem('egyskills.redirect', '/' + rest.replace(/^\\//, ''));
        location.replace(base);
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
  writeF(path.join(publicDir, "404.html"), fallback404);

  ok("public/.nojekyll + public/404.html created");
}

// =============================================================================
// 6. REWRITE DEPLOY.md (GitHub Pages only)
// =============================================================================
const DEPLOY_MD = `# Deployment — GitHub Pages

The only supported deployment target is **GitHub Pages**, via the official
GitHub Actions workflow at \`.github/workflows/deploy.yml\`.

---

## How it works

On every push to \`main\`:

1. The workflow installs dependencies (\`npm ci\`).
2. It runs \`npm run build\` with \`VITE_BASE\` set to \`/<repo-name>/\`
   (required because GitHub Pages serves from a subpath).
3. It copies \`dist/index.html\` to \`dist/404.html\` (SPA deep-link fallback).
4. It adds \`.nojekyll\` so Jekyll doesn't strip files starting with \`_\`.
5. It uploads the artifact and publishes it with \`actions/deploy-pages\`.

No \`gh-pages\` branch, no \`gh-pages\` npm package, no external services.

---

## First-time setup

1. Push your code to \`main\`:
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   \`\`\`

2. On GitHub, open the repo → **Settings** → **Pages**.

3. Under **Build and deployment** → **Source**, choose **GitHub Actions**.

4. Go to the **Actions** tab. The \`Deploy to GitHub Pages\` workflow should
   already be running. Wait for it to finish (about 1 minute).

5. Your site will be live at:
   \`\`\`
   https://<user>.github.io/<repo>/
   \`\`\`

---

## Updating the site

\`\`\`bash
git add .
git commit -m "your change"
git push
\`\`\`

The workflow re-runs automatically and re-publishes.

You can also trigger it manually from **Actions → Deploy to GitHub Pages → Run workflow**.

---

## Local preview (matches what gets deployed)

\`\`\`bash
npm ci
npm run build
npm run preview
# → http://localhost:4173
\`\`\`

---

## Custom domain (optional)

1. Repo → **Settings** → **Pages** → **Custom domain**.
2. Enter your domain (e.g. \`egy-skills.com\`).
3. At your DNS provider, add:
   - \`A\` records to \`185.199.108.153\`, \`.109.153\`, \`.110.153\`, \`.111.153\`
   - \`CNAME\` record \`www\` → \`<user>.github.io\`
4. Add a file \`public/CNAME\` containing your domain (single line).
5. Commit and push — the workflow will pick it up.

---

## Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| Blank page after deploy | \`VITE_BASE\` wrong | Confirm repo name matches — the workflow reads it automatically |
| 404 on \`/courses\` | Missing \`404.html\` | \`.github/workflows/deploy.yml\` creates it; check that step ran |
| \`_next\`/\`_assets\` missing | Jekyll stripped files | Ensure \`public/.nojekyll\` exists (created automatically) |
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
`;

function writeDeployMd() {
  step("Writing DEPLOY.md (GitHub Pages only)");
  writeF(path.join(ROOT, "DEPLOY.md"), DEPLOY_MD);
  ok("DEPLOY.md rewritten");
}

// =============================================================================
// 7. REWRITE README.md (remove non-GitHub deployment references)
// =============================================================================
function writeReadme() {
  step("Rewriting README.md");
  const existing = readF(path.join(ROOT, "README.md")) || "";
  // Preserve the title if it exists, else default
  const titleMatch = existing.match(/^#\s+.+$/m);
  const title = titleMatch ? titleMatch[0] : "# EGY-Skills";

  const readme =
    title +
    `

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

\`\`\`
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
\`\`\`

## Scripts

| Command | Purpose |
| --- | --- |
| \`npm run dev\` | Dev server on http://localhost:5173 |
| \`npm run build\` | Production build → \`dist/\` |
| \`npm run preview\` | Preview the production build |
| \`npm run lint\` | ESLint |

## Run locally

\`\`\`bash
npm ci
npm run dev
\`\`\`

## Deploy

This project deploys **only to GitHub Pages**, via GitHub Actions.

See [DEPLOY.md](./DEPLOY.md) for the full guide.

Quick summary:
1. Push the repository to GitHub (\`main\` branch).
2. Settings → Pages → Source: **GitHub Actions**.
3. Every push to \`main\` auto-deploys.

## Git quickstart

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
\`\`\`

## License

MIT — see [LICENSE](./LICENSE).
`;
  writeF(path.join(ROOT, "README.md"), readme);
  ok("README.md rewritten");
}

// =============================================================================
// 8. REMOVE LEFTOVER CI/CD REFERENCES FROM .gitignore/.dockerignore
// =============================================================================
function cleanGitignore() {
  step("Sanity check .gitignore");
  const p = path.join(ROOT, ".gitignore");
  if (!exists(p)) {
    writeF(
      p,
      "node_modules/\ndist/\n.env\n.env.*\n!.env.example\n.backup-*/\n*.log\n.DS_Store\n"
    );
    ok(".gitignore created");
    return;
  }
  let src = readF(p);
  const mustIgnore = ["node_modules/", "dist/", ".env", ".backup-*/"];
  let added = false;
  for (const line of mustIgnore) {
    if (!src.split(/\r?\n/).some((l) => l.trim() === line)) {
      src += (src.endsWith("\n") ? "" : "\n") + line + "\n";
      added = true;
    }
  }
  if (added) {
    writeF(p, src);
    ok(".gitignore topped up");
  } else ok(".gitignore already ok");
}

// =============================================================================
// MAIN
// =============================================================================
async function main() {
  console.log("");
  console.log(
    paint(
      C.b + C.grn,
      "╔══════════════════════════════════════════════════════╗"
    )
  );
  console.log(
    paint(
      C.b + C.grn,
      "║   EGY-Skills · GitHub Pages only · cleanup fixer     ║"
    )
  );
  console.log(
    paint(
      C.b + C.grn,
      "╚══════════════════════════════════════════════════════╝"
    )
  );
  console.log("");

  backup();

  // Confirm
  console.log(paint(C.b, "  This will:"));
  console.log(
    "   • Delete Vercel / Netlify / Docker / Cloudflare / Surge / Firebase configs"
  );
  console.log("   • Delete any deploy-* scripts and old GitHub workflows");
  console.log("   • Create .github/workflows/deploy.yml (GitHub Pages only)");
  console.log("   • Patch vite.config.js to use VITE_BASE env");
  console.log("   • Remove deploy:* scripts + gh-pages from package.json");
  console.log("   • Rewrite DEPLOY.md and README.md");
  console.log("   • Create public/.nojekyll and public/404.html");
  console.log("");
  const a = await ask("  Proceed? (Y/n): ");
  if (a && !/^y?$/i.test(a)) {
    info("Cancelled.");
    process.exit(0);
  }

  killArtifacts();
  patchViteConfig();
  patchPackageJson();
  createWorkflow();
  createPublicAssets();
  writeDeployMd();
  writeReadme();
  cleanGitignore();

  hr();
  ok("Done.");
  console.log("");
  console.log(paint(C.b, "  Next steps:"));
  console.log(
    "    1. " +
      paint(C.cyn, 'git add . && git commit -m "github-pages only" && git push')
  );
  console.log(
    "    2. GitHub → Settings → Pages → Source: " +
      paint(C.cyn, "GitHub Actions")
  );
  console.log(
    "    3. Watch the run at: " +
      paint(C.cyn, "https://github.com/<user>/<repo>/actions")
  );
  console.log("");
  console.log(
    paint(C.gry, "  Site will be live at: https://<user>.github.io/<repo>/")
  );
  console.log("");
}

main().catch((e) => {
  err(e && e.stack ? e.stack : String(e));
  process.exit(1);
});

#!/usr/bin/env node
"use strict";
/* =============================================================================
 * deploy-to-github.cjs — one-shot: patch → git init → push → GitHub Pages
 *
 * Usage:
 *   node deploy-to-github.cjs
 *   node deploy-to-github.cjs --user=Shendyy --repo=egy-skills
 *   node deploy-to-github.cjs --skip-push      (local prep only)
 * ============================================================================= */

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const { spawnSync } = require("child_process");

const ROOT = __dirname;

// ---------- ANSI ----------
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

// ---------- CLI args ----------
const argv = process.argv.slice(2);
const argOf = (k) => {
  const a = argv.find((x) => x.startsWith("--" + k + "="));
  return a ? a.split("=")[1] : null;
};
const SKIP_PUSH = argv.includes("--skip-push");

// ---------- Input ----------
function ask(q) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((res) =>
    rl.question(q, (a) => {
      rl.close();
      res(a.trim());
    })
  );
}

// ---------- Shell ----------
function run(cmd, args, opts) {
  args = args || [];
  opts = opts || {};
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd || ROOT,
    stdio: opts.silent ? "pipe" : "inherit",
    encoding: "utf8",
    shell: os.platform() === "win32",
    timeout: opts.timeout || 5 * 60 * 1000,
  });
  return {
    code: typeof r.status === "number" ? r.status : 1,
    out: (r.stdout || "") + (r.stderr || ""),
  };
}

// ---------- FS ----------
const exists = (p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
};
const read = (p) => {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
};
const write = (p, s) => {
  fs.writeFileSync(p, s, "utf8");
};

// ---------- Backup ----------
function backup() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const tag =
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds());
  const dir = path.join(ROOT, ".backup-" + tag);
  const skipD = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage",
    "out",
  ]);
  const skipF = new Set([path.basename(__filename), "errors.txt", ".DS_Store"]);
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
    ok("Backup: " + path.basename(dir) + " (" + n + " files)");
  } catch (e) {
    warn("backup skipped: " + e.message);
  }
}

// ---------- 1. Patch vite.config.js ----------
function patchViteConfig(repoName) {
  step("Patching vite.config.js");
  const p = path.join(ROOT, "vite.config.js");
  if (!exists(p)) {
    warn("vite.config.js not found — skipping");
    return false;
  }
  let src = read(p);

  const baseLine = "  base: '/" + repoName + "/',";

  // If a base already exists, replace it
  if (/^\s*base\s*:\s*['"`].*?['"`]\s*,?\s*$/m.test(src)) {
    src = src.replace(/^\s*base\s*:\s*['"`].*?['"`]\s*,?\s*$/m, baseLine);
  } else {
    // Insert base right after `export default defineConfig({`
    src = src.replace(
      /(export\s+default\s+defineConfig\s*\(\s*\{)/,
      "$1\n" + baseLine
    );
    // Or if there's a `=> ({` pattern
    if (!/base\s*:/.test(src)) {
      src = src.replace(/return\s*\{\s*\n/, "return {\n" + baseLine + "\n");
    }
  }

  if (!/base\s*:/.test(src)) {
    warn(
      "Could not auto-insert base — please add manually: base: '/" +
        repoName +
        "/'"
    );
    return false;
  }

  write(p, src);
  ok("base = '/" + repoName + "/'");
  return true;
}

// ---------- 2. Patch package.json (scripts + devDep) ----------
function patchPackageJson() {
  step("Patching package.json");
  const p = path.join(ROOT, "package.json");
  if (!exists(p)) {
    warn("package.json not found — aborting");
    return false;
  }
  let pkg;
  try {
    pkg = JSON.parse(read(p));
  } catch (e) {
    warn("package.json invalid: " + e.message);
    return false;
  }

  pkg.scripts = pkg.scripts || {};
  pkg.scripts.predeploy = pkg.scripts.predeploy || "npm run build";
  pkg.scripts.deploy = pkg.scripts.deploy || "gh-pages -d dist --dotfiles";
  pkg.devDependencies = pkg.devDependencies || {};
  if (!pkg.devDependencies["gh-pages"]) {
    pkg.devDependencies["gh-pages"] = "^6.1.1";
  }

  write(p, JSON.stringify(pkg, null, 2) + "\n");
  ok("added predeploy + deploy scripts + gh-pages devDep");
  return true;
}

// ---------- 3. Install gh-pages ----------
function installGhPages() {
  step("Installing gh-pages");
  const bin =
    os.platform() === "win32"
      ? path.join(ROOT, "node_modules", ".bin", "gh-pages.cmd")
      : path.join(ROOT, "node_modules", ".bin", "gh-pages");
  if (exists(bin)) {
    ok("gh-pages already installed");
    return true;
  }

  const r = run("npm", [
    "install",
    "--save-dev",
    "gh-pages",
    "--no-audit",
    "--no-fund",
  ]);
  if (r.code !== 0) {
    warn("npm install gh-pages failed");
    return false;
  }
  ok("gh-pages installed");
  return true;
}

// ---------- 4. Create public/404.html ----------
function create404() {
  step("Creating public/404.html (SPA fallback)");
  const publicDir = path.join(ROOT, "public");
  if (!exists(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const target = path.join(publicDir, "404.html");
  const indexHtml = path.join(ROOT, "index.html");
  if (exists(target)) {
    ok("public/404.html already exists");
    return true;
  }
  if (!exists(indexHtml)) {
    // Create a minimal version
    write(
      target,
      [
        "<!doctype html>",
        '<html lang="ar" dir="rtl"><head>',
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width,initial-scale=1" />',
        "<title>EGY-Skills</title>",
        "<script>sessionStorage.redirect = location.pathname;</script>",
        '<script>location.replace("/egy-skills/" + (location.hash || "#/"));</script>',
        "</head><body></body></html>",
        "",
      ].join("\n")
    );
  } else {
    let html = read(indexHtml);
    // Add a small script that preserves the deep-link path so the SPA can recover it
    const script =
      '<script>sessionStorage.redirect=location.pathname;location.replace("/"+location.pathname.split("/")[1]+"/");</script>';
    if (!/sessionStorage\.redirect/.test(html)) {
      html = html.replace("</body>", script + "\n</body>");
    }
    write(target, html);
  }
  ok("public/404.html created");
  return true;
}

// ---------- 5. git init + remote ----------
function gitInit(user, repo) {
  step("Initializing git repository");
  const hasGit = exists(path.join(ROOT, ".git"));
  if (!hasGit) {
    const r = run("git", ["init"]);
    if (r.code !== 0) {
      warn("git init failed");
      return false;
    }
    run("git", ["branch", "-M", "main"]);
    ok("git init + branch main");
  } else {
    ok("git already initialized");
    // Ensure branch is main (silent)
    run("git", ["checkout", "-B", "main"], { silent: true });
  }

  // Ensure user.name / user.email exist (locally) so commit works
  const nameRes = run("git", ["config", "user.name"], { silent: true });
  if (!nameRes.out.trim()) {
    run("git", ["config", "user.name", user || "EGY-Skills User"], {
      silent: true,
    });
    ok("set git user.name locally");
  }
  const emailRes = run("git", ["config", "user.email"], { silent: true });
  if (!emailRes.out.trim()) {
    run(
      "git",
      ["config", "user.email", (user || "user") + "@users.noreply.github.com"],
      { silent: true }
    );
    ok("set git user.email locally");
  }

  // Remote
  const url = "https://github.com/" + user + "/" + repo + ".git";
  const getRemote = run("git", ["remote", "get-url", "origin"], {
    silent: true,
  });
  if (getRemote.code === 0 && getRemote.out.trim()) {
    run("git", ["remote", "set-url", "origin", url], { silent: true });
    ok("updated origin → " + url);
  } else {
    const r = run("git", ["remote", "add", "origin", url]);
    if (r.code !== 0) {
      warn("git remote add failed");
      return false;
    }
    ok("origin → " + url);
  }
  return true;
}

// ---------- 6. commit + push ----------
function gitCommitAndPush() {
  step("Staging and committing");
  run("git", ["add", "-A"]);

  // Are there changes?
  const status = run("git", ["status", "--porcelain"], { silent: true });
  if (!status.out.trim()) {
    ok("nothing to commit");
  } else {
    const msg =
      "deploy: " + new Date().toISOString().slice(0, 19).replace("T", " ");
    const r = run("git", ["commit", "-m", msg]);
    if (r.code !== 0) warn("git commit failed (maybe user.email/name missing)");
    else ok("commit created");
  }

  if (SKIP_PUSH) {
    warn("--skip-push given → skipping push. Local repo ready.");
    return true;
  }

  step("Pushing to GitHub");
  const r = run("git", ["push", "-u", "origin", "main"]);
  if (r.code !== 0) {
    warn("git push failed — you may need to authenticate");
    console.log(paint(C.gry, "  → Create a Personal Access Token:"));
    console.log(paint(C.gry, "    https://github.com/settings/tokens"));
    console.log(paint(C.gry, "  → Use it as the password when prompted."));
    return false;
  }
  ok("pushed to origin/main");
  return true;
}

// ---------- 7. npm run deploy ----------
function runDeploy() {
  step("Running `npm run deploy`");
  const r = run("npm", ["run", "deploy"]);
  if (r.code !== 0) {
    warn("npm run deploy failed");
    return false;
  }
  ok("Published to gh-pages branch");
  return true;
}

// ---------- main ----------
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
      "║   EGY-Skills · One-shot GitHub Pages deployment      ║"
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

  // Gather info
  let user = argOf("user");
  let repo = argOf("repo");

  // Try to guess from existing origin
  if (!user || !repo) {
    const r = run("git", ["remote", "get-url", "origin"], { silent: true });
    const m =
      r.out && r.out.match(/github\.com[:\/]([^\/]+)\/([^\.\s]+?)(?:\.git)?$/);
    if (m) {
      user = user || m[1];
      repo = repo || m[2];
    }
  }

  if (!user) user = await ask("GitHub username: ");
  if (!repo) repo = await ask("Repository name  : ");
  if (!user || !repo) {
    err("Username and repo name are required.");
    process.exit(1);
  }

  console.log("");
  info("User   : " + paint(C.cyn, user));
  info("Repo   : " + paint(C.cyn, repo));
  info("Base   : " + paint(C.cyn, "/" + repo + "/"));
  info(
    "URL    : " + paint(C.cyn, "https://" + user + ".github.io/" + repo + "/")
  );
  console.log("");

  const a = await ask("Proceed? (Y/n): ");
  if (a && !/^y?$/i.test(a)) {
    info("Cancelled.");
    process.exit(0);
  }

  // 1..4 local patches
  patchViteConfig(repo);
  patchPackageJson();
  installGhPages();
  create404();

  // 5..7 git
  if (!gitInit(user, repo)) {
    err("git setup failed");
    process.exit(1);
  }
  gitCommitAndPush();

  // 8 deploy
  runDeploy();

  hr();
  ok("All done.");
  console.log("");
  console.log("  Site will be live at:");
  console.log(
    "  " + paint(C.b + C.cyn, "https://" + user + ".github.io/" + repo + "/")
  );
  console.log("");
  console.log(paint(C.gry, "  First time only: enable GitHub Pages"));
  console.log(
    paint(
      C.gry,
      "  Repo → Settings → Pages → Source: branch `gh-pages` /root → Save"
    )
  );
  console.log("");
}

main().catch((e) => {
  err(e && e.stack ? e.stack : String(e));
  process.exit(1);
});

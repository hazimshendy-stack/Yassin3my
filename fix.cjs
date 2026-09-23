#!/usr/bin/env node
"use strict";
/* =============================================================================
 * fix.cjs — Full design overhaul (single-file, no CSS modules)
 * Overwrites everything with a polished, complete project.
 * ============================================================================= */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync, spawn } = require('child_process');

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
const hr = () => console.log(paint(C.gry, "─".repeat(64)));

const exists = (p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
};
const writeF = (rel, s) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, s, "utf8");
};
const rm = (rel) => {
  const f = path.join(ROOT, rel);
  try {
    if (exists(f)) {
      fs.rmSync(f, { recursive: true, force: true });
      return true;
    }
  } catch {}
  return false;
};

function backup() {
  const d = new Date(),
    pad = (n) => String(n).padStart(2, "0");
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
  ]);
  const skipF = new Set([SELF, "errors.txt", "bundle.txt", ".DS_Store"]);
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
// FILES
// =============================================================================
const files = {};

// ---------- package.json ----------
files["package.json"] = `{
  "name": "egy-skills",
  "private": true,
  "version": "3.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 4173 --strictPort",
    "lint": "eslint ."
  },
  "dependencies": {
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.13.0",
    "@vitejs/plugin-react": "^4.3.3",
    "eslint": "^9.13.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "globals": "^15.11.0",
    "vite": "^5.4.10"
  },
  "engines": { "node": ">=18" }
}
`;

// ---------- vite.config.js ----------
files["vite.config.js"] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 5173, host: true },
  preview: { port: 4173, strictPort: true },
  build: {
    target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 800,
    rollupOptions: { output: { manualChunks(id) {
      if (!id.includes('node_modules')) return;
      if (id.includes('react-router')) return 'vendor-router';
      if (id.includes('lucide-react')) return 'vendor-icons';
      if (id.includes('/react/') || id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react';
      return 'vendor';
    }}},
  },
});
`;

// ---------- index.html ----------
files["index.html"] = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0a0a" />
    <meta name="color-scheme" content="dark" />
    <title>EGY-Skills — منصة الطلاب</title>
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">تخطَّ إلى المحتوى</a>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

// ---------- public/logo.svg ----------
files[
  "public/logo.svg"
] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="#0a0a0a"/><rect x="14" y="14" width="36" height="36" rx="10" fill="none" stroke="#22c55e" stroke-width="4"/><circle cx="32" cy="32" r="8" fill="#22c55e"/></svg>
`;

// ---------- public/404.html ----------
files[
  "public/404.html"
] = `<!doctype html><html><head><meta charset="UTF-8"><script>(function(){var p=location.pathname||'/';var a=p.split('/').filter(Boolean);var b=a.length?'/'+a[0]+'/':'/';var r=p.slice(b.length)||'';sessionStorage.setItem('egy.redirect','/'+r.replace(/^\\//,''));location.replace(b);})();</script></head><body></body></html>
`;

// ---------- public/.nojekyll ----------
files["public/.nojekyll"] = "";

// ---------- .gitignore ----------
files[".gitignore"] = `node_modules/
dist/
.env
.env.*
!.env.example
.backup-*/
*.log
.DS_Store
.vite/
.vercel
.netlify
`;

// ---------- .github/workflows/deploy.yml ----------
files[".github/workflows/deploy.yml"] = `name: Deploy to GitHub Pages

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
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci --no-audit --no-fund
      - run: npm run build
        env:
          VITE_BASE: /\${{ github.event.repository.name }}/
      - run: touch dist/.nojekyll
      - run: cp dist/index.html dist/404.html
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
`;

// =============================================================================
// src/main.jsx
// =============================================================================
files["src/main.jsx"] = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

// =============================================================================
// src/App.jsx
// =============================================================================
files["src/App.jsx"] = `import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { UIProvider } from './contexts/UIContext.jsx';
import { router } from './router.jsx';

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </UIProvider>
  );
}
`;

// =============================================================================
// src/lib/constants.js
// =============================================================================
files["src/lib/constants.js"] = `export const APP_NAME = 'EGY-Skills';
export const ROUTES = {
  home: '/',
  courses: '/courses',
  course: (id = ':id') => '/courses/' + id,
  profile: '/profile',
  settings: '/settings',
  login: '/login',
  register: '/register',
};

export const NAV = [
  { group: 'الرئيسية', items: [
    { to: '/', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { to: '/courses', label: 'الكورسات', icon: 'BookOpen' },
    { to: '/profile', label: 'ملفي الشخصي', icon: 'User' },
  ]},
  { group: 'الحساب', items: [
    { to: '/settings', label: 'الإعدادات', icon: 'Settings' },
  ]},
];

export const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'arduino', label: 'أردوينو' },
  { id: 'python', label: 'بايثون' },
  { id: 'web', label: 'ويب' },
  { id: 'robotics', label: 'روبوتكس' },
];
`;

// =============================================================================
// src/lib/format.js
// =============================================================================
files["src/lib/format.js"] = `export function formatNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '0';
  try { return new Intl.NumberFormat('ar-EG').format(num); } catch { return String(num); }
}
export function pct(a, b) { const t = Number(b); if (!t) return 0; return Math.min(100, Math.max(0, Math.round((Number(a) / t) * 100))); }
export function initials(name = '') {
  const p = String(name).trim().split(/\\s+/).filter(Boolean);
  if (!p.length) return '؟';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
export function formatDate(d) {
  if (!d) return '';
  try { return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d)); } catch { return ''; }
}
`;

// =============================================================================
// src/contexts/UIContext.jsx
// =============================================================================
files[
  "src/contexts/UIContext.jsx"
] = `import { createContext, useContext, useState, useCallback } from 'react';
const UICtx = createContext(null);
export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  return <UICtx.Provider value={{ sidebarOpen, openSidebar, closeSidebar, toggleSidebar }}>{children}</UICtx.Provider>;
}
export function useUI() {
  const c = useContext(UICtx);
  if (!c) throw new Error('useUI needs UIProvider');
  return c;
}
`;

// =============================================================================
// src/contexts/AuthContext.jsx
// =============================================================================
files[
  "src/contexts/AuthContext.jsx"
] = `import { createContext, useContext, useEffect, useState, useCallback } from 'react';
const KEY = 'egy.auth.user';
const AuthCtx = createContext(null);
function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(read()); setReady(true); }, []);
  const login = useCallback((email, name) => {
    const u = { id: 'u-' + Date.now(), email, name: name || email.split('@')[0], role: 'student', joinedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);
  const register = useCallback((payload) => {
    const u = { id: 'u-' + Date.now(), email: payload.email, name: payload.name, role: 'student', joinedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);
  const logout = useCallback(() => { localStorage.removeItem(KEY); setUser(null); }, []);
  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return <AuthCtx.Provider value={{ user, ready, login, register, logout, updateProfile }}>{children}</AuthCtx.Provider>;
}
export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth needs AuthProvider');
  return c;
}
`;

// =============================================================================
// src/contexts/ToastContext.jsx
// =============================================================================
files[
  "src/contexts/ToastContext.jsx"
] = `import { createContext, useContext, useCallback, useEffect, useState } from 'react';
const ToastCtx = createContext(null);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((t) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, tone: 'success', ...t }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), t.duration || 3500);
  }, []);
  const api = {
    success: (m) => push({ tone: 'success', message: m }),
    error: (m) => push({ tone: 'error', message: m }),
    info: (m) => push({ tone: 'info', message: m }),
  };
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toast-portal">
        {items.map((t) => (
          <div key={t.id} className={'toast toast--' + t.tone}>
            <span className="toast__msg">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  const c = useContext(ToastCtx);
  if (!c) throw new Error('useToast needs ToastProvider');
  return c;
}
`;

// =============================================================================
// src/components/Button.jsx
// =============================================================================
files["src/components/Button.jsx"] = `import { Link } from 'react-router-dom';
export function Button({ to, href, variant = 'primary', size = 'md', block, className = '', children, ...rest }) {
  const cls = ['btn', 'btn--' + variant, 'btn--' + size, block ? 'btn--block' : '', className].filter(Boolean).join(' ');
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}
export default Button;
`;

// =============================================================================
// src/components/Card.jsx
// =============================================================================
files[
  "src/components/Card.jsx"
] = `export function Card({ as: Tag = 'div', interactive, className = '', children, ...rest }) {
  const cls = ['card', interactive ? 'card--hover' : '', className].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
export default Card;
`;

// =============================================================================
// src/components/Badge.jsx
// =============================================================================
files[
  "src/components/Badge.jsx"
] = `export function Badge({ tone = 'neutral', className = '', children }) {
  return <span className={'badge badge--' + tone + ' ' + className}>{children}</span>;
}
export default Badge;
`;

// =============================================================================
// src/components/Chip.jsx
// =============================================================================
files[
  "src/components/Chip.jsx"
] = `export function Chip({ active, className = '', children, ...rest }) {
  return <button type="button" className={'chip' + (active ? ' chip--on' : '') + ' ' + className} {...rest}>{children}</button>;
}
export default Chip;
`;

// =============================================================================
// src/components/Input.jsx
// =============================================================================
files["src/components/Input.jsx"] = `import { useId } from 'react';
export function Input({ label, hint, error, leading, id, className = '', ...rest }) {
  const aid = useId();
  const iid = id || 'in-' + aid;
  return (
    <label className={'field ' + className} htmlFor={iid}>
      {label ? <span className="field__label">{label}</span> : null}
      <span className={'field__wrap' + (error ? ' field__wrap--err' : '')}>
        {leading ? <span className="field__lead">{leading}</span> : null}
        <input id={iid} className="field__input" {...rest} />
      </span>
      {hint && !error ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__err">{error}</span> : null}
    </label>
  );
}
export default Input;
`;

// =============================================================================
// src/components/Avatar.jsx
// =============================================================================
files[
  "src/components/Avatar.jsx"
] = `import { initials } from '../lib/format.js';
export function Avatar({ src, name = '', size = 40, className = '' }) {
  return (
    <span className={'avatar ' + className} style={{ width: size, height: size, fontSize: Math.max(11, size * 0.35) }}>
      {src ? <img src={src} alt={name} /> : <span>{initials(name)}</span>}
    </span>
  );
}
export default Avatar;
`;

// =============================================================================
// src/components/Skeleton.jsx
// =============================================================================
files[
  "src/components/Skeleton.jsx"
] = `export function Skeleton({ width = '100%', height = 14, radius = 6, className = '', style }) {
  return <span aria-hidden className={'skl ' + className} style={{ width, height, borderRadius: radius, ...(style || {}) }} />;
}
export default Skeleton;
`;

// =============================================================================
// src/components/EmptyState.jsx
// =============================================================================
files["src/components/EmptyState.jsx"] = `import { Inbox } from 'lucide-react';
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty" role="status">
      <div className="empty__icon">{icon || <Inbox size={22} />}</div>
      <h3 className="empty__title">{title}</h3>
      {description ? <p className="empty__desc">{description}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
export default EmptyState;
`;

// =============================================================================
// src/components/ProgressBar.jsx
// =============================================================================
files[
  "src/components/ProgressBar.jsx"
] = `export function ProgressBar({ value = 0, className = '' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <span className={'pb ' + className} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <span className="pb__fill" style={{ width: v + '%' }} />
    </span>
  );
}
export default ProgressBar;
`;

// =============================================================================
// src/components/PageHeader.jsx
// =============================================================================
files[
  "src/components/PageHeader.jsx"
] = `import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
export function PageHeader({ breadcrumbs = [], title, subtitle, actions }) {
  return (
    <header className="ph">
      {breadcrumbs.length ? (
        <nav className="ph__crumbs" aria-label="breadcrumbs">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="ph__crumb">
              {b.to ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
              {i < breadcrumbs.length - 1 ? <ChevronLeft size={12} className="ph__sep" /> : null}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="ph__row">
        <div className="ph__text">
          <h1 className="ph__title">{title}</h1>
          {subtitle ? <p className="ph__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="ph__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
export default PageHeader;
`;

// =============================================================================
// src/components/Tabs.jsx
// =============================================================================
files[
  "src/components/Tabs.jsx"
] = `export function Tabs({ tabs = [], value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.value} role="tab" type="button" aria-selected={t.value === value}
          className={'tabs__tab' + (t.value === value ? ' tabs__tab--on' : '')}
          onClick={() => onChange && onChange(t.value)}>
          {t.label}
          {typeof t.count === 'number' ? <span className="tabs__count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
export default Tabs;
`;

// =============================================================================
// src/components/Modal.jsx
// =============================================================================
files["src/components/Modal.jsx"] = `import { useEffect } from 'react';
import { X } from 'lucide-react';
export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="modal__panel">
        <header className="modal__head">
          <h3>{title}</h3>
          <button className="modal__x" onClick={onClose} aria-label="إغلاق"><X size={18} /></button>
        </header>
        <div className="modal__body">{children}</div>
        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}
export default Modal;
`;

// =============================================================================
// src/components/Toast.jsx (only view — provider is in ToastContext)
// =============================================================================
files["src/components/Toast.jsx"] = `// Re-export for convenience
export { useToast } from '../contexts/ToastContext.jsx';
`;

// =============================================================================
// src/components/index.js
// =============================================================================
files["src/components/index.js"] = `export { Button } from './Button.jsx';
export { Card } from './Card.jsx';
export { Badge } from './Badge.jsx';
export { Chip } from './Chip.jsx';
export { Input } from './Input.jsx';
export { Avatar } from './Avatar.jsx';
export { Skeleton } from './Skeleton.jsx';
export { EmptyState } from './EmptyState.jsx';
export { ProgressBar } from './ProgressBar.jsx';
export { PageHeader } from './PageHeader.jsx';
export { Tabs } from './Tabs.jsx';
export { Modal } from './Modal.jsx';
`;

// =============================================================================
// src/layouts/TopBar.jsx
// =============================================================================
files[
  "src/layouts/TopBar.jsx"
] = `import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogIn, LogOut, Menu, Search, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUI } from '../contexts/UIContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { ROUTES } from '../lib/constants.js';

export function TopBar() {
  const { toggleSidebar } = useUI();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__burger" onClick={toggleSidebar} aria-label="القائمة"><Menu size={20} /></button>
        <Link to={ROUTES.home} className="topbar__brand">
          <span className="brand__mark" aria-hidden />
          <span className="brand__name">EGY-Skills</span>
        </Link>
      </div>

      <div className="topbar__right">
        <button className="icon-btn" aria-label="الإشعارات" title="الإشعارات">
          <Bell size={18} />
          <span className="icon-btn__dot" />
        </button>

        {user ? (
          <div className="user-menu" ref={menuRef}>
            <button className="user-menu__trigger" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen}>
              <Avatar name={user.name} size={30} />
              <span className="user-menu__name">{user.name}</span>
            </button>
            {menuOpen ? (
              <div className="user-menu__panel" role="menu">
                <button className="user-menu__item" onClick={() => { setMenuOpen(false); nav(ROUTES.profile); }}>
                  <UserIcon size={15} /> <span>ملفي الشخصي</span>
                </button>
                <button className="user-menu__item" onClick={() => { setMenuOpen(false); nav(ROUTES.settings); }}>
                  <SettingsIcon size={15} /> <span>الإعدادات</span>
                </button>
                <div className="user-menu__sep" />
                <button className="user-menu__item user-menu__item--danger" onClick={() => { setMenuOpen(false); logout(); nav(ROUTES.login); }}>
                  <LogOut size={15} /> <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Link to={ROUTES.login} className="btn btn--primary btn--sm">
            <LogIn size={15} /> <span>دخول</span>
          </Link>
        )}
      </div>
    </header>
  );
}
export default TopBar;
`;

// =============================================================================
// src/layouts/Sidebar.jsx
// =============================================================================
files["src/layouts/Sidebar.jsx"] = `import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User as UserIcon, Settings as SettingsIcon, Compass, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useUI } from '../contexts/UIContext.jsx';
import { NAV } from '../lib/constants.js';

const ICONS = { LayoutDashboard, BookOpen, User: UserIcon, Settings: SettingsIcon };

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUI();
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && closeSidebar();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [closeSidebar]);

  return (
    <>
      {sidebarOpen ? <div className="sidebar__overlay" onClick={closeSidebar} aria-hidden /> : null}
      <aside ref={ref} className={'sidebar' + (sidebarOpen ? ' sidebar--open' : '')} aria-label="التنقل">
        <button className="sidebar__close" onClick={closeSidebar} aria-label="إغلاق"><X size={18} /></button>

        <div className="sidebar__brand">
          <div className="brand__mark" aria-hidden />
          <div>
            <div className="sidebar__title">EGY-Skills</div>
            <div className="sidebar__tag">منصة الطلاب</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((group) => (
            <div key={group.group} className="sidebar__group">
              <p className="sidebar__group-title">{group.group}</p>
              <ul>
                {group.items.map((item) => {
                  const Ico = ICONS[item.icon] || Compass;
                  return (
                    <li key={item.to}>
                      <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => 'side-link' + (isActive ? ' side-link--on' : '')} onClick={closeSidebar}>
                        <span className="side-link__icon"><Ico size={18} /></span>
                        <span className="side-link__label">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar__cta">
          <div className="sidebar__cta-title">ابدأ رحلتك</div>
          <p className="sidebar__cta-desc">اختر كورسًا وابدأ التعلم الآن.</p>
          <NavLink to="/courses" className="btn btn--primary btn--sm btn--block" onClick={closeSidebar}>تصفح الكورسات</NavLink>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
`;

// =============================================================================
// src/layouts/MainLayout.jsx
// =============================================================================
files[
  "src/layouts/MainLayout.jsx"
] = `import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar.jsx';
import { Sidebar } from './Sidebar.jsx';

export function MainLayout() {
  return (
    <div className="app">
      <TopBar />
      <div className="app__body">
        <Sidebar />
        <main id="main-content" className="app__main" role="main">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default MainLayout;
`;

// =============================================================================
// src/layouts/AuthLayout.jsx
// =============================================================================
files[
  "src/layouts/AuthLayout.jsx"
] = `import { Link, Outlet } from 'react-router-dom';
import { Sparkles, BookOpen, Award, Users } from 'lucide-react';
import { ROUTES } from '../lib/constants.js';

export function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <Link to={ROUTES.home} className="auth__brand">
          <span className="brand__mark" aria-hidden />
          <span>EGY-Skills</span>
        </Link>

        <div className="auth__hero">
          <span className="auth__hero-chip"><Sparkles size={14} /> منصة تعليمية متكاملة</span>
          <h1 className="auth__hero-title">تعلّم. ابنِ. ابتكر.</h1>
          <p className="auth__hero-sub">انضم إلى منصة إيجي سكيلز وابدأ رحلتك في عالم الأردوينو والبرمجة والروبوتكس مع محتوى عربي معاصر ومشاريع عملية.</p>
        </div>

        <ul className="auth__points">
          <li><BookOpen size={16} /> <span>دروس عملية ومنهجية واضحة</span></li>
          <li><Award size={16} /> <span>تتبع التقدم وشهادات إتمام</span></li>
          <li><Users size={16} /> <span>مجتمع طلابي ومحتوى حديث</span></li>
        </ul>

        <p className="auth__copy">© {new Date().getFullYear()} EGY-Skills</p>
      </aside>

      <section className="auth__main">
        <div className="auth__card">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
export default AuthLayout;
`;

// =============================================================================
// src/router.jsx
// =============================================================================
files[
  "src/router.jsx"
] = `import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

const Dashboard = lazy(() => import('./pages/DashboardPage.jsx'));
const Courses = lazy(() => import('./pages/CoursesPage.jsx'));
const CourseDetail = lazy(() => import('./pages/CourseDetailPage.jsx'));
const Profile = lazy(() => import('./pages/ProfilePage.jsx'));
const Settings = lazy(() => import('./pages/SettingsPage.jsx'));
const Login = lazy(() => import('./pages/LoginPage.jsx'));
const Register = lazy(() => import('./pages/RegisterPage.jsx'));
const NotFound = lazy(() => import('./pages/NotFoundPage.jsx'));

function Loading() {
  return <div className="loading"><span className="spinner" /></div>;
}
function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
function Wrap({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Wrap><Login /></Wrap> },
      { path: 'register', element: <Wrap><Register /></Wrap> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Wrap><Guard><Dashboard /></Guard></Wrap> },
      { path: 'courses', element: <Wrap><Guard><Courses /></Guard></Wrap> },
      { path: 'courses/:id', element: <Wrap><Guard><CourseDetail /></Guard></Wrap> },
      { path: 'profile', element: <Wrap><Guard><Profile /></Guard></Wrap> },
      { path: 'settings', element: <Wrap><Guard><Settings /></Guard></Wrap> },
      { path: '*', element: <Wrap><NotFound /></Wrap> },
    ],
  },
]);
export default router;
`;

// =============================================================================
// src/data/mock.js
// =============================================================================
files["src/data/mock.js"] = `export const COURSES = [
  { id: 'arduino-1', title: 'أساسيات الأردوينو والإلكترونيات — الجزء الأول', description: 'ابدأ من الصفر مع لوحة Arduino UNO، تعرّف على الدوائر والمكونات وابنِ أول مشروع عملي لك خطوة بخطوة.', category: 'arduino', level: 'مبتدئ', duration: '8 ساعات', lessons: 12, rating: 4.8, students: 342, progress: 35, enrolled: true },
  { id: 'arduino-2', title: 'أساسيات الأردوينو — الجزء الثاني', description: 'توسّع في الحساسات والمحركات وشاشات العرض مع مشاريع تطبيقية متقدمة.', category: 'arduino', level: 'متوسط', duration: '9 ساعات', lessons: 14, rating: 4.7, students: 218, progress: 12, enrolled: true },
  { id: 'python-1', title: 'Python من الصفر إلى الاحتراف', description: 'تعلّم أساسيات لغة بايثون: المتغيرات، الشروط، الحلقات، الدوال، ومشاريع عملية كاملة.', category: 'python', level: 'مبتدئ', duration: '12 ساعة', lessons: 22, rating: 4.9, students: 512, progress: 62, enrolled: true },
  { id: 'web-1', title: 'تطوير الويب HTML & CSS الحديث', description: 'أنشئ صفحات ويب متجاوبة مع أحدث تقنيات CSS، وتعلّم تصميم واجهات احترافية.', category: 'web', level: 'مبتدئ', duration: '10 ساعات', lessons: 18, rating: 4.6, students: 389, progress: 0, enrolled: false },
  { id: 'js-1', title: 'JavaScript للمبتدئين', description: 'أساسيات لغة JavaScript وكيفية التعامل مع DOM وبناء تطبيقات تفاعلية.', category: 'web', level: 'مبتدئ', duration: '14 ساعة', lessons: 26, rating: 4.7, students: 445, progress: 0, enrolled: false },
  { id: 'robot-1', title: 'روبوت تتبع الخط', description: 'ابنِ روبوتًا يتتبع المسار باستخدام حساسات IR ومتحكم Arduino مع منطق تحكم دقيق.', category: 'robotics', level: 'متوسط', duration: '7 ساعات', lessons: 10, rating: 4.8, students: 156, progress: 0, enrolled: false },
  { id: 'robot-2', title: 'روبوتات متقدمة — التحكم اللاسلكي', description: 'تحكم في الروبوت عن بعد باستخدام ESP32 ولوحة تحكم ويب.', category: 'robotics', level: 'متقدم', duration: '11 ساعة', lessons: 15, rating: 4.9, students: 98, progress: 0, enrolled: false },
  { id: 'sensors-1', title: 'الحساسات المتقدمة والتحكم', description: 'استخدم أحدث الحساسات: DHT22، Ultrasonic، PIR، وLDR في مشاريع عملية متكاملة.', category: 'arduino', level: 'متوسط', duration: '6 ساعات', lessons: 9, rating: 4.6, students: 167, progress: 0, enrolled: false },
];

export const ACTIVITY_7D = [
  { day: 'السبت', mins: 45 },
  { day: 'الأحد', mins: 30 },
  { day: 'الاثنين', mins: 65 },
  { day: 'الثلاثاء', mins: 20 },
  { day: 'الأربعاء', mins: 80 },
  { day: 'الخميس', mins: 50 },
  { day: 'الجمعة', mins: 15 },
];

export const DEADLINES = [
  { id: 1, day: 12, month: 'نوف', title: 'اختبار الوحدة الثالثة', course: 'Python من الصفر' },
  { id: 2, day: 18, month: 'نوف', title: 'تسليم مشروع الأردوينو', course: 'أساسيات الأردوينو' },
  { id: 3, day: 25, month: 'نوف', title: 'اختبار نهاية المسار', course: 'تطوير الويب' },
];

export const REVIEWS = [
  { id: 1, name: 'أحمد محمود', date: 'قبل أسبوع', stars: 5, body: 'دورة ممتازة، الشرح واضح والمشاريع عملية جدًا. ساعدتني أفهم الأردوينو بسرعة.' },
  { id: 2, name: 'سارة إبراهيم', date: 'قبل أسبوعين', stars: 4, body: 'محتوى جيد ومنظم. كنت أتمنى المزيد من الأمثلة المتقدمة في النهاية.' },
  { id: 3, name: 'محمد ياسر', date: 'قبل شهر', stars: 5, body: 'أفضل تجربة تعليمية عربية حتى الآن. المستوى احترافي والمحتوى محدّث.' },
  { id: 4, name: 'نور حسن', date: 'قبل شهر', stars: 4, body: 'استفدت كثيرًا من الجزء العملي. أنصح بها لكل مبتدئ في المجال.' },
];
`;

// =============================================================================
// src/pages/DashboardPage.jsx
// =============================================================================
files["src/pages/DashboardPage.jsx"] = `import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Flame, GraduationCap, Play, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { COURSES, ACTIVITY_7D, DEADLINES } from '../data/mock.js';
import { formatNumber } from '../lib/format.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const enrolled = COURSES.filter((c) => c.enrolled);
  const recommended = COURSES.filter((c) => !c.enrolled).slice(0, 4);
  const totalHours = enrolled.reduce((acc, c) => acc + (parseFloat(c.duration) || 0), 0);
  const maxMins = Math.max(...ACTIVITY_7D.map((d) => d.mins), 1);

  const stats = [
    { label: 'كورسات نشطة', value: enrolled.length, icon: <BookOpen size={18} />, delta: '+1 هذا الشهر' },
    { label: 'ساعات تعلم', value: totalHours.toFixed(1), icon: <Clock size={18} />, delta: '+2.5 هذا الأسبوع' },
    { label: 'أيام متتالية', value: 12, icon: <Flame size={18} />, delta: 'استمر!' },
    { label: 'شهادات', value: 2, icon: <GraduationCap size={18} />, delta: '+1 حديثة' },
  ];

  return (
    <div className="page">
      <PageHeader
        title={'أهلًا، ' + (user?.name || 'طالب')}
        subtitle="إليك نظرة سريعة على تقدمك في المنصة"
        actions={<Button to="/courses" variant="primary" size="md" >تصفح الكورسات <ArrowRight size={14} /></Button>}
      />

      <section className="stats-grid">
        {stats.map((s, i) => (
          <Card key={i} className="stat">
            <div className="stat__top">
              <span className="stat__label">{s.label}</span>
              <span className="stat__icon">{s.icon}</span>
            </div>
            <div className="stat__value">{formatNumber(s.value)}</div>
            <div className="stat__delta">{s.delta}</div>
          </Card>
        ))}
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">أكمل التعلم</h2>
            <p className="section__sub">ارجع من حيث توقفت</p>
          </div>
          <Link to="/courses" className="section__link">تصفح الكل <ArrowRight size={14} /></Link>
        </div>
        <div className="continue-grid">
          {enrolled.map((c) => (
            <Card key={c.id} as={Link} to={'/courses/' + c.id} interactive className="continue-card">
              <div className="continue-card__thumb"><Play size={22} /></div>
              <div className="continue-card__body">
                <span className="continue-card__provider">EGY-Skills</span>
                <h3 className="continue-card__title">{c.title}</h3>
                <div className="continue-card__progress">
                  <ProgressBar value={c.progress} />
                  <div className="continue-card__meta">
                    <span>{c.progress}% مكتمل</span>
                    <span className="continue-card__cta">متابعة <ArrowRight size={12} /></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">مقترح لك</h2>
            <p className="section__sub">كورسات مختارة بعناية</p>
          </div>
          <Link to="/courses" className="section__link">تصفح الكل <ArrowRight size={14} /></Link>
        </div>
        <div className="course-grid">
          {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      <div className="dash-split">
        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="section__title">نشاط الأسبوع</h2>
              <p className="section__sub">دقائق التعلم اليومية</p>
            </div>
          </div>
          <Card className="activity">
            {ACTIVITY_7D.map((d) => (
              <div key={d.day} className="activity__col">
                <div className="activity__bar-wrap">
                  <div className={'activity__bar' + (d.mins >= 40 ? ' activity__bar--on' : '')} style={{ height: (d.mins / maxMins) * 100 + '%' }} title={d.mins + ' دقيقة'} />
                </div>
                <span className="activity__day">{d.day}</span>
              </div>
            ))}
          </Card>
        </section>

        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="section__title">المواعيد القادمة</h2>
              <p className="section__sub">تسليمات واختبارات</p>
            </div>
          </div>
          <Card className="deadlines">
            {DEADLINES.map((d) => (
              <div key={d.id} className="deadline">
                <div className="deadline__date">
                  <span className="deadline__day">{d.day}</span>
                  <span className="deadline__month">{d.month}</span>
                </div>
                <div className="deadline__body">
                  <div className="deadline__title">{d.title}</div>
                  <div className="deadline__course">{d.course}</div>
                </div>
                <Badge tone="outline"><Calendar size={12} /> قادم</Badge>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <Card as={Link} to={'/courses/' + course.id} interactive className="course-card">
      <div className="course-card__thumb"><BookOpen size={28} /></div>
      <div className="course-card__body">
        <div className="course-card__badges">
          <Badge tone="outline">{course.level}</Badge>
          <span className="course-card__rating"><Sparkles size={12} /> {course.rating}</span>
        </div>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__desc">{course.description}</p>
        <div className="course-card__meta">
          <span>{course.lessons} درس</span>
          <span className="dot" />
          <span>{course.duration}</span>
          <span className="dot" />
          <span>{formatNumber(course.students)} طالب</span>
        </div>
      </div>
    </Card>
  );
}
`;

// =============================================================================
// src/pages/CoursesPage.jsx
// =============================================================================
files["src/pages/CoursesPage.jsx"] = `import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Chip } from '../components/Chip.jsx';
import { Input } from '../components/Input.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';
import { COURSES } from '../data/mock.js';
import { CATEGORIES } from '../lib/constants.js';
import { formatNumber } from '../lib/format.js';

const LEVELS = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'];

export default function CoursesPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [level, setLevel] = useState('الكل');
  const [sort, setSort] = useState('popular');

  const filtered = useMemo(() => {
    let list = [...COURSES];
    if (cat !== 'all') list = list.filter((c) => c.category === cat);
    if (level !== 'الكل') list = list.filter((c) => c.level === level);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
    }
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'students') list.sort((a, b) => b.students - a.students);
    return list;
  }, [q, cat, level, sort]);

  return (
    <div className="page">
      <PageHeader
        title="الكورسات"
        subtitle={filtered.length + ' كورس متاح على المنصة'}
        breadcrumbs={[{ label: 'الكورسات' }]}
      />

      <div className="courses-toolbar">
        <div className="courses-toolbar__search">
          <Input placeholder="ابحث بالاسم أو الوصف..." leading={<Search size={16} />} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="courses-toolbar__chips">
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>
          ))}
        </div>
        <div className="courses-toolbar__right">
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l === 'الكل' ? 'كل المستويات' : l}</option>)}
          </select>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">الأكثر شعبية</option>
            <option value="rating">الأعلى تقييمًا</option>
            <option value="students">الأكثر طلابًا</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={22} />}
          title="لا توجد كورسات مطابقة"
          description="جرّب تعديل الفلاتر أو كلمة البحث."
          action={<Button variant="outline" onClick={() => { setQ(''); setCat('all'); setLevel('الكل'); }}>مسح الفلاتر</Button>}
        />
      ) : (
        <div className="course-grid">
          {filtered.map((c) => (
            <Card key={c.id} as={Link} to={'/courses/' + c.id} interactive className="course-card">
              <div className="course-card__thumb"><BookOpen size={28} /></div>
              <div className="course-card__body">
                <div className="course-card__badges">
                  <Badge tone="outline">{c.level}</Badge>
                  {c.enrolled ? <Badge tone="accent">مشترك</Badge> : null}
                </div>
                <h3 className="course-card__title">{c.title}</h3>
                <p className="course-card__desc">{c.description}</p>
                <div className="course-card__meta">
                  <span>{c.lessons} درس</span>
                  <span className="dot" />
                  <span>{c.duration}</span>
                </div>
                <div className="course-card__foot">
                  <span className="course-card__rating"><Sparkles size={12} /> {c.rating}</span>
                  <span className="course-card__students">{formatNumber(c.students)} طالب</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
`;

// =============================================================================
// src/pages/CourseDetailPage.jsx
// =============================================================================
files[
  "src/pages/CourseDetailPage.jsx"
] = `import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, Play, Sparkles, Users } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { COURSES, REVIEWS } from '../data/mock.js';
import { formatNumber } from '../lib/format.js';

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = useMemo(() => COURSES.find((c) => c.id === id) || COURSES[0], [id]);
  const [tab, setTab] = useState('overview');

  const lessons = useMemo(() => Array.from({ length: course.lessons }, (_, i) => ({
    id: i + 1,
    title: 'الدرس ' + (i + 1) + ' — مقدمة ومفاهيم أساسية',
    duration: (12 + ((i * 3) % 18)) + ' د',
    done: i < Math.round((course.progress / 100) * course.lessons),
  })), [course]);

  const tabs = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'curriculum', label: 'المنهج', count: lessons.length },
    { value: 'reviews', label: 'التقييمات', count: REVIEWS.length },
  ];

  return (
    <div className="page">
      <PageHeader
        breadcrumbs={[{ label: 'الكورسات', to: '/courses' }, { label: course.title }]}
        title={course.title}
        subtitle={course.description}
        actions={<Button variant="outline" to="/courses" leftIcon={<ArrowLeft size={14} />}>رجوع</Button>}
      />

      <div className="detail-hero">
        <div className="detail-hero__main">
          <div className="detail-hero__meta">
            <Badge tone="accent">{course.level}</Badge>
            <span className="dot" />
            <span>{course.duration}</span>
            <span className="dot" />
            <span className="detail-hero__rating"><Sparkles size={12} /> {course.rating}</span>
            <span className="dot" />
            <span><Users size={12} /> {formatNumber(course.students)} طالب</span>
          </div>
          <div className="detail-hero__cta">
            <Button variant="primary" size="lg">ابدأ التعلم <Play size={16} /></Button>
            <Button variant="outline" size="lg">معاينة مجانية</Button>
          </div>
        </div>

        <Card className="detail-hero__side">
          <div className="detail-hero__thumb"><BookOpen size={40} /></div>
          <div className="detail-hero__side-body">
            <div className="detail-hero__price">مجانًا للمشتركين</div>
            <ul className="detail-hero__list">
              <li><CheckCircle2 size={14} /> وصول مدى الحياة</li>
              <li><CheckCircle2 size={14} /> مشاريع عملية</li>
              <li><CheckCircle2 size={14} /> شهادة إتمام</li>
              <li><CheckCircle2 size={14} /> دعم مباشر من المدرّب</li>
            </ul>
            <Button variant="primary" block size="lg">اشترك الآن</Button>
          </div>
        </Card>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="detail-panel">
          <Card>
            <h2 className="detail-h2">عن هذا الكورس</h2>
            <p className="measure">ستتعلم في هذا الكورس أساسيات المهارة من الصفر حتى الاحتراف، مع تطبيق عملي لكل مفهوم من خلال مشاريع حقيقية. المحتوى منظم بشكل تدريجي وبسيط، مناسب للمبتدئين ويحتوي على تحديات إضافية للمتقدمين.</p>
          </Card>
          <div className="detail-goals">
            <Card><h3 className="detail-h3">ما ستتعلمه</h3>
              <ul className="detail-list">
                <li><CheckCircle2 size={14} /> إعداد البيئة والأدوات</li>
                <li><CheckCircle2 size={14} /> المفاهيم الأساسية والمصطلحات</li>
                <li><CheckCircle2 size={14} /> التعامل مع المكونات والوحدات</li>
                <li><CheckCircle2 size={14} /> تنفيذ مشروع عملي كامل</li>
                <li><CheckCircle2 size={14} /> تصحيح الأخطاء والاستكشاف</li>
              </ul>
            </Card>
            <Card><h3 className="detail-h3">من هذا الكورس؟</h3>
              <ul className="detail-list">
                <li><CheckCircle2 size={14} /> المبتدئون الراغبون في تعلم المجال</li>
                <li><CheckCircle2 size={14} /> طلاب المدارس والجامعات</li>
                <li><CheckCircle2 size={14} /> المهتمون بالمشاريع العملية</li>
                <li><CheckCircle2 size={14} /> المهندسون الباحثون عن تحديث مهاراتهم</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === 'curriculum' && (
        <div className="detail-panel">
          <Card padded={false} className="curriculum">
            <div className="curriculum__head">
              <h3>محتوى الكورس</h3>
              <span className="muted">{lessons.length} درس • {course.duration}</span>
            </div>
            <ul className="curriculum__list">
              {lessons.map((l) => (
                <li key={l.id} className={'curriculum__item' + (l.done ? ' is-done' : '')}>
                  <span className="curriculum__icon">{l.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}</span>
                  <div className="curriculum__text">
                    <span className="curriculum__index">الدرس {l.id}</span>
                    <span className="curriculum__title">{l.title}</span>
                  </div>
                  <span className="curriculum__duration"><Clock size={12} /> {l.duration}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="detail-panel">
          <div className="reviews">
            {REVIEWS.map((r) => (
              <Card key={r.id} className="review">
                <header className="review__head">
                  <Avatar name={r.name} size={42} />
                  <div>
                    <div className="review__name">{r.name}</div>
                    <div className="review__date">{r.date}</div>
                  </div>
                  <div className="review__stars" aria-label={r.stars + ' نجوم'}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Sparkles key={i} size={12} className={i < r.stars ? 'star-on' : 'star-off'} />
                    ))}
                  </div>
                </header>
                <p className="review__body">{r.body}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;

// =============================================================================
// src/pages/ProfilePage.jsx
// =============================================================================
files["src/pages/ProfilePage.jsx"] = `import { useState } from 'react';
import { Award, BookOpen, Clock, Flame, Mail, MapPin, Pencil, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Modal } from '../components/Modal.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { formatNumber } from '../lib/format.js';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const stats = [
    { label: 'كورسات مسجلة', value: 3, icon: <BookOpen size={16} /> },
    { label: 'ساعات تعلم', value: 29, icon: <Clock size={16} /> },
    { label: 'أيام متتالية', value: 12, icon: <Flame size={16} /> },
    { label: 'شهادات', value: 2, icon: <Award size={16} /> },
  ];

  const achievements = [
    { title: 'الخطوة الأولى', desc: 'أكملت أول درس على المنصة', icon: '🚀' },
    { title: 'بطل الأسبوع', desc: 'أعلى نشاط في أسبوع واحد', icon: '🔥' },
    { title: 'مساهم نشط', desc: 'شاركت في 10 نقاشات', icon: '💬' },
    { title: 'متقن الأردوينو', desc: 'أكملت مسار الأردوينو كاملًا', icon: '⚡' },
  ];

  function saveProfile() {
    updateProfile({ name: name.trim(), email: email.trim() });
    toast.success('تم تحديث الملف الشخصي');
    setEditOpen(false);
  }

  return (
    <div className="page">
      <div className="profile-cover" />
      <div className="profile-head">
        <Avatar name={user?.name || 'طالب'} size={96} className="profile-avatar" />
        <div className="profile-head__text">
          <h1 className="profile-head__name">{user?.name || 'طالب'}</h1>
          <div className="profile-head__meta">
            <span><Mail size={13} /> {user?.email || '—'}</span>
            <span className="dot" />
            <span><MapPin size={13} /> مصر</span>
            <span className="dot" />
            <span>طالب نشط</span>
          </div>
        </div>
        <div className="profile-head__actions">
          <Button variant="outline" onClick={() => setEditOpen(true)} leftIcon={<Pencil size={14} />}>تعديل الملف</Button>
        </div>
      </div>

      <div className="profile-stats">
        {stats.map((s, i) => (
          <Card key={i} className="pstat">
            <span className="pstat__icon">{s.icon}</span>
            <span className="pstat__value">{formatNumber(s.value)}</span>
            <span className="pstat__label">{s.label}</span>
          </Card>
        ))}
      </div>

      <Tabs tabs={[{ value: 'overview', label: 'نظرة عامة' }, { value: 'achievements', label: 'الإنجازات', count: achievements.length }, { value: 'activity', label: 'النشاط' }]} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <Card>
          <h3 className="detail-h3">نبذة</h3>
          <p className="measure">طالب شغوف بتعلم البرمجة والأردوينو، أشارك في المشاريع الصفية وأسعى لتنمية مهاراتي في المجال التقني. أحب بناء المشاريع العملية والعمل الجماعي.</p>
        </Card>
      )}

      {tab === 'achievements' && (
        <div className="achievements">
          {achievements.map((a, i) => (
            <Card key={i} className="achievement">
              <div className="achievement__icon">{a.icon}</div>
              <div>
                <div className="achievement__title">{a.title}</div>
                <div className="achievement__desc">{a.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'activity' && (
        <Card>
          <ul className="timeline">
            <li><span className="timeline__dot" /><div><div className="timeline__title">أكملت درس «المتغيرات في Python»</div><span className="timeline__when">قبل ساعتين</span></div></li>
            <li><span className="timeline__dot" /><div><div className="timeline__title">حصلت على شارة «بطل الأسبوع»</div><span className="timeline__when">أمس</span></div></li>
            <li><span className="timeline__dot" /><div><div className="timeline__title">سجّلت في كورس «روبوت تتبع الخط»</div><span className="timeline__when">قبل 3 أيام</span></div></li>
            <li><span className="timeline__dot" /><div><div className="timeline__title">أنهيت مشروع الأردوينو الأول</div><span className="timeline__when">قبل أسبوع</span></div></li>
          </ul>
        </Card>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="تعديل الملف الشخصي"
        footer={<><Button variant="ghost" onClick={() => setEditOpen(false)}>إلغاء</Button><Button variant="primary" onClick={saveProfile}>حفظ</Button></>}>
        <div className="stack">
          <Input label="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
`;

// =============================================================================
// src/pages/SettingsPage.jsx
// =============================================================================
files["src/pages/SettingsPage.jsx"] = `import { useState } from 'react';
import { Bell, Globe, Palette, Shield, User } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function SettingsPage() {
  const toast = useToast();
  const [section, setSection] = useState('account');
  const [dirty, setDirty] = useState(false);

  const sections = [
    { id: 'account', label: 'الحساب', icon: <User size={15} /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={15} /> },
    { id: 'language', label: 'اللغة', icon: <Globe size={15} /> },
    { id: 'appearance', label: 'المظهر', icon: <Palette size={15} /> },
    { id: 'privacy', label: 'الخصوصية', icon: <Shield size={15} /> },
  ];

  return (
    <div className="page">
      <PageHeader title="الإعدادات" subtitle="خصّص تجربتك على المنصة" />

      <div className="settings">
        <aside className="settings__nav">
          {sections.map((s) => (
            <button key={s.id} className={'settings__nav-item' + (section === s.id ? ' is-active' : '')} onClick={() => setSection(s.id)}>
              {s.icon} <span>{s.label}</span>
            </button>
          ))}
        </aside>

        <div className="settings__body">
          {section === 'account' && (
            <Card>
              <SectionHead title="الحساب" sub="إعدادات حسابك الأساسية" />
              <Row label="الاسم الظاهر" desc="سيظهر هذا الاسم للآخرين"><input className="input" defaultValue="طالب" onChange={() => setDirty(true)} /></Row>
              <Row label="البريد الإلكتروني" desc="لن يظهر للآخرين"><input className="input" defaultValue="student@egy-skills.com" onChange={() => setDirty(true)} /></Row>
              <Row label="كلمة المرور" desc="آخر تحديث قبل 30 يومًا"><Button variant="outline" size="sm">تغيير</Button></Row>
            </Card>
          )}
          {section === 'notifications' && (
            <Card>
              <SectionHead title="الإشعارات" sub="تحكم في تنبيهات المنصة" />
              <Row label="دروس جديدة" desc="تنبيه عند إضافة درس"><Toggle onChange={() => setDirty(true)} /></Row>
              <Row label="ردود المعلم" desc="إشعار عند رد المعلم"><Toggle onChange={() => setDirty(true)} /></Row>
              <Row label="تذكير الدروس" desc="تنبيه يومي بالمهام"><Toggle onChange={() => setDirty(true)} /></Row>
            </Card>
          )}
          {section === 'language' && (
            <Card>
              <SectionHead title="اللغة" sub="لغة عرض المنصة" />
              <Row label="لغة الواجهة" desc="العربية / English"><select className="select"><option>العربية</option><option>English</option></select></Row>
            </Card>
          )}
          {section === 'appearance' && (
            <Card>
              <SectionHead title="المظهر" sub="الوضع الحالي: داكن (أسود + أخضر)" />
              <Row label="الوضع" desc="ثابت في هذا الإصدار"><Button variant="outline" size="sm" disabled>مُفعّل</Button></Row>
            </Card>
          )}
          {section === 'privacy' && (
            <Card>
              <SectionHead title="الخصوصية" sub="إعدادات الخصوصية والأمان" />
              <Row label="إظهار ملفي" desc="للمعلمين والطلاب"><Toggle onChange={() => setDirty(true)} /></Row>
              <Row label="تنزيل بياناتي" desc="نسخة JSON من بياناتك"><Button variant="outline" size="sm" onClick={() => toast.info('سيتوفر التنزيل قريبًا')}>تنزيل</Button></Row>
            </Card>
          )}

          {dirty ? (
            <div className="settings__save">
              <span>لديك تغييرات غير محفوظة</span>
              <div className="row">
                <Button variant="ghost" onClick={() => setDirty(false)}>إلغاء</Button>
                <Button variant="primary" onClick={() => { toast.success('تم الحفظ'); setDirty(false); }}>حفظ</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ title, sub }) {
  return <div className="settings__head"><h3>{title}</h3><p>{sub}</p></div>;
}
function Row({ label, desc, children }) {
  return <div className="settings__row"><div><div className="settings__row-label">{label}</div><div className="settings__row-desc">{desc}</div></div><div className="settings__row-control">{children}</div></div>;
}
function Toggle({ onChange }) {
  const [on, setOn] = useState(true);
  return <button className={'toggle' + (on ? ' is-on' : '')} aria-pressed={on} onClick={() => { setOn(!on); onChange && onChange(); }}><span className="toggle__dot" /></button>;
}
`;

// =============================================================================
// src/pages/LoginPage.jsx
// =============================================================================
files["src/pages/LoginPage.jsx"] = `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('student@egy-skills.com');
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      login(email, email.split('@')[0]);
      toast.success('أهلًا بك مجددًا');
      nav('/', { replace: true });
    }, 400);
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <header className="auth-form__head">
        <h1>تسجيل الدخول</h1>
        <p>أدخل بياناتك للوصول إلى لوحة التحكم</p>
      </header>

      <Input label="البريد الإلكتروني" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="كلمة المرور" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className="auth-form__row">
        <label className="auth-check"><input type="checkbox" defaultChecked /> <span>تذكرني</span></label>
        <a href="#" className="auth-form__link" onClick={(e) => e.preventDefault()}>نسيت كلمة المرور؟</a>
      </div>

      <Button variant="primary" size="lg" block leftIcon={<LogIn size={16} />} type="submit" disabled={busy}>
        {busy ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
      </Button>

      <p className="auth-form__foot">ليس لديك حساب؟ <Link to="/register">أنشئ حسابًا جديدًا</Link></p>
    </form>
  );
}
`;

// =============================================================================
// src/pages/RegisterPage.jsx
// =============================================================================
files["src/pages/RegisterPage.jsx"] = `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      toast.error('أكمل جميع الحقول (كلمة المرور 6 أحرف على الأقل)');
      return;
    }
    setBusy(true);
    setTimeout(() => {
      register(form);
      toast.success('تم إنشاء الحساب');
      nav('/', { replace: true });
    }, 400);
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <header className="auth-form__head">
        <h1>حساب جديد</h1>
        <p>أنشئ حسابك وابدأ رحلتك التعليمية</p>
      </header>

      <Input label="الاسم الكامل" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="البريد الإلكتروني" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="كلمة المرور" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} hint="6 أحرف على الأقل" />

      <Button variant="primary" size="lg" block leftIcon={<UserPlus size={16} />} type="submit" disabled={busy}>
        {busy ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
      </Button>

      <p className="auth-form__foot">لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link></p>
    </form>
  );
}
`;

// =============================================================================
// src/pages/NotFoundPage.jsx
// =============================================================================
files[
  "src/pages/NotFoundPage.jsx"
] = `import { Compass, Home } from 'lucide-react';
import { Button } from '../components/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="nf">
      <div className="nf__icon"><Compass size={32} /></div>
      <div className="nf__code">404</div>
      <h1 className="nf__title">الصفحة غير موجودة</h1>
      <p className="nf__desc">الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.</p>
      <div className="nf__actions">
        <Button variant="primary" to="/" leftIcon={<Home size={15} />}>لوحة التحكم</Button>
        <Button variant="outline" to="/courses">تصفح الكورسات</Button>
      </div>
    </div>
  );
}
`;

// =============================================================================
// src/styles/globals.css — THE FULL DESIGN
// =============================================================================
files[
  "src/styles/globals.css"
] = `/* =============================================================================
   EGY-Skills — complete design system in one file
   ============================================================================= */

:root {
  --bg: #0a0a0a;
  --bg-2: #0f0f0f;
  --surface: #141414;
  --surface-2: #1a1a1a;
  --surface-3: #222;
  --border: #262626;
  --border-2: #333;
  --text: #f5f5f5;
  --text-2: #a3a3a3;
  --text-3: #737373;
  --accent: #22c55e;
  --accent-2: #16a34a;
  --accent-3: #15803d;
  --accent-soft: rgba(34,197,94,.10);
  --accent-soft-2: rgba(34,197,94,.18);
  --accent-ring: rgba(34,197,94,.35);

  --r-xs: 4px; --r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-xl: 20px; --r-pill: 999px;

  --sh-sm: 0 1px 2px rgba(0,0,0,.4);
  --sh-md: 0 4px 20px rgba(0,0,0,.5);
  --sh-lg: 0 16px 48px rgba(0,0,0,.6);
  --sh-glow: 0 0 28px rgba(34,197,94,.18);

  --topbar-h: 64px;
  --sidebar-w: 260px;
  --content-max: 1280px;
  --px: clamp(16px, 3vw, 32px);

  --dur: 200ms;
  --ease: cubic-bezier(.4,0,.2,1);

  --font: 'Space Grotesk', 'Tajawal', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

  color-scheme: dark;
}
@media (max-width: 768px) { :root { --topbar-h: 58px; } }

/* ---------- Reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
  margin: 0;
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(34,197,94,.06), transparent 60%),
    radial-gradient(1000px 500px at 90% 110%, rgba(34,197,94,.04), transparent 60%),
    var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}
img, svg, video { display: block; max-width: 100%; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
input, textarea, select { font: inherit; color: inherit; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; padding: 0; margin: 0; }
h1, h2, h3, h4, h5, h6, p { margin: 0; }
h1 { font-size: clamp(28px, 2.6vw, 36px); font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }
h2 { font-size: clamp(22px, 1.9vw, 26px); font-weight: 700; letter-spacing: -.015em; line-height: 1.2; }
h3 { font-size: clamp(17px, 1.3vw, 19px); font-weight: 600; line-height: 1.3; }
p { color: var(--text-2); }
small { font-size: 12px; color: var(--text-2); }
code, pre { font-family: var(--mono); }

:where(button, a, input, textarea, select, [tabindex]):focus-visible {
  outline: 2px solid transparent; outline-offset: 2px;
  box-shadow: 0 0 0 3px var(--accent-ring); border-radius: var(--r-sm);
}
::selection { background: var(--accent); color: #0a0a0a; }
* { scrollbar-width: thin; scrollbar-color: var(--border-2) transparent; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: var(--r-pill); border: 2px solid var(--bg); }
*::-webkit-scrollbar-track { background: transparent; }

.skip-link { position: fixed; inset-inline-start: 16px; top: 16px; z-index: 1000; transform: translateY(-200%); background: var(--accent); color: #0a0a0a; padding: 10px 16px; border-radius: var(--r-md); font-weight: 600; transition: transform var(--dur) var(--ease); }
.skip-link:focus { transform: translateY(0); }

/* ---------- Utilities ---------- */
.container { width: 100%; max-width: var(--content-max); margin-inline: auto; padding-inline: var(--px); }
.row { display: flex; align-items: center; gap: 12px; }
.stack { display: flex; flex-direction: column; gap: 12px; }
.muted { color: var(--text-2); }
.dim { color: var(--text-3); }
.accent { color: var(--accent); }
.measure { max-width: 70ch; }
.dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-3); display: inline-block; }

/* ---------- Loading ---------- */
.loading { min-height: 60vh; display: grid; place-items: center; }
.spinner { width: 24px; height: 24px; border: 2.5px solid var(--border-2); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ---------- Buttons ---------- */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: var(--r-md); font-weight: 500; white-space: nowrap; transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease), color var(--dur) var(--ease), transform 100ms var(--ease), box-shadow var(--dur) var(--ease); }
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn--sm { padding: 7px 12px; font-size: 13px; min-height: 34px; }
.btn--md { padding: 10px 16px; font-size: 14px; min-height: 42px; }
.btn--lg { padding: 12px 20px; font-size: 15px; min-height: 48px; }
.btn--block { width: 100%; }
.btn--primary { background: var(--accent); color: #052e16; border: 1px solid var(--accent); font-weight: 600; }
.btn--primary:hover:not(:disabled) { background: var(--accent-2); border-color: var(--accent-2); box-shadow: 0 0 20px rgba(34,197,94,.2); }
.btn--outline { background: transparent; color: var(--text); border: 1px solid var(--border-2); }
.btn--outline:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.btn--ghost { background: transparent; color: var(--text-2); border: 1px solid transparent; }
.btn--ghost:hover:not(:disabled) { background: var(--surface-2); color: var(--text); }
.btn--danger { background: transparent; color: var(--accent); border: 1px solid var(--accent); }

/* ---------- Icon button ---------- */
.icon-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--r-md); color: var(--text-2); border: 1px solid transparent; transition: all var(--dur) var(--ease); }
.icon-btn:hover { background: var(--surface-2); color: var(--text); border-color: var(--border); }
.icon-btn__dot { position: absolute; top: 8px; inset-inline-end: 10px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg); }

/* ---------- Card ---------- */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 20px; transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease), transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.card--hover { cursor: pointer; }
.card--hover:hover { border-color: var(--border-2); background: var(--surface-2); transform: translateY(-2px); box-shadow: var(--sh-md); }

/* ---------- Badge ---------- */
.badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: var(--r-pill); line-height: 1; white-space: nowrap; }
.badge--neutral { background: var(--surface-2); color: var(--text-2); border: 1px solid var(--border); }
.badge--accent { background: var(--accent-soft-2); color: var(--accent); border: 1px solid var(--accent-ring); }
.badge--outline { background: transparent; color: var(--text-2); border: 1px solid var(--border-2); }

/* ---------- Chip ---------- */
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 13px; font-weight: 500; color: var(--text-2); background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-pill); transition: all var(--dur) var(--ease); min-height: 34px; }
.chip:hover { color: var(--text); border-color: var(--border-2); }
.chip--on { color: var(--accent); background: var(--accent-soft-2); border-color: var(--accent-ring); }

/* ---------- Field ---------- */
.field { display: flex; flex-direction: column; gap: 6px; }
.field__label { font-size: 13px; font-weight: 500; color: var(--text-2); }
.field__wrap { display: flex; align-items: center; gap: 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 0 12px; min-height: 42px; transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease); }
.field__wrap:focus-within { border-color: var(--accent); background: var(--surface-3); box-shadow: 0 0 0 3px var(--accent-ring); }
.field__wrap--err { border-color: var(--accent); }
.field__input { flex: 1; background: transparent; border: 0; outline: none; color: var(--text); font-size: 14px; padding: 10px 0; min-width: 0; }
.field__input::placeholder { color: var(--text-3); }
.field__lead { color: var(--text-3); display: inline-flex; }
.field__hint { font-size: 12px; color: var(--text-3); }
.field__err { font-size: 12px; color: var(--accent); font-weight: 500; }

.input, .select { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 10px 14px; color: var(--text); font-size: 14px; min-height: 42px; outline: none; transition: all var(--dur) var(--ease); }
.input:focus, .select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }
.select { cursor: pointer; appearance: none; padding-inline-end: 32px; background-image: linear-gradient(45deg, transparent 50%, var(--text-2) 50%), linear-gradient(135deg, var(--text-2) 50%, transparent 50%); background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%; background-size: 6px 6px; background-repeat: no-repeat; }
[dir="rtl"] .select { background-position: 18px 50%, 12px 50%; }

/* ---------- Avatar ---------- */
.avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: linear-gradient(135deg, var(--accent-soft-2), var(--accent-soft)); color: var(--accent); font-weight: 600; overflow: hidden; border: 1px solid var(--border-2); flex: 0 0 auto; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }

/* ---------- Skeleton ---------- */
.skl { display: inline-block; background: linear-gradient(90deg, var(--surface-2) 0%, var(--surface-3) 50%, var(--surface-2) 100%); background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* ---------- ProgressBar ---------- */
.pb { display: block; width: 100%; height: 6px; background: var(--surface-3); border-radius: var(--r-pill); overflow: hidden; }
.pb__fill { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), #4ade80); border-radius: var(--r-pill); transition: width var(--dur) var(--ease); }

/* ---------- Toast ---------- */
.toast-portal { position: fixed; inset-block-end: 20px; inset-inline-end: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 5000; max-width: min(380px, calc(100vw - 40px)); }
.toast { display: flex; gap: 10px; align-items: flex-start; background: var(--surface-3); border: 1px solid var(--border-2); border-inline-start: 3px solid var(--accent); border-radius: var(--r-md); padding: 12px 16px; box-shadow: var(--sh-md); font-size: 14px; animation: toastIn var(--dur) var(--ease); }
.toast--error { border-inline-start-color: #ef4444; }
.toast--info { border-inline-start-color: var(--text-2); }
.toast__msg { color: var(--text); }
@keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ---------- Modal ---------- */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 20px; z-index: 3000; }
.modal__panel { width: 100%; max-width: 520px; background: var(--surface); border: 1px solid var(--border-2); border-radius: var(--r-xl); box-shadow: var(--sh-lg); overflow: hidden; animation: modalIn var(--dur) var(--ease); }
.modal__head { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid var(--border); }
.modal__head h3 { font-size: 17px; }
.modal__x { width: 32px; height: 32px; border-radius: var(--r-sm); color: var(--text-2); display: inline-flex; align-items: center; justify-content: center; }
.modal__x:hover { background: var(--surface-2); color: var(--text); }
.modal__body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.modal__foot { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }
@keyframes modalIn { from { opacity: 0; transform: scale(.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

/* ---------- Tabs ---------- */
.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); overflow-x: auto; margin: 24px 0 0; }
.tabs::-webkit-scrollbar { display: none; }
.tabs__tab { display: inline-flex; align-items: center; gap: 8px; padding: 14px 16px; font-size: 14px; font-weight: 500; color: var(--text-2); border-bottom: 2px solid transparent; white-space: nowrap; transition: all var(--dur) var(--ease); }
.tabs__tab:hover { color: var(--text); }
.tabs__tab--on { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
.tabs__count { background: var(--surface-3); color: var(--text-2); border-radius: var(--r-pill); padding: 1px 8px; font-size: 11px; }
.tabs__tab--on .tabs__count { background: var(--accent-soft-2); color: var(--accent); }

/* ---------- Empty ---------- */
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 64px 24px; border: 1px dashed var(--border-2); border-radius: var(--r-lg); background: var(--surface); }
.empty__icon { width: 60px; height: 60px; border-radius: 50%; background: var(--accent-soft-2); color: var(--accent); display: grid; place-items: center; }
.empty__title { font-size: 17px; font-weight: 600; }
.empty__desc { font-size: 14px; color: var(--text-2); max-width: 42ch; }

/* ---------- PageHeader ---------- */
.ph { padding-bottom: 22px; margin-bottom: 22px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
.ph__crumbs { display: flex; flex-wrap: wrap; gap: 4px; font-size: 13px; color: var(--text-2); }
.ph__crumb { display: inline-flex; align-items: center; gap: 4px; }
.ph__crumb a:hover { color: var(--accent); }
.ph__sep { color: var(--text-3); }
.ph__row { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.ph__text { flex: 1; min-width: 0; }
.ph__title { font-size: clamp(26px, 2.6vw, 34px); font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }
.ph__subtitle { color: var(--text-2); font-size: 15px; margin-top: 6px; max-width: 65ch; }
.ph__actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* =============================================================================
   LAYOUT
   ============================================================================= */
.app { min-height: 100dvh; display: flex; flex-direction: column; }
.app__body { flex: 1; display: flex; min-height: 0; }
.app__main { flex: 1; min-width: 0; overflow-x: hidden; }
.app__main > .container { padding-top: 32px; padding-bottom: 64px; }
@media (max-width: 768px) { .app__main > .container { padding-top: 20px; padding-bottom: 48px; } }

.page { animation: pageIn var(--dur) var(--ease); display: flex; flex-direction: column; gap: 8px; }
@keyframes pageIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* ---------- TopBar ---------- */
.topbar { position: sticky; top: 0; z-index: 900; height: var(--topbar-h); display: flex; align-items: center; justify-content: space-between; padding-inline: var(--px); background: rgba(10,10,10,.82); backdrop-filter: blur(14px) saturate(140%); border-bottom: 1px solid var(--border); }
.topbar__left, .topbar__right { display: flex; align-items: center; gap: 12px; }
.topbar__burger { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--r-md); color: var(--text-2); }
.topbar__burger:hover { background: var(--surface-2); color: var(--text); }
@media (min-width: 1024px) { .topbar__burger { display: none; } }
.topbar__brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; letter-spacing: -.01em; }
.brand__mark { width: 26px; height: 26px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), #16a34a); position: relative; box-shadow: 0 0 20px rgba(34,197,94,.35); flex: 0 0 auto; }
.brand__mark::after { content: ''; position: absolute; inset: 7px; border-radius: 4px; background: #0a0a0a; }
.brand__name { color: var(--text); }

.user-menu { position: relative; }
.user-menu__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: var(--r-pill); border: 1px solid var(--border); background: var(--surface-2); transition: all var(--dur) var(--ease); min-height: 40px; }
[dir="rtl"] .user-menu__trigger { padding: 4px 4px 4px 12px; }
.user-menu__trigger:hover { border-color: var(--border-2); background: var(--surface-3); }
.user-menu__name { font-size: 13px; font-weight: 500; }
@media (max-width: 480px) { .user-menu__name { display: none; } .user-menu__trigger { padding: 4px; } }
.user-menu__panel { position: absolute; top: calc(100% + 8px); inset-inline-end: 0; min-width: 200px; background: var(--surface-2); border: 1px solid var(--border-2); border-radius: var(--r-md); padding: 6px; box-shadow: var(--sh-md); animation: ddIn var(--dur) var(--ease); z-index: 100; }
@keyframes ddIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.user-menu__item { display: flex; align-items: center; gap: 8px; width: 100%; text-align: start; padding: 10px 12px; border-radius: var(--r-sm); color: var(--text-2); font-size: 13px; transition: all var(--dur) var(--ease); }
.user-menu__item:hover { background: var(--surface-3); color: var(--text); }
.user-menu__item--danger { color: var(--accent); }
.user-menu__item--danger:hover { background: var(--accent-soft); color: var(--accent); }
.user-menu__sep { height: 1px; background: var(--border); margin: 6px 2px; }

/* ---------- Sidebar ---------- */
.sidebar { width: var(--sidebar-w); background: var(--bg-2); border-inline-end: 1px solid var(--border); padding: 24px 16px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; position: sticky; top: var(--topbar-h); height: calc(100dvh - var(--topbar-h)); align-self: flex-start; }
@media (max-width: 1023px) {
  .sidebar { position: fixed; inset-block: 0; inset-inline-start: 0; height: 100dvh; z-index: 1100; width: min(300px, 84vw); padding-top: calc(var(--topbar-h) + 20px); transform: translateX(-105%); transition: transform 260ms cubic-bezier(.16,1,.3,1); box-shadow: var(--sh-lg); }
  [dir="rtl"] .sidebar { transform: translateX(105%); }
  .sidebar--open { transform: translateX(0) !important; }
}
.sidebar__overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 1050; animation: ovIn var(--dur) var(--ease); }
@keyframes ovIn { from { opacity: 0; } to { opacity: 1; } }
.sidebar__close { display: none; position: absolute; top: 14px; inset-inline-end: 14px; width: 34px; height: 34px; border-radius: var(--r-sm); color: var(--text-2); }
.sidebar__close:hover { background: var(--surface-2); color: var(--text); }
@media (max-width: 1023px) { .sidebar__close { display: inline-flex; align-items: center; justify-content: center; } }
.sidebar__brand { display: flex; align-items: center; gap: 12px; padding: 4px 6px 12px; border-bottom: 1px solid var(--border); }
.sidebar__title { font-weight: 700; font-size: 15px; }
.sidebar__tag { font-size: 11px; color: var(--text-3); letter-spacing: .04em; }
.sidebar__nav { display: flex; flex-direction: column; gap: 20px; flex: 1; }
.sidebar__group-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; color: var(--text-3); padding: 0 12px; margin-bottom: 8px; }
.sidebar__group ul { display: flex; flex-direction: column; gap: 2px; }
.side-link { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: var(--r-md); color: var(--text-2); font-size: 14px; font-weight: 500; transition: all var(--dur) var(--ease); min-height: 44px; position: relative; border-inline-start: 2px solid transparent; }
.side-link:hover { background: var(--surface-2); color: var(--text); }
.side-link--on { background: var(--accent-soft-2); color: var(--accent); border-inline-start-color: var(--accent); font-weight: 600; }
.side-link__icon { display: inline-flex; flex: 0 0 auto; }
.side-link__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sidebar__cta { padding: 16px; background: linear-gradient(140deg, var(--surface-2), var(--surface-3)); border: 1px solid var(--border); border-radius: var(--r-lg); display: flex; flex-direction: column; gap: 6px; }
.sidebar__cta-title { font-weight: 700; font-size: 14px; }
.sidebar__cta-desc { font-size: 12px; color: var(--text-2); margin-bottom: 8px; }

/* ---------- Auth ---------- */
.auth { min-height: 100dvh; display: grid; grid-template-columns: 1fr; }
@media (min-width: 1024px) { .auth { grid-template-columns: 1.05fr 1fr; } }
.auth__aside { display: none; padding: 48px; background:
  radial-gradient(900px 400px at 20% 10%, rgba(34,197,94,.12), transparent 60%),
  radial-gradient(700px 300px at 90% 90%, rgba(34,197,94,.06), transparent 60%),
  var(--surface);
  border-inline-end: 1px solid var(--border); flex-direction: column; justify-content: center; gap: 40px; }
@media (min-width: 1024px) { .auth__aside { display: flex; } }
.auth__brand { display: inline-flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 700; }
.auth__hero-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--accent); background: var(--accent-soft-2); border: 1px solid var(--accent-ring); padding: 5px 12px; border-radius: var(--r-pill); font-weight: 500; align-self: flex-start; }
.auth__hero-title { font-size: clamp(32px, 3vw, 44px); font-weight: 700; letter-spacing: -.03em; line-height: 1.05; margin-top: 16px; }
.auth__hero-sub { color: var(--text-2); font-size: 15px; line-height: 1.6; max-width: 46ch; margin-top: 14px; }
.auth__points { display: flex; flex-direction: column; gap: 12px; font-size: 14px; color: var(--text-2); }
.auth__points li { display: flex; align-items: center; gap: 10px; }
.auth__points li svg { color: var(--accent); flex: 0 0 auto; }
.auth__copy { font-size: 12px; color: var(--text-3); }
.auth__main { display: grid; place-items: center; padding: 40px 20px; }
.auth__card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 36px 32px; box-shadow: var(--sh-md); }
@media (max-width: 480px) { .auth__card { padding: 24px 20px; } }

.auth-form { display: flex; flex-direction: column; gap: 18px; }
.auth-form__head { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }
.auth-form__head h1 { font-size: 24px; font-weight: 700; }
.auth-form__head p { font-size: 14px; color: var(--text-2); }
.auth-form__row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.auth-form__link { color: var(--accent); }
.auth-form__link:hover { text-decoration: underline; }
.auth-form__foot { text-align: center; font-size: 13px; color: var(--text-2); }
.auth-form__foot a { color: var(--accent); font-weight: 500; }
.auth-form__foot a:hover { text-decoration: underline; }
.auth-check { display: inline-flex; align-items: center; gap: 8px; color: var(--text-2); }
.auth-check input { accent-color: var(--accent); }

/* =============================================================================
   PAGES
   ============================================================================= */

/* ---------- Dashboard ---------- */
.stats-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); margin-bottom: 40px; }
.stat { display: flex; flex-direction: column; gap: 10px; padding: 20px; min-height: 132px; position: relative; overflow: hidden; }
.stat::before { content: ''; position: absolute; inset: 0; background: radial-gradient(120% 80% at 100% 0%, rgba(34,197,94,.06), transparent 60%); pointer-events: none; }
.stat__top { display: flex; align-items: center; justify-content: space-between; }
.stat__label { font-size: 13px; color: var(--text-2); font-weight: 500; }
.stat__icon { width: 34px; height: 34px; border-radius: var(--r-md); background: var(--accent-soft-2); color: var(--accent); display: grid; place-items: center; }
.stat__value { font-size: 30px; font-weight: 700; letter-spacing: -.02em; line-height: 1; }
.stat__delta { font-size: 12px; color: var(--accent); font-weight: 500; }

.section { display: flex; flex-direction: column; gap: 20px; margin-bottom: 44px; }
.section:last-child { margin-bottom: 0; }
@media (max-width: 768px) { .section { margin-bottom: 32px; } }
.section__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.section__title { font-size: 22px; font-weight: 700; letter-spacing: -.02em; }
.section__sub { font-size: 14px; color: var(--text-2); margin-top: 2px; }
.section__link { display: inline-flex; align-items: center; gap: 4px; font-size: 14px; color: var(--accent); font-weight: 500; }
.section__link:hover { text-decoration: underline; }

.continue-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); }
@media (max-width: 640px) { .continue-grid { grid-template-columns: 1fr; gap: 12px; } }
.continue-card { display: grid; grid-template-columns: 100px 1fr; gap: 16px; padding: 16px; }
.continue-card__thumb { width: 100px; height: 100px; border-radius: var(--r-md); background: radial-gradient(80% 120% at 20% 0%, rgba(34,197,94,.25), transparent 60%), linear-gradient(135deg, #1a1a1a, #0d0d0d); border: 1px solid var(--border); display: grid; place-items: center; color: var(--accent); }
.continue-card__body { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.continue-card__provider { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: .08em; font-weight: 600; }
.continue-card__title { font-size: 15px; font-weight: 600; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.continue-card__progress { margin-top: auto; display: flex; flex-direction: column; gap: 6px; }
.continue-card__meta { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-2); }
.continue-card__cta { display: inline-flex; align-items: center; gap: 4px; color: var(--accent); font-weight: 500; }
@media (max-width: 420px) { .continue-card { grid-template-columns: 1fr; } .continue-card__thumb { height: 100px; width: 100%; } }

.course-grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .course-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .course-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .course-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 640px) { .course-grid { gap: 12px; } }

.course-card { display: flex; flex-direction: column; padding: 0; overflow: hidden; }
.course-card__thumb { aspect-ratio: 16/9; background: radial-gradient(80% 120% at 20% 0%, rgba(34,197,94,.22), transparent 60%), linear-gradient(135deg, #171717, #0d0d0d); border-bottom: 1px solid var(--border); display: grid; place-items: center; color: var(--accent); }
.course-card__body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.course-card__badges { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.course-card__rating { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--accent); font-weight: 600; }
.course-card__title { font-size: 15px; font-weight: 600; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 40px; }
.course-card__desc { font-size: 13px; color: var(--text-2); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.course-card__meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-3); flex-wrap: wrap; }
.course-card__foot { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-3); }

.dash-split { display: grid; gap: 24px; grid-template-columns: 1fr; }
@media (min-width: 1024px) { .dash-split { grid-template-columns: 1.4fr 1fr; } }
.activity { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; align-items: end; padding: 24px; min-height: 220px; }
.activity__col { display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; }
.activity__bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; justify-content: center; }
.activity__bar { width: 100%; max-width: 40px; border-radius: var(--r-sm) var(--r-sm) 2px 2px; background: linear-gradient(180deg, var(--surface-3), var(--surface-2)); border: 1px solid var(--border); transition: all var(--dur) var(--ease); min-height: 8px; }
.activity__bar--on { background: linear-gradient(180deg, var(--accent), var(--accent-2)); border-color: var(--accent-2); box-shadow: 0 0 12px rgba(34,197,94,.25); }
.activity__day { font-size: 11px; color: var(--text-3); font-weight: 500; }
@media (max-width: 480px) { .activity { padding: 16px; gap: 6px; } .activity__day { font-size: 9px; } }

.deadlines { display: flex; flex-direction: column; padding: 0; }
.deadline { display: grid; grid-template-columns: 68px 1fr auto; gap: 14px; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); transition: background-color var(--dur) var(--ease); }
.deadline:last-child { border-bottom: 0; }
.deadline:hover { background: var(--surface-2); }
.deadline__date { display: flex; flex-direction: column; align-items: center; background: var(--accent-soft-2); border: 1px solid var(--accent-ring); border-radius: var(--r-md); padding: 6px 8px; }
.deadline__day { font-size: 18px; font-weight: 700; color: var(--accent); line-height: 1; }
.deadline__month { font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }
.deadline__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.deadline__title { font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.deadline__course { font-size: 12px; color: var(--text-2); }
@media (max-width: 480px) { .deadline { grid-template-columns: 60px 1fr; padding: 14px; } .deadline .badge { display: none; } }

/* ---------- Courses page ---------- */
.courses-toolbar { display: grid; gap: 14px; grid-template-columns: 1fr; padding: 16px 0; margin-bottom: 24px; border-bottom: 1px solid var(--border); position: sticky; top: var(--topbar-h); z-index: 40; background: linear-gradient(to bottom, var(--bg) 75%, transparent); }
@media (min-width: 900px) { .courses-toolbar { grid-template-columns: minmax(240px, 1fr) auto auto; align-items: center; } }
.courses-toolbar__search { min-width: 0; }
.courses-toolbar__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.courses-toolbar__right { display: flex; gap: 8px; flex-wrap: wrap; }

/* ---------- Course detail ---------- */
.detail-hero { display: grid; gap: 32px; grid-template-columns: 1fr; margin-bottom: 32px; }
@media (min-width: 1024px) { .detail-hero { grid-template-columns: 1.5fr 1fr; } }
.detail-hero__main { display: flex; flex-direction: column; gap: 20px; padding: 8px 0; }
.detail-hero__meta { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text-2); flex-wrap: wrap; }
.detail-hero__rating { display: inline-flex; align-items: center; gap: 4px; color: var(--accent); font-weight: 600; }
.detail-hero__cta { display: flex; gap: 10px; flex-wrap: wrap; }
.detail-hero__side { position: sticky; top: calc(var(--topbar-h) + 20px); align-self: flex-start; padding: 0; overflow: hidden; }
.detail-hero__thumb { aspect-ratio: 16/9; background: radial-gradient(80% 120% at 30% 0%, rgba(34,197,94,.22), transparent 60%), linear-gradient(135deg, #171717, #0d0d0d); border-bottom: 1px solid var(--border); display: grid; place-items: center; color: var(--accent); }
.detail-hero__side-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.detail-hero__price { font-size: 22px; font-weight: 700; letter-spacing: -.02em; }
.detail-hero__list { display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-2); }
.detail-hero__list li { display: flex; align-items: center; gap: 8px; }
.detail-hero__list svg { color: var(--accent); flex: 0 0 auto; }
.detail-panel { margin-top: 24px; display: flex; flex-direction: column; gap: 24px; }
.detail-h2 { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
.detail-h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.detail-goals { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .detail-goals { grid-template-columns: 1fr 1fr; } }
.detail-list { display: flex; flex-direction: column; gap: 10px; font-size: 14px; color: var(--text-2); }
.detail-list li { display: flex; align-items: center; gap: 8px; }
.detail-list svg { color: var(--accent); flex: 0 0 auto; }
.curriculum__head { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid var(--border); }
.curriculum__head h3 { font-size: 16px; }
.curriculum__list { display: flex; flex-direction: column; }
.curriculum__item { display: grid; grid-template-columns: 32px 1fr auto; gap: 12px; align-items: center; padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text-2); transition: background-color var(--dur) var(--ease); }
.curriculum__item:last-child { border-bottom: 0; }
.curriculum__item:hover { background: var(--surface-2); }
.curriculum__item.is-done { color: var(--text); }
.curriculum__icon { color: var(--text-3); display: inline-flex; }
.curriculum__item.is-done .curriculum__icon { color: var(--accent); }
.curriculum__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.curriculum__index { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
.curriculum__title { font-weight: 500; color: inherit; }
.curriculum__duration { font-size: 12px; color: var(--text-3); display: inline-flex; align-items: center; gap: 4px; }
.reviews { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .reviews { grid-template-columns: 1fr 1fr; } }
.review { display: flex; flex-direction: column; gap: 12px; }
.review__head { display: flex; align-items: center; gap: 12px; }
.review__name { font-size: 14px; font-weight: 600; }
.review__date { font-size: 12px; color: var(--text-3); }
.review__stars { margin-inline-start: auto; display: inline-flex; gap: 2px; }
.star-on { color: var(--accent); }
.star-off { color: var(--text-3); opacity: .35; }
.review__body { font-size: 14px; color: var(--text-2); line-height: 1.6; }

/* ---------- Profile ---------- */
.profile-cover { height: 180px; border-radius: var(--r-xl); background: radial-gradient(700px 240px at 30% 0%, rgba(34,197,94,.18), transparent 60%), linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border: 1px solid var(--border); margin-bottom: -60px; position: relative; overflow: hidden; }
@media (max-width: 640px) { .profile-cover { height: 120px; margin-bottom: -48px; } }
.profile-head { display: flex; align-items: flex-end; gap: 20px; padding: 0 12px; margin-bottom: 24px; flex-wrap: wrap; }
.profile-avatar { border: 4px solid var(--bg); box-shadow: var(--sh-md); }
.profile-head__text { padding-bottom: 8px; flex: 1; min-width: 0; }
.profile-head__name { font-size: clamp(24px, 2.4vw, 30px); font-weight: 700; letter-spacing: -.02em; }
.profile-head__meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; color: var(--text-2); margin-top: 6px; }
.profile-head__meta svg { vertical-align: middle; }
.profile-head__actions { padding-bottom: 8px; }
@media (max-width: 640px) { .profile-head__actions { width: 100%; } .profile-head__actions .btn { width: 100%; } }
.profile-stats { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); margin-bottom: 32px; }
.pstat { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 20px; }
.pstat__icon { width: 34px; height: 34px; border-radius: var(--r-md); background: var(--accent-soft-2); color: var(--accent); display: grid; place-items: center; margin-bottom: 4px; }
.pstat__value { font-size: 26px; font-weight: 700; letter-spacing: -.02em; line-height: 1; }
.pstat__label { font-size: 13px; color: var(--text-2); }
.achievements { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.achievement { display: flex; align-items: center; gap: 14px; padding: 16px; }
.achievement__icon { width: 46px; height: 46px; border-radius: 50%; background: var(--accent-soft-2); color: var(--accent); display: grid; place-items: center; font-size: 22px; flex: 0 0 auto; }
.achievement__title { font-size: 14px; font-weight: 600; }
.achievement__desc { font-size: 12px; color: var(--text-2); margin-top: 2px; }
.timeline { display: flex; flex-direction: column; gap: 14px; }
.timeline li { display: flex; gap: 12px; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--border); }
.timeline li:last-child { border-bottom: 0; }
.timeline__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-top: 8px; box-shadow: 0 0 8px rgba(34,197,94,.4); flex: 0 0 auto; }
.timeline__title { font-size: 14px; color: var(--text); }
.timeline__when { font-size: 12px; color: var(--text-3); }

/* ---------- Settings ---------- */
.settings { display: grid; gap: 28px; grid-template-columns: 1fr; }
@media (min-width: 1024px) { .settings { grid-template-columns: 220px 1fr; } }
.settings__nav { display: flex; flex-direction: column; gap: 4px; position: sticky; top: calc(var(--topbar-h) + 20px); align-self: flex-start; }
.settings__nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: var(--r-md); font-size: 14px; color: var(--text-2); font-weight: 500; transition: all var(--dur) var(--ease); text-align: start; min-height: 42px; }
.settings__nav-item:hover { background: var(--surface-2); color: var(--text); }
.settings__nav-item.is-active { background: var(--accent-soft-2); color: var(--accent); font-weight: 600; }
.settings__body { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.settings__head { margin-bottom: 16px; }
.settings__head h3 { font-size: 17px; font-weight: 600; }
.settings__head p { font-size: 13px; color: var(--text-2); margin-top: 2px; }
.settings__row { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
.settings__row:last-child { border-bottom: 0; }
.settings__row-label { font-size: 14px; font-weight: 500; color: var(--text); }
.settings__row-desc { font-size: 12px; color: var(--text-2); margin-top: 2px; }
.settings__row-control { flex: 0 0 auto; min-width: 180px; }
.settings__save { position: sticky; bottom: 20px; padding: 14px 18px; background: var(--surface-3); border: 1px solid var(--border-2); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: var(--sh-md); animation: slideUp var(--dur) var(--ease); }
@keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.toggle { position: relative; width: 44px; height: 26px; border-radius: var(--r-pill); background: var(--surface-3); border: 1px solid var(--border-2); transition: all var(--dur) var(--ease); }
.toggle__dot { position: absolute; top: 2px; inset-inline-start: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--text-3); transition: all var(--dur) var(--ease); }
.toggle.is-on { background: var(--accent-soft-2); border-color: var(--accent-ring); }
.toggle.is-on .toggle__dot { background: var(--accent); inset-inline-start: calc(100% - 22px); }

/* ---------- NotFound ---------- */
.nf { min-height: 55vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 14px; padding: 40px 20px; }
.nf__icon { width: 60px; height: 60px; border-radius: 50%; background: var(--accent-soft-2); color: var(--accent); display: grid; place-items: center; }
.nf__code { font-family: var(--mono); font-size: clamp(48px, 8vw, 72px); font-weight: 700; color: var(--text-3); letter-spacing: -.05em; line-height: 1; }
.nf__title { font-size: 24px; font-weight: 700; }
.nf__desc { color: var(--text-2); font-size: 15px; max-width: 40ch; }
.nf__actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
`;

// =============================================================================
// WRITE + RUN
// =============================================================================

const STALE_EXT = [".module.css"];

function cleanStale() {
  step("Cleaning stale CSS modules + old pages");
  let removed = 0;
  const srcDir = path.join(ROOT, "src");
  if (!exists(srcDir)) {
    ok("src/ missing");
    return;
  }
  (function walk(dir) {
    let es;
    try {
      es = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of es) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
        continue;
      }
      if (STALE_EXT.some((s) => e.name.endsWith(s))) {
        try {
          fs.unlinkSync(full);
          removed++;
        } catch {}
      }
    }
  })(srcDir);
  ok("Removed " + removed + " stale CSS module(s)");
}

function writeAll() {
  step("Writing " + Object.keys(files).length + " files");
  let n = 0;
  for (const rel of Object.keys(files)) {
    try {
      writeF(rel, files[rel]);
      n++;
    } catch (e) {
      warn(rel + ": " + e.message);
    }
  }
  ok("Wrote " + n + "/" + Object.keys(files).length + " files");
}

function installDeps() {
  step("Installing dependencies");
  const vite =
    os.platform() === "win32"
      ? path.join(ROOT, "node_modules", ".bin", "vite.cmd")
      : path.join(ROOT, "node_modules", ".bin", "vite");
  if (exists(vite)) {
    info("node_modules present — skipping");
    return true;
  }
  const r = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: os.platform() === "win32",
    timeout: 8 * 60 * 1000,
  });
  if (r.status !== 0) {
    warn("npm install failed");
    return false;
  }
  ok("npm install done");
  return true;
}

function runBuild() {
  step("Building");
  const r = spawnSync("npm", ["run", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: os.platform() === "win32",
    timeout: 5 * 60 * 1000,
  });
  if (r.status !== 0) {
    err("build failed");
    return false;
  }
  ok("build ok");
  return true;
}

function runDevAndOpen() {
  if (process.env.SKIP_DEV === "1") {
    info("SKIP_DEV=1 — skipping dev server");
    return;
  }
  step("Starting dev server on :5173");
  const child = spawn
    ? require("child_process").spawn("npm", ["run", "dev"], {
        cwd: ROOT,
        shell: os.platform() === "win32",
        stdio: "inherit",
      })
    : null;
  if (!child) {
    warn("Could not spawn dev server");
    return;
  }
  setTimeout(() => {
    const url = "http://localhost:5173/";
    try {
      if (os.platform() === "win32")
        require("child_process")
          .spawn("cmd", ["/c", "start", '""', url], {
            detached: true,
            stdio: "ignore",
          })
          .unref();
      else if (os.platform() === "darwin")
        require("child_process")
          .spawn("open", [url], { detached: true, stdio: "ignore" })
          .unref();
      else
        require("child_process")
          .spawn("xdg-open", [url], { detached: true, stdio: "ignore" })
          .unref();
      console.log("");
      ok("Site live at: " + url);
      console.log(paint(C.gry, "  Press Ctrl+C to stop."));
    } catch {}
  }, 4000);
  child.on("exit", () => process.exit(0));
}

function main() {
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
      "║   EGY-Skills · full design overhaul · fix.cjs        ║"
    )
  );
  console.log(
    paint(
      C.b + C.grn,
      "╚══════════════════════════════════════════════════════╝"
    )
  );
  console.log(paint(C.gry, "  Root: " + ROOT));
  console.log("");
  backup();
  cleanStale();
  writeAll();
  installDeps();
  const built = runBuild();
  hr();
  console.log(paint(C.b, "  Done."));
  console.log(paint(C.gry, "  Files written: ") + Object.keys(files).length);
  console.log(paint(C.gry, "  Backup: ") + paint(C.cyn, ".backup-*"));
  console.log(
    paint(C.gry, "  Build: ") +
      (built ? paint(C.grn, "PASS") : paint(C.yel, "SKIPPED"))
  );
  console.log("");
  if (built) runDevAndOpen();
  else {
    console.log(paint(C.b, "  Next steps:"));
    console.log(
      "    " + paint(C.cyn, "npm run dev") + "       → dev server on :5173"
    );
    console.log(
      "    " + paint(C.cyn, "npm run build") + "     → production build"
    );
  }
}

main();

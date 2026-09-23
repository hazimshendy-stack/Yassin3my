export function formatNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '0';
  try { return new Intl.NumberFormat('ar-EG').format(num); } catch { return String(num); }
}
export function pct(a, b) { const t = Number(b); if (!t) return 0; return Math.min(100, Math.max(0, Math.round((Number(a) / t) * 100))); }
export function initials(name = '') {
  const p = String(name).trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '؟';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
export function formatDate(d) {
  if (!d) return '';
  try { return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d)); } catch { return ''; }
}

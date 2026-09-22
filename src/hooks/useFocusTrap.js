import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(ref, active) {
  const enabled = typeof active === 'boolean' ? active : true;
  useEffect(() => {
    if (!enabled) return undefined;
    const root = ref.current;
    if (!root) return undefined;

    const previouslyFocused = document.activeElement;
    const nodes = () =>
      Array.from(root.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null);
    const first = () => nodes()[0];

    const focusTimer = setTimeout(() => {
      const f = first();
      if (f && typeof f.focus === 'function') f.focus();
    }, 0);

    function onKeyDown(e) {
      if (e.key !== 'Tab') return;
      const items = nodes();
      if (items.length === 0) { e.preventDefault(); return; }
      const f = items[0];
      const l = items[items.length - 1];
      if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
    }

    root.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      root.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [ref, enabled]);
}

export default useFocusTrap;

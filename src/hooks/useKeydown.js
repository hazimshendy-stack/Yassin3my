import { useEffect } from 'react';

/**
 * Attach a keydown handler to window. Pass `enabled = false` to temporarily skip.
 * @param {(e: KeyboardEvent) => void} handler
 * @param {boolean} enabled
 */
export function useKeydown(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (e) => handler(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, enabled]);
}

export default useKeydown;

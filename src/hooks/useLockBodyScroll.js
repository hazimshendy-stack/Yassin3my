import { useEffect } from 'react';

export function useLockBodyScroll(locked = true) {
  useEffect(() => {
    if (!locked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [locked]);
}

export default useLockBodyScroll;

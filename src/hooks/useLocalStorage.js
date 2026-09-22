import { useCallback, useEffect, useState } from 'react';
import { logger } from '../lib/logger.js';

export function useLocalStorage(key, initialValue) {
  const read = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw);
    } catch (e) {
      logger.warn('useLocalStorage read failed', key, e.message);
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      logger.warn('useLocalStorage write failed', key, e.message);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;

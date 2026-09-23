import { createContext, useContext, useCallback, useEffect, useState } from 'react';
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

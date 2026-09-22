import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import './Toast.module.css';

const ToastContext = createContext(null);

let toastSeq = 0;

function reducer(state, action) {
  switch (action.type) {
    case 'push':
      return [...state, action.toast].slice(-4);
    case 'pop':
      return state.filter((t) => t.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    dispatch({ type: 'pop', id });
  }, []);

  const push = useCallback(
    (input, opts = {}) => {
      const id = ++toastSeq;
      const toast = {
        id,
        tone: opts.tone || 'neutral',
        title: typeof input === 'string' ? input : input.title,
        description: typeof input === 'object' ? input.description : opts.description,
        duration: opts.duration ?? 4000,
      };
      dispatch({ type: 'push', toast });
      if (toast.duration > 0) {
        const t = setTimeout(() => remove(id), toast.duration);
        timers.current.set(id, t);
      }
      return id;
    },
    [remove]
  );

  useEffect(
    () => () => {
      for (const t of timers.current.values()) clearTimeout(t);
      timers.current.clear();
    },
    []
  );

  const api = useMemo(
    () => ({
      push,
      remove,
      success: (t, o) => push(t, { ...(o || {}), tone: 'success' }),
      info: (t, o) => push(t, { ...(o || {}), tone: 'info' }),
      error: (t, o) => push(t, { ...(o || {}), tone: 'error' }),
    }),
    [push, remove]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const Icon =
    toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? AlertCircle : Info;
  return (
    <div className={`toast toast--${toast.tone}`} role="status">
      <span className="toast__icon" aria-hidden="true">
        <Icon size={16} />
      </span>
      <div className="toast__body">
        <p className="toast__title">{toast.title}</p>
        {toast.description ? <p className="toast__desc">{toast.description}</p> : null}
      </div>
      <button type="button" className="toast__close" onClick={onClose} aria-label="close">
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export default ToastProvider;

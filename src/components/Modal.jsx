import { useEffect } from 'react';
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

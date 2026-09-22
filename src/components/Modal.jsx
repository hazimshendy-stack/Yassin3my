import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useKeydown } from '../hooks/useKeydown.js';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import './Modal.module.css';

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  footer = null,
  children,
  closeOnOverlay = true,
}) {
  const panelRef = useRef(null);
  useKeydown(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    Boolean(open)
  );
  useLockBodyScroll(Boolean(open));
  useFocusTrap(panelRef, Boolean(open));

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (!closeOnOverlay) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <header className="modal__head">
          <h3 className="modal__title">{title}</h3>
          <button
            type="button"
            className="modal__close"
            onClick={() => onClose?.()}
            aria-label="close"
          >
            <X size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

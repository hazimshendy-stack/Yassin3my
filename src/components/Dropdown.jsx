import { useEffect, useRef, useState } from 'react';
import { useKeydown } from '../hooks/useKeydown.js';
import './Dropdown.module.css';

export function Dropdown({ trigger, items = [], align = 'end', className = '' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useKeydown((e) => e.key === 'Escape' && setOpen(false), open);

  return (
    <div ref={wrapRef} className={['dropdown', className].filter(Boolean).join(' ')}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open ? (
        <div
          role="menu"
          className={`dropdown__menu dropdown__menu--${align}`}
          onClick={() => setOpen(false)}
        >
          {items.map((item, idx) =>
            item.type === 'separator' ? (
              <div key={`sep-${idx}`} className="dropdown__sep" />
            ) : (
              <button
                key={item.id || item.label || idx}
                type="button"
                role="menuitem"
                className={`dropdown__item ${item.tone === 'danger' ? 'is-danger' : ''}`}
                onClick={item.onSelect}
                disabled={item.disabled}
              >
                {item.icon ? <span className="dropdown__icon">{item.icon}</span> : null}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Dropdown;

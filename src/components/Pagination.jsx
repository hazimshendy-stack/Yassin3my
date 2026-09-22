import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.module.css';

export function Pagination({ page, pageCount, onChange, className = '' }) {
  if (pageCount <= 1) return null;
  const pages = [];
  const push = (n) => pages.push(n);
  const span = 1;
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= span) push(i);
    else if (pages[pages.length - 1] !== '…') push('…');
  }
  return (
    <nav
      aria-label="pagination"
      className={['pagination', className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="pagination__arrow"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="previous"
      >
        <ChevronRight size={16} />
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="pagination__gap">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination__btn ${p === page ? 'is-active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        className="pagination__arrow"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        aria-label="next"
      >
        <ChevronLeft size={16} />
      </button>
    </nav>
  );
}

export default Pagination;

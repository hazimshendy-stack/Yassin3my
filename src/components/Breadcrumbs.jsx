import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import './Breadcrumbs.module.css';

export function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="breadcrumbs" className="crumbs">
      <ol className="crumbs__list">
        <li className="crumbs__item">
          <Link to="/" className="crumbs__link" aria-label="home">
            <Home size={14} />
          </Link>
        </li>
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="crumbs__item">
              <ChevronLeft size={12} className="crumbs__sep" aria-hidden="true" />
              {isLast || !it.to ? (
                <span aria-current="page" className="crumbs__current">
                  {it.label}
                </span>
              ) : (
                <Link to={it.to} className="crumbs__link">
                  {it.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
export function PageHeader({ breadcrumbs = [], title, subtitle, actions }) {
  return (
    <header className="ph">
      {breadcrumbs.length ? (
        <nav className="ph__crumbs" aria-label="breadcrumbs">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="ph__crumb">
              {b.to ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
              {i < breadcrumbs.length - 1 ? <ChevronLeft size={12} className="ph__sep" /> : null}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="ph__row">
        <div className="ph__text">
          <h1 className="ph__title">{title}</h1>
          {subtitle ? <p className="ph__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="ph__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
export default PageHeader;

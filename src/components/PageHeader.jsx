import { Breadcrumbs } from './Breadcrumbs.jsx';
import './PageHeader.module.css';

export function PageHeader({ title, subtitle, breadcrumbs = [], actions = null }) {
  return (
    <header className="page-header">
      {breadcrumbs.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="page-header__row">
        <div className="page-header__text">
          <h1 className="page-header__title">{title}</h1>
          {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="page-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export default PageHeader;

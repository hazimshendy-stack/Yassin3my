import { Link, Outlet } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../lib/constants.js';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <Link to={ROUTES.home} className="auth-layout__brand">
          <span className="auth-layout__dot" aria-hidden="true" />
          <span>{APP_NAME}</span>
        </Link>
        <p className="auth-layout__tagline">
          تعلم. ابنِ. ابتكر. — مع منصة الطلاب الأولى للأردوينو والبرمجة.
        </p>
        <ul className="auth-layout__points">
          <li>دروس عملية ومشاريع حقيقية</li>
          <li>متابعة دقيقة للتقدم واكتساب النقاط</li>
          <li>مجتمع طلابي ومحتوى حديث</li>
        </ul>
      </div>
      <div className="auth-layout__content">
        <div className="auth-layout__card">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

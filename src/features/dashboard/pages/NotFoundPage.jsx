import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../../../components/Button.jsx';
import { ROUTES } from '../../../lib/constants.js';
import './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className="nf" role="region" aria-labelledby="nf-title">
      <div className="nf__panel">
        <div className="nf__icon" aria-hidden="true">
          <Compass size={26} />
        </div>
        <p className="nf__code mono">404</p>
        <h1 id="nf-title" className="nf__title">الصفحة غير موجودة</h1>
        <p className="nf__desc">
          الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله. جرّب العودة إلى لوحة التحكم.
        </p>
        <div className="nf__actions">
          <Button variant="primary" to={ROUTES.home} leftIcon={<Home size={15} />}>
            لوحة التحكم
          </Button>
          <Button variant="outline" to={ROUTES.courses}>
            تصفح الكورسات
          </Button>
        </div>
        <Link to={ROUTES.home} className="nf__hidden">
          الرئيسية
        </Link>
      </div>
    </div>
  );
}

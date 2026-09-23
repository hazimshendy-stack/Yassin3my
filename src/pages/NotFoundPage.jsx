import { Compass, Home } from 'lucide-react';
import { Button } from '../components/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="nf">
      <div className="nf__icon"><Compass size={32} /></div>
      <div className="nf__code">404</div>
      <h1 className="nf__title">الصفحة غير موجودة</h1>
      <p className="nf__desc">الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.</p>
      <div className="nf__actions">
        <Button variant="primary" to="/" leftIcon={<Home size={15} />}>لوحة التحكم</Button>
        <Button variant="outline" to="/courses">تصفح الكورسات</Button>
      </div>
    </div>
  );
}

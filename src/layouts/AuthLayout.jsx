import { Link, Outlet } from 'react-router-dom';
import { Sparkles, BookOpen, Award, Users } from 'lucide-react';
import { ROUTES } from '../lib/constants.js';

export function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <Link to={ROUTES.home} className="auth__brand">
          <span className="brand__mark" aria-hidden />
          <span>EGY-Skills</span>
        </Link>

        <div className="auth__hero">
          <span className="auth__hero-chip"><Sparkles size={14} /> منصة تعليمية متكاملة</span>
          <h1 className="auth__hero-title">تعلّم. ابنِ. ابتكر.</h1>
          <p className="auth__hero-sub">انضم إلى منصة إيجي سكيلز وابدأ رحلتك في عالم الأردوينو والبرمجة والروبوتكس مع محتوى عربي معاصر ومشاريع عملية.</p>
        </div>

        <ul className="auth__points">
          <li><BookOpen size={16} /> <span>دروس عملية ومنهجية واضحة</span></li>
          <li><Award size={16} /> <span>تتبع التقدم وشهادات إتمام</span></li>
          <li><Users size={16} /> <span>مجتمع طلابي ومحتوى حديث</span></li>
        </ul>

        <p className="auth__copy">© {new Date().getFullYear()} EGY-Skills</p>
      </aside>

      <section className="auth__main">
        <div className="auth__card">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
export default AuthLayout;

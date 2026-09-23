import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User as UserIcon, Settings as SettingsIcon, Compass, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useUI } from '../contexts/UIContext.jsx';
import { NAV } from '../lib/constants.js';

const ICONS = { LayoutDashboard, BookOpen, User: UserIcon, Settings: SettingsIcon };

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUI();
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && closeSidebar();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [closeSidebar]);

  return (
    <>
      {sidebarOpen ? <div className="sidebar__overlay" onClick={closeSidebar} aria-hidden /> : null}
      <aside ref={ref} className={'sidebar' + (sidebarOpen ? ' sidebar--open' : '')} aria-label="التنقل">
        <button className="sidebar__close" onClick={closeSidebar} aria-label="إغلاق"><X size={18} /></button>

        <div className="sidebar__brand">
          <div className="brand__mark" aria-hidden />
          <div>
            <div className="sidebar__title">EGY-Skills</div>
            <div className="sidebar__tag">منصة الطلاب</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((group) => (
            <div key={group.group} className="sidebar__group">
              <p className="sidebar__group-title">{group.group}</p>
              <ul>
                {group.items.map((item) => {
                  const Ico = ICONS[item.icon] || Compass;
                  return (
                    <li key={item.to}>
                      <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => 'side-link' + (isActive ? ' side-link--on' : '')} onClick={closeSidebar}>
                        <span className="side-link__icon"><Ico size={18} /></span>
                        <span className="side-link__label">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar__cta">
          <div className="sidebar__cta-title">ابدأ رحلتك</div>
          <p className="sidebar__cta-desc">اختر كورسًا وابدأ التعلم الآن.</p>
          <NavLink to="/courses" className="btn btn--primary btn--sm btn--block" onClick={closeSidebar}>تصفح الكورسات</NavLink>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;

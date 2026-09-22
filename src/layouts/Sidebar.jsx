import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Boxes,
  User as UserIcon,
  Settings,
  Circle,
} from 'lucide-react';
import { useUI } from '../components/UIProvider.jsx';
import { useKeydown } from '../hooks/useKeydown.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { NAV_SECTIONS } from '../lib/constants.js';
import './Sidebar.module.css';

const ICONS = {
  LayoutDashboard,
  BookOpen,
  Boxes,
  User: UserIcon,
  Settings,
};

function resolveIcon(name) {
  const Ico = ICONS[name] || Circle;
  return <Ico size={18} />;
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar, lang } = useUI();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const drawerRef = useRef(null);

  useKeydown((e) => { if (e.key === 'Escape') closeSidebar(); }, !isDesktop && sidebarOpen);
  useLockBodyScroll(!isDesktop && sidebarOpen);
  useFocusTrap(drawerRef, !isDesktop && sidebarOpen);

  useEffect(() => { if (isDesktop) closeSidebar(); }, [isDesktop, closeSidebar]);

  const rendered = (
    <aside
      ref={drawerRef}
      className={'sidebar ' + (sidebarOpen ? 'is-open' : '')}
      aria-label="sidebar navigation"
    >
      <nav className="sidebar__nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="sidebar__section">
            <p className="sidebar__section-title">
              {lang === 'ar' ? section.titleAr : section.titleEn}
            </p>
            <ul className="sidebar__list">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => 'sidebar__item ' + (isActive ? 'is-active' : '')}
                    onClick={() => { if (!isDesktop) closeSidebar(); }}
                  >
                    <span className="sidebar__icon" aria-hidden="true">
                      {resolveIcon(item.icon)}
                    </span>
                    <span className="sidebar__label">
                      {lang === 'ar' ? item.labelAr : item.labelEn}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );

  if (isDesktop) return rendered;

  return (
    <>
      {sidebarOpen ? (
        <div className="sidebar__overlay" onClick={closeSidebar} aria-hidden="true" />
      ) : null}
      {rendered}
    </>
  );
}

export default Sidebar;

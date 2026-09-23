import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogIn, LogOut, Menu, Search, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUI } from '../contexts/UIContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { ROUTES } from '../lib/constants.js';

export function TopBar() {
  const { toggleSidebar } = useUI();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__burger" onClick={toggleSidebar} aria-label="القائمة"><Menu size={20} /></button>
        <Link to={ROUTES.home} className="topbar__brand">
          <span className="brand__mark" aria-hidden />
          <span className="brand__name">EGY-Skills</span>
        </Link>
      </div>

      <div className="topbar__right">
        <button className="icon-btn" aria-label="الإشعارات" title="الإشعارات">
          <Bell size={18} />
          <span className="icon-btn__dot" />
        </button>

        {user ? (
          <div className="user-menu" ref={menuRef}>
            <button className="user-menu__trigger" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen}>
              <Avatar name={user.name} size={30} />
              <span className="user-menu__name">{user.name}</span>
            </button>
            {menuOpen ? (
              <div className="user-menu__panel" role="menu">
                <button className="user-menu__item" onClick={() => { setMenuOpen(false); nav(ROUTES.profile); }}>
                  <UserIcon size={15} /> <span>ملفي الشخصي</span>
                </button>
                <button className="user-menu__item" onClick={() => { setMenuOpen(false); nav(ROUTES.settings); }}>
                  <SettingsIcon size={15} /> <span>الإعدادات</span>
                </button>
                <div className="user-menu__sep" />
                <button className="user-menu__item user-menu__item--danger" onClick={() => { setMenuOpen(false); logout(); nav(ROUTES.login); }}>
                  <LogOut size={15} /> <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Link to={ROUTES.login} className="btn btn--primary btn--sm">
            <LogIn size={15} /> <span>دخول</span>
          </Link>
        )}
      </div>
    </header>
  );
}
export default TopBar;

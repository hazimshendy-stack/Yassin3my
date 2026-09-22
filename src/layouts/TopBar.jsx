import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogIn, LogOut, Menu, User, Languages } from 'lucide-react';
import { IconButton } from '../components/IconButton.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Dropdown } from '../components/Dropdown.jsx';
import { useUI } from '../components/UIProvider.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { APP_NAME, ROUTES } from '../lib/constants.js';
import './TopBar.module.css';

export function TopBar({ unreadCount = 0, onOpenNotifications }) {
  const { toggleSidebar, lang, toggleLang } = useUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthRoute =
    location.pathname.startsWith(ROUTES.login) || location.pathname.startsWith(ROUTES.register);

  const menuItems = user
    ? [
        {
          id: 'profile',
          label: 'الملف الشخصي',
          icon: <User size={14} />,
          onSelect: () => navigate(ROUTES.profile),
        },
        { type: 'separator' },
        {
          id: 'logout',
          label: 'تسجيل الخروج',
          icon: <LogOut size={14} />,
          onSelect: () => {
            logout();
            navigate(ROUTES.home, { replace: true });
          },
        },
      ]
    : [];

  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        {!isAuthRoute ? (
          <IconButton
            label="القائمة"
            className="topbar__menu"
            onClick={toggleSidebar}
            size="md"
          >
            <Menu size={18} />
          </IconButton>
        ) : null}

        <Link to={ROUTES.home} className="topbar__brand" aria-label={APP_NAME}>
          <span className="topbar__brand-dot" aria-hidden="true" />
          <span className="topbar__brand-name">{APP_NAME}</span>
        </Link>
      </div>

      <div className="topbar__right">
        <IconButton
          label={lang === 'ar' ? 'English' : 'العربية'}
          onClick={toggleLang}
          size="md"
          title={lang === 'ar' ? 'English' : 'العربية'}
        >
          <Languages size={17} />
        </IconButton>

        <IconButton
          label="الإشعارات"
          onClick={onOpenNotifications}
          size="md"
          className="topbar__bell"
        >
          <Bell size={17} />
          {unreadCount > 0 ? (
            <span className="topbar__badge" aria-label={`${unreadCount} unread`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </IconButton>

        {user ? (
          <Dropdown
            trigger={
              <button type="button" className="topbar__account" aria-label="account menu">
                <Avatar src={user.avatarUrl} name={user.name} size={30} />
                <span className="topbar__account-name">{user.name}</span>
              </button>
            }
            items={menuItems}
          />
        ) : (
          <Link to={ROUTES.login} className="topbar__login">
            <LogIn size={15} />
            <span>تسجيل الدخول</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default TopBar;

export const APP_NAME = 'EGY-Skills';
export const ROUTES = {
  home: '/',
  courses: '/courses',
  course: (id = ':id') => '/courses/' + id,
  profile: '/profile',
  settings: '/settings',
  login: '/login',
  register: '/register',
};

export const NAV = [
  { group: 'الرئيسية', items: [
    { to: '/', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
    { to: '/courses', label: 'الكورسات', icon: 'BookOpen' },
    { to: '/profile', label: 'ملفي الشخصي', icon: 'User' },
  ]},
  { group: 'الحساب', items: [
    { to: '/settings', label: 'الإعدادات', icon: 'Settings' },
  ]},
];

export const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'arduino', label: 'أردوينو' },
  { id: 'python', label: 'بايثون' },
  { id: 'web', label: 'ويب' },
  { id: 'robotics', label: 'روبوتكس' },
];

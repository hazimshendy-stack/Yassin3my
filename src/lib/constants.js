/** Shared constants. Keep values frozen so accidental writes fail loudly. */

export const APP_NAME = 'EGY-Skills';
export const APP_TAGLINE_AR = 'منصة الطلاب — تعلم. ابنِ. ابتكر.';
export const APP_TAGLINE_EN = 'Student platform — Learn. Build. Ship.';

export const STORAGE_KEYS = Object.freeze({
  auth: 'egyskills.auth',
  ui: 'egyskills.ui',
  theme: 'egyskills.theme',
});

export const ROUTES = Object.freeze({
  home: '/',
  courses: '/courses',
  course: (id = ':id') => `/courses/${id}`,
  modules: '/modules',
  profile: '/profile',
  settings: '/settings',
  login: '/login',
  register: '/register',
  notFound: '*',
});

export const NAV_SECTIONS = Object.freeze([
  {
    id: 'main',
    titleAr: 'الرئيسية',
    titleEn: 'Main',
    items: [
      { to: ROUTES.home, labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: 'LayoutDashboard' },
      { to: ROUTES.courses, labelAr: 'الكورسات', labelEn: 'Courses', icon: 'BookOpen' },
      { to: ROUTES.modules, labelAr: 'الوحدات', labelEn: 'Modules', icon: 'Boxes' },
    ],
  },
  {
    id: 'account',
    titleAr: 'الحساب',
    titleEn: 'Account',
    items: [
      { to: ROUTES.profile, labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: 'User' },
      { to: ROUTES.settings, labelAr: 'الإعدادات', labelEn: 'Settings', icon: 'Settings' },
    ],
  },
]);

export const COURSE_CATEGORIES = Object.freeze([
  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
  { id: 'arduino', labelAr: 'أردوينو', labelEn: 'Arduino' },
  { id: 'python', labelAr: 'بايثون', labelEn: 'Python' },
  { id: 'web', labelAr: 'ويب', labelEn: 'Web' },
  { id: 'robotics', labelAr: 'روبوتكس', labelEn: 'Robotics' },
]);

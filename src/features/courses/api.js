const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const SEED = [
  {
    id: 'arduino-basics',
    title: 'أساسيات الأردوينو والإلكترونيات',
    description:
      'ابدأ من الصفر مع لوحة Arduino UNO، تعرّف على الدوائر والمكونات وابنِ أول مشروع لك.',
    category: 'arduino',
    level: 'مبتدئ',
    duration: '8 ساعات',
    lessonsCount: 12,
    accent: 'green',
    progress: 35,
    enrolled: true,
  },
  {
    id: 'python-zero',
    title: 'Python من الصفر',
    description:
      'تعلّم لغة بايثون خطوة بخطوة: المتغيرات، الشروط، الحلقات، والدوال مع مشاريع عملية.',
    category: 'python',
    level: 'مبتدئ',
    duration: '10 ساعات',
    lessonsCount: 18,
    accent: 'green',
    progress: 62,
    enrolled: true,
  },
  {
    id: 'line-follower',
    title: 'روبوت تتبع الخط',
    description:
      'ابنِ روبوتًا يتتبع المسار باستخدام حساسات IR ومتحكم Arduino مع منطق تحكم دقيق.',
    category: 'robotics',
    level: 'متوسط',
    duration: '6 ساعات',
    lessonsCount: 9,
    accent: 'green',
    progress: 0,
    enrolled: false,
  },
  {
    id: 'web-basics',
    title: 'HTML & CSS للمبتدئين',
    description:
      'أنشئ صفحات ويب حديثة ومتجاوبة باستخدام HTML و CSS من الصفر دون أي خبرة سابقة.',
    category: 'web',
    level: 'مبتدئ',
    duration: '12 ساعات',
    lessonsCount: 22,
    accent: 'green',
    progress: 0,
    enrolled: false,
  },
  {
    id: 'sensors-deep',
    title: 'الحساسات المتقدمة',
    description:
      'توسّع في التعامل مع الحساسات: Ultrasonic، DHT، LDR، PIR، مع تكامل عملي كامل.',
    category: 'arduino',
    level: 'متوسط',
    duration: '5 ساعات',
    lessonsCount: 8,
    accent: 'green',
    progress: 0,
    enrolled: false,
  },
  {
    id: 'robotics-advanced',
    title: 'روبوتات متقدمة',
    description:
      'دمج الحساسات والمحركات وبناء أنظمة روبوتية ذاتية التحكم بمشاريع واقعية.',
    category: 'robotics',
    level: 'متقدم',
    duration: '14 ساعة',
    lessonsCount: 16,
    accent: 'green',
    progress: 0,
    enrolled: false,
  },
];

export const coursesApi = {
  async list({ q = '', category = 'all' } = {}) {
    await delay(250);
    const query = String(q).trim().toLowerCase();
    return SEED.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (!query) return true;
      return (
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    });
  },

  async get(id) {
    await delay(200);
    const found = SEED.find((c) => c.id === id);
    if (!found) {
      const e = new Error('course not found');
      e.code = 'NOT_FOUND';
      throw e;
    }
    const lessons = Array.from({ length: found.lessonsCount }, (_, i) => ({
      id: `${found.id}-l${i + 1}`,
      index: i + 1,
      title: `الدرس ${i + 1}`,
      duration: '~ 20 دقيقة',
      done: i < Math.round((found.progress / 100) * found.lessonsCount),
    }));
    return { ...found, lessons };
  },
};

export default coursesApi;

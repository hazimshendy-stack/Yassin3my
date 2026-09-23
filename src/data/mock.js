export const COURSES = [
  { id: 'arduino-1', title: 'أساسيات الأردوينو والإلكترونيات — الجزء الأول', description: 'ابدأ من الصفر مع لوحة Arduino UNO، تعرّف على الدوائر والمكونات وابنِ أول مشروع عملي لك خطوة بخطوة.', category: 'arduino', level: 'مبتدئ', duration: '8 ساعات', lessons: 12, rating: 4.8, students: 342, progress: 35, enrolled: true },
  { id: 'arduino-2', title: 'أساسيات الأردوينو — الجزء الثاني', description: 'توسّع في الحساسات والمحركات وشاشات العرض مع مشاريع تطبيقية متقدمة.', category: 'arduino', level: 'متوسط', duration: '9 ساعات', lessons: 14, rating: 4.7, students: 218, progress: 12, enrolled: true },
  { id: 'python-1', title: 'Python من الصفر إلى الاحتراف', description: 'تعلّم أساسيات لغة بايثون: المتغيرات، الشروط، الحلقات، الدوال، ومشاريع عملية كاملة.', category: 'python', level: 'مبتدئ', duration: '12 ساعة', lessons: 22, rating: 4.9, students: 512, progress: 62, enrolled: true },
  { id: 'web-1', title: 'تطوير الويب HTML & CSS الحديث', description: 'أنشئ صفحات ويب متجاوبة مع أحدث تقنيات CSS، وتعلّم تصميم واجهات احترافية.', category: 'web', level: 'مبتدئ', duration: '10 ساعات', lessons: 18, rating: 4.6, students: 389, progress: 0, enrolled: false },
  { id: 'js-1', title: 'JavaScript للمبتدئين', description: 'أساسيات لغة JavaScript وكيفية التعامل مع DOM وبناء تطبيقات تفاعلية.', category: 'web', level: 'مبتدئ', duration: '14 ساعة', lessons: 26, rating: 4.7, students: 445, progress: 0, enrolled: false },
  { id: 'robot-1', title: 'روبوت تتبع الخط', description: 'ابنِ روبوتًا يتتبع المسار باستخدام حساسات IR ومتحكم Arduino مع منطق تحكم دقيق.', category: 'robotics', level: 'متوسط', duration: '7 ساعات', lessons: 10, rating: 4.8, students: 156, progress: 0, enrolled: false },
  { id: 'robot-2', title: 'روبوتات متقدمة — التحكم اللاسلكي', description: 'تحكم في الروبوت عن بعد باستخدام ESP32 ولوحة تحكم ويب.', category: 'robotics', level: 'متقدم', duration: '11 ساعة', lessons: 15, rating: 4.9, students: 98, progress: 0, enrolled: false },
  { id: 'sensors-1', title: 'الحساسات المتقدمة والتحكم', description: 'استخدم أحدث الحساسات: DHT22، Ultrasonic، PIR، وLDR في مشاريع عملية متكاملة.', category: 'arduino', level: 'متوسط', duration: '6 ساعات', lessons: 9, rating: 4.6, students: 167, progress: 0, enrolled: false },
];

export const ACTIVITY_7D = [
  { day: 'السبت', mins: 45 },
  { day: 'الأحد', mins: 30 },
  { day: 'الاثنين', mins: 65 },
  { day: 'الثلاثاء', mins: 20 },
  { day: 'الأربعاء', mins: 80 },
  { day: 'الخميس', mins: 50 },
  { day: 'الجمعة', mins: 15 },
];

export const DEADLINES = [
  { id: 1, day: 12, month: 'نوف', title: 'اختبار الوحدة الثالثة', course: 'Python من الصفر' },
  { id: 2, day: 18, month: 'نوف', title: 'تسليم مشروع الأردوينو', course: 'أساسيات الأردوينو' },
  { id: 3, day: 25, month: 'نوف', title: 'اختبار نهاية المسار', course: 'تطوير الويب' },
];

export const REVIEWS = [
  { id: 1, name: 'أحمد محمود', date: 'قبل أسبوع', stars: 5, body: 'دورة ممتازة، الشرح واضح والمشاريع عملية جدًا. ساعدتني أفهم الأردوينو بسرعة.' },
  { id: 2, name: 'سارة إبراهيم', date: 'قبل أسبوعين', stars: 4, body: 'محتوى جيد ومنظم. كنت أتمنى المزيد من الأمثلة المتقدمة في النهاية.' },
  { id: 3, name: 'محمد ياسر', date: 'قبل شهر', stars: 5, body: 'أفضل تجربة تعليمية عربية حتى الآن. المستوى احترافي والمحتوى محدّث.' },
  { id: 4, name: 'نور حسن', date: 'قبل شهر', stars: 4, body: 'استفدت كثيرًا من الجزء العملي. أنصح بها لكل مبتدئ في المجال.' },
];

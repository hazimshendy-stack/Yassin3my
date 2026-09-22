const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const dashboardApi = {
  async summary() {
    await delay(350);
    return {
      stats: [
        { id: 'courses', label: 'كورسات نشطة', value: 4, delta: '+1 هذا الأسبوع' },
        { id: 'lessons', label: 'دروس مكتملة', value: 27, delta: '+5 هذا الأسبوع' },
        { id: 'hours', label: 'ساعات تعلم', value: 18.5, delta: '+2.5 هذا الأسبوع' },
        { id: 'xp', label: 'نقاط الخبرة', value: 1240, delta: '+80 هذا الأسبوع' },
      ],
      recent: [
        { id: 'r1', title: 'أكملت درس «مقدمة إلى Arduino»', when: 'قبل ساعتين' },
        { id: 'r2', title: 'حصلت على شارة «أول مشروع»', when: 'أمس' },
        { id: 'r3', title: 'بدأت كورس «Python من الصفر»', when: 'قبل 3 أيام' },
        { id: 'r4', title: 'سجّلت في «روبوت تتبع الخط»', when: 'قبل أسبوع' },
      ],
    };
  },
};

export default dashboardApi;

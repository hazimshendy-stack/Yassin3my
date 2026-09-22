import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, BookOpen, Clock, Sparkles, Play, Calendar, Award,
} from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader.jsx';
import { Card, CardHeader } from '../../../components/Card.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { Skeleton } from '../../../components/Skeleton.jsx';
import { EmptyState } from '../../../components/EmptyState.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { ROUTES } from '../../../lib/constants.js';
import { dashboardApi } from '../api.js';
import './DashboardPage.module.css';

const ICONS = { courses: BookOpen, lessons: Sparkles, hours: Clock, xp: Activity };
const WEEK_DAYS = ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    dashboardApi.summary().then((d) => { if (mounted) setData(d); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="fade-in">
      <section className="dash__hero">
        <span className="dash__hero-kicker">لوحة التحكم</span>
        <h1 className="dash__hero-title">مرحبًا، {user?.name || 'طالب'}</h1>
        <p className="dash__hero-sub">
          تابع تقدمك واستمر في التعلم. كل جلسة تقربك خطوة من هدفك.
        </p>
        <div className="dash__hero-cta">
          <Button to={ROUTES.courses} variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
            استكشف الكورسات
          </Button>
          <Button to={ROUTES.profile} variant="outline" size="lg">
            ملفي الشخصي
          </Button>
        </div>
      </section>

      <section className="dash__stats" aria-label="الملخص">
        {!data
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="dash__stat-card">
                <Skeleton width="40%" height={12} />
                <Skeleton width="60%" height={26} style={{ marginTop: 10 }} />
                <Skeleton width="50%" height={11} style={{ marginTop: 10 }} />
              </Card>
            ))
          : data.stats.map((s) => {
              const Icon = ICONS[s.id] || Sparkles;
              return (
                <Card key={s.id} className="dash__stat-card">
                  <div className="dash__stat-top">
                    <span className="dash__stat-label">{s.label}</span>
                    <span className="dash__stat-icon"><Icon size={18} /></span>
                  </div>
                  <div className="dash__stat-value">
                    {typeof s.value === 'number' ? new Intl.NumberFormat('ar-EG').format(s.value) : s.value}
                  </div>
                  <div className="dash__stat-delta">{s.delta}</div>
                </Card>
              );
            })}
      </section>

      <section className="dash__section">
        <div className="dash__section-head">
          <div>
            <h2 className="dash__section-title">أكمل التعلم</h2>
            <p className="dash__section-sub">ارجع من حيث توقفت</p>
          </div>
          <Link to={ROUTES.courses} className="dash__section-link">تصفح الكل ←</Link>
        </div>
        <div className="dash__continue-scroll">
          {[
            { id: 'python-zero', title: 'Python من الصفر', provider: 'EGY-Skills', progress: 62 },
            { id: 'arduino-basics', title: 'أساسيات الأردوينو والإلكترونيات', provider: 'EGY-Skills', progress: 35 },
            { id: 'web-basics', title: 'HTML & CSS للمبتدئين', provider: 'EGY-Skills', progress: 12 },
          ].map((c) => (
            <div key={c.id} className="dash__continue-card">
              <div className="dash__continue-thumb"><Play size={22} /></div>
              <div className="dash__continue-body">
                <div>
                  <div className="dash__continue-provider">{c.provider}</div>
                  <div className="dash__continue-title">{c.title}</div>
                </div>
                <div className="dash__continue-progress">
                  <div className="dash__continue-bar">
                    <div className="dash__continue-fill" style={{ width: c.progress + '%' }} />
                  </div>
                  <div className="dash__continue-meta">
                    <span>التقدم {c.progress}%</span>
                    <span>متابعة →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dash__section">
        <div className="dash__section-head">
          <div>
            <h2 className="dash__section-title">مقترح لك</h2>
            <p className="dash__section-sub">كورسات مختارة بعناية</p>
          </div>
          <Link to={ROUTES.courses} className="dash__section-link">تصفح الكل ←</Link>
        </div>
        <div className="dash__browse">
          {[1,2,3,4].map((i) => (
            <Card key={i} as={Link} to="/courses" interactive className="course__card" padded={false}>
              <div className="course__thumb"><BookOpen size={28} /></div>
              <div className="course__body">
                <div className="course__metarow">
                  <span>EGY-Skills</span>
                  <span className="course__dot" />
                  <span>مبتدئ</span>
                </div>
                <h3 className="course__title">مسار تعليمي مقترح {i}</h3>
                <p className="course__desc">تعلّم خطوة بخطوة مع مشاريع عملية ومتابعة كاملة.</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="dash__section">
        <div className="dash__section-head">
          <div>
            <h2 className="dash__section-title">نشاط الأسبوع</h2>
            <p className="dash__section-sub">دقائق التعلم اليومية</p>
          </div>
        </div>
        <div className="dash__activity">
          {[30, 45, 20, 60, 80, 40, 10].map((v, i) => (
            <div key={i} className="dash__activity-day">
              <div
                className={'dash__activity-bar' + (v > 30 ? ' is-active' : '')}
                style={{ height: Math.max(8, v) + 'px' }}
              />
              <span className="dash__activity-label">{WEEK_DAYS[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dash__section">
        <div className="dash__section-head">
          <div>
            <h2 className="dash__section-title">المواعيد القادمة</h2>
            <p className="dash__section-sub">تسليمات واختبارات قريبة</p>
          </div>
        </div>
        <div className="dash__deadlines">
          {[
            { id: 1, day: '12', month: 'نوف', title: 'اختبار الوحدة الثالثة', course: 'Python من الصفر' },
            { id: 2, day: '18', month: 'نوف', title: 'تسليم مشروع الأردوينو', course: 'أساسيات الأردوينو' },
            { id: 3, day: '25', month: 'نوف', title: 'اختبار نهاية المسار', course: 'HTML & CSS' },
          ].map((d) => (
            <div key={d.id} className="dash__deadline-row">
              <div className="dash__deadline-date">
                <span className="dash__deadline-day">{d.day}</span>
                <span className="dash__deadline-month">{d.month}</span>
              </div>
              <div className="dash__deadline-body">
                <span className="dash__deadline-title">{d.title}</span>
                <span className="dash__deadline-course">{d.course}</span>
              </div>
              <Badge tone="outline"><Calendar size={12} /> قادم</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

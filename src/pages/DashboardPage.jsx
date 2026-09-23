import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Flame, GraduationCap, Play, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { COURSES, ACTIVITY_7D, DEADLINES } from '../data/mock.js';
import { formatNumber } from '../lib/format.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const enrolled = COURSES.filter((c) => c.enrolled);
  const recommended = COURSES.filter((c) => !c.enrolled).slice(0, 4);
  const totalHours = enrolled.reduce((acc, c) => acc + (parseFloat(c.duration) || 0), 0);
  const maxMins = Math.max(...ACTIVITY_7D.map((d) => d.mins), 1);

  const stats = [
    { label: 'كورسات نشطة', value: enrolled.length, icon: <BookOpen size={18} />, delta: '+1 هذا الشهر' },
    { label: 'ساعات تعلم', value: totalHours.toFixed(1), icon: <Clock size={18} />, delta: '+2.5 هذا الأسبوع' },
    { label: 'أيام متتالية', value: 12, icon: <Flame size={18} />, delta: 'استمر!' },
    { label: 'شهادات', value: 2, icon: <GraduationCap size={18} />, delta: '+1 حديثة' },
  ];

  return (
    <div className="page">
      <PageHeader
        title={'أهلًا، ' + (user?.name || 'طالب')}
        subtitle="إليك نظرة سريعة على تقدمك في المنصة"
        actions={<Button to="/courses" variant="primary" size="md" >تصفح الكورسات <ArrowRight size={14} /></Button>}
      />

      <section className="stats-grid">
        {stats.map((s, i) => (
          <Card key={i} className="stat">
            <div className="stat__top">
              <span className="stat__label">{s.label}</span>
              <span className="stat__icon">{s.icon}</span>
            </div>
            <div className="stat__value">{formatNumber(s.value)}</div>
            <div className="stat__delta">{s.delta}</div>
          </Card>
        ))}
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">أكمل التعلم</h2>
            <p className="section__sub">ارجع من حيث توقفت</p>
          </div>
          <Link to="/courses" className="section__link">تصفح الكل <ArrowRight size={14} /></Link>
        </div>
        <div className="continue-grid">
          {enrolled.map((c) => (
            <Card key={c.id} as={Link} to={'/courses/' + c.id} interactive className="continue-card">
              <div className="continue-card__thumb"><Play size={22} /></div>
              <div className="continue-card__body">
                <span className="continue-card__provider">EGY-Skills</span>
                <h3 className="continue-card__title">{c.title}</h3>
                <div className="continue-card__progress">
                  <ProgressBar value={c.progress} />
                  <div className="continue-card__meta">
                    <span>{c.progress}% مكتمل</span>
                    <span className="continue-card__cta">متابعة <ArrowRight size={12} /></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">مقترح لك</h2>
            <p className="section__sub">كورسات مختارة بعناية</p>
          </div>
          <Link to="/courses" className="section__link">تصفح الكل <ArrowRight size={14} /></Link>
        </div>
        <div className="course-grid">
          {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      <div className="dash-split">
        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="section__title">نشاط الأسبوع</h2>
              <p className="section__sub">دقائق التعلم اليومية</p>
            </div>
          </div>
          <Card className="activity">
            {ACTIVITY_7D.map((d) => (
              <div key={d.day} className="activity__col">
                <div className="activity__bar-wrap">
                  <div className={'activity__bar' + (d.mins >= 40 ? ' activity__bar--on' : '')} style={{ height: (d.mins / maxMins) * 100 + '%' }} title={d.mins + ' دقيقة'} />
                </div>
                <span className="activity__day">{d.day}</span>
              </div>
            ))}
          </Card>
        </section>

        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="section__title">المواعيد القادمة</h2>
              <p className="section__sub">تسليمات واختبارات</p>
            </div>
          </div>
          <Card className="deadlines">
            {DEADLINES.map((d) => (
              <div key={d.id} className="deadline">
                <div className="deadline__date">
                  <span className="deadline__day">{d.day}</span>
                  <span className="deadline__month">{d.month}</span>
                </div>
                <div className="deadline__body">
                  <div className="deadline__title">{d.title}</div>
                  <div className="deadline__course">{d.course}</div>
                </div>
                <Badge tone="outline"><Calendar size={12} /> قادم</Badge>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <Card as={Link} to={'/courses/' + course.id} interactive className="course-card">
      <div className="course-card__thumb"><BookOpen size={28} /></div>
      <div className="course-card__body">
        <div className="course-card__badges">
          <Badge tone="outline">{course.level}</Badge>
          <span className="course-card__rating"><Sparkles size={12} /> {course.rating}</span>
        </div>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__desc">{course.description}</p>
        <div className="course-card__meta">
          <span>{course.lessons} درس</span>
          <span className="dot" />
          <span>{course.duration}</span>
          <span className="dot" />
          <span>{formatNumber(course.students)} طالب</span>
        </div>
      </div>
    </Card>
  );
}

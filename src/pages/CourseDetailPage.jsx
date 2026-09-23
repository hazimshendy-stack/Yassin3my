import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, Play, Sparkles, Users } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { COURSES, REVIEWS } from '../data/mock.js';
import { formatNumber } from '../lib/format.js';

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = useMemo(() => COURSES.find((c) => c.id === id) || COURSES[0], [id]);
  const [tab, setTab] = useState('overview');

  const lessons = useMemo(() => Array.from({ length: course.lessons }, (_, i) => ({
    id: i + 1,
    title: 'الدرس ' + (i + 1) + ' — مقدمة ومفاهيم أساسية',
    duration: (12 + ((i * 3) % 18)) + ' د',
    done: i < Math.round((course.progress / 100) * course.lessons),
  })), [course]);

  const tabs = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'curriculum', label: 'المنهج', count: lessons.length },
    { value: 'reviews', label: 'التقييمات', count: REVIEWS.length },
  ];

  return (
    <div className="page">
      <PageHeader
        breadcrumbs={[{ label: 'الكورسات', to: '/courses' }, { label: course.title }]}
        title={course.title}
        subtitle={course.description}
        actions={<Button variant="outline" to="/courses" leftIcon={<ArrowLeft size={14} />}>رجوع</Button>}
      />

      <div className="detail-hero">
        <div className="detail-hero__main">
          <div className="detail-hero__meta">
            <Badge tone="accent">{course.level}</Badge>
            <span className="dot" />
            <span>{course.duration}</span>
            <span className="dot" />
            <span className="detail-hero__rating"><Sparkles size={12} /> {course.rating}</span>
            <span className="dot" />
            <span><Users size={12} /> {formatNumber(course.students)} طالب</span>
          </div>
          <div className="detail-hero__cta">
            <Button variant="primary" size="lg">ابدأ التعلم <Play size={16} /></Button>
            <Button variant="outline" size="lg">معاينة مجانية</Button>
          </div>
        </div>

        <Card className="detail-hero__side">
          <div className="detail-hero__thumb"><BookOpen size={40} /></div>
          <div className="detail-hero__side-body">
            <div className="detail-hero__price">مجانًا للمشتركين</div>
            <ul className="detail-hero__list">
              <li><CheckCircle2 size={14} /> وصول مدى الحياة</li>
              <li><CheckCircle2 size={14} /> مشاريع عملية</li>
              <li><CheckCircle2 size={14} /> شهادة إتمام</li>
              <li><CheckCircle2 size={14} /> دعم مباشر من المدرّب</li>
            </ul>
            <Button variant="primary" block size="lg">اشترك الآن</Button>
          </div>
        </Card>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="detail-panel">
          <Card>
            <h2 className="detail-h2">عن هذا الكورس</h2>
            <p className="measure">ستتعلم في هذا الكورس أساسيات المهارة من الصفر حتى الاحتراف، مع تطبيق عملي لكل مفهوم من خلال مشاريع حقيقية. المحتوى منظم بشكل تدريجي وبسيط، مناسب للمبتدئين ويحتوي على تحديات إضافية للمتقدمين.</p>
          </Card>
          <div className="detail-goals">
            <Card><h3 className="detail-h3">ما ستتعلمه</h3>
              <ul className="detail-list">
                <li><CheckCircle2 size={14} /> إعداد البيئة والأدوات</li>
                <li><CheckCircle2 size={14} /> المفاهيم الأساسية والمصطلحات</li>
                <li><CheckCircle2 size={14} /> التعامل مع المكونات والوحدات</li>
                <li><CheckCircle2 size={14} /> تنفيذ مشروع عملي كامل</li>
                <li><CheckCircle2 size={14} /> تصحيح الأخطاء والاستكشاف</li>
              </ul>
            </Card>
            <Card><h3 className="detail-h3">من هذا الكورس؟</h3>
              <ul className="detail-list">
                <li><CheckCircle2 size={14} /> المبتدئون الراغبون في تعلم المجال</li>
                <li><CheckCircle2 size={14} /> طلاب المدارس والجامعات</li>
                <li><CheckCircle2 size={14} /> المهتمون بالمشاريع العملية</li>
                <li><CheckCircle2 size={14} /> المهندسون الباحثون عن تحديث مهاراتهم</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === 'curriculum' && (
        <div className="detail-panel">
          <Card padded={false} className="curriculum">
            <div className="curriculum__head">
              <h3>محتوى الكورس</h3>
              <span className="muted">{lessons.length} درس • {course.duration}</span>
            </div>
            <ul className="curriculum__list">
              {lessons.map((l) => (
                <li key={l.id} className={'curriculum__item' + (l.done ? ' is-done' : '')}>
                  <span className="curriculum__icon">{l.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}</span>
                  <div className="curriculum__text">
                    <span className="curriculum__index">الدرس {l.id}</span>
                    <span className="curriculum__title">{l.title}</span>
                  </div>
                  <span className="curriculum__duration"><Clock size={12} /> {l.duration}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="detail-panel">
          <div className="reviews">
            {REVIEWS.map((r) => (
              <Card key={r.id} className="review">
                <header className="review__head">
                  <Avatar name={r.name} size={42} />
                  <div>
                    <div className="review__name">{r.name}</div>
                    <div className="review__date">{r.date}</div>
                  </div>
                  <div className="review__stars" aria-label={r.stars + ' نجوم'}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Sparkles key={i} size={12} className={i < r.stars ? 'star-on' : 'star-off'} />
                    ))}
                  </div>
                </header>
                <p className="review__body">{r.body}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

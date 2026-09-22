import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader.jsx';
import { Card, CardHeader } from '../../../components/Card.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { Skeleton } from '../../../components/Skeleton.jsx';
import { EmptyState } from '../../../components/EmptyState.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { ROUTES } from '../../../lib/constants.js';
import { coursesApi } from '../api.js';
import './CourseDetailPage.module.css';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    setCourse(null);
    setError('');
    coursesApi
      .get(id)
      .then((c) => {
        if (mounted) setCourse(c);
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'تعذر تحميل الكورس');
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <EmptyState
        icon={<BookOpen size={20} />}
        title="لم يتم العثور على الكورس"
        description={error}
        action={
          <Button to={ROUTES.courses} variant="outline" rightIcon={<ArrowRight size={14} />}>
            العودة إلى الكورسات
          </Button>
        }
      />
    );
  }

  if (!course) {
    return (
      <div className="stack stack-4">
        <Skeleton height={28} width="40%" />
        <Skeleton height={18} width="70%" />
        <Skeleton height={200} radius={12} />
        <Skeleton height={200} radius={12} />
      </div>
    );
  }

  const completed = course.lessons.filter((l) => l.done).length;
  const total = course.lessons.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="fade-in">
      <PageHeader
        breadcrumbs={[
          { label: 'الكورسات', to: ROUTES.courses },
          { label: course.title },
        ]}
        title={course.title}
        subtitle={course.description}
        actions={
          <Button
            variant="outline"
            to={ROUTES.courses}
            leftIcon={<ArrowRight size={14} />}
          >
            رجوع
          </Button>
        }
      />

      <div className="course-detail__grid">
        <Card className="course-detail__main">
          <CardHeader
            title="محتوى الكورس"
            subtitle={`${total} درس — ${completed} مكتمل`}
            action={
              <Badge tone={pct === 100 ? 'accent' : 'outline'}>
                {pct}%
              </Badge>
            }
          />
          <ul className="course-detail__lessons">
            {course.lessons.map((l) => (
              <li key={l.id} className={`course-detail__lesson ${l.done ? 'is-done' : ''}`}>
                <span className="course-detail__lesson-icon" aria-hidden="true">
                  {l.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </span>
                <div className="course-detail__lesson-text">
                  <span className="course-detail__lesson-index">الدرس {l.index}</span>
                  <span className="course-detail__lesson-title">{l.title}</span>
                </div>
                <span className="course-detail__lesson-duration">
                  <Clock size={12} /> {l.duration}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="course-detail__side">
          <CardHeader title="معلومات" />
          <dl className="course-detail__facts">
            <div>
              <dt>المستوى</dt>
              <dd>{course.level}</dd>
            </div>
            <div>
              <dt>المدة</dt>
              <dd>{course.duration}</dd>
            </div>
            <div>
              <dt>التصنيف</dt>
              <dd>{course.category}</dd>
            </div>
            <div>
              <dt>عدد الدروس</dt>
              <dd>{course.lessonsCount}</dd>
            </div>
          </dl>
          <div className="course-detail__progress">
            <div className="course-detail__progress-label">
              <span>التقدم</span>
              <span>{pct}%</span>
            </div>
            <div className="course-detail__progress-bar">
              <div
                className="course-detail__progress-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Button
            variant="primary"
            block
            onClick={() =>
              toast.info('سيتم فتح الدرس داخل مشغل المنصة في تحديث قادم.')
            }
          >
            ابدأ الدرس التالي
          </Button>
          <Link to={ROUTES.courses} className="course-detail__link">
            العودة إلى القائمة
          </Link>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Search, BookOpen, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.jsx';
import { Card } from '../../../components/Card.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { Chip } from '../../../components/Chip.jsx';
import { Input } from '../../../components/Input.jsx';
import { Skeleton } from '../../../components/Skeleton.jsx';
import { EmptyState } from '../../../components/EmptyState.jsx';
import { Pagination } from '../../../components/Pagination.jsx';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue.js';
import { COURSE_CATEGORIES } from '../../../lib/constants.js';
import { coursesApi } from '../api.js';
import './CoursesListPage.module.css';

const PAGE_SIZE = 6;

export default function CoursesListPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(null);
  const debouncedQ = useDebouncedValue(q, 220);

  useEffect(() => { setPage(1); }, [debouncedQ, category, sort]);

  useEffect(() => {
    let mounted = true;
    setItems(null);
    coursesApi.list({ q: debouncedQ, category }).then((list) => { if (mounted) setItems(list); });
    return () => { mounted = false; };
  }, [debouncedQ, category]);

  const sorted = useMemo(() => {
    if (!items) return null;
    const copy = [...items];
    if (sort === 'rating') copy.sort((a, b) => b.progress - a.progress);
    if (sort === 'duration') copy.sort((a, b) => (a.duration || '').localeCompare(b.duration || ''));
    return copy;
  }, [items, sort]);

  const paged = useMemo(() => {
    if (!sorted) return null;
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const pageCount = sorted ? Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)) : 1;
  const empty = sorted && sorted.length === 0;

  return (
    <div className="fade-in">
      <PageHeader
        breadcrumbs={[{ label: 'الكورسات' }]}
        title="الكورسات"
        subtitle={sorted ? sorted.length + ' كورس متاح' : 'تصفح الكورسات المتاحة على المنصة.'}
      />

      <section className="courses__toolbar">
        <div className="courses__search">
          <Input
            placeholder="ابحث بالاسم أو الوصف..."
            leading={<Search size={16} />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="بحث"
          />
        </div>
        <div className="courses__chips" role="group" aria-label="التصنيفات">
          {COURSE_CATEGORIES.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.labelAr}
            </Chip>
          ))}
        </div>
        <div className="courses__sort">
          <label htmlFor="sort">الترتيب</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">الأكثر شعبية</option>
            <option value="rating">الأعلى تقييمًا</option>
            <option value="duration">الأقصر مدة</option>
          </select>
        </div>
      </section>

      {!items ? (
        <div className="courses__grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="course__card" padded={false}>
              <Skeleton height={140} radius={0} />
              <div className="course__body">
                <Skeleton width="70%" height={16} />
                <Skeleton width="100%" height={12} />
                <Skeleton width="85%" height={12} />
              </div>
            </Card>
          ))}
        </div>
      ) : empty ? (
        <EmptyState
          icon={<Search size={22} />}
          title="لا توجد كورسات مطابقة"
          description="جرّب كلمة بحث أخرى أو اختر تصنيفًا مختلفًا."
          action={<Chip onClick={() => { setQ(''); setCategory('all'); }}>مسح الفلاتر</Chip>}
        />
      ) : (
        <>
          <div className="courses__grid">
            {paged.map((c) => (
              <Card key={c.id} as={Link} to={'/courses/' + c.id} interactive className="course__card" padded={false}>
                <div className="course__thumb"><BookOpen size={28} /></div>
                <div className="course__body">
                  <div className="course__meta">
                    <Badge tone="outline">{c.level}</Badge>
                    {c.enrolled ? <Badge tone="accent"><CheckCircle2 size={12} /> مشترك</Badge> : null}
                  </div>
                  <h3 className="course__title">{c.title}</h3>
                  <p className="course__desc">{c.description}</p>
                  <div className="course__metarow">
                    <span>{c.lessonsCount} درس</span>
                    <span className="course__dot" />
                    <span>{c.duration}</span>
                  </div>
                  <div className="course__footer">
                    {c.enrolled ? (
                      <div className="course__progress" style={{ flex: 1 }}>
                        <div className="course__progress-fill" style={{ width: c.progress + '%' }} />
                      </div>
                    ) : (
                      <span className="text-sm accent fw-semibold">عرض التفاصيل →</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="courses__pagination">
            <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

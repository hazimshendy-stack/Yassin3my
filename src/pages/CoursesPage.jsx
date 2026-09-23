import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Chip } from '../components/Chip.jsx';
import { Input } from '../components/Input.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';
import { COURSES } from '../data/mock.js';
import { CATEGORIES } from '../lib/constants.js';
import { formatNumber } from '../lib/format.js';

const LEVELS = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'];

export default function CoursesPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [level, setLevel] = useState('الكل');
  const [sort, setSort] = useState('popular');

  const filtered = useMemo(() => {
    let list = [...COURSES];
    if (cat !== 'all') list = list.filter((c) => c.category === cat);
    if (level !== 'الكل') list = list.filter((c) => c.level === level);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
    }
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'students') list.sort((a, b) => b.students - a.students);
    return list;
  }, [q, cat, level, sort]);

  return (
    <div className="page">
      <PageHeader
        title="الكورسات"
        subtitle={filtered.length + ' كورس متاح على المنصة'}
        breadcrumbs={[{ label: 'الكورسات' }]}
      />

      <div className="courses-toolbar">
        <div className="courses-toolbar__search">
          <Input placeholder="ابحث بالاسم أو الوصف..." leading={<Search size={16} />} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="courses-toolbar__chips">
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>
          ))}
        </div>
        <div className="courses-toolbar__right">
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l === 'الكل' ? 'كل المستويات' : l}</option>)}
          </select>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">الأكثر شعبية</option>
            <option value="rating">الأعلى تقييمًا</option>
            <option value="students">الأكثر طلابًا</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={22} />}
          title="لا توجد كورسات مطابقة"
          description="جرّب تعديل الفلاتر أو كلمة البحث."
          action={<Button variant="outline" onClick={() => { setQ(''); setCat('all'); setLevel('الكل'); }}>مسح الفلاتر</Button>}
        />
      ) : (
        <div className="course-grid">
          {filtered.map((c) => (
            <Card key={c.id} as={Link} to={'/courses/' + c.id} interactive className="course-card">
              <div className="course-card__thumb"><BookOpen size={28} /></div>
              <div className="course-card__body">
                <div className="course-card__badges">
                  <Badge tone="outline">{c.level}</Badge>
                  {c.enrolled ? <Badge tone="accent">مشترك</Badge> : null}
                </div>
                <h3 className="course-card__title">{c.title}</h3>
                <p className="course-card__desc">{c.description}</p>
                <div className="course-card__meta">
                  <span>{c.lessons} درس</span>
                  <span className="dot" />
                  <span>{c.duration}</span>
                </div>
                <div className="course-card__foot">
                  <span className="course-card__rating"><Sparkles size={12} /> {c.rating}</span>
                  <span className="course-card__students">{formatNumber(c.students)} طالب</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

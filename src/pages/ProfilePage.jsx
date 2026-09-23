import { useState } from 'react';
import { Award, BookOpen, Clock, Flame, Mail, MapPin, Pencil, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Modal } from '../components/Modal.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { formatNumber } from '../lib/format.js';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const stats = [
    { label: 'كورسات مسجلة', value: 3, icon: <BookOpen size={16} /> },
    { label: 'ساعات تعلم', value: 29, icon: <Clock size={16} /> },
    { label: 'أيام متتالية', value: 12, icon: <Flame size={16} /> },
    { label: 'شهادات', value: 2, icon: <Award size={16} /> },
  ];

  const achievements = [
    { title: 'الخطوة الأولى', desc: 'أكملت أول درس على المنصة', icon: '🚀' },
    { title: 'بطل الأسبوع', desc: 'أعلى نشاط في أسبوع واحد', icon: '🔥' },
    { title: 'مساهم نشط', desc: 'شاركت في 10 نقاشات', icon: '💬' },
    { title: 'متقن الأردوينو', desc: 'أكملت مسار الأردوينو كاملًا', icon: '⚡' },
  ];

  function saveProfile() {
    updateProfile({ name: name.trim(), email: email.trim() });
    toast.success('تم تحديث الملف الشخصي');
    setEditOpen(false);
  }

  return (
    <div className="page">
      <div className="profile-cover" />
      <div className="profile-head">
        <Avatar name={user?.name || 'طالب'} size={96} className="profile-avatar" />
        <div className="profile-head__text">
          <h1 className="profile-head__name">{user?.name || 'طالب'}</h1>
          <div className="profile-head__meta">
            <span><Mail size={13} /> {user?.email || '—'}</span>
            <span className="dot" />
            <span><MapPin size={13} /> مصر</span>
            <span className="dot" />
            <span>طالب نشط</span>
          </div>
        </div>
        <div className="profile-head__actions">
          <Button variant="outline" onClick={() => setEditOpen(true)} leftIcon={<Pencil size={14} />}>تعديل الملف</Button>
        </div>
      </div>

      <div className="profile-stats">
        {stats.map((s, i) => (
          <Card key={i} className="pstat">
            <span className="pstat__icon">{s.icon}</span>
            <span className="pstat__value">{formatNumber(s.value)}</span>
            <span className="pstat__label">{s.label}</span>
          </Card>
        ))}
      </div>

      <Tabs tabs={[{ value: 'overview', label: 'نظرة عامة' }, { value: 'achievements', label: 'الإنجازات', count: achievements.length }, { value: 'activity', label: 'النشاط' }]} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <Card>
          <h3 className="detail-h3">نبذة</h3>
          <p className="measure">طالب شغوف بتعلم البرمجة والأردوينو، أشارك في المشاريع الصفية وأسعى لتنمية مهاراتي في المجال التقني. أحب بناء المشاريع العملية والعمل الجماعي.</p>
        </Card>
      )}

      {tab === 'achievements' && (
        <div className="achievements">
          {achievements.map((a, i) => (
            <Card key={i} className="achievement">
              <div className="achievement__icon">{a.icon}</div>
              <div>
                <div className="achievement__title">{a.title}</div>
                <div className="achievement__desc">{a.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'activity' && (
        <Card>
          <ul className="timeline">
            <li><span className="timeline__dot" /><div><div className="timeline__title">أكملت درس «المتغيرات في Python»</div><span className="timeline__when">قبل ساعتين</span></div></li>
            <li><span className="timeline__dot" /><div><div className="timeline__title">حصلت على شارة «بطل الأسبوع»</div><span className="timeline__when">أمس</span></div></li>
            <li><span className="timeline__dot" /><div><div className="timeline__title">سجّلت في كورس «روبوت تتبع الخط»</div><span className="timeline__when">قبل 3 أيام</span></div></li>
            <li><span className="timeline__dot" /><div><div className="timeline__title">أنهيت مشروع الأردوينو الأول</div><span className="timeline__when">قبل أسبوع</span></div></li>
          </ul>
        </Card>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="تعديل الملف الشخصي"
        footer={<><Button variant="ghost" onClick={() => setEditOpen(false)}>إلغاء</Button><Button variant="primary" onClick={saveProfile}>حفظ</Button></>}>
        <div className="stack">
          <Input label="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

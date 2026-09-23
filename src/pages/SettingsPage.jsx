import { useState } from 'react';
import { Bell, Globe, Palette, Shield, User } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Card } from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function SettingsPage() {
  const toast = useToast();
  const [section, setSection] = useState('account');
  const [dirty, setDirty] = useState(false);

  const sections = [
    { id: 'account', label: 'الحساب', icon: <User size={15} /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={15} /> },
    { id: 'language', label: 'اللغة', icon: <Globe size={15} /> },
    { id: 'appearance', label: 'المظهر', icon: <Palette size={15} /> },
    { id: 'privacy', label: 'الخصوصية', icon: <Shield size={15} /> },
  ];

  return (
    <div className="page">
      <PageHeader title="الإعدادات" subtitle="خصّص تجربتك على المنصة" />

      <div className="settings">
        <aside className="settings__nav">
          {sections.map((s) => (
            <button key={s.id} className={'settings__nav-item' + (section === s.id ? ' is-active' : '')} onClick={() => setSection(s.id)}>
              {s.icon} <span>{s.label}</span>
            </button>
          ))}
        </aside>

        <div className="settings__body">
          {section === 'account' && (
            <Card>
              <SectionHead title="الحساب" sub="إعدادات حسابك الأساسية" />
              <Row label="الاسم الظاهر" desc="سيظهر هذا الاسم للآخرين"><input className="input" defaultValue="طالب" onChange={() => setDirty(true)} /></Row>
              <Row label="البريد الإلكتروني" desc="لن يظهر للآخرين"><input className="input" defaultValue="student@egy-skills.com" onChange={() => setDirty(true)} /></Row>
              <Row label="كلمة المرور" desc="آخر تحديث قبل 30 يومًا"><Button variant="outline" size="sm">تغيير</Button></Row>
            </Card>
          )}
          {section === 'notifications' && (
            <Card>
              <SectionHead title="الإشعارات" sub="تحكم في تنبيهات المنصة" />
              <Row label="دروس جديدة" desc="تنبيه عند إضافة درس"><Toggle onChange={() => setDirty(true)} /></Row>
              <Row label="ردود المعلم" desc="إشعار عند رد المعلم"><Toggle onChange={() => setDirty(true)} /></Row>
              <Row label="تذكير الدروس" desc="تنبيه يومي بالمهام"><Toggle onChange={() => setDirty(true)} /></Row>
            </Card>
          )}
          {section === 'language' && (
            <Card>
              <SectionHead title="اللغة" sub="لغة عرض المنصة" />
              <Row label="لغة الواجهة" desc="العربية / English"><select className="select"><option>العربية</option><option>English</option></select></Row>
            </Card>
          )}
          {section === 'appearance' && (
            <Card>
              <SectionHead title="المظهر" sub="الوضع الحالي: داكن (أسود + أخضر)" />
              <Row label="الوضع" desc="ثابت في هذا الإصدار"><Button variant="outline" size="sm" disabled>مُفعّل</Button></Row>
            </Card>
          )}
          {section === 'privacy' && (
            <Card>
              <SectionHead title="الخصوصية" sub="إعدادات الخصوصية والأمان" />
              <Row label="إظهار ملفي" desc="للمعلمين والطلاب"><Toggle onChange={() => setDirty(true)} /></Row>
              <Row label="تنزيل بياناتي" desc="نسخة JSON من بياناتك"><Button variant="outline" size="sm" onClick={() => toast.info('سيتوفر التنزيل قريبًا')}>تنزيل</Button></Row>
            </Card>
          )}

          {dirty ? (
            <div className="settings__save">
              <span>لديك تغييرات غير محفوظة</span>
              <div className="row">
                <Button variant="ghost" onClick={() => setDirty(false)}>إلغاء</Button>
                <Button variant="primary" onClick={() => { toast.success('تم الحفظ'); setDirty(false); }}>حفظ</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ title, sub }) {
  return <div className="settings__head"><h3>{title}</h3><p>{sub}</p></div>;
}
function Row({ label, desc, children }) {
  return <div className="settings__row"><div><div className="settings__row-label">{label}</div><div className="settings__row-desc">{desc}</div></div><div className="settings__row-control">{children}</div></div>;
}
function Toggle({ onChange }) {
  const [on, setOn] = useState(true);
  return <button className={'toggle' + (on ? ' is-on' : '')} aria-pressed={on} onClick={() => { setOn(!on); onChange && onChange(); }}><span className="toggle__dot" /></button>;
}

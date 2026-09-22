import { useState } from 'react';
import { Mail, User as UserIcon, Shield, Calendar } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader.jsx';
import { Card, CardHeader } from '../../../components/Card.jsx';
import { Avatar } from '../../../components/Avatar.jsx';
import { Input } from '../../../components/Input.jsx';
import { Button } from '../../../components/Button.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { useToast } from '../../../hooks/useToast.js';
import { formatDate } from '../../../lib/format.js';
import './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), avatarUrl: avatarUrl.trim() });
      toast.success('تم تحديث الملف الشخصي');
    } catch (err) {
      toast.error(err.message || 'تعذر تحديث الملف');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in">
      <PageHeader
        breadcrumbs={[{ label: 'الملف الشخصي' }]}
        title="الملف الشخصي"
        subtitle="إدارة بياناتك الأساسية على المنصة."
      />

      <div className="profile__grid">
        <Card className="profile__summary">
          <div className="profile__identity">
            <Avatar src={user.avatarUrl} name={user.name} size={72} />
            <div className="profile__identity-text">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <Badge tone={user.role === 'admin' ? 'accent' : 'outline'}>
                {user.role === 'admin' ? 'مدير' : user.role === 'teacher' ? 'معلم' : 'طالب'}
              </Badge>
            </div>
          </div>
          <dl className="profile__facts">
            <div>
              <dt>
                <Mail size={13} /> البريد
              </dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>
                <Shield size={13} /> الدور
              </dt>
              <dd>{user.role}</dd>
            </div>
            <div>
              <dt>
                <Calendar size={13} /> تاريخ الانضمام
              </dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card className="profile__edit">
          <CardHeader
            title="تعديل البيانات"
            subtitle="حدّث اسمك وصورة العرض."
          />
          <form onSubmit={onSave} className="profile__form">
            <Input
              label="الاسم الكامل"
              leading={<UserIcon size={16} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="رابط الصورة (اختياري)"
              type="url"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
            <Button type="submit" variant="primary" loading={saving}>
              حفظ التعديلات
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

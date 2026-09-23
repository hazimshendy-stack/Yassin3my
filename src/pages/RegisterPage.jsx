import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      toast.error('أكمل جميع الحقول (كلمة المرور 6 أحرف على الأقل)');
      return;
    }
    setBusy(true);
    setTimeout(() => {
      register(form);
      toast.success('تم إنشاء الحساب');
      nav('/', { replace: true });
    }, 400);
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <header className="auth-form__head">
        <h1>حساب جديد</h1>
        <p>أنشئ حسابك وابدأ رحلتك التعليمية</p>
      </header>

      <Input label="الاسم الكامل" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="البريد الإلكتروني" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="كلمة المرور" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} hint="6 أحرف على الأقل" />

      <Button variant="primary" size="lg" block leftIcon={<UserPlus size={16} />} type="submit" disabled={busy}>
        {busy ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
      </Button>

      <p className="auth-form__foot">لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link></p>
    </form>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '../../../components/Button.jsx';
import { Input } from '../../../components/Input.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { useToast } from '../../../hooks/useToast.js';
import { ROUTES } from '../../../lib/constants.js';
import './AuthPages.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (form.password !== form.confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'student',
      });
      toast.success('تم إنشاء الحساب بنجاح');
      navigate(ROUTES.home, { replace: true });
    } catch (err) {
      setError(err.message || 'تعذّر إنشاء الحساب');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-page__head">
        <h1>حساب جديد</h1>
        <p>أنشئ حسابك وابدأ رحلتك التعليمية الآن.</p>
      </header>

      <form className="auth-page__form" onSubmit={onSubmit} noValidate>
        <Input
          label="الاسم الكامل"
          type="text"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="مثال: أحمد علي"
        />
        <Input
          label="البريد الإلكتروني"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="كلمة المرور"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          placeholder="6 أحرف على الأقل"
        />
        <Input
          label="تأكيد كلمة المرور"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirm}
          onChange={(e) => update('confirm', e.target.value)}
          placeholder="أعد كتابة كلمة المرور"
        />
        {error ? (
          <p className="auth-page__error" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={submitting}
          leftIcon={<UserPlus size={16} />}
        >
          إنشاء الحساب
        </Button>
      </form>

      <footer className="auth-page__foot">
        <span>لديك حساب بالفعل؟</span>{' '}
        <Link to={ROUTES.login}>تسجيل الدخول</Link>
      </footer>
    </div>
  );
}

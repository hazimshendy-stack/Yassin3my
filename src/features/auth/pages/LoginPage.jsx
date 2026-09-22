import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../../../components/Button.jsx';
import { Input } from '../../../components/Input.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { useToast } from '../../../hooks/useToast.js';
import { ROUTES } from '../../../lib/constants.js';
import './AuthPages.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      toast.success('مرحبًا بعودتك');
      const to = location.state?.from || ROUTES.home;
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || 'تعذّر تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-page__head">
        <h1>تسجيل الدخول</h1>
        <p>أدخل بياناتك للوصول إلى لوحة التحكم.</p>
      </header>

      <form className="auth-page__form" onSubmit={onSubmit} noValidate>
        <Input
          label="البريد الإلكتروني"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="كلمة المرور"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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
          leftIcon={<LogIn size={16} />}
        >
          دخول
        </Button>
      </form>

      <footer className="auth-page__foot">
        <span>ليس لديك حساب؟</span>{' '}
        <Link to={ROUTES.register}>أنشئ حسابًا جديدًا</Link>
      </footer>
    </div>
  );
}

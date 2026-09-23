import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('student@egy-skills.com');
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      login(email, email.split('@')[0]);
      toast.success('أهلًا بك مجددًا');
      nav('/', { replace: true });
    }, 400);
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <header className="auth-form__head">
        <h1>تسجيل الدخول</h1>
        <p>أدخل بياناتك للوصول إلى لوحة التحكم</p>
      </header>

      <Input label="البريد الإلكتروني" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="كلمة المرور" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className="auth-form__row">
        <label className="auth-check"><input type="checkbox" defaultChecked /> <span>تذكرني</span></label>
        <a href="#" className="auth-form__link" onClick={(e) => e.preventDefault()}>نسيت كلمة المرور؟</a>
      </div>

      <Button variant="primary" size="lg" block leftIcon={<LogIn size={16} />} type="submit" disabled={busy}>
        {busy ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
      </Button>

      <p className="auth-form__foot">ليس لديك حساب؟ <Link to="/register">أنشئ حسابًا جديدًا</Link></p>
    </form>
  );
}

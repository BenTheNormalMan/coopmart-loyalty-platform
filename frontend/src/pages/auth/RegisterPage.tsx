import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../api/client';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên.';
    if (!form.email.includes('@')) errs.email = 'Email không hợp lệ.';
    if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setLoading(true);
    setApiError('');
    try {
      const data = await authApi.customerSignup({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone || undefined,
      });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h1 className="auth-title">Đăng Ký Thành Viên</h1>
          <p className="auth-subtitle">Tạo tài khoản khách hàng thân thiết miễn phí</p>
        </div>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid-2">
            <FormField
              id="reg-name" label="Họ và tên" name="fullName" required
              placeholder="Vd: Nguyễn Văn A" value={form.fullName} onChange={handleChange}
              error={errors.fullName}
            />
            <FormField
              id="reg-phone" label="Số điện thoại" name="phone"
              placeholder="Vd: 0901234567" value={form.phone} onChange={handleChange}
            />
          </div>

          <FormField
            id="reg-email" label="Email" name="email" type="email" required
            placeholder="you@example.com" value={form.email} onChange={handleChange}
            error={errors.email}
          />

          <div className="form-grid-2">
            <FormField
              id="reg-password" label="Mật khẩu" name="password" type="password" required
              placeholder="••••••••" value={form.password} onChange={handleChange}
              autoComplete="new-password" error={errors.password}
            />
            <FormField
              id="reg-confirm" label="Xác nhận mật khẩu" name="confirmPassword" type="password" required
              placeholder="••••••••" value={form.confirmPassword} onChange={handleChange}
              autoComplete="new-password" error={errors.confirmPassword}
            />
          </div>

          <Button type="submit" fullWidth isLoading={loading} className="mt-4">
            Đăng ký tài khoản
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/auth/customer/login" className="auth-link">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
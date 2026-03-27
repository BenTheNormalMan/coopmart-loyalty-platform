import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../api/client';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.customerLogin(form);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Đăng Nhập Thành Viên</h1>
          <p className="auth-subtitle">Chào mừng bạn quay trở lại Co.opmart</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <FormField
            id="login-email"
            label="Email đăng nhập"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <FormField
            id="login-password"
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          
          <Button type="submit" fullWidth isLoading={loading} className="mt-4">
            Đăng nhập
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/auth/customer/signup" className="auth-link">Đăng ký ngay</Link>
          </p>
          <Link to="/auth/admin/login" className="admin-switch-link">
            Đăng nhập dành cho Quản trị viên
          </Link>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../api/client';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import './AuthPages.css';

export default function AdminLoginPage() {
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
      const data = await authApi.adminLogin(form);
      login(data.token);
      navigate('/admin');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-admin">
        <div className="auth-header">
          <div style={{ color: 'var(--coop-secondary)', fontWeight: 800, fontSize: '0.875rem', letterSpacing: 1, marginBottom: 8 }}>
            ADMIN CONSOLE
          </div>
          <h1 className="auth-title">Đăng Nhập Quản Trị</h1>
          <p className="auth-subtitle">Truy cập hệ thống quản lý khách hàng thân thiết</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <FormField
            id="admin-email"
            label="Email quản trị"
            name="email"
            type="email"
            placeholder="admin@coopmart.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <FormField
            id="admin-password"
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <Button type="submit" variant="secondary" fullWidth isLoading={loading} className="mt-4">
            Đăng nhập hệ thống
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Bạn cần cấp quyền?{' '}
            <Link to="/auth/admin/signup" className="auth-link" style={{color: 'var(--coop-secondary)'}}>Tạo tài khoản Admin</Link>
          </p>
          <Link to="/auth/customer/login" className="admin-switch-link" style={{color: 'var(--text-secondary)'}}>
            ← Quay lại đăng nhập Khách Hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

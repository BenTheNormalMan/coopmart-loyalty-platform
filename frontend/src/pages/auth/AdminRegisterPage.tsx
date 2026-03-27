import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../api/client';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import './AuthPages.css';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
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
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên quản trị viên.';
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
      const data = await authApi.adminSignup({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });
      login(data.token);
      navigate('/admin');
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide auth-card-admin">
        <div className="auth-header">
          <div style={{ color: 'var(--coop-secondary)', fontWeight: 800, fontSize: '0.875rem', letterSpacing: 1, marginBottom: 8 }}>
            ADMIN CONSOLE
          </div>
          <h1 className="auth-title">Đăng Ký Quản Trị Viên</h1>
          <p className="auth-subtitle">Cấp quyền truy cập hệ thống Loyalty Platform</p>
        </div>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid-2">
            <FormField
              id="admin-reg-name" label="Họ và tên" name="fullName" required
              placeholder="Vd: Nguyễn Văn Admin" value={form.fullName} onChange={handleChange}
              error={errors.fullName}
            />
            <FormField
              id="admin-reg-email" label="Email nghiệp vụ" name="email" type="email" required
              placeholder="admin@coop.com" value={form.email} onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="form-grid-2">
            <FormField
              id="admin-reg-password" label="Mật khẩu" name="password" type="password" required
              placeholder="••••••••" value={form.password} onChange={handleChange}
              autoComplete="new-password" error={errors.password}
            />
            <FormField
              id="admin-reg-confirm" label="Xác nhận mật khẩu" name="confirmPassword" type="password" required
              placeholder="••••••••" value={form.confirmPassword} onChange={handleChange}
              autoComplete="new-password" error={errors.confirmPassword}
            />
          </div>

          <Button type="submit" variant="secondary" fullWidth isLoading={loading} className="mt-4">
            Khởi tạo tài khoản
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản Admin?{' '}
            <Link to="/auth/admin/login" className="auth-link" style={{color: 'var(--coop-secondary)'}}>Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

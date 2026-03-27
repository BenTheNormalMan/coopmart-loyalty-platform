import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="public-header">
      <div className="container header-container">
        <Link to="/" className="header-brand">
          <img src="/coopmart logo.png" alt="Co.opmart Logo" className="coop-logo-img" />
          <div className="brand-divider"></div>
          <span className="brand-subtitle">Thành viên</span>
        </Link>
        
        <nav className="header-nav">
          <Link to="/auth/customer/login" className="header-link">Đăng nhập</Link>
          <Link to="/auth/customer/signup" className="btn btn-primary btn-sm btn-header">Đăng ký ngay</Link>
        </nav>
      </div>
    </header>
  );
}

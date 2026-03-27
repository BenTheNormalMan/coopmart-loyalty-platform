import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './CustomerLayout.css';

const navItems = [
  { to: '/dashboard', label: 'Tổng quan', end: true },
  { to: '/dashboard/tier', label: 'Hạng thành viên' },
  { to: '/dashboard/rewards', label: 'Đổi thưởng' },
  { to: '/dashboard/offers', label: 'Ưu đãi' },
  { to: '/dashboard/campaigns', label: 'Chiến dịch' },
  { to: '/dashboard/transactions', label: 'Giao dịch' },
  { to: '/dashboard/coupons', label: 'Mã giảm giá' },
  { to: '/dashboard/profile', label: 'Hồ sơ của tôi' },
];

export default function CustomerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/customer/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const initial = user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="portal-layout">
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay${sidebarOpen ? '' : ' hidden'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`portal-sidebar customer-sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigate('/'); closeSidebar(); }}>
          <img src="/CP_logo.png" alt="CP Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain' }} />
          <div className="logo-text">
            <span className="logo-main sidebar-logo-main">co.opmart</span>
            <span className="logo-sub" style={{ color: 'rgba(255,255,255,0.5)' }}>Member Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.email ?? ''}</span>
              <span className="sidebar-user-tier badge badge-accent">Thành viên</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Hamburger — visible on mobile only */}
            <button
              className={`sidebar-hamburger${sidebarOpen ? ' open' : ''}`}
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Mở menu"
            >
              <span /><span /><span />
            </button>
            <h1 className="portal-page-title">Cổng thành viên</h1>
          </div>
          <div className="portal-topbar-right">
            <Link to="/dashboard/profile" title="Hồ sơ của tôi" style={{ textDecoration: 'none' }}>
              <div className="portal-avatar" style={{ cursor: 'pointer' }}>{initial}</div>
            </Link>
          </div>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
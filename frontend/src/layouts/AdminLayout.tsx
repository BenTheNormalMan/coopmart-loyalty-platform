import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './CustomerLayout.css';

const adminNavItems = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/members', label: 'Thành viên' },
  { to: '/admin/campaigns', label: 'Chiến dịch' },
  { to: '/admin/rewards', label: 'Phần thưởng' },
  { to: '/admin/coupons', label: 'Coupon' },
  { to: '/admin/rules', label: 'Quy tắc' },
  { to: '/admin/audit-logs', label: 'Nhật ký hệ thống' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const initial = user?.email?.[0]?.toUpperCase() ?? 'A';

  return (
    <div className="portal-layout">
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay${sidebarOpen ? '' : ' hidden'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`portal-sidebar admin-sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigate('/'); closeSidebar(); }}>
          <img src="/CP_logo.png" alt="CP Admin Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', backgroundColor: 'white' }} />
          <div className="logo-text">
            <span className="logo-main sidebar-logo-main">co.opmart</span>
            <span className="logo-sub" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Console</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {adminNavItems.map((item) => (
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
            <div className="sidebar-avatar" style={{ background: '#E6007E' }}>{initial}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.email ?? 'Admin'}</span>
              <span className="sidebar-user-tier badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                Quản trị viên
              </span>
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
            <h1 className="portal-page-title">Quản trị hệ thống</h1>
          </div>
          <div className="portal-topbar-right">
            <span className="badge badge-accent">Admin</span>
            <div className="portal-avatar" style={{ background: '#E6007E' }}>{initial}</div>
          </div>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
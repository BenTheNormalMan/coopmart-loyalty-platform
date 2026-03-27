import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import './PublicHomePage.css';

const benefits = [
  {
    icon: '💎',
    title: 'Tích Điểm Dễ Dàng',
    desc: 'Mỗi giao dịch mua sắm tại hệ thống siêu thị Co.opmart đều được quy đổi thành điểm thưởng.',
  },
  {
    icon: '🎁',
    title: 'Đổi Quà Hấp Dẫn',
    desc: 'Sử dụng điểm tích lũy để đổi lấy voucher mua sắm và các phần quà giá trị dành riêng cho thành viên.',
  },
  {
    icon: '🎂',
    title: 'Ưu Đãi Sinh Nhật',
    desc: 'Nhân đôi niềm vui vào tháng sinh nhật với những ưu đãi độc quyền và chiết khấu đặc biệt.',
  },
  {
    icon: '✨',
    title: 'Đặc Quyền V.I.P',
    desc: 'Nâng hạng thẻ từ Bạc lên Vàng, Bạch Kim để trải nghiệm dịch vụ chăm sóc khách hàng đẳng cấp.',
  }
];

export default function PublicHomePage() {
  const { login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  const navigate = useNavigate();

  const handleDemoCustomer = () => { login('demo-customer-token'); navigate('/dashboard'); };
  const handleDemoAdmin = () => { login('demo-admin-token'); navigate('/admin'); };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Nền Tảng Khách Hàng <br />
              <span className="text-coop-red">Thân Thiết</span> Co.opmart
            </h1>
            <p className="hero-desc">
              Tham gia ngay hôm nay để tận hưởng hàng ngàn ưu đãi đặc quyền, 
              tích điểm mọi lúc, đổi quà mọi nơi cùng hệ thống siêu thị lớn nhất Việt Nam.
            </p>
            <div className="hero-actions">
              <Link to="/auth/customer/signup">
                <Button size="lg">Đăng ký thành viên</Button>
              </Link>
              <Link to="/auth/customer/login">
                <Button variant="outline" size="lg">Đăng nhập tài khoản</Button>
              </Link>
            </div>
            
            {/* DEMO MODE ACCESS */}
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,0,0,0.03)', borderRadius: 12, border: '1px dashed #ccc' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Development Demo Access</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button size="sm" variant="secondary" onClick={handleDemoCustomer}>Enter Customer Demo</Button>
                <Button size="sm" variant="outline" onClick={handleDemoAdmin}>Enter Admin Demo</Button>
              </div>
            </div>
          </div>
          <div className="hero-image-placeholder">
            <div className="hero-card">
              <div className="card-chip"></div>
              <div className="card-logo">co.opmart</div>
              <div className="card-name">THẺ THÀNH VIÊN</div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL CO.OPMART BENEFITS SECTION */}
      <section id="benefits" className="home-benefits py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="coop-benefits-header">
            <div>
              <div className="coop-benefits-supertitle">Co.opmart</div>
              <h2 className="coop-benefits-title">Quyền Lợi Độc Quyền</h2>
            </div>
            <Link to="/dashboard" className="coop-benefits-more" style={{ display: 'none' }}>
              {/* Optional: Add "Xem thêm" link if needed */}
            </Link>
          </div>

          <div className="coop-benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="coop-benefit-card">
                <div className="coop-benefit-bg-logo">cp</div>
                
                <div className="coop-benefit-image-wrapper">
                   <div className="coop-benefit-leaf-shape">
                     {b.icon}
                   </div>
                </div>

                <div className="coop-benefit-content">
                  <h3 className="coop-benefit-title">{b.title}</h3>
                  <p className="coop-benefit-desc">{b.desc}</p>
                  <Link to="/auth/customer/login" className="coop-benefit-link">
                    Xem chi tiết <span className="coop-arrow-btn"><span className="circle-green"></span><span className="circle-pink">&rsaquo;</span></span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICIAL CO.OPMART TIER SECTION */}
      <section className="home-official-tier py-16" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <div className="container coop-tier-layout">
          {/* Left Column: iMac mockup with Video */}
          <div className="coop-imac-wrapper">
            <div className="imac-mockup">
              <div className="imac-screen">
                <img src="/CP_logo.png" alt="CP Logo" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxWidth: '45%', maxHeight: '45%', objectFit: 'contain' }} />
              </div>
            </div>
            <div className="imac-stand"></div>
            <div className="imac-base"></div>
          </div>

          {/* Right Column: Content */}
          <div className="coop-tier-content">
            <h2 className="coop-tier-title">Khách hàng thành viên</h2>
            <p className="coop-tier-desc">
              Trở thành khách hàng thành viên của Co.opmart để mua hàng với ưu đãi lớn cùng nhiều phần quà hấp dẫn !
            </p>

            {/* Overlapping Cards */}
            <div className="coop-cards-showcase">
              <div className="coop-member-card platinum">
                <div className="coop-card-label">Khách hàng</div>
                <div className="coop-card-tier">Bạch Kim</div>
              </div>
              <div className="coop-member-card gold">
              </div>
              <div className="coop-member-card silver">
              </div>
              <div className="coop-member-card bronze">
              </div>
            </div>

            {/* Pill Buttons */}
            <div className="coop-pill-nav">
              <Link to="/auth/customer/signup" className="coop-pill-btn">
                <div className="pill-thumb" style={{ background: 'linear-gradient(135deg, #db2777, #e11d48)' }}>📝</div>
                <span>Đăng ký thành viên Co.opmart</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="home-cta">
        <div className="container text-center">
          <h2 className="cta-title">Sẵn Sàng Trải Nghiệm Mua Sắm Thông Minh?</h2>
          <p className="cta-desc">Chỉ mất 2 phút để tạo tài khoản và bắt đầu hành trình tích điểm của bạn.</p>
          <div className="cta-actions">
            <Link to="/auth/customer/signup">
              <Button size="lg" style={{ background: 'white', color: 'var(--coop-primary)' }}>
                Tạo Tài Khoản Ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
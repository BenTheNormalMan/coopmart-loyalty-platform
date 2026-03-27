import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="public-footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <img src="/coopmart logo.png" alt="Co.opmart Logo" className="coop-logo-img footer-logo" />
            <p className="footer-desc">
              Chương trình khách hàng thân thiết của Co.opmart - Hệ thống siêu thị thuần Việt lâu đời nhất Việt Nam.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>Dịch vụ</h4>
            <ul>
              <li><Link to="/auth/customer/login">Trang thành viên</Link></li>
              <li><Link to="/auth/customer/signup">Đăng ký mới</Link></li>
              <li><a href="#">Thể lệ chương trình</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Hotline: 1900.5555.68</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Liên hiệp HTX Thương mại TP.HCM (Saigon Co.op).</p>
          <div className="footer-links">
            <Link to="/auth/admin/login" className="admin-link">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

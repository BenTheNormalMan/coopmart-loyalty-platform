import { isDemoMode } from '../../utils/demo';
import { mockCustomerCoupons } from '../../mocks/customer';
import { useEffect, useState } from 'react';
import { customerApi } from '../../api/customer.api';
import type { CustomerCoupon } from '../../types/customer';
import { formatDate } from '../../utils/format';
import './CustomerPages.css';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CustomerCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setCoupons(mockCustomerCoupons);
      setLoading(false);
      return;
    }

    setLoading(true);
    customerApi.getCoupons(50)
      .then(setCoupons)
      .catch(() => setError('Không thể tải coupon. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;

  const active = coupons.filter(c => !c.isCampaignExpired);
  const expired = coupons.filter(c => c.isCampaignExpired);

  return (
    <div>
      <div className="page-header">
        <h2>Coupon của tôi</h2>
        <p>Tất cả coupon đã nhận từ các chiến dịch</p>
      </div>

      {coupons.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 40 }}>
            Bạn chưa có coupon nào. Hãy tham gia các chiến dịch để nhận coupon!
          </div>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--gray-700)' }}>Coupon còn hiệu lực ({active.length})</h3>
              <div className="coupon-grid">
                {active.map((c) => (
                  <CouponCard key={c.id} coupon={c} />
                ))}
              </div>
            </div>
          )}
          {expired.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--gray-500)' }}>Coupon đã hết hạn ({expired.length})</h3>
              <div className="coupon-grid">
                {expired.map((c) => (
                  <CouponCard key={c.id} coupon={c} expired />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CouponCard({ coupon, expired }: { coupon: CustomerCoupon; expired?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`coupon-card ${expired ? 'coupon-card-expired' : ''}`}>
      <div className="coupon-campaign">{coupon.campaignName}</div>
      <div className="coupon-title">{coupon.couponTitle}</div>
      <div className="coupon-code-row">
        <code className="coupon-code">{coupon.couponCode}</code>
        <button className="btn btn-outline btn-sm" onClick={handleCopy} disabled={expired}>
          {copied ? 'Đã sao chép!' : 'Sao chép'}
        </button>
      </div>
      <div className="coupon-meta">
        <span>Nhận: {formatDate(coupon.claimedAt)}</span>
        <span>HH: {formatDate(coupon.campaignEndAt)}</span>
        {expired && <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11 }}>Hết hạn</span>}
      </div>
    </div>
  );
}
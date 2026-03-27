import { isDemoMode } from '../../utils/demo';
import { mockCustomerProfile, mockCustomerTier, mockCustomerTransactions, mockCustomerCampaigns, mockCustomerCoupons } from '../../mocks/customer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from '../../api/customer.api';
import type { CustomerProfile, CustomerTier, CustomerTransaction, CustomerCampaign, CustomerCoupon } from '../../types/customer';
import { formatVnd, formatTier, formatDate } from '../../utils/format';
import './CustomerPages.css';

const TIER_BENEFITS: Record<string, string[]> = {
  BRONZE: ['Tích 1 điểm / 1,000đ chi tiêu', 'Ưu đãi thành viên tại quầy', 'Thông báo khuyến mãi định kỳ'],
  SILVER: ['Tích 1.5 điểm / 1,000đ', 'Ưu đãi sinh nhật độc quyền', 'Ưu tiên hỗ trợ khách hàng'],
  GOLD: ['Tích 2 điểm / 1,000đ', 'Quà tặng ngày lễ đặc biệt', 'Mời tham gia sự kiện VIP', 'Hỗ trợ ưu tiên 24/7'],
  PLATINUM: ['Tích 3 điểm / 1,000đ', 'Dịch vụ cá nhân hoá', 'Voucher độc quyền hàng tháng', 'Đặc quyền trải nghiệm sản phẩm mới', 'Quản lý tài khoản chuyên biệt'],
};

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [tier, setTier] = useState<CustomerTier | null>(null);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [campaigns, setCampaigns] = useState<CustomerCampaign[]>([]);
  const [coupons, setCoupons] = useState<CustomerCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setProfile(mockCustomerProfile);
      setTier(mockCustomerTier);
      setTransactions(mockCustomerTransactions);
      setCampaigns(mockCustomerCampaigns);
      setCoupons(mockCustomerCoupons);
      setLoading(false);
      return;
    }
    Promise.all([
      customerApi.getProfile(),
      customerApi.getTier(),
      customerApi.getTransactions(5),
      customerApi.getCampaigns().catch(() => []),
      customerApi.getCoupons(50).catch(() => [])
    ]).then(([p, t, txns, c, coup]) => {
      setProfile(p);
      setTier(t);
      setTransactions(txns || []);
      setCampaigns(c || []);
      setCoupons(coup || []);
    }).catch(() => {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;

  const progressPct = tier?.amountToNextTierVnd && tier.rolling6MonthsSpendVnd
    ? (() => {
        const spent = Number(tier.rolling6MonthsSpendVnd);
        const needed = Number(tier.amountToNextTierVnd);
        if (needed <= 0) return 100;
        const goal = spent + needed;
        return Math.min(100, Math.round((spent / goal) * 100));
      })()
    : null;

  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const registeredCampaigns = campaigns.filter(c => c.isRegistered).length;
  const qualifiedCampaigns = campaigns.filter(c => c.qualifiesForCoupon && !c.claimedCouponCode).length;
  const claimedCampaigns = campaigns.filter(c => c.claimedCouponCode).length;

  const activeCoupons = coupons.filter(c => !c.isCampaignExpired).length;
  const expiredCoupons = coupons.filter(c => c.isCampaignExpired).length;
  const nearestExpiring = coupons
    .filter(c => !c.isCampaignExpired)
    .sort((a, b) => new Date(a.campaignEndAt).getTime() - new Date(b.campaignEndAt).getTime())[0];

  const currentBenefits = TIER_BENEFITS[profile?.currentTier ?? 'BRONZE'] ?? [];
  const nextBenefits = tier?.nextTier ? (TIER_BENEFITS[tier.nextTier] ?? []) : [];

  // Build contextual alerts
  const alerts: { type: 'warning' | 'success' | 'info'; message: string; link?: string }[] = [];
  if (qualifiedCampaigns > 0)
    alerts.push({ type: 'success', message: `Bạn đủ điều kiện nhận coupon từ ${qualifiedCampaigns} chiến dịch!`, link: '/dashboard/campaigns' });
  if (nearestExpiring) {
    const daysLeft = Math.ceil((new Date(nearestExpiring.campaignEndAt).getTime() - Date.now()) / 86400000);
    if (daysLeft <= 7)
      alerts.push({ type: 'warning', message: `Coupon "${nearestExpiring.couponCode}" sắp hết hạn trong ${daysLeft} ngày!`, link: '/dashboard/coupons' });
  }
  if (tier?.amountToNextTierVnd && Number(tier.amountToNextTierVnd) < 1000000)
    alerts.push({ type: 'info', message: `Chỉ cần thêm ${formatVnd(tier.amountToNextTierVnd)} nữa để lên hạng ${formatTier(tier.nextTier)}!`, link: '/dashboard/tier' });

  return (
    <div>
      <div className="page-header">
        <h2>Tổng quan</h2>
        <p>Chào mừng trở lại, {profile?.fullName ?? profile?.email}!</p>
      </div>

      {/* ALERTS / ATTENTION NEEDED */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10,
              background: a.type === 'success' ? 'var(--success-light)' : a.type === 'warning' ? '#fffbeb' : '#eff6ff',
              border: `1px solid ${a.type === 'success' ? '#bbf7d0' : a.type === 'warning' ? '#fde68a' : '#bfdbfe'}`,
            }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                {a.type === 'success' ? '✅' : a.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--gray-700)' }}>{a.message}</span>
              {a.link && (
                <Link to={a.link} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>
                  Xem ngay →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* STATS GRID */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Điểm hiện tại</div>
          <div className="stat-value">{Number(profile?.pointsBalance ?? 0).toLocaleString('vi-VN')}</div>
          <div className="stat-change up">điểm tích lũy</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Chi tiêu 6 tháng</div>
          <div className="stat-value">{formatVnd(profile?.rolling6MonthsSpendVnd)}</div>
          <div className="stat-change up">dùng để xếp hạng</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hạng hiện tại</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{formatTier(profile?.currentTier)}</div>
          {tier?.nextTier && <div className="stat-change up">Tiếp theo: {formatTier(tier.nextTier)}</div>}
        </div>
        <div className="stat-card">
          <div className="stat-label">Cần thêm để lên hạng</div>
          <div className="stat-value" style={{ fontSize: tier?.amountToNextTierVnd ? 18 : 22 }}>
            {tier?.amountToNextTierVnd ? formatVnd(tier.amountToNextTierVnd) : 'Đã đạt tối đa'}
          </div>
          {tier?.nextTier && <div className="stat-change">lên hạng {formatTier(tier.nextTier)}</div>}
        </div>
      </div>

      {/* PROFILE SUMMARY + TIER PROGRESS */}
      <div className="content-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Thông tin tài khoản
            <Link to="/dashboard/profile" style={{ fontSize: 13, color: 'var(--primary)' }}>Xem hồ sơ →</Link>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.3rem', flexShrink: 0,
              }}>
                {(profile?.fullName?.[0] ?? profile?.email?.[0] ?? '?').toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{profile?.fullName || '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{profile?.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Mã thành viên', value: profile?.id, mono: true },
                { label: 'Số điện thoại', value: profile?.phone || '—' },
                { label: 'Ngày tham gia', value: profile?.joinedAt ? formatDate(profile.joinedAt) : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gray-100)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--gray-500)', fontSize: 13 }}>{row.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, fontFamily: row.mono ? 'monospace' : undefined }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tiến độ lên hạng
            <Link to="/dashboard/tier" style={{ fontSize: 13, color: 'var(--primary)' }}>Chi tiết →</Link>
          </div>
          <div className="card-body">
            {progressPct !== null ? (
              <>
                <div className="progress-info">
                  <span>{formatVnd(tier?.rolling6MonthsSpendVnd)} chi tiêu</span>
                  <span className="progress-pct">{progressPct}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: 'var(--warning)' }} />
                </div>
                {tier?.amountToNextTierVnd && (
                  <p className="progress-hint">Còn {formatVnd(tier.amountToNextTierVnd)} để lên hạng {formatTier(tier.nextTier)}</p>
                )}
              </>
            ) : (
              <p className="progress-hint">Bạn đã đạt hạng cao nhất!</p>
            )}
            <div style={{ marginTop: 16 }}>
              <Link to="/dashboard/tier" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Xem chi tiết quyền lợi hạng
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TIER BENEFITS */}
      <div className="content-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">Quyền lợi hạng {formatTier(profile?.currentTier)} hiện tại</div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentBenefits.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--gray-700)' }}>
                  <span style={{ color: 'var(--success)', flexShrink: 0, fontSize: '1rem', marginTop: 1 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {tier?.nextTier && nextBenefits.length > 0 && (
          <div className="card" style={{ border: '2px dashed var(--gray-200)' }}>
            <div className="card-header" style={{ color: 'var(--gray-500)' }}>
              Xem trước quyền lợi hạng {formatTier(tier.nextTier)}
            </div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nextBenefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--gray-400)' }}>
                    <span style={{ flexShrink: 0 }}>◎</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* CAMPAIGN + COUPON SUMMARY */}
      <div className="content-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Chiến dịch & Thử thách
            <Link to="/dashboard/campaigns" style={{ fontSize: 13, color: 'var(--primary)' }}>Khám phá →</Link>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Đang diễn ra', count: activeCampaigns, color: 'var(--primary)' },
              { label: 'Đã tham gia', count: registeredCampaigns, color: 'var(--gray-700)' },
              { label: 'Đủ điều kiện nhận', count: qualifiedCampaigns, color: 'var(--success)' },
              { label: 'Đã nhận mã', count: claimedCampaigns, color: 'var(--gray-700)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Kho Coupon của tôi
            <Link to="/dashboard/coupons" style={{ fontSize: 13, color: 'var(--primary)' }}>Xem tất cả →</Link>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>
              <div className="stat-label">Chưa sử dụng</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{activeCoupons}</div>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>
              <div className="stat-label">Đã hết hạn</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-400)' }}>{expiredCoupons}</div>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>
              <div className="stat-label">Tổng thu thập</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{coupons.length}</div>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>
              <div className="stat-label">Sắp hết hạn</div>
              {nearestExpiring ? (
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)', marginTop: 4 }}>
                  {nearestExpiring.couponCode}<br />
                  <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>
                    Hết hạn {formatDate(nearestExpiring.campaignEndAt)}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Không có</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      {transactions.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Giao dịch gần đây
            <Link to="/dashboard/transactions" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Xem lịch sử →</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày</th>
                  <th>Số tiền</th>
                  <th>Điểm</th>
                  <th>Biến động hạng</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td><code style={{ fontSize: 12, background: 'var(--gray-50)', padding: '2px 6px', borderRadius: 4 }}>{t.externalOrderId}</code></td>
                    <td style={{ fontSize: 13 }}>{formatDate(t.checkoutAt)}</td>
                    <td style={{ fontWeight: 600 }}>{formatVnd(t.amountVnd)}</td>
                    <td><span className="badge badge-success" style={{ fontWeight: 600 }}>+{Number(t.pointsAwarded).toLocaleString('vi-VN')}</span></td>
                    <td>
                      {t.tierChanged
                        ? <span className="badge badge-accent" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>Lên hạng {formatTier(t.newTier)}</span>
                        : <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="card">
        <div className="card-header">Truy cập nhanh</div>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { to: '/dashboard/campaigns', label: 'Chiến dịch' },
            { to: '/dashboard/rewards', label: 'Đổi thưởng' },
            { to: '/dashboard/offers', label: 'Ưu đãi' },
            { to: '/dashboard/coupons', label: 'Coupon của tôi' },
            { to: '/dashboard/tier', label: 'Hạng thành viên' },
            { to: '/dashboard/transactions', label: 'Lịch sử giao dịch' },
            { to: '/dashboard/profile', label: 'Hồ sơ của tôi' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="btn btn-outline btn-sm">{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
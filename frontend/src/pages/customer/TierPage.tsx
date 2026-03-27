import { isDemoMode } from '../../utils/demo';
import { mockCustomerTier } from '../../mocks/customer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from '../../api/customer.api';
import type { CustomerTier } from '../../types/customer';
import { formatVnd, formatTier } from '../../utils/format';
import './CustomerPages.css';

const TIER_ORDER = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

const TIER_META: Record<string, { color: string; threshold: string; earnRate: string; benefits: string[] }> = {
  BRONZE: {
    color: '#cd7f32',
    threshold: 'Dưới 5,000,000đ / 6 tháng',
    earnRate: '1 điểm / 1,000đ',
    benefits: ['Tích điểm tại tất cả Co.opmart', 'Tham gia chương trình thưởng định kỳ', 'Thông báo khuyến mãi hàng tháng'],
  },
  SILVER: {
    color: '#9ca3af',
    threshold: '5,000,000đ – 15,000,000đ / 6 tháng',
    earnRate: '1.5 điểm / 1,000đ',
    benefits: ['Tất cả quyền lợi hạng Đồng', 'Ưu đãi sinh nhật độc quyền', 'Ưu tiên hỗ trợ khách hàng', 'Voucher thưởng theo quý'],
  },
  GOLD: {
    color: '#daa520',
    threshold: '15,000,000đ – 40,000,000đ / 6 tháng',
    earnRate: '2 điểm / 1,000đ',
    benefits: ['Tất cả quyền lợi hạng Bạc', 'Quà tặng ngày lễ đặc biệt', 'Mời tham gia sự kiện VIP', 'Hỗ trợ ưu tiên 24/7', 'Điểm thưởng nhân đôi tháng sinh nhật'],
  },
  PLATINUM: {
    color: '#795d2c',
    threshold: 'Trên 40,000,000đ / 6 tháng',
    earnRate: '3 điểm / 1,000đ',
    benefits: ['Tất cả quyền lợi hạng Vàng', 'Quản lý tài khoản chuyên biệt', 'Voucher độc quyền hàng tháng', 'Đặc quyền trải nghiệm sản phẩm mới', 'Siêu ưu đãi ngày thành viên 30/4', 'Hoàn tiền 2% mỗi giao dịch'],
  },
};

export default function TierPage() {
  const [tier, setTier] = useState<CustomerTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setTier(mockCustomerTier);
      setLoading(false);
      return;
    }
    customerApi.getTier()
      .then(setTier)
      .catch(() => setError('Không thể tải thông tin hạng. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!tier) return null;

  const currentIndex = TIER_ORDER.indexOf(tier.currentTier);
  const progressPct = tier.amountToNextTierVnd
    ? (() => {
        const spent = Number(tier.rolling6MonthsSpendVnd);
        const needed = Number(tier.amountToNextTierVnd);
        const goal = spent + needed;
        if (goal <= 0) return 100;
        return Math.min(100, Math.round((spent / goal) * 100));
      })()
    : 100;

  const currentMeta = TIER_META[tier.currentTier] ?? TIER_META.BRONZE;
  const nextMeta = tier.nextTier ? TIER_META[tier.nextTier] : null;

  return (
    <div>
      <div className="page-header">
        <h2>Hạng thành viên</h2>
        <p>Theo dõi hạng, quyền lợi và tiến độ thăng hạng của bạn</p>
      </div>

      {/* CURRENT TIER STATUS */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Hạng hiện tại của bạn</div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `${currentMeta.color}22`, border: `3px solid ${currentMeta.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: currentMeta.color, textAlign: 'center',
              flexShrink: 0,
            }}>
              {formatTier(tier.currentTier)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>{formatTier(tier.currentTier)}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Chi tiêu 6 tháng gần nhất</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>{formatVnd(tier.rolling6MonthsSpendVnd)}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>Ngưỡng: {currentMeta.threshold}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Tỷ lệ tích điểm</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: currentMeta.color }}>{currentMeta.earnRate}</div>
            </div>
          </div>

          {tier.nextTier && (
            <>
              <div className="progress-info">
                <span>Tiến độ lên hạng <strong>{formatTier(tier.nextTier)}</strong></span>
                <span className="progress-pct">{progressPct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: currentMeta.color }} />
              </div>
              <p className="progress-hint" style={{ marginTop: 8 }}>
                Cần thêm <strong>{formatVnd(tier.amountToNextTierVnd)}</strong> để lên hạng {formatTier(tier.nextTier)}
              </p>
            </>
          )}
          {!tier.nextTier && (
            <p className="progress-hint">🏆 Bạn đã đạt hạng cao nhất — Bạch Kim!</p>
          )}
        </div>
      </div>

      <div className="content-grid" style={{ marginBottom: 20 }}>
        {/* CURRENT BENEFITS */}
        <div className="card">
          <div className="card-header" style={{ color: currentMeta.color }}>Quyền lợi hạng {formatTier(tier.currentTier)}</div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentMeta.benefits.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                  <span style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ color: 'var(--gray-700)' }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NEXT TIER PREVIEW */}
        {nextMeta && tier.nextTier && (
          <div className="card" style={{ border: `2px dashed ${nextMeta.color}44` }}>
            <div className="card-header" style={{ color: 'var(--gray-500)' }}>
              Xem trước quyền lợi hạng {formatTier(tier.nextTier)}
            </div>
            <div className="card-body">
              <div style={{ fontSize: 13, color: nextMeta.color, fontWeight: 600, marginBottom: 12 }}>
                Tỷ lệ tích điểm: {nextMeta.earnRate}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {nextMeta.benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--gray-300)', flexShrink: 0, marginTop: 2 }}>◎</span>
                    <span style={{ color: 'var(--gray-400)' }}>{b}</span>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-400)', fontStyle: 'italic' }}>
                Ngưỡng: {nextMeta.threshold}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* TIER LADDER */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Sơ đồ các hạng thành viên</div>
        <div className="card-body" style={{ padding: '16px 0 16px 16px' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 8 }}>
            <div className="tier-ladder" style={{ minWidth: 480 }}>
            {TIER_ORDER.map((t, i) => {
              const isActive = t === tier.currentTier;
              const isPassed = currentIndex > i;
              const meta = TIER_META[t];
              return (
                <div key={t} className={`tier-step ${isActive ? 'tier-step-active' : ''} ${isPassed ? 'tier-step-passed' : ''}`}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${meta.color}22`, border: `2px solid ${meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: meta.color }}>{formatTier(t)[0]}</span>
                  </div>
                  <div className="tier-step-name">{formatTier(t)}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 2 }}>{meta.earnRate}</div>
                  {isActive && <span className="badge badge-accent" style={{ fontSize: 10, marginTop: 4 }}>Hiện tại</span>}
                  {isPassed && <span className="badge badge-success" style={{ fontSize: 10, marginTop: 4 }}>Đã đạt</span>}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link to="/dashboard/campaigns" className="btn btn-primary btn-sm">Xem chiến dịch ưu đãi</Link>
        <Link to="/dashboard/rewards" className="btn btn-outline btn-sm">Đổi điểm thưởng</Link>
      </div>
    </div>
  );
}
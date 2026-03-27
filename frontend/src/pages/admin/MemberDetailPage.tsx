import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockMembers, mockMemberDetails } from '../../mocks/members';

const TIER_LABELS: Record<string, string> = { BRONZE: 'Đồng', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch Kim' };
const TIER_BADGE: Record<string, string> = { BRONZE: 'badge-danger', SILVER: 'badge-gray', GOLD: 'badge-warning', PLATINUM: 'badge-accent' };
function formatVnd(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }

export default function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const member = mockMemberDetails[memberId ?? ''] ?? mockMembers.find(m => m.id === memberId);
  const detail = mockMemberDetails[memberId ?? ''];

  const [adjDelta, setAdjDelta] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [adjRequiresApproval, setAdjRequiresApproval] = useState(false);
  const [adjFeedback, setAdjFeedback] = useState('');

  if (!member) return (
    <div style={{ textAlign: 'center', padding: 64 }}>
      <h2>Không tìm thấy thành viên</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>ID: {memberId}</p>
      <Link to="/admin/members" className="btn btn-outline">Quay lại danh sách</Link>
    </div>
  );

  const handlePointsAdjust = () => {
    const delta = parseInt(adjDelta, 10);
    if (!adjDelta || isNaN(delta)) { setAdjFeedback('Vui lòng nhập số điểm hợp lệ.'); return; }
    if (!adjReason.trim()) { setAdjFeedback('Vui lòng nhập lý do điều chỉnh.'); return; }
    setAdjFeedback(`[Demo] Yêu cầu điều chỉnh ${delta > 0 ? '+' : ''}${delta} điểm vì "${adjReason}"${adjRequiresApproval ? ' (cần phê duyệt)' : ''} đã được ghi nhận.`);
    setAdjDelta('');
    setAdjReason('');
  };

  const nextTierSpend = { BRONZE: 5000000, SILVER: 15000000, GOLD: 40000000, PLATINUM: null }[member.currentTier];
  const amountToNext = nextTierSpend ? Math.max(0, nextTierSpend - member.rolling6MonthsSpendVnd) : null;
  const progressPct = nextTierSpend ? Math.min(100, Math.round((member.rolling6MonthsSpendVnd / nextTierSpend) * 100)) : 100;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/admin/members" style={{ color: 'var(--gray-400)', textDecoration: 'none', fontSize: 13 }}>← Danh sách thành viên</Link>
      </div>

      {/* Profile Summary */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 }}>
            {member.fullName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>{member.fullName}</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--gray-500)', fontSize: 13 }}>
              <span>{member.email}</span>
              <span>{member.phone}</span>
              <span>Tham gia: {new Date(member.joinedAt).toLocaleDateString('vi-VN')}</span>
              <span className="badge badge-success" style={{ fontSize: 11 }}>Đang hoạt động</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className={`badge ${TIER_BADGE[member.currentTier]}`} style={{ fontSize: 14, padding: '6px 14px' }}>
              Hạng {TIER_LABELS[member.currentTier]}
            </span>
            <span style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'monospace' }}>ID: {member.id}</span>
          </div>
        </div>
      </div>

      {/* Loyalty Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Điểm tích lũy', value: member.pointsBalance.toLocaleString() + ' điểm', color: 'var(--primary)' },
          { label: 'Chi tiêu 6 tháng', value: formatVnd(member.rolling6MonthsSpendVnd), color: 'var(--gray-900)' },
          { label: 'Hạng hiện tại', value: TIER_LABELS[member.currentTier], color: 'var(--gray-900)' },
          { label: 'Còn để lên hạng', value: amountToNext ? formatVnd(amountToNext) : 'Tối đa', color: amountToNext ? 'var(--warning)' : 'var(--success)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 20 }}>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tier Progress */}
      {amountToNext !== null && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">Tiến độ lên hạng</div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>{formatVnd(member.rolling6MonthsSpendVnd)} / {nextTierSpend ? formatVnd(nextTierSpend) : ''}</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{progressPct}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--warning)', borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 8 }}>
              Cần thêm <strong>{formatVnd(amountToNext)}</strong> để lên hạng {TIER_LABELS[{ BRONZE: 'SILVER', SILVER: 'GOLD', GOLD: 'PLATINUM' }[member.currentTier] ?? 'PLATINUM']}
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">Giao dịch gần đây</div>
          <div className="card-body">
            {detail?.recentTransactions?.length ? (
              <table className="data-table">
                <thead><tr><th>Ngày</th><th>Mã đơn</th><th style={{ textAlign: 'right' }}>Số tiền</th><th style={{ textAlign: 'right' }}>Điểm</th></tr></thead>
                <tbody>
                  {detail.recentTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{new Date(tx.checkoutAt).toLocaleDateString('vi-VN')}</td>
                      <td><code style={{ fontSize: 11, background: 'var(--gray-50)', padding: '1px 5px', borderRadius: 3 }}>{tx.sourceSystem}</code></td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVnd(tx.amountVnd)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--primary)', fontWeight: 700 }}>+{tx.pointsAwarded.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: 20 }}>Không có dữ liệu</p>}
          </div>
        </div>

        {/* Coupons */}
        <div className="card">
          <div className="card-header">Coupon đã nhận ({detail?.coupons?.length ?? 0})</div>
          <div className="card-body">
            {detail?.coupons?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {detail.coupons.map((c, i) => (
                  <div key={i} style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{c.campaignName}</div>
                      <code style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{c.couponCode}</code>
                    </div>
                    {c.isCampaignExpired
                      ? <span className="badge badge-gray" style={{ fontSize: 10 }}>Hết hạn</span>
                      : <span className="badge badge-success" style={{ fontSize: 10 }}>Còn hiệu lực</span>
                    }
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: 20 }}>Không có dữ liệu</p>}
          </div>
        </div>
      </div>

      {/* Points Adjustment Shell */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Điều chỉnh điểm thưởng</div>
        <div className="card-body">
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
            Sử dụng form này để điều chỉnh điểm thưởng của thành viên. Dùng số âm để trừ điểm.
            <span style={{ color: 'var(--warning)', fontWeight: 600 }}> (Giao diện demo — yêu cầu backend khi triển khai)</span>
          </p>
          {adjFeedback && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: adjFeedback.startsWith('[Demo]') ? 'var(--success-light)' : '#fef2f2', borderRadius: 8, fontSize: 13, color: adjFeedback.startsWith('[Demo]') ? '#065f46' : '#b91c1c', border: `1px solid ${adjFeedback.startsWith('[Demo]') ? '#bbf7d0' : '#fca5a5'}` }}>
              {adjFeedback}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6, display: 'block' }}>Số điểm điều chỉnh</label>
              <input
                type="number"
                value={adjDelta}
                onChange={e => { setAdjDelta(e.target.value); setAdjFeedback(''); }}
                placeholder="+500 hoặc -200"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray-300)', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6, display: 'block' }}>Lý do</label>
              <input
                value={adjReason}
                onChange={e => { setAdjReason(e.target.value); setAdjFeedback(''); }}
                placeholder="Nhập lý do điều chỉnh..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray-300)', fontSize: 14 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}>
              <input type="checkbox" checked={adjRequiresApproval} onChange={e => setAdjRequiresApproval(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
              Yêu cầu phê duyệt cấp trên
            </label>
            <button className="btn btn-primary btn-sm" onClick={handlePointsAdjust}>Ghi nhận điều chỉnh</button>
            <button className="btn btn-outline btn-sm" disabled>Đặt lại hạng thành viên</button>
          </div>
        </div>
      </div>
    </div>
  );
}

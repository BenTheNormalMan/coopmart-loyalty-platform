import { useState } from 'react';
import { mockRewards, type Reward } from '../../mocks/rewards';
import { mockCustomerProfile } from '../../mocks/customer';
import { isDemoMode } from '../../utils/demo';

const TIER_COLOR: Record<string, string> = {
  Voucher: '#1553A1',
  'Quà tặng': '#16a34a',
  'Thẻ nạp': '#d97706',
  'Giải trí': '#7c3aed',
  'Độc quyền': '#795d2c',
};

function RedeemModal({ reward, pointsBalance, onClose }: { reward: Reward; pointsBalance: number; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'loading'>('idle');
  const canRedeem = pointsBalance >= reward.pointsRequired && reward.isActive && (reward.stock === null || reward.stock > 0);

  const handleRedeem = () => {
    if (!canRedeem) return;
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', padding: 32 }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h3 style={{ color: 'var(--success)', marginBottom: 8 }}>Đổi thưởng thành công!</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Bạn đã đổi <strong>{reward.name}</strong>. Mã phần thưởng sẽ được gửi qua email của bạn.</p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>Đóng</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ fontSize: '2.5rem' }}>{reward.imageEmoji}</div>
              <div>
                <h3 style={{ color: 'var(--gray-900)', marginBottom: 4 }}>{reward.name}</h3>
                <span className="badge badge-primary">{reward.category}</span>
              </div>
            </div>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>{reward.description}</p>
            <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--gray-500)', fontSize: 13 }}>Điểm yêu cầu</span>
                <strong style={{ color: 'var(--primary)' }}>{reward.pointsRequired.toLocaleString()} điểm</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--gray-500)', fontSize: 13 }}>Điểm hiện tại của bạn</span>
                <strong style={{ color: pointsBalance >= reward.pointsRequired ? 'var(--success)' : 'var(--danger)' }}>
                  {pointsBalance.toLocaleString()} điểm
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray-500)', fontSize: 13 }}>Điểm còn lại sau đổi</span>
                <strong>{canRedeem ? (pointsBalance - reward.pointsRequired).toLocaleString() : '--'} điểm</strong>
              </div>
            </div>
            {!canRedeem && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                {!reward.isActive ? '⚠️ Phần thưởng này hiện không khả dụng.' : reward.stock === 0 ? '⚠️ Phần thưởng đã hết hàng.' : '⚠️ Bạn không đủ điểm để đổi phần thưởng này.'}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Hủy</button>
              <button className="btn btn-primary" onClick={handleRedeem} disabled={!canRedeem || status === 'loading'} style={{ flex: 1 }}>
                {status === 'loading' ? 'Đang xử lý...' : 'Xác nhận đổi'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const [selected, setSelected] = useState<Reward | null>(null);
  const [filter, setFilter] = useState<string>('Tất cả');
  const profile = isDemoMode() ? mockCustomerProfile : null;
  const pointsBalance = parseInt(profile?.pointsBalance ?? '0', 10);
  const rewards = mockRewards;
  const categories = ['Tất cả', ...Array.from(new Set(rewards.map(r => r.category)))];
  const filtered = filter === 'Tất cả' ? rewards : rewards.filter(r => r.category === filter);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Danh mục phần thưởng</h1>
        <p style={{ color: 'var(--gray-500)' }}>Dùng điểm tích lũy để đổi lấy các phần thưởng hấp dẫn từ Co.opmart.</p>
      </div>

      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 }}>Điểm hiện tại của bạn</div>
          <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>{pointsBalance.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 6 }}>điểm</span></div>
        </div>
        <div style={{ fontSize: '2rem' }}>💰</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '6px 16px', borderRadius: 50, border: `1.5px solid ${filter === cat ? 'var(--primary)' : 'var(--gray-200)'}`, background: filter === cat ? 'var(--primary)' : 'white', color: filter === cat ? 'white' : 'var(--gray-700)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map(reward => {
          const canAfford = pointsBalance >= reward.pointsRequired;
          const inStock = reward.stock === null || reward.stock > 0;
          return (
            <div key={reward.id} className="card" style={{ overflow: 'visible', opacity: reward.isActive ? 1 : 0.6 }}>
              <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2.5rem' }}>{reward.imageEmoji}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className="badge" style={{ background: TIER_COLOR[reward.category] + '22', color: TIER_COLOR[reward.category], fontWeight: 700 }}>{reward.category}</span>
                  {!reward.isActive && <span className="badge badge-gray">Không khả dụng</span>}
                  {reward.isActive && !inStock && <span className="badge badge-danger">Hết hàng</span>}
                </div>
              </div>
              <div style={{ padding: '12px 24px 24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{reward.name}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{reward.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Cần</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: canAfford ? 'var(--primary)' : 'var(--danger)' }}>{reward.pointsRequired.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 400 }}>điểm</span></div>
                  </div>
                  {reward.stock !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Còn lại</div>
                      <div style={{ fontWeight: 700, color: reward.stock < 10 ? 'var(--danger)' : 'var(--gray-700)' }}>{reward.stock}</div>
                    </div>
                  )}
                </div>
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}
                  disabled={!reward.isActive || !inStock}
                  onClick={() => setSelected(reward)}>
                  {!reward.isActive ? 'Không khả dụng' : !inStock ? 'Hết hàng' : !canAfford ? 'Không đủ điểm' : 'Đổi ngay'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <RedeemModal reward={selected} pointsBalance={pointsBalance} onClose={() => setSelected(null)} />}
    </div>
  );
}

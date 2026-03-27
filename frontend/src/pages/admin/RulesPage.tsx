import { useState } from 'react';
import { mockTierRules, mockEarnRules, mockRedeemRules, mockExpiryPolicy } from '../../mocks/rules';

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState<'tier' | 'earn' | 'redeem' | 'expiry'>('tier');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Quản lý quy tắc</h1>
        <p style={{ color: 'var(--gray-500)' }}>Xem và quản lý các quy tắc tích điểm, đổi thưởng, hạng thành viên và chính sách hết hạn.</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--gray-100)', paddingBottom: 0 }}>
        {([['tier', 'Quy tắc hạng'], ['earn', 'Tích điểm'], ['redeem', 'Đổi thưởng'], ['expiry', 'Hết hạn']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '8px 20px', border: 'none', background: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', borderBottom: `2px solid ${activeTab === key ? 'var(--primary)' : 'transparent'}`, color: activeTab === key ? 'var(--primary)' : 'var(--gray-400)', marginBottom: -2, transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'tier' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {mockTierRules.map(rule => (
            <div key={rule.tierName} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ background: rule.gradient, padding: '20px 20px 16px', color: 'white' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Hạng {rule.tierName}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{rule.earnRate}x điểm / 1,000đ</div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 2 }}>Chi tiêu 6 tháng</div>
                  <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
                    {rule.minSpend.toLocaleString('vi-VN')}đ {rule.maxSpend ? `– ${rule.maxSpend.toLocaleString('vi-VN')}đ` : 'trở lên'}
                  </div>
                </div>
                <p style={{ color: 'var(--gray-500)', fontSize: 13, lineHeight: 1.5 }}>{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'earn' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Quy tắc tích điểm
            <button className="btn btn-primary btn-sm" disabled>+ Thêm quy tắc</button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mockEarnRules.map(rule => (
                <div key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 10, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{rule.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{rule.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge badge-primary" style={{ fontWeight: 800 }}>×{rule.multiplier}</span>
                    <span className={`badge ${rule.isActive ? 'badge-success' : 'badge-gray'}`}>{rule.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                    <button className="btn btn-outline btn-sm" disabled>Sửa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'redeem' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Quy tắc đổi thưởng
            <button className="btn btn-primary btn-sm" disabled>+ Thêm quy tắc</button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mockRedeemRules.map(rule => (
                <div key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 10, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{rule.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{rule.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge badge-primary">{rule.pointsRequired.toLocaleString()} điểm</span>
                    <span className={`badge ${rule.isActive ? 'badge-success' : 'badge-gray'}`}>{rule.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                    <button className="btn btn-outline btn-sm" disabled>Sửa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expiry' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header">Chính sách hết hạn điểm</div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: '16px 20px', background: 'var(--info-light)', borderRadius: 10 }}>
                <p style={{ color: 'var(--info)', fontWeight: 600 }}>ℹ️ {mockExpiryPolicy.description}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Thời hạn điểm', value: `${mockExpiryPolicy.expiresAfterMonths} tháng` },
                  { label: 'Thông báo trước khi hết hạn', value: `${mockExpiryPolicy.warningBeforeDays} ngày` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 8 }}>
                    <span style={{ color: 'var(--gray-600)' }}>{item.label}</span>
                    <strong style={{ color: 'var(--gray-900)' }}>{item.value}</strong>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-sm" disabled style={{ alignSelf: 'flex-start' }}>Chỉnh sửa chính sách</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

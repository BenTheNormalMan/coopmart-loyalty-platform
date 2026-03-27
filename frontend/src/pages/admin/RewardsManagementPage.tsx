import { useState } from 'react';
import { mockRewards } from '../../mocks/rewards';

export default function RewardsManagementPage() {
  const [rewards, setRewards] = useState(mockRewards);

  const toggleActive = (id: string) =>
    setRewards(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Quản lý phần thưởng</h1>
          <p style={{ color: 'var(--gray-500)' }}>Danh sách phần thưởng trong danh mục đổi điểm của Co.opmart Loyalty.</p>
        </div>
        <button className="btn btn-primary" disabled>+ Thêm phần thưởng</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {rewards.map(r => (
          <div key={r.id} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: '2rem' }}>{r.imageEmoji}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className={`badge ${r.isActive ? 'badge-success' : 'badge-gray'}`}>{r.isActive ? 'Đang hoạt động' : 'Tắt'}</span>
                <span className="badge badge-primary">{r.category}</span>
              </div>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: 8 }}>{r.name}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{r.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Điểm yêu cầu</div>
                <strong style={{ color: 'var(--primary)' }}>{r.pointsRequired.toLocaleString()}</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Tồn kho</div>
                <strong style={{ color: r.stock !== null && r.stock < 10 ? 'var(--danger)' : 'var(--gray-800)' }}>
                  {r.stock === null ? 'Không giới hạn' : r.stock}
                </strong>
              </div>
              {r.validUntil && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Hết hạn</div>
                  <strong style={{ fontSize: 13 }}>{new Date(r.validUntil).toLocaleDateString('vi-VN')}</strong>
                </div>
              )}
            </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} disabled>Sửa</button>
                <button
                  onClick={() => toggleActive(r.id)}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    background: r.isActive ? '#fee2e2' : 'var(--primary)',
                    color: r.isActive ? '#dc2626' : 'white',
                    border: r.isActive ? '1.5px solid #dc2626' : 'none',
                  }}
                >
                  {r.isActive ? 'Tắt' : 'Bật'} phần thưởng
                </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

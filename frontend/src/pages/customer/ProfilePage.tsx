import { isDemoMode } from '../../utils/demo';
import { mockCustomerProfile, mockCustomerTier } from '../../mocks/customer';
import { useEffect, useState } from 'react';
import { customerApi } from '../../api/customer.api';
import type { CustomerProfile, CustomerTier } from '../../types/customer';
import { formatVnd, formatTier, formatDate } from '../../utils/format';
import './CustomerPages.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [tier, setTier] = useState<CustomerTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setProfile(mockCustomerProfile);
      setTier(mockCustomerTier);
      setLoading(false);
      return;
    }
    Promise.all([customerApi.getProfile(), customerApi.getTier().catch(() => null)])
      .then(([p, t]) => { setProfile(p); setTier(t); })
      .catch(() => setError('Không thể tải hồ sơ. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraftName(profile?.fullName ?? '');
    setDraftPhone(profile?.phone ?? '');
    setEditing(true);
    setSaveFeedback('');
  };

  const handleSave = () => {
    // Mock save — replace with API call when backend is ready
    setProfile(prev => prev ? { ...prev, fullName: draftName, phone: draftPhone } : prev);
    setSaveFeedback('Thay đổi đã được lưu (chế độ demo).');
    setEditing(false);
  };

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!profile) return null;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>Hồ sơ của tôi</h2>
          <p>Thông tin tài khoản thành viên Co.opmart Loyalty</p>
        </div>
        {!editing && (
          <button className="btn btn-primary btn-sm" onClick={startEdit}>Chỉnh sửa hồ sơ</button>
        )}
      </div>

      {saveFeedback && (
        <div style={{ marginBottom: 16, padding: '10px 16px', background: 'var(--success-light)', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 14, color: '#065f46' }}>
          ✅ {saveFeedback}
        </div>
      )}

      <div className="content-grid" style={{ marginBottom: 24 }}>
        {/* PERSONAL INFO */}
        <div className="card">
          <div className="card-header">Thông tin cá nhân</div>
          <div className="card-body">
            <div className="profile-avatar-row">
              <div className="profile-avatar">{(profile.fullName?.[0] ?? profile.email[0]).toUpperCase()}</div>
              <div>
                <div className="profile-name">{profile.fullName || '—'}</div>
                <div className="profile-email">{profile.email}</div>
                <span className="badge badge-accent" style={{ marginTop: 6 }}>{formatTier(profile.currentTier)}</span>
              </div>
            </div>

            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 4, display: 'block' }}>Họ và tên</label>
                  <input
                    className="form-input"
                    value={draftName}
                    onChange={e => setDraftName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray-300)', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 4, display: 'block' }}>Số điện thoại</label>
                  <input
                    className="form-input"
                    value={draftPhone}
                    onChange={e => setDraftPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray-300)', fontSize: 14 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>Lưu thay đổi</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Huỷ</button>
                </div>
              </div>
            ) : (
              <dl className="profile-details" style={{ marginTop: 20 }}>
                {[
                  { label: 'Email', value: profile.email },
                  { label: 'Họ và tên', value: profile.fullName || '—' },
                  { label: 'Số điện thoại', value: profile.phone || '—' },
                  { label: 'Mã thành viên', value: profile.id, mono: true },
                  { label: 'Ngày tham gia', value: formatDate(profile.joinedAt) },
                  { label: 'Trạng thái tài khoản', value: 'Đang hoạt động', badge: true },
                ].map(row => (
                  <div key={row.label} className="profile-detail-row">
                    <dt>{row.label}</dt>
                    <dd>
                      {row.badge
                        ? <span className="badge badge-success" style={{ fontSize: 12 }}>{row.value}</span>
                        : <span style={{ fontFamily: row.mono ? 'monospace' : undefined, fontSize: 13 }}>{row.value}</span>
                      }
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* LOYALTY SUMMARY */}
        <div className="card">
          <div className="card-header">Thông tin loyalty</div>
          <div className="card-body">
            <dl className="profile-details">
              <div className="profile-detail-row">
                <dt>Hạng thành viên</dt>
                <dd><span className="badge badge-accent">{formatTier(profile.currentTier)}</span></dd>
              </div>
              <div className="profile-detail-row">
                <dt>Điểm tích lũy</dt>
                <dd><strong style={{ color: 'var(--primary)' }}>{Number(profile.pointsBalance).toLocaleString('vi-VN')} điểm</strong></dd>
              </div>
              <div className="profile-detail-row">
                <dt>Chi tiêu 6 tháng</dt>
                <dd>{formatVnd(profile.rolling6MonthsSpendVnd)}</dd>
              </div>
              {tier?.nextTier && (
                <>
                  <div className="profile-detail-row">
                    <dt>Hạng tiếp theo</dt>
                    <dd><span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{formatTier(tier.nextTier)}</span></dd>
                  </div>
                  <div className="profile-detail-row">
                    <dt>Cần thêm</dt>
                    <dd style={{ color: 'var(--warning)', fontWeight: 600 }}>{formatVnd(tier.amountToNextTierVnd)}</dd>
                  </div>
                </>
              )}
            </dl>

            {/* Consent Flags */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 10 }}>Tuỳ chọn thông báo</div>
              {[
                'Nhận thông báo khuyến mãi qua email',
                'Nhận SMS cập nhật điểm thưởng',
                'Đồng ý cho phép phân tích dữ liệu cá nhân hoá',
              ].map((label, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: 'var(--gray-700)' }}>
                  <input type="checkbox" defaultChecked={i < 2} disabled style={{ accentColor: 'var(--primary)' }} />
                  {label}
                  <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>(chế độ demo)</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
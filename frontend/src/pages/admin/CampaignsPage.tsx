import { isDemoMode } from '../../utils/demo';
import { mockAdminCampaigns } from '../../mocks/admin';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import type { AdminCampaign } from '../../types/admin';
import type { CampaignStatus, CampaignType } from '../../types/common';
import { formatVnd, formatDate, formatCampaignType, formatCampaignStatus } from '../../utils/format';
import '../admin/AdminPages.css';

const STATUS_OPTIONS: CampaignStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'];
const TYPE_OPTIONS: CampaignType[] = ['WEEKLY_SPEND_COUPON', 'POINTS_BONUS', 'DISCOUNT', 'CASHBACK', 'OTHER'];

function StatusBadge({ status }: { status: CampaignStatus }) {
  const colors: Record<CampaignStatus, { bg: string; color: string }> = {
    ACTIVE: { bg: '#d1fae5', color: '#065f46' },
    DRAFT: { bg: '#f3f4f6', color: '#374151' },
    PAUSED: { bg: '#fef3c7', color: '#92400e' },
    ENDED: { bg: '#fee2e2', color: '#991b1b' },
  };
  const style = colors[status] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span className="badge" style={{ background: style.bg, color: style.color }}>
      {formatCampaignStatus(status)}
    </span>
  );
}

export default function AdminCampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setCampaigns(mockAdminCampaigns);
      setLoading(false);
      return;
    }
    setLoading(true);
    adminApi.getCampaigns({
      status: filterStatus || undefined,
      type: filterType || undefined,
      limit: 200,
    })
      .then(setCampaigns)
      .catch(() => setError('Không thể tải danh sách chiến dịch.'))
      .finally(() => setLoading(false));
  }, [filterStatus, filterType]);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>Chiến dịch</h2>
          <p>Quản lý tất cả chiến dịch loyalty</p>
        </div>
        <button id="create-campaign-btn" className="btn btn-primary" onClick={() => navigate('/admin/campaigns/create')}>
          + Tạo chiến dịch
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select className="form-input" style={{ width: 'auto', minWidth: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{formatCampaignStatus(s)}</option>)}
          </select>
          <select className="form-input" style={{ width: 'auto', minWidth: 160 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tất cả loại</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{formatCampaignType(t)}</option>)}
          </select>
          {(filterStatus || filterType) && (
            <button className="btn btn-outline btn-sm" onClick={() => { setFilterStatus(''); setFilterType(''); }}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {loading ? <div className="page-loading">Đang tải...</div> :
       error ? <div className="page-error">{error}</div> : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {campaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>Không có chiến dịch nào.</div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th>Phần thưởng</th>
                      <th>Thời gian</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td style={{ fontSize: 13 }}>{formatCampaignType(c.type)}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{formatVnd(c.rewardValue)}</td>
                        <td style={{ fontSize: 12, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                          {formatDate(c.startAt)} — {formatDate(c.endAt)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Link to={`/admin/campaigns/${c.id}`} className="btn btn-outline btn-sm">Xem</Link>
                            <Link to={`/admin/campaigns/${c.id}/edit`} className="btn btn-outline btn-sm">Sửa</Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
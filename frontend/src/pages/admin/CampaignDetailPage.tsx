import { isDemoMode } from '../../utils/demo';
import { mockAdminCampaigns } from '../../mocks/admin';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import type { AdminCampaign } from '../../types/admin';
import { formatVnd, formatDate, formatDateTime, formatCampaignType, formatCampaignStatus, formatTier } from '../../utils/format';
import './AdminPages.css';

export default function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<AdminCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!campaignId) return;
    if (isDemoMode()) {
      setCampaign(mockAdminCampaigns.find(c => c.id === campaignId) || mockAdminCampaigns[0]);
      setLoading(false);
      return;
    }
    adminApi.getCampaign(campaignId)
      .then(setCampaign)
      .catch(() => setError('Không thể tải thông tin chiến dịch.'))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!campaign) return null;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ marginBottom: 8 }}>
            <Link to="/admin/campaigns" style={{ color: 'var(--primary)', fontSize: 13 }}>← Danh sách chiến dịch</Link>
          </div>
          <h2>{campaign.name}</h2>
          <p>{formatCampaignStatus(campaign.status)} · {formatCampaignType(campaign.type)}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/admin/campaigns/${campaign.id}/edit`)}>
          Chỉnh sửa
        </button>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">Thông tin cơ bản</div>
          <div className="card-body">
            <dl className="profile-details">
              <div className="profile-detail-row"><dt>Tên</dt><dd>{campaign.name}</dd></div>
              <div className="profile-detail-row"><dt>Mô tả</dt><dd>{campaign.description || '—'}</dd></div>
              <div className="profile-detail-row"><dt>Loại</dt><dd>{formatCampaignType(campaign.type)}</dd></div>
              <div className="profile-detail-row">
                <dt>Trạng thái</dt>
                <dd><span className="badge badge-success">{formatCampaignStatus(campaign.status)}</span></dd>
              </div>
              <div className="profile-detail-row"><dt>Phần thưởng</dt><dd><strong>{formatVnd(campaign.rewardValue)}</strong></dd></div>
              {campaign.spendGoalVnd && (
                <div className="profile-detail-row"><dt>Mục tiêu chi tiêu</dt><dd>{formatVnd(campaign.spendGoalVnd)}</dd></div>
              )}
              {campaign.couponTitle && (
                <div className="profile-detail-row"><dt>Tiêu đề coupon</dt><dd>{campaign.couponTitle}</dd></div>
              )}
              {campaign.couponPrefix && (
                <div className="profile-detail-row"><dt>Prefix coupon</dt><dd><code>{campaign.couponPrefix}</code></dd></div>
              )}
              {campaign.maxRegistrations && (
                <div className="profile-detail-row"><dt>Giới hạn đăng ký</dt><dd>{campaign.maxRegistrations.toLocaleString('vi-VN')}</dd></div>
              )}
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Thời gian &amp; Đối tượng</div>
          <div className="card-body">
            <dl className="profile-details">
              <div className="profile-detail-row"><dt>Bắt đầu</dt><dd>{formatDate(campaign.startAt)}</dd></div>
              <div className="profile-detail-row"><dt>Kết thúc</dt><dd>{formatDate(campaign.endAt)}</dd></div>
              <div className="profile-detail-row">
                <dt>Hạng mục tiêu</dt>
                <dd>
                  {campaign.targetTiers.length ? campaign.targetTiers.map((t: string) => (
                    <span key={t} className="badge" style={{ marginRight: 4, background: '#ede9fe', color: '#7c3aed' }}>{formatTier(t)}</span>
                  )) : 'Tất cả hạng'}
                </dd>
              </div>
              {campaign.totalCouponClaims !== undefined && (
                <div className="profile-detail-row"><dt>Số coupon đã phát</dt><dd><strong>{campaign.totalCouponClaims}</strong></dd></div>
              )}
              <div className="profile-detail-row"><dt>Tạo lúc</dt><dd>{formatDateTime(campaign.createdAt)}</dd></div>
              <div className="profile-detail-row"><dt>Cập nhật</dt><dd>{formatDateTime(campaign.updatedAt)}</dd></div>
              <div className="profile-detail-row"><dt>ID</dt><dd><code style={{ fontSize: 12 }}>{campaign.id}</code></dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

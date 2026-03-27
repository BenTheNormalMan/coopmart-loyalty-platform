import { isDemoMode } from '../../utils/demo';
import { mockCustomerCampaigns } from '../../mocks/customer';
import { useEffect, useState, useCallback } from 'react';
import { customerApi } from '../../api/customer.api';
import type { CustomerCampaign } from '../../types/customer';
import { formatVnd, formatTier, formatDate, formatCampaignType, formatCampaignStatus } from '../../utils/format';
import { getErrorMessage } from '../../api/client';
import './CustomerPages.css';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CustomerCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCampaigns = useCallback(() => {
    if (isDemoMode()) {
      setCampaigns(mockCustomerCampaigns);
      setLoading(false);
      return;
    }
    setLoading(true);
    customerApi.getCampaigns()
      .then(setCampaigns)
      .catch(() => setError('Không thể tải chiến dịch. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;

  const active = campaigns.filter(c => c.status === 'ACTIVE');
  const other = campaigns.filter(c => c.status !== 'ACTIVE');

  return (
    <div>
      <div className="page-header">
        <h2>Chiến dịch ưu đãi</h2>
        <p>Tham gia chiến dịch để nhận phần thưởng hấp dẫn</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 40 }}>
            Không có chiến dịch nào hiện tại.
          </div>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--gray-700)' }}>Đang diễn ra ({active.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {active.map(c => (
                  <CampaignCard key={c.id} campaign={c} onRefresh={fetchCampaigns} />
                ))}
              </div>
            </div>
          )}
          {other.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--gray-500)' }}>Chiến dịch khác</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {other.map(c => (
                  <CampaignCard key={c.id} campaign={c} onRefresh={fetchCampaigns} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CampaignCard({ campaign: c, onRefresh }: { campaign: CustomerCampaign; onRefresh: () => void }) {
  const [registering, setRegistering] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [actionError, setActionError] = useState('');
  const [claimedCode, setClaimedCode] = useState<string | null>(c.claimedCouponCode);
  const [copied, setCopied] = useState(false);

  const handleRegister = async () => {
    setRegistering(true);
    setActionError('');
    try {
      await customerApi.registerCampaign(c.id);
      onRefresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setRegistering(false);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    setActionError('');
    try {
      const result = await customerApi.claimCoupon(c.id);
      setClaimedCode(result.couponCode);
      onRefresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setClaiming(false);
    }
  };

  const handleCopy = () => {
    if (!claimedCode) return;
    navigator.clipboard.writeText(claimedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card campaign-card">
      <div className="card-body">
        <div className="campaign-header-row">
          <div>
            <div className="campaign-title">{c.name}</div>
            <div className="campaign-meta-row">
              <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{formatCampaignType(c.type)}</span>
              <span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : ''}`} style={c.status !== 'ACTIVE' ? { background: 'var(--gray-100)', color: 'var(--gray-500)' } : {}}>
                {formatCampaignStatus(c.status)}
              </span>
              {c.targetTiers.length > 0 && c.targetTiers.map((t: string) => (
                <span key={t} className="badge" style={{ background: '#ede9fe', color: '#7c3aed', fontSize: 11 }}>{formatTier(t)}</span>
              ))}
            </div>
          </div>
          <div className="campaign-reward">
            <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>Phần thưởng</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{formatVnd(c.rewardValue)}</span>
          </div>
        </div>

        {c.description && <p className="campaign-desc">{c.description}</p>}
        {c.campaignStory && <p className="campaign-desc" style={{ fontStyle: 'italic', color: 'var(--gray-500)' }}>{c.campaignStory}</p>}

        <div className="campaign-details-row">
          {c.spendGoalVnd && (
            <span>Mục tiêu: <strong>{formatVnd(c.spendGoalVnd)}</strong></span>
          )}
          <span>Từ: {formatDate(c.startAt)} — {formatDate(c.endAt)}</span>
        </div>

        {/* Progress for WEEKLY_SPEND_COUPON */}
        {c.type === 'WEEKLY_SPEND_COUPON' && c.spendGoalVnd && c.currentWeekSpendVnd && (
          <div style={{ marginBottom: 12 }}>
            <div className="progress-info" style={{ marginBottom: 4 }}>
              <span>Chi tiêu tuần: {formatVnd(c.currentWeekSpendVnd)} / {formatVnd(c.spendGoalVnd)}</span>
              <span className="progress-pct">
                {Math.min(100, Math.round((Number(c.currentWeekSpendVnd) / Number(c.spendGoalVnd)) * 100))}%
              </span>
            </div>
            <div className="progress-bar-bg" style={{ height: 6 }}>
              <div className="progress-bar-fill" style={{
                width: `${Math.min(100, Math.round((Number(c.currentWeekSpendVnd) / Number(c.spendGoalVnd)) * 100))}%`,
                background: c.qualifiesForCoupon ? 'var(--success)' : 'var(--primary)'
              }} />
            </div>
          </div>
        )}

        {actionError && <div className="campaign-action-error">{actionError}</div>}

        {/* Claimed state */}
        {claimedCode ? (
          <div className="campaign-claimed-box">
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>Đã nhận coupon!</span>
            <div className="coupon-code-row" style={{ marginTop: 6 }}>
              <code className="coupon-code">{claimedCode}</code>
              <button className="btn btn-outline btn-sm" onClick={handleCopy}>
                {copied ? 'Đã sao chép!' : 'Sao chép'}
              </button>
            </div>
          </div>
        ) : (
          <div className="campaign-actions">
            {!c.isRegistered && c.status === 'ACTIVE' && (
              <button
                id={`register-btn-${c.id}`}
                className="btn btn-primary btn-sm"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'Đang đăng ký...' : 'Đăng ký tham gia'}
              </button>
            )}
            {c.isRegistered && c.qualifiesForCoupon && !claimedCode && (
              <button
                id={`claim-btn-${c.id}`}
                className="btn btn-accent btn-sm"
                onClick={handleClaim}
                disabled={claiming}
              >
                {claiming ? 'Đang nhận...' : 'Nhận coupon'}
              </button>
            )}
            {c.isRegistered && !c.qualifiesForCoupon && !claimedCode && (
              <span className="badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}>Đã đăng ký — chưa đủ điều kiện</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

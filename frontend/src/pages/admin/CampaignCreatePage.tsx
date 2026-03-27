import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import type { CampaignType, CampaignStatus, TierName } from '../../types/common';
import { getErrorMessage } from '../../api/client';
import { formatCampaignType, formatCampaignStatus, formatTier } from '../../utils/format';
import './AdminPages.css';

const TYPE_OPTIONS: CampaignType[] = ['WEEKLY_SPEND_COUPON', 'POINTS_BONUS', 'DISCOUNT', 'CASHBACK', 'OTHER'];
const STATUS_OPTIONS: CampaignStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'];
const TIER_OPTIONS: TierName[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

export default function CampaignCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'WEEKLY_SPEND_COUPON' as CampaignType,
    status: 'DRAFT' as CampaignStatus,
    rewardValue: '',
    spendGoalVnd: '',
    couponTitle: '',
    couponPrefix: '',
    startAt: '',
    endAt: '',
    maxRegistrations: '',
    targetTiers: [] as TierName[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTierToggle = (tier: TierName) => {
    setForm(prev => ({
      ...prev,
      targetTiers: prev.targetTiers.includes(tier)
        ? prev.targetTiers.filter(t => t !== tier)
        : [...prev.targetTiers, tier],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.rewardValue || !form.startAt || !form.endAt) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = {
        name: form.name,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        rewardValue: form.rewardValue,
        description: form.description || undefined,
        type: form.type,
        status: form.status,
        spendGoalVnd: form.spendGoalVnd || undefined,
        couponTitle: form.couponTitle || undefined,
        couponPrefix: form.couponPrefix || undefined,
        targetTiers: form.targetTiers.length ? form.targetTiers : undefined,
        maxRegistrations: form.maxRegistrations ? Number(form.maxRegistrations) : undefined,
      };
      const created = await adminApi.createCampaign(body);
      navigate(`/admin/campaigns/${created.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ marginBottom: 8 }}>
          <Link to="/admin/campaigns" style={{ color: 'var(--primary)', fontSize: 13 }}>← Danh sách chiến dịch</Link>
        </div>
        <h2>Tạo chiến dịch mới</h2>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="content-grid">
          <div className="card">
            <div className="card-header">Thông tin cơ bản</div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tên chiến dịch *</label>
                <input name="name" type="text" className="form-input" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Loại</label>
                  <select name="type" className="form-input" value={form.type} onChange={handleChange}>
                    {TYPE_OPTIONS.map(t => <option key={t} value={t}>{formatCampaignType(t)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Trạng thái</label>
                  <select name="status" className="form-input" value={form.status} onChange={handleChange}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{formatCampaignStatus(s)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phần thưởng (VND) *</label>
                  <input name="rewardValue" type="number" min="0" className="form-input" value={form.rewardValue} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Mục tiêu chi tiêu (VND)</label>
                  <input name="spendGoalVnd" type="number" min="0" className="form-input" value={form.spendGoalVnd} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Coupon &amp; Đối tượng</div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tiêu đề coupon</label>
                <input name="couponTitle" type="text" className="form-input" value={form.couponTitle} onChange={handleChange} />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Prefix coupon</label>
                  <input name="couponPrefix" type="text" className="form-input" value={form.couponPrefix} onChange={handleChange} placeholder="COOP-" />
                </div>
                <div className="form-group">
                  <label className="form-label">Giới hạn đăng ký</label>
                  <input name="maxRegistrations" type="number" min="0" className="form-input" value={form.maxRegistrations} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hạng mục tiêu (để trống = tất cả)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {TIER_OPTIONS.map(t => (
                    <label key={t} className="checkbox-label" style={{ background: form.targetTiers.includes(t) ? 'var(--primary-light)' : 'var(--gray-50)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--gray-200)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.targetTiers.includes(t)} onChange={() => handleTierToggle(t)} style={{ marginRight: 6 }} />
                      {formatTier(t)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Ngày bắt đầu *</label>
                  <input name="startAt" type="datetime-local" className="form-input" value={form.startAt} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày kết thúc *</label>
                  <input name="endAt" type="datetime-local" className="form-input" value={form.endAt} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button id="create-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo chiến dịch'}
          </button>
          <Link to="/admin/campaigns" className="btn btn-outline">Hủy</Link>
        </div>
      </form>
    </div>
  );
}

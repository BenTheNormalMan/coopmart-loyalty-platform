import { mockOffers, type CustomerOffer } from '../../mocks/offers';
import { mockCustomerProfile } from '../../mocks/customer';
import { isDemoMode } from '../../utils/demo';

const STATUS_LABELS: Record<string, string> = { ACTIVE: 'Đang diễn ra', ENDED: 'Đã kết thúc', UPCOMING: 'Sắp mở' };
const STATUS_BADGE: Record<string, string> = { ACTIVE: 'badge-success', ENDED: 'badge-gray', UPCOMING: 'badge-warning' };
const ASSIGNED_BADGE: Record<string, { label: string; cls: string }> = {
  AVAILABLE: { label: 'Khả dụng', cls: 'badge-primary' },
  REGISTERED: { label: 'Đã đăng ký', cls: 'badge-warning' },
  CLAIMED: { label: 'Đã nhận thưởng', cls: 'badge-success' },
};

const TIER_LABELS: Record<string, string> = { BRONZE: 'Đồng', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch Kim' };

function OfferCard({ offer }: { offer: CustomerOffer }) {
  const ab = ASSIGNED_BADGE[offer.assignedState];
  const daysLeft = Math.ceil((new Date(offer.endAt).getTime() - Date.now()) / 86400000);
  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, opacity: offer.status === 'ENDED' ? 0.65 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', flex: 1 }}>{offer.name}</h3>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span className={`badge ${STATUS_BADGE[offer.status]}`}>{STATUS_LABELS[offer.status]}</span>
          <span className={`badge ${ab.cls}`}>{ab.label}</span>
        </div>
      </div>

      <p style={{ color: 'var(--gray-500)', fontSize: 13, lineHeight: 1.6 }}>{offer.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {offer.targetTiers.map(tier => (
          <span key={tier} style={{ padding: '3px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-600)' }}>
            {TIER_LABELS[tier] ?? tier}
          </span>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 13 }}>
          <strong style={{ color: 'var(--primary)' }}>Phần thưởng:</strong>
          <span style={{ color: 'var(--gray-700)', marginLeft: 6 }}>{offer.rewardSummary}</span>
        </div>
        {offer.status === 'ACTIVE' && daysLeft > 0 && (
          <span style={{ fontSize: 12, color: daysLeft <= 3 ? 'var(--danger)' : 'var(--gray-400)' }}>
            Còn {daysLeft} ngày
          </span>
        )}
      </div>

      {offer.assignedState === 'CLAIMED' && offer.claimedCouponCode && (
        <div style={{ background: 'var(--success-light)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>Mã coupon của bạn:</span>
          <code style={{ background: 'white', padding: '4px 10px', borderRadius: 6, fontWeight: 700, color: 'var(--gray-900)', fontSize: 13, letterSpacing: 1 }}>
            {offer.claimedCouponCode}
          </code>
        </div>
      )}
    </div>
  );
}

export default function OffersPage() {
  const profile = isDemoMode() ? mockCustomerProfile : null;
  const currentTier = profile?.currentTier ?? 'BRONZE';
  const offers = mockOffers;
  const available = offers.filter(o => o.status === 'ACTIVE' && o.targetTiers.includes(currentTier as never));
  const all = offers.filter(o => o.status === 'ENDED' || !o.targetTiers.includes(currentTier as never));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Ưu đãi dành cho bạn</h1>
        <p style={{ color: 'var(--gray-500)' }}>Các ưu đãi và chiến dịch được phân bổ dựa trên hạng thành viên và lịch sử chi tiêu của bạn.</p>
      </div>

      {available.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: 16 }}>
            🎁 Ưu đãi phù hợp với hạng <strong>{TIER_LABELS[currentTier]}</strong> của bạn ({available.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {available.map(o => <OfferCard key={o.id} offer={o} />)}
          </div>
        </div>
      )}

      {all.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: 16 }}>
            Ưu đãi khác & Đã kết thúc ({all.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {all.map(o => <OfferCard key={o.id} offer={o} />)}
          </div>
        </div>
      )}
    </div>
  );
}

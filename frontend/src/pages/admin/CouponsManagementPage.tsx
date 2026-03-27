import { mockCustomerCoupons } from '../../mocks/customer';
import { isDemoMode } from '../../utils/demo';

export default function CouponsManagementPage() {
  const coupons = isDemoMode() ? mockCustomerCoupons : [];
  const allMockCoupons = [
    ...coupons,
    { id: 'adm-coup-1', couponCode: 'PLAT-VIP-XX1', campaignId: 'camp-p1', campaignName: 'Ưu đãi Bạch Kim', couponTitle: 'VOUCHER VIP', claimedAt: new Date(Date.now() - 86400000 * 5).toISOString(), campaignStatus: 'ACTIVE' as const, campaignEndAt: new Date(Date.now() + 86400000 * 20).toISOString(), isCampaignExpired: false },
    { id: 'adm-coup-2', couponCode: 'COOP30Y-X7B9K', campaignId: 'camp-2', campaignName: 'Sinh nhật Co.opmart 30 Năm', couponTitle: 'SINH NHẬT VÀNG', claimedAt: new Date(Date.now() - 86400000 * 2).toISOString(), campaignStatus: 'ACTIVE' as const, campaignEndAt: new Date(Date.now() + 86400000 * 14).toISOString(), isCampaignExpired: false },
    { id: 'adm-coup-3', couponCode: 'WELCOME-BRONZE', campaignId: 'camp-0', campaignName: 'Quà tặng thành viên mới', couponTitle: 'WELCOME 20K', claimedAt: new Date(Date.now() - 86400000 * 15).toISOString(), campaignStatus: 'ENDED' as const, campaignEndAt: new Date(Date.now() - 86400000).toISOString(), isCampaignExpired: true },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Quản lý Coupon</h1>
          <p style={{ color: 'var(--gray-500)' }}>Danh sách coupon đã được phát hành trong hệ thống.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-success" style={{ fontSize: 13, padding: '6px 14px' }}>Đang hoạt động: {allMockCoupons.filter(c => !c.isCampaignExpired).length}</span>
          <span className="badge badge-gray" style={{ fontSize: 13, padding: '6px 14px' }}>Hết hạn: {allMockCoupons.filter(c => c.isCampaignExpired).length}</span>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Coupon</th>
                <th>Chiến dịch</th>
                <th>Tiêu đề</th>
                <th>Ngày nhận</th>
                <th>Hết hạn chiến dịch</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {allMockCoupons.map(c => (
                <tr key={c.id}>
                  <td>
                    <code style={{ background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 4, fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>{c.couponCode}</code>
                  </td>
                  <td style={{ color: 'var(--gray-700)', fontSize: 13 }}>{c.campaignName}</td>
                  <td style={{ fontSize: 13 }}>{c.couponTitle}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{new Date(c.claimedAt).toLocaleDateString('vi-VN')}</td>
                  <td style={{ color: c.isCampaignExpired ? 'var(--danger)' : 'var(--gray-500)', fontSize: 12 }}>{new Date(c.campaignEndAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${c.isCampaignExpired ? 'badge-gray' : 'badge-success'}`}>{c.isCampaignExpired ? 'Hết hạn' : 'Còn hiệu lực'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

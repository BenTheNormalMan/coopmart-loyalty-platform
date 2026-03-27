export interface TierRule {
  tierName: string;
  minSpend: number;
  maxSpend: number | null;
  earnRate: number;
  description: string;
  color: string;
  gradient: string;
}

export const mockTierRules: TierRule[] = [
  { tierName: 'Đồng', minSpend: 0, maxSpend: 3000000, earnRate: 1, description: 'Tích 1 điểm mỗi 1,000đ chi tiêu. Ưu đãi sản phẩm thành viên tại quầy.', color: '#d32029', gradient: 'linear-gradient(135deg, #d32029, #a81a21)' },
  { tierName: 'Bạc', minSpend: 3000000, maxSpend: 10000000, earnRate: 1.5, description: 'Tích 1.5 điểm / 1,000đ. Ưu đãi sinh nhật và sự kiện theo quý.', color: '#9ca3af', gradient: 'linear-gradient(135deg, #c7c8cc, #9ca3af)' },
  { tierName: 'Vàng', minSpend: 10000000, maxSpend: 30000000, earnRate: 2, description: 'Tích 2 điểm / 1,000đ. Hỗ trợ ưu tiên, quà tặng đặc biệt ngày lễ.', color: '#daa520', gradient: 'linear-gradient(135deg, #f7ba0b, #daa520)' },
  { tierName: 'Bạch Kim', minSpend: 30000000, maxSpend: null, earnRate: 3, description: 'Tích 3 điểm / 1,000đ. Đặc quyền VIP, dịch vụ cá nhân hoá, voucher độc quyền.', color: '#795d2c', gradient: 'linear-gradient(135deg, #a48139, #795d2c)' },
];

export const mockEarnRules = [
  { id: 'earn-1', name: 'Tích điểm tiêu chuẩn', description: 'Mỗi 1,000đ chi tiêu tại hệ thống POS Co.opmart = 1 điểm thưởng.', multiplier: 1, isActive: true },
  { id: 'earn-2', name: 'Tích điểm coop.online', description: 'Mỗi 1,000đ chi tiêu trên coop.online = 1 điểm thưởng.', multiplier: 1, isActive: true },
  { id: 'earn-3', name: 'Tích điểm double ngày cuối tuần', description: 'Nhân đôi điểm tích vào thứ 7, Chủ nhật cho hạng Vàng và Bạch Kim.', multiplier: 2, isActive: false },
];

export const mockRedeemRules = [
  { id: 'rdm-1', name: 'Quy đổi voucher 50k', description: 'Đổi 5,000 điểm → Voucher mua sắm 50,000đ.', pointsRequired: 5000, isActive: true },
  { id: 'rdm-2', name: 'Quy đổi voucher 100k', description: 'Đổi 9,500 điểm → Voucher mua sắm 100,000đ.', pointsRequired: 9500, isActive: true },
];

export const mockExpiryPolicy = {
  description: 'Điểm tích lũy sẽ hết hạn sau 12 tháng kể từ ngày giao dịch được ghi nhận.',
  expiresAfterMonths: 12,
  warningBeforeDays: 30,
};

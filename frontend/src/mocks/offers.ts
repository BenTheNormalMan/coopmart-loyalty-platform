import type { TierName } from '../types/common';

export interface CustomerOffer {
  id: string;
  name: string;
  description: string;
  rewardSummary: string;
  targetTiers: TierName[];
  startAt: string;
  endAt: string;
  status: 'ACTIVE' | 'ENDED' | 'UPCOMING';
  assignedState: 'AVAILABLE' | 'REGISTERED' | 'CLAIMED';
  claimedCouponCode: string | null;
}

export const mockOffers: CustomerOffer[] = [
  {
    id: 'offer-1', name: 'Ưu đãi đặc biệt tháng 3 – Hạng Bạc & Vàng',
    description: 'Chi tiêu 1.000.000đ trong tuần để nhận Coupon 50k dành riêng cho Hạng Bạc và Vàng.',
    rewardSummary: 'Coupon 50,000đ',
    targetTiers: ['SILVER', 'GOLD'],
    startAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    endAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'ACTIVE', assignedState: 'AVAILABLE', claimedCouponCode: null,
  },
  {
    id: 'offer-2', name: 'Quà sinh nhật Co.opmart 30 Năm',
    description: 'Đăng ký nhận Mã giảm 100K cho hóa đơn từ 500K. Ưu đãi dành riêng cho Hạng Bạc và Vàng.',
    rewardSummary: 'Voucher 100,000đ',
    targetTiers: ['SILVER', 'GOLD'],
    startAt: new Date(Date.now() - 86400000).toISOString(),
    endAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: 'ACTIVE', assignedState: 'CLAIMED', claimedCouponCode: 'COOP30Y-X7B9K',
  },
  {
    id: 'offer-3', name: 'Đặc quyền Bạch Kim – Voucher 200K độc quyền',
    description: 'Dành riêng cho khách hàng Bạch Kim, đổi điểm lấy Voucher cao cấp trị giá 200K.',
    rewardSummary: 'Voucher 200,000đ',
    targetTiers: ['PLATINUM'],
    startAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    endAt: new Date(Date.now() + 86400000 * 20).toISOString(),
    status: 'ACTIVE', assignedState: 'AVAILABLE', claimedCouponCode: null,
  },
  {
    id: 'offer-4', name: 'Chào hè rực rỡ – Cashback 20K',
    description: 'Chiến dịch cashback hè đã kết thúc vào tháng 6.',
    rewardSummary: 'Cashback 20,000đ',
    targetTiers: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    startAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    endAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    status: 'ENDED', assignedState: 'AVAILABLE', claimedCouponCode: null,
  },
];

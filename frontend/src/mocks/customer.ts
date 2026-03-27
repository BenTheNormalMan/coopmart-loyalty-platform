import type { CustomerProfile, CustomerTier, CustomerTransaction, CustomerCampaign, CustomerCoupon } from '../types/customer';

export const mockCustomerProfile: CustomerProfile = {
  id: 'c-demo-123',
  email: 'khachhang@demo.com',
  fullName: 'Khách Hàng Trải Nghiệm',
  phone: '0901234567',
  pointsBalance: '15400',
  currentTier: 'SILVER',
  rolling6MonthsSpendVnd: '4500000',
  joinedAt: new Date().toISOString()
};

export const mockCustomerTier: CustomerTier = {
  customerId: 'c-demo-123',
  rolling6MonthsSpendVnd: '4500000',
  currentTier: 'SILVER',
  nextTier: 'GOLD',
  amountToNextTierVnd: '1000000'
};

export const mockCustomerTransactions: CustomerTransaction[] = [
  { id: 'tx-1', externalOrderId: 'ORD123', amountVnd: '1250000', pointsAwarded: '2500',  sourceSystem: 'POS_DISTRICT_1', checkoutAt: new Date(Date.now() - 86400000).toISOString(), processedAt: new Date(Date.now() - 86400000).toISOString(), previousTier: null, newTier: null, tierChanged: false },
  { id: 'tx-2', externalOrderId: 'ORD124', amountVnd: '320000', pointsAwarded: '640',  sourceSystem: 'COOP_ONLINE', checkoutAt: new Date(Date.now() - 86400000 * 3).toISOString(), processedAt: new Date(Date.now() - 86400000 * 3).toISOString(), previousTier: null, newTier: null, tierChanged: false },
  { id: 'tx-3', externalOrderId: 'ORD125', amountVnd: '2800000', pointsAwarded: '5600',  sourceSystem: 'POS_DISTRICT_7', checkoutAt: new Date(Date.now() - 86400000 * 12).toISOString(), processedAt: new Date(Date.now() - 86400000 * 12).toISOString(), previousTier: 'BRONZE', newTier: 'SILVER', tierChanged: true },
];

export const mockCustomerCampaigns: CustomerCampaign[] = [
  {
    id: 'camp-1', name: 'Thử thách chi tiêu tuần 3 Tháng 10', description: 'Chi tiêu từ 1.000.000đ trong tuần để nhận ngay Coupon 50k!',
    type: 'WEEKLY_SPEND_COUPON', status: 'ACTIVE', rewardValue: '50000', spendGoalVnd: '1000000', startAt: new Date().toISOString(), endAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    targetTiers: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'], isRegistered: false, qualifiesForCoupon: false,
    currentWeekSpendVnd: '350000', couponTitle: 'VOUCHER 50K TỪ THỬ THÁCH', claimedCouponCode: null, claimedAt: null, campaignStory: null
  },
  {
    id: 'camp-2', name: 'Đại tiệc sinh nhật Co.opmart', description: 'Đăng ký nhận mã giảm 100K áp dụng cho hóa đơn 500k',
    type: 'DISCOUNT', status: 'ACTIVE', rewardValue: '100000', spendGoalVnd: '500000', startAt: new Date(Date.now() - 86400000).toISOString(), endAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    targetTiers: ['SILVER', 'GOLD'], isRegistered: true, qualifiesForCoupon: true, claimedCouponCode: 'COOP30Y-X7B9K',
    currentWeekSpendVnd: null, couponTitle: 'SINH NHẬT VÀNG', claimedAt: new Date().toISOString(), campaignStory: 'Nhân dịp kỉ niệm 30 năm thành lập'
  }
];

export const mockCustomerCoupons: CustomerCoupon[] = [
  { id: 'coup-1', couponCode: 'COOP30Y-X7B9K', campaignId: 'camp-2', campaignName: 'Đại tiệc sinh nhật Co.opmart', couponTitle: 'SINH NHẬT VÀNG', claimedAt: new Date().toISOString(), campaignStatus: 'ACTIVE', campaignEndAt: new Date(Date.now() + 86400000 * 14).toISOString(), isCampaignExpired: false },
  { id: 'coup-2', couponCode: 'WELCOME-BRONZE', campaignId: 'camp-0', campaignName: 'Quà tặng thành viên mới', couponTitle: 'WELCOME 20K', claimedAt: new Date(Date.now() - 86400000 * 15).toISOString(), campaignStatus: 'ENDED', campaignEndAt: new Date(Date.now() - 86400000).toISOString(), isCampaignExpired: true  }
];

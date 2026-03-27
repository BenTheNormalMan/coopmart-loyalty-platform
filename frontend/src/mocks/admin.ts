import type { AdminCampaign } from '../types/admin';
import type { AuditLog } from '../types/common';

export const mockAdminStats = {
  totalCustomers: 42103,
  activeCampaigns: 5,
  totalCouponsClaimed: 8402,
  totalPointsIssued: 1540300
};

export const mockAdminCampaigns: AdminCampaign[] = [
  {
    id: 'camp-1', name: 'Thử thách chi tiêu tuần 3 Tháng 10', description: 'Chi tiêu từ 1.000.000đ trong tuần để nhận ngay Coupon 50k!',
    type: 'WEEKLY_SPEND_COUPON', status: 'ACTIVE', rewardValue: '50000', spendGoalVnd: '1000000',
    couponTitle: 'VOUCHER 50K TỪ THỬ THÁCH', couponPrefix: 'T3',
    maxRegistrations: null, totalCouponClaims: 1520,
    startAt: new Date().toISOString(), endAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), targetTiers: []
  },
  {
    id: 'camp-2', name: 'Đại tiệc sinh nhật Co.opmart 30 Năm', description: 'Đăng ký nhận mã giảm 100K áp dụng cho hóa đơn 500k',
    type: 'DISCOUNT', status: 'ACTIVE', rewardValue: '100000', spendGoalVnd: '500000',
    couponTitle: 'SINH NHẬT VÀNG', couponPrefix: 'COOP30Y',
    maxRegistrations: 10000, totalCouponClaims: 6882,
    startAt: new Date(Date.now() - 86400000).toISOString(), endAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(), targetTiers: ['SILVER', 'GOLD']
  },
  {
    id: 'camp-3', name: 'Chào hè rực rỡ', description: 'Đã kết thúc',
    type: 'CASHBACK', status: 'ENDED', rewardValue: '20000', spendGoalVnd: null,
    couponTitle: 'CASHBACK HÈ', couponPrefix: 'HE',
    maxRegistrations: null, totalCouponClaims: 45000,
    startAt: new Date(Date.now() - 86400000 * 90).toISOString(), endAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 100).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 60).toISOString(), targetTiers: ['PLATINUM']
  }
];

export const mockAdminAuditLogs: AuditLog[] = [
  { id: 'log-1', entityType: 'CAMPAIGN', entityId: 'camp-1', actorType: 'ADMIN', actorId: 'admin-1', action: 'CREATE', changes: null, createdAt: new Date().toISOString() },
  { id: 'log-2', entityType: 'CAMPAIGN', entityId: 'camp-3', actorType: 'SYSTEM', actorId: 'CRON', action: 'STATUS_UPDATE_ENDED', changes: { old: 'ACTIVE', new: 'ENDED' }, createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
  { id: 'log-3', entityType: 'CUSTOMER_TIER', entityId: 'c-demo-123', actorType: 'SYSTEM', actorId: 'CRON', action: 'TIER_UPGRADE', changes: { old: 'BRONZE', new: 'SILVER' }, createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
];

export const mockAdminCoupons = [
  { id: 'adm-coup-1', couponCode: 'PLAT-VIP-XX1', campaignId: 'camp-p1', campaignName: 'Ưu đãi Bạch Kim', couponTitle: 'VOUCHER VIP', claimedAt: new Date(Date.now() - 86400000 * 5).toISOString(), campaignStatus: 'ACTIVE' as const, campaignEndAt: new Date(Date.now() + 86400000 * 20).toISOString(), isCampaignExpired: false },
  { id: 'adm-coup-2', couponCode: 'COOP30Y-X7B9K', campaignId: 'camp-2', campaignName: 'Sinh nhật Co.opmart 30 Năm', couponTitle: 'SINH NHẬT VÀNG', claimedAt: new Date(Date.now() - 86400000 * 2).toISOString(), campaignStatus: 'ACTIVE' as const, campaignEndAt: new Date(Date.now() + 86400000 * 14).toISOString(), isCampaignExpired: false },
  { id: 'adm-coup-3', couponCode: 'WELCOME-BRONZE', campaignId: 'camp-0', campaignName: 'Quà tặng thành viên mới', couponTitle: 'WELCOME 20K', claimedAt: new Date(Date.now() - 86400000 * 15).toISOString(), campaignStatus: 'ENDED' as const, campaignEndAt: new Date(Date.now() - 86400000).toISOString(), isCampaignExpired: true },
];

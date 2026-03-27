import type { TierName } from '../types/common';

export interface MemberRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentTier: TierName;
  pointsBalance: number;
  rolling6MonthsSpendVnd: number;
  joinedAt: string;
}

export interface MemberDetail extends MemberRow {
  recentTransactions: { id: string; amountVnd: number; pointsAwarded: number; checkoutAt: string; sourceSystem: string }[];
  coupons: { couponCode: string; campaignName: string; claimedAt: string; isCampaignExpired: boolean }[];
}

export const mockMembers: MemberRow[] = [
  { id: 'm-001', fullName: 'Nguyễn Văn An', email: 'nguyenvanan@gmail.com', phone: '0901111111', currentTier: 'PLATINUM', pointsBalance: 85000, rolling6MonthsSpendVnd: 25000000, joinedAt: '2021-03-10T00:00:00Z' },
  { id: 'm-002', fullName: 'Trần Thị Bích', email: 'tranthibich@email.com', phone: '0902222222', currentTier: 'GOLD', pointsBalance: 32000, rolling6MonthsSpendVnd: 10500000, joinedAt: '2022-06-15T00:00:00Z' },
  { id: 'm-003', fullName: 'Lê Hoàng Cường', email: 'lehoangcuong@yahoo.com', phone: '0903333333', currentTier: 'SILVER', pointsBalance: 15400, rolling6MonthsSpendVnd: 4500000, joinedAt: '2023-01-20T00:00:00Z' },
  { id: 'm-004', fullName: 'Phạm Minh Đức', email: 'phamminhdc@gmail.com', phone: '0904444444', currentTier: 'BRONZE', pointsBalance: 4200, rolling6MonthsSpendVnd: 1200000, joinedAt: '2024-02-05T00:00:00Z' },
  { id: 'm-005', fullName: 'Hoàng Thị Hoa', email: 'hoangthihoa@email.com', phone: '0905555555', currentTier: 'BRONZE', pointsBalance: 1800, rolling6MonthsSpendVnd: 550000, joinedAt: '2024-08-12T00:00:00Z' },
  { id: 'm-006', fullName: 'Ngô Văn Khánh', email: 'ngovankhanh@gmail.com', phone: '0906666666', currentTier: 'GOLD', pointsBalance: 41000, rolling6MonthsSpendVnd: 13200000, joinedAt: '2022-11-30T00:00:00Z' },
  { id: 'm-007', fullName: 'Vũ Thị Lan', email: 'vuthilan@email.com', phone: '0907777777', currentTier: 'SILVER', pointsBalance: 9800, rolling6MonthsSpendVnd: 3100000, joinedAt: '2023-09-18T00:00:00Z' },
  { id: 'm-008', fullName: 'Đinh Văn Mạnh', email: 'dinhvanmanh@gmail.com', phone: '0908888888', currentTier: 'PLATINUM', pointsBalance: 120000, rolling6MonthsSpendVnd: 38000000, joinedAt: '2020-05-25T00:00:00Z' },
];

export const mockMemberDetails: Record<string, MemberDetail> = {
  'm-001': {
    ...mockMembers[0],
    recentTransactions: [
      { id: 'tx-a1', amountVnd: 3500000, pointsAwarded: 7000, checkoutAt: new Date(Date.now() - 86400000 * 2).toISOString(), sourceSystem: 'POS_DISTRICT_1' },
      { id: 'tx-a2', amountVnd: 1200000, pointsAwarded: 2400, checkoutAt: new Date(Date.now() - 86400000 * 10).toISOString(), sourceSystem: 'COOP_ONLINE' },
    ],
    coupons: [
      { couponCode: 'PLAT-VIP-XX1', campaignName: 'Ưu đãi Bạch Kim', claimedAt: new Date(Date.now() - 86400000 * 5).toISOString(), isCampaignExpired: false },
    ],
  },
  'm-003': {
    ...mockMembers[2],
    recentTransactions: [
      { id: 'tx-c1', amountVnd: 1250000, pointsAwarded: 2500, checkoutAt: new Date(Date.now() - 86400000).toISOString(), sourceSystem: 'POS_DISTRICT_1' },
      { id: 'tx-c2', amountVnd: 320000, pointsAwarded: 640, checkoutAt: new Date(Date.now() - 86400000 * 3).toISOString(), sourceSystem: 'COOP_ONLINE' },
    ],
    coupons: [
      { couponCode: 'COOP30Y-X7B9K', campaignName: 'Đại tiệc sinh nhật Co.opmart', claimedAt: new Date().toISOString(), isCampaignExpired: false },
    ],
  },
};

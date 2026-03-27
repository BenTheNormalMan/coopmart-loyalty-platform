import type { TierName, CampaignType, CampaignStatus } from './common';

export interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  /** bigint as string */
  pointsBalance: string;
  currentTier: TierName;
  /** bigint as string */
  rolling6MonthsSpendVnd: string;
  joinedAt: string;
}

export interface CustomerTier {
  customerId: string;
  /** bigint as string */
  rolling6MonthsSpendVnd: string;
  currentTier: TierName;
  nextTier: TierName | null;
  /** bigint as string */
  amountToNextTierVnd: string | null;
}

export interface CustomerCampaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  /** bigint as string */
  rewardValue: string;
  /** bigint as string */
  spendGoalVnd: string | null;
  /** bigint as string */
  currentWeekSpendVnd: string | null;
  qualifiesForCoupon: boolean;
  couponTitle: string | null;
  startAt: string;
  endAt: string;
  status: CampaignStatus;
  targetTiers: TierName[];
  isRegistered: boolean;
  claimedCouponCode: string | null;
  claimedAt: string | null;
  campaignStory: string | null;
}

export interface CampaignRegisterResponse {
  campaignId: string;
  customerId: string;
  registrationId: string;
  registeredAt: string;
}

export interface ClaimCouponResponse {
  campaignId: string;
  couponCode: string;
  claimedAt: string;
  couponTitle: string | null;
  alreadyClaimed: boolean;
}

export interface CustomerTransaction {
  id: string;
  externalOrderId: string;
  sourceSystem: string;
  /** bigint as string */
  amountVnd: string;
  checkoutAt: string;
  processedAt: string;
  /** bigint as string */
  pointsAwarded: string;
  previousTier: TierName | null;
  newTier: TierName | null;
  tierChanged: boolean;
}

export interface CustomerCoupon {
  id: string;
  campaignId: string;
  campaignName: string;
  couponTitle: string;
  couponCode: string;
  claimedAt: string;
  campaignStatus: CampaignStatus;
  campaignEndAt: string;
  isCampaignExpired: boolean;
}

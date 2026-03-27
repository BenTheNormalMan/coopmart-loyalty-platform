import type { CampaignType, CampaignStatus, TierName } from './common';

export interface AdminCampaign {
  id: string;
  name: string;
  description: string | null;
  type: CampaignType;
  status: CampaignStatus;
  /** bigint as string */
  rewardValue: string;
  /** bigint as string */
  spendGoalVnd: string | null;
  couponTitle: string | null;
  couponPrefix: string | null;
  targetTiers: TierName[];
  maxRegistrations: number | null;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  totalCouponClaims?: number;
}

export interface AdminCampaignCreateBody {
  name: string;
  startAt: string;
  endAt: string;
  /** bigint as string */
  rewardValue: string;
  description?: string;
  type?: CampaignType;
  status?: CampaignStatus;
  /** bigint as string */
  spendGoalVnd?: string;
  couponTitle?: string;
  couponPrefix?: string;
  targetTiers?: TierName[];
  maxRegistrations?: number;
}

export type AdminCampaignUpdateBody = Partial<AdminCampaignCreateBody>;

export interface AdminStats {
  totalCustomers: number;
  activeCampaigns: number;
  totalCouponsClaimed: number;
  totalPointsIssued: number;
}

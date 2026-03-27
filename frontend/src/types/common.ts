export type UserRole = 'customer' | 'admin';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
  exp?: number;
  iat?: number;
}

export type TierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | string;

export type CampaignType =
  | 'WEEKLY_SPEND_COUPON'
  | 'POINTS_BONUS'
  | 'DISCOUNT'
  | 'CASHBACK'
  | 'OTHER';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  actorType: string;
  actorId: string;
  action: string;
  changes: Record<string, unknown> | null;
  createdAt: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

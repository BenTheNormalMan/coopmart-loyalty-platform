import apiClient from './client';
import type {
  CustomerProfile,
  CustomerTier,
  CustomerCampaign,
  CampaignRegisterResponse,
  ClaimCouponResponse,
  CustomerTransaction,
  CustomerCoupon,
} from '../types/customer';

export const customerApi = {
  getProfile: () =>
    apiClient.get<CustomerProfile>('/customers/me/profile').then((r) => r.data),

  getTier: () =>
    apiClient.get<CustomerTier>('/customers/me/tier').then((r) => r.data),

  getCampaigns: () =>
    apiClient.get<CustomerCampaign[]>('/customers/me/campaigns').then((r) => r.data),

  registerCampaign: (campaignId: string) =>
    apiClient
      .post<CampaignRegisterResponse>(`/customers/me/campaigns/${campaignId}/register`)
      .then((r) => r.data),

  claimCoupon: (campaignId: string) =>
    apiClient
      .post<ClaimCouponResponse>(`/customers/me/campaigns/${campaignId}/claim-coupon`)
      .then((r) => r.data),

  getTransactions: (limit = 50) =>
    apiClient
      .get<CustomerTransaction[]>('/customers/me/transactions', { params: { limit } })
      .then((r) => r.data),

  getCoupons: (limit = 50) =>
    apiClient
      .get<CustomerCoupon[]>('/customers/me/coupons', { params: { limit } })
      .then((r) => r.data),
};

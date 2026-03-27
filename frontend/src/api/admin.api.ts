import apiClient from './client';
import type {
  AdminCampaign,
  AdminCampaignCreateBody,
  AdminCampaignUpdateBody,
} from '../types/admin';
import type { AuditLog } from '../types/common';

export const adminApi = {
  getCampaigns: (params?: { status?: string; type?: string; limit?: number }) =>
    apiClient.get<AdminCampaign[]>('/admin/campaigns', { params }).then((r) => r.data),

  getCampaign: (campaignId: string) =>
    apiClient.get<AdminCampaign>(`/admin/campaigns/${campaignId}`).then((r) => r.data),

  createCampaign: (body: AdminCampaignCreateBody) =>
    apiClient.post<AdminCampaign>('/admin/campaigns', body).then((r) => r.data),

  updateCampaign: (campaignId: string, body: AdminCampaignUpdateBody) =>
    apiClient.patch<AdminCampaign>(`/admin/campaigns/${campaignId}`, body).then((r) => r.data),

  getAuditLogs: (params?: { entityType?: string; actorType?: string; limit?: number }) =>
    apiClient.get<AuditLog[]>('/admin/audit-logs', { params }).then((r) => r.data),

  getStats: () =>
    apiClient.get<any>('/admin/stats').then((r) => r.data),
};

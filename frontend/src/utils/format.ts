/**
 * Format a bigint-as-string or number as Vietnamese Dong currency.
 * Uses locale formatting without floating-point math.
 */
export function formatVnd(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '—';
  return num.toLocaleString('vi-VN') + 'đ';
}

/**
 * Format a bigint-as-string as a plain number string with locale separators.
 */
export function formatNumber(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '—';
  return num.toLocaleString('vi-VN');
}

/**
 * Format an ISO datetime string to a Vietnamese locale date.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/**
 * Format an ISO datetime string to date + time.
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const TIER_LABELS: Record<string, string> = {
  BRONZE: 'Đồng',
  SILVER: 'Bạc',
  GOLD: 'Vàng',
  PLATINUM: 'Bạch Kim',
};

export function formatTier(tier: string | null | undefined): string {
  if (!tier) return '—';
  return TIER_LABELS[tier] ?? tier;
}

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  WEEKLY_SPEND_COUPON: 'Chi tiêu tuần',
  POINTS_BONUS: 'Thưởng điểm',
  DISCOUNT: 'Giảm giá',
  CASHBACK: 'Hoàn tiền',
  OTHER: 'Khác',
};

export function formatCampaignType(type: string): string {
  return CAMPAIGN_TYPE_LABELS[type] ?? type;
}

const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Nháp',
  ACTIVE: 'Đang chạy',
  PAUSED: 'Tạm dừng',
  ENDED: 'Kết thúc',
};

export function formatCampaignStatus(status: string): string {
  return CAMPAIGN_STATUS_LABELS[status] ?? status;
}

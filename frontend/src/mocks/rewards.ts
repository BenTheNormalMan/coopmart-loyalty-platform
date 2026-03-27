export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number | null; // null = unlimited
  isActive: boolean;
  category: string;
  validUntil: string | null;
  imageEmoji: string;
}

export const mockRewards: Reward[] = [
  {
    id: 'rwd-1',
    name: 'Voucher mua sắm 50,000đ',
    description: 'Voucher giảm giá 50,000đ áp dụng cho hóa đơn từ 300,000đ tại Co.opmart.',
    pointsRequired: 5000,
    stock: 500,
    isActive: true,
    category: 'Voucher',
    validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
    imageEmoji: '🎫',
  },
  {
    id: 'rwd-2',
    name: 'Voucher mua sắm 100,000đ',
    description: 'Voucher giảm giá 100,000đ áp dụng cho hóa đơn từ 500,000đ tại Co.opmart.',
    pointsRequired: 9500,
    stock: 200,
    isActive: true,
    category: 'Voucher',
    validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
    imageEmoji: '🎟️',
  },
  {
    id: 'rwd-3',
    name: 'Gói quà tặng thực phẩm',
    description: 'Giỏ quà thực phẩm Co.opmart trị giá 200,000đ gồm các sản phẩm thiết yếu.',
    pointsRequired: 18000,
    stock: 50,
    isActive: true,
    category: 'Quà tặng',
    validUntil: null,
    imageEmoji: '🛒',
  },
  {
    id: 'rwd-4',
    name: 'Thẻ nạp điện thoại 50,000đ',
    description: 'Mã nạp tiền điện thoại mệnh giá 50,000đ (Viettel, Vinaphone, Mobifone).',
    pointsRequired: 4800,
    stock: 1000,
    isActive: true,
    category: 'Thẻ nạp',
    validUntil: null,
    imageEmoji: '📱',
  },
  {
    id: 'rwd-5',
    name: 'Vé xem phim CGV',
    description: '1 vé xem phim tiêu chuẩn tại rạp CGV hợp lệ (trừ xuất đặc biệt và phim 3D).',
    pointsRequired: 12000,
    stock: 30,
    isActive: true,
    category: 'Giải trí',
    validUntil: new Date(Date.now() + 86400000 * 60).toISOString(),
    imageEmoji: '🎬',
  },
  {
    id: 'rwd-6',
    name: 'Voucher ưu đãi 200,000đ hạng Bạch Kim',
    description: 'Voucher độc quyền dành riêng cho thành viên hạng Bạch Kim trở lên.',
    pointsRequired: 20000,
    stock: 20,
    isActive: false,
    category: 'Độc quyền',
    validUntil: new Date(Date.now() + 86400000 * 90).toISOString(),
    imageEmoji: '💎',
  },
];

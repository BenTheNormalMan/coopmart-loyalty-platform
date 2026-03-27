import { isDemoMode } from '../../utils/demo';
import { mockAdminCampaigns, mockAdminStats, mockAdminAuditLogs } from '../../mocks/admin';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import type { AdminCampaign, AdminStats } from '../../types/admin';
import type { AuditLog } from '../../types/common';
import { formatVnd, formatDate, formatDateTime, formatCampaignStatus, formatCampaignType } from '../../utils/format';
import './AdminPages.css';

export default function AdminDashboardPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode()) {
      setCampaigns(mockAdminCampaigns);
      setStats(mockAdminStats);
      setLogs(mockAdminAuditLogs);
      setLoading(false);
      return;
    }
    Promise.all([
      adminApi.getCampaigns({ limit: 5 }),
      adminApi.getStats(),
      adminApi.getAuditLogs({ limit: 5 })
    ]).then(([c, s, l]) => {
      setCampaigns(c);
      setStats(s);
      setLogs(l);
    }).catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard Quản trị</h2>
        <p>Tổng quan hoạt động Hệ thống Khách hàng thân thiết</p>
      </div>

      {loading ? <div className="page-loading">Đang tải...</div> : (
        <>
          {/* STATS GRID */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-label">Tổng khách hàng</div>
              <div className="stat-value">{stats?.totalCustomers?.toLocaleString('vi-VN') || 0}</div>
              <div className="stat-change up">thành viên</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Chiến dịch đang chạy</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.activeCampaigns || 0}</div>
              <div className="stat-change up">đang tiến hành</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Coupon đã được nhận</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats?.totalCouponsClaimed?.toLocaleString('vi-VN') || 0}</div>
              <div className="stat-change up">lượt lưu/đổi</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tổng điểm đã phát hành</div>
              <div className="stat-value" style={{ fontSize: 20 }}>{stats?.totalPointsIssued?.toLocaleString('vi-VN') || 0}</div>
              <div className="stat-change up">điểm thưởng</div>
            </div>
          </div>

          {/* TIER PIE CHART + ALERTS + REWARDS TEASER */}
          <div className="content-grid-3" style={{ marginBottom: 24 }}>

            {/* CUSTOMERS BY TIER PIE CHART */}
            <div className="card">
              <div className="card-header">Khách hàng theo hạng</div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                {(() => {
                  const tierData = [
                    { name: 'Bạch Kim', count: 1240, color: '#795d2c' },
                    { name: 'Vàng', count: 5820, color: '#daa520' },
                    { name: 'Bạc', count: 14300, color: '#9ca3af' },
                    { name: 'Đồng', count: 20743, color: '#d32029' },
                  ];
                  const total = tierData.reduce((a, b) => a + b.count, 0);
                  let cumulative = 0;
                  const segments = tierData.map(t => {
                    const pct = (t.count / total) * 100;
                    const start = cumulative;
                    cumulative += pct;
                    return { ...t, pct, start, end: cumulative };
                  });
                  const gradient = segments.map(s => `${s.color} ${s.start.toFixed(1)}% ${s.end.toFixed(1)}%`).join(', ');
                  return (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 140, height: 140, borderRadius: '50%', background: `conic-gradient(${gradient})`, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {segments.map(s => (
                          <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                              <span style={{ color: 'var(--gray-700)' }}>{s.name}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{s.pct.toFixed(1)}%</span>
                              <span style={{ color: 'var(--gray-400)', fontSize: 11, marginLeft: 4 }}>({s.count.toLocaleString()})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ALERTS / ATTENTION */}
            <div className="card">
              <div className="card-header">Cần chú ý</div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '⚠️', text: '2 chiến dịch sắp kết thúc trong 7 ngày tới', color: 'var(--warning)' },
                  { icon: '📋', text: '1 chiến dịch ở trạng thái Nháp chưa hoàn thiện', color: 'var(--info)' },
                  { icon: '🔥', text: 'Chiến dịch "Sinh nhật Co.opmart 30 Năm" đã đạt 68% hạn mức coupon', color: 'var(--danger)' },
                  { icon: '🏅', text: '142 thành viên vừa thăng hạng tháng này', color: 'var(--success)' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--gray-50)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, color: a.color, lineHeight: 1.4 }}>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REWARDS & COUPONS TEASER */}
            <div className="card">
              <div className="card-header">Phần thưởng & Coupon</div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Phần thưởng đang hoạt động', value: '5', icon: '🎁', color: 'var(--primary)' },
                  { label: 'Coupon còn hiệu lực', value: '3,240', icon: '🎫', color: 'var(--success)' },
                  { label: 'Coupon được nhận trong 7 ngày', value: '892', icon: '📈', color: 'var(--warning)' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: 'var(--gray-50)' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                      <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>{s.label}</span>
                    </div>
                    <strong style={{ color: s.color, fontSize: '1.1rem' }}>{s.value}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <Link to="/admin/rewards" className="btn btn-outline btn-sm" style={{ flex: 1 }}>Phần thưởng</Link>
                  <Link to="/admin/coupons" className="btn btn-outline btn-sm" style={{ flex: 1 }}>Coupon</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="content-grid" style={{ marginBottom: 24 }}>
            {/* RECENT CAMPAIGNS PREVIEW */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Chiến dịch gần đây
                <Link to="/admin/campaigns" style={{ fontSize: 13, color: 'var(--primary)' }}>Xem tất cả →</Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {campaigns.length === 0 ? (
                  <div style={{ padding: 24, color: 'var(--gray-500)', textAlign: 'center' }}>Không có chiến dịch nào.</div>
                ) : (
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="data-table">
                      <thead><tr><th>Tên</th><th>Trạng thái</th><th>Phần thưởng</th><th>Hạn kết thúc</th></tr></thead>
                      <tbody>
                        {campaigns.slice(0, 5).map(c => (
                          <tr key={c.id}>
                            <td>
                              <Link to={`/admin/campaigns/${c.id}`} style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>{c.name}</Link>
                              <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{formatCampaignType(c.type)}</span>
                            </td>
                            <td>
                              <span className="badge" style={{ background: c.status === 'ACTIVE' ? '#d1fae5' : '#f3f4f6', color: c.status === 'ACTIVE' ? '#065f46' : '#374151' }}>
                                {formatCampaignStatus(c.status)}
                              </span>
                            </td>
                            <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{formatVnd(c.rewardValue)}</td>
                            <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDate(c.endAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS + CAMPAIGN STATUS */}
            <div className="card">
              <div className="card-header">Thao tác nhanh</div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Campaign Status Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 4 }}>
                  {[
                    { label: 'Đang hoạt động', count: campaigns.filter(c => c.status === 'ACTIVE').length, color: 'var(--success)', bg: 'var(--success-light)' },
                    { label: 'Đã kết thúc', count: campaigns.filter(c => c.status === 'ENDED').length, color: 'var(--gray-500)', bg: 'var(--gray-100)' },
                    { label: 'Tổng', count: campaigns.length, color: 'var(--primary)', bg: '#e0eef9' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '10px 8px', borderRadius: 8, background: s.bg, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.count}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-600)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 12 }} />
                <Link to="/admin/campaigns/create" className="btn btn-primary btn-sm">+ Tạo chiến dịch mới</Link>
                <Link to="/admin/members" className="btn btn-outline btn-sm">Quản lý thành viên</Link>
                <Link to="/admin/rewards" className="btn btn-outline btn-sm">Quản lý phần thưởng</Link>
                <Link to="/admin/coupons" className="btn btn-outline btn-sm">Quản lý Coupon</Link>
                <Link to="/admin/rules" className="btn btn-outline btn-sm">Quản lý quy tắc</Link>
                <Link to="/admin/audit-logs" className="btn btn-outline btn-sm">Tra cứu Nhật ký hệ thống</Link>
              </div>
            </div>
          </div>

          {/* RECENT AUDIT LOGS PREVIEW */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Nhật ký thao tác gần đây
              <Link to="/admin/audit-logs" style={{ fontSize: 13, color: 'var(--primary)' }}>Xem toàn bộ nhật ký →</Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {logs.length === 0 ? (
                <div style={{ padding: 24, color: 'var(--gray-500)', textAlign: 'center' }}>Hệ thống chưa ghi nhận biến động mới.</div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Thời gian</th>
                        <th>Tác vụ (Action)</th>
                        <th>Khởi tạo bởi (Actor)</th>
                        <th>Đối tượng (Entity)</th>
                        <th>Chi tiết thay đổi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.slice(0, 5).map(log => (
                        <tr key={log.id}>
                          <td style={{ fontSize: 12, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{formatDateTime(log.createdAt)}</td>
                          <td>
                            <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontFamily: 'monospace', fontSize: 11 }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{ fontSize: 12 }}>
                            <span style={{ fontWeight: 600 }}>{log.actorType}</span> <span style={{ color: 'var(--gray-400)' }}>#{log.actorId}</span>
                          </td>
                          <td style={{ fontSize: 12 }}>
                            <span style={{ fontWeight: 600 }}>{log.entityType}</span> <span style={{ color: 'var(--gray-400)' }}>#{log.entityId}</span>
                          </td>
                          <td style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                            {log.changes ? 'Có thay đổi State' : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </>
      )}
    </div>
  );
}
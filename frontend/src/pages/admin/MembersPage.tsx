import { useState } from 'react';
import { mockMembers } from '../../mocks/members';
import { Link } from 'react-router-dom';
import '../admin/AdminPages.css';

const TIER_LABELS: Record<string, string> = { BRONZE: 'Đồng', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch Kim' };
const TIER_BADGE: Record<string, string> = { BRONZE: 'badge-danger', SILVER: 'badge-gray', GOLD: 'badge-warning', PLATINUM: 'badge-accent' };
const ALL_TIERS = ['', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;

function formatVnd(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const filtered = mockMembers.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q);
    const matchTier = !tierFilter || m.currentTier === tierFilter;
    return matchSearch && matchTier;
  });

  const tierCounts = Object.fromEntries(
    ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].map(t => [t, mockMembers.filter(m => m.currentTier === t).length])
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Quản lý thành viên</h1>
          <p style={{ color: 'var(--gray-500)' }}>Danh sách khách hàng thành viên trong hệ thống Co.opmart Loyalty.</p>
        </div>
        <span className="badge badge-primary" style={{ fontSize: 14, padding: '6px 14px' }}>
          Tổng: {mockMembers.length} thành viên
        </span>
      </div>

      {/* Tier distribution mini-stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const).map(t => (
          <div key={t} className="card" style={{ padding: '12px 16px', cursor: 'pointer', border: tierFilter === t ? '2px solid var(--primary)' : '2px solid transparent' }} onClick={() => setTierFilter(prev => prev === t ? '' : t)}>
            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>Hạng {TIER_LABELS[t]}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>{tierCounts[t]}</div>
            <span className={`badge ${TIER_BADGE[t]}`} style={{ fontSize: 10, marginTop: 4 }}>{tierFilter === t ? 'Đang lọc' : 'Nhấn để lọc'}</span>
          </div>
        ))}
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên, email, SĐT, ID..."
          style={{ flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--gray-300)', fontSize: 14 }}
        />
        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--gray-300)', fontSize: 14, minWidth: 160 }}
        >
          <option value="">Tất cả hạng</option>
          {ALL_TIERS.slice(1).map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
        </select>
        {(search || tierFilter) && (
          <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setTierFilter(''); }}>Xoá bộ lọc</button>
        )}
        <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--gray-500)' }}>
          {filtered.length} / {mockMembers.length} thành viên
        </span>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Thành viên</th>
                <th>Liên hệ</th>
                <th>Hạng</th>
                <th style={{ textAlign: 'right' }}>Điểm tích lũy</th>
                <th style={{ textAlign: 'right' }}>Chi tiêu 6 tháng</th>
                <th>Ngày tham gia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Không tìm thấy thành viên phù hợp</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {m.fullName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{m.fullName}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'monospace' }}>ID: {m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{m.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{m.phone}</div>
                  </td>
                  <td><span className={`badge ${TIER_BADGE[m.currentTier]}`}>{TIER_LABELS[m.currentTier]}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>{m.pointsBalance.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: 'var(--gray-700)' }}>{formatVnd(m.rolling6MonthsSpendVnd)}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{new Date(m.joinedAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Link to={`/admin/members/${m.id}`} className="btn btn-outline btn-sm">Xem chi tiết</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { isDemoMode } from '../../utils/demo';
import { mockAdminAuditLogs } from '../../mocks/admin';
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import type { AuditLog } from '../../types/common';
import { formatDateTime } from '../../utils/format';
import './AdminPages.css';

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entityType, setEntityType] = useState('');
  const [actorType, setActorType] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setLogs(mockAdminAuditLogs);
      setLoading(false);
      return;
    }
    setLoading(true);
    adminApi.getAuditLogs({
      entityType: entityType || undefined,
      actorType: actorType || undefined,
      limit: 200,
    })
      .then(setLogs)
      .catch(() => setError('Không thể tải nhật ký kiểm toán.'))
      .finally(() => setLoading(false));
  }, [entityType, actorType]);

  return (
    <div>
      <div className="page-header">
        <h2>Nhật ký kiểm toán</h2>
        <p>Theo dõi mọi thao tác trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text" className="form-input" style={{ width: 'auto', minWidth: 160 }}
            placeholder="Entity Type..." value={entityType}
            onChange={e => setEntityType(e.target.value)}
          />
          <input
            type="text" className="form-input" style={{ width: 'auto', minWidth: 160 }}
            placeholder="Actor Type..." value={actorType}
            onChange={e => setActorType(e.target.value)}
          />
          {(entityType || actorType) && (
            <button className="btn btn-outline btn-sm" onClick={() => { setEntityType(''); setActorType(''); }}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {loading ? <div className="page-loading">Đang tải...</div> :
       error ? <div className="page-error">{error}</div> : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>Không có nhật ký nào.</div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Thao tác</th>
                      <th>Entity</th>
                      <th>Actor</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontSize: 12, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{formatDateTime(log.createdAt)}</td>
                        <td>
                          <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontFamily: 'monospace', fontSize: 11 }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontSize: 12 }}>
                          <div style={{ fontWeight: 600 }}>{log.entityType}</div>
                          <code style={{ fontSize: 10, color: 'var(--gray-500)' }}>{log.entityId}</code>
                        </td>
                        <td style={{ fontSize: 12 }}>
                          <div>{log.actorType}</div>
                          <code style={{ fontSize: 10, color: 'var(--gray-500)' }}>{log.actorId}</code>
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--gray-500)', maxWidth: 200 }}>
                          {log.changes ? (
                            <details>
                              <summary style={{ cursor: 'pointer' }}>Xem thay đổi</summary>
                              <pre style={{ fontSize: 10, marginTop: 4, background: 'var(--gray-50)', padding: 6, borderRadius: 4, overflowX: 'auto' }}>
                                {JSON.stringify(log.changes, null, 2)}
                              </pre>
                            </details>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
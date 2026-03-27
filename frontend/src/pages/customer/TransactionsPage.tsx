import { isDemoMode } from '../../utils/demo';
import { mockCustomerTransactions } from '../../mocks/customer';
import { useEffect, useState } from 'react';
import { customerApi } from '../../api/customer.api';
import type { CustomerTransaction } from '../../types/customer';
import { formatVnd, formatTier, formatDateTime } from '../../utils/format';
import './CustomerPages.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isDemoMode()) {
      setTransactions(mockCustomerTransactions);
      setLoading(false);
      return;
    }
    customerApi.getTransactions(50)
      .then(setTransactions)
      .catch(() => setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Đang tải...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Lịch sử giao dịch</h2>
        <p>Tất cả giao dịch tích điểm của bạn</p>
      </div>

      {transactions.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 40 }}>
            Chưa có giao dịch nào.
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày thanh toán</th>
                    <th>Số tiền</th>
                    <th>Điểm nhận</th>
                    <th>Nguồn</th>
                    <th>Thay đổi hạng</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td><code style={{ fontSize: 12 }}>{t.externalOrderId}</code></td>
                      <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{formatDateTime(t.checkoutAt)}</td>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatVnd(t.amountVnd)}</td>
                      <td><span className="badge badge-success">+{Number(t.pointsAwarded).toLocaleString('vi-VN')}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.sourceSystem}</td>
                      <td>
                        {t.tierChanged ? (
                          <span className="badge badge-accent">
                            {formatTier(t.previousTier)} → {formatTier(t.newTier)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--gray-300)', fontSize: 12 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
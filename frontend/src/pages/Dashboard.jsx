import { useEffect, useState } from 'react'
import { getDashboardStats, getOverdue, getTransactions } from '../api/transactions'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [overdue, setOverdue] = useState([])

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data))
    getTransactions().then(r => setRecent(r.data.slice(-5).reverse()))
    getOverdue().then(r => setOverdue(r.data.slice(0, 5)))
  }, [])

  const cards = stats ? [
    { label: 'Total Books', value: stats.totalBooks, icon: '📚', type: 'accent' },
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', type: 'info' },
    { label: 'Books Issued', value: stats.issuedBooks, icon: '📤', type: 'warning' },
    { label: 'Overdue', value: stats.overdueBooks, icon: '⚠️', type: 'danger' },
    { label: 'Available', value: stats.availableBooks, icon: '✅', type: 'success' },
  ] : []

  return (
    <div>
      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.type}`}>
            <div className="stat-card-header">
              <div className="stat-card-icon">{c.icon}</div>
            </div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
        {!stats && [1,2,3,4,5].map(i => (
          <div key={i} className="stat-card accent" style={{ opacity: 0.4 }}>
            <div className="stat-value">—</div>
            <div className="stat-label">Loading...</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="section-title">🔄 Recent Transactions</div>
          {recent.length === 0 ? (
            <div className="empty-state"><p>No transactions yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Book</th><th>Member</th><th>Status</th>
              </tr></thead>
              <tbody>
                {recent.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.book?.title?.slice(0, 28)}{t.book?.title?.length > 28 ? '…' : ''}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{t.member?.name}</td>
                    <td><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="section-title">⚠️ Overdue Books</div>
          {overdue.length === 0 ? (
            <div className="empty-state"><p>No overdue books 🎉</p></div>
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Book</th><th>Member</th><th>Fine</th>
              </tr></thead>
              <tbody>
                {overdue.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.book?.title?.slice(0, 22)}{t.book?.title?.length > 22 ? '…' : ''}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{t.member?.name}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>₹{t.fine?.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    ISSUED: 'badge-warning',
    RETURNED: 'badge-success',
    OVERDUE: 'badge-danger',
  }
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>
}

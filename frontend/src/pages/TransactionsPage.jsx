import React, { useEffect, useState } from 'react'
import { getTransactions, getOverdue, issueBook, returnBook } from '../api/transactions'
import { getBooks } from '../api/books'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function TransactionsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [transactions, setTransactions] = useState([])
  const [tab, setTab] = useState('all')
  const [modal, setModal] = useState(false)
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ bookId: '' })

  const load = () => {
    if (tab === 'overdue') getOverdue().then(r => setTransactions(r.data))
    else getTransactions().then(r => setTransactions(r.data))
  }

  useEffect(() => { load() }, [tab])

  const openIssue = () => {
    getBooks().then(r => setBooks(r.data.filter(b => b.availableCopies > 0)))
    setForm({ bookId: '' })
    setModal(true)
  }

  const handleIssue = async (e) => {
    e.preventDefault()
    try {
      await issueBook(Number(form.bookId))
      toast.success('Book borrowed successfully!')
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to borrow book')
    }
  }

  const handleReturn = async (id, title) => {
    if (!window.confirm(`Return "${title}"?`)) return
    try {
      const { data } = await returnBook(id)
      if (data.fine > 0) toast.success(`Returned! Fine: Rs. ${data.fine.toFixed(0)}`, { duration: 5000 })
      else toast.success('Book returned successfully!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to return book')
    }
  }

  const displayed = tab === 'all' ? transactions
    : tab === 'issued' ? transactions.filter(t => t.status === 'ISSUED')
      : tab === 'borrowed' ? transactions.filter(t => t.status === 'ISSUED' || t.status === 'OVERDUE')
      : tab === 'overdue' ? transactions
        : transactions.filter(t => t.status === 'RETURNED')

  const tabs = isAdmin ? ['all', 'issued', 'overdue', 'returned'] : ['all', 'borrowed', 'overdue', 'returned']
  const pageTitle = isAdmin ? 'Transactions' : 'My Activity'
  const pageSubtitle = isAdmin ? `${transactions.length} total records` : `${transactions.length} of your records`
  const actionLabel = 'Borrow Book'

  const tabStyle = (t) => ({
    padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500,
    background: tab === t ? 'var(--accent)' : 'var(--bg-card)',
    color: tab === t ? 'white' : 'var(--text-secondary)',
    border: `1px solid ${tab === t ? 'var(--accent)' : 'var(--border)'}`,
    transition: 'all 0.2s'
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{pageTitle}</div>
          <div className="page-subtitle">{pageSubtitle}</div>
        </div>
        {!isAdmin && (
          <button className="btn btn-primary" id="issue-book-btn" onClick={openIssue}>{actionLabel}</button>
        )}
      </div>

      <div className="toolbar">
        {tabs.map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>Book</th>{isAdmin && <th>Member</th>}<th>Issue Date</th>
            <th>Due Date</th><th>Return Date</th><th>Status</th><th>Fine (Rs.)</th>{!isAdmin && <th>Action</th>}
          </tr></thead>
          <tbody>
            {displayed.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">TX</div><p>No records</p></div></td></tr>
            )}
            {displayed.map((t, i) => (
              <tr key={t.id}>
                <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600, maxWidth: 200 }}>{t.book?.title}</td>
                {isAdmin && <td style={{ color: 'var(--text-secondary)' }}>{t.member?.name}</td>}
                <td style={{ color: 'var(--text-muted)' }}>{t.issueDate}</td>
                <td style={{ color: t.status !== 'RETURNED' && t.dueDate < new Date().toISOString().slice(0, 10) ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {t.dueDate}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{t.returnDate || '--'}</td>
                <td><StatusBadge status={t.status} /></td>
                <td style={{ color: t.fine > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: t.fine > 0 ? 700 : 400 }}>
                  {t.fine > 0 ? `Rs. ${t.fine.toFixed(0)}` : '--'}
                </td>
                {!isAdmin && (
                  <td>
                    {t.status !== 'RETURNED' && (
                    <button className="btn btn-success btn-sm" onClick={() => handleReturn(t.id, t.book?.title)}>
                      Return
                    </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isAdmin && modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{actionLabel}</div>
              <button className="modal-close" onClick={() => setModal(false)}>x</button>
            </div>
            <form onSubmit={handleIssue}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Book (Available only) *</label>
                  <select className="form-control" value={form.bookId} onChange={e => setForm({ ...form, bookId: e.target.value })} required>
                    <option value="">-- Choose a book --</option>
                    {books.map(b => (
                      <option key={b.id} value={b.id}>{b.title} - {b.author} ({b.availableCopies} available)</option>
                    ))}
                  </select>
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--info-light)', borderRadius: 8, fontSize: 13, color: 'var(--info)' }}>
                  Note: Loan period is <strong>14 days</strong>. Fine is <strong>Rs. 5/day</strong> after the due date.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="confirm-issue-btn">Confirm Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = { ISSUED: 'badge-warning', RETURNED: 'badge-success', OVERDUE: 'badge-danger' }
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>
}

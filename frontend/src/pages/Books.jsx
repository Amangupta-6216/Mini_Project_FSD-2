import { useEffect, useState } from 'react'
import { getBooks, createBook, updateBook, deleteBook } from '../api/books'
import toast from 'react-hot-toast'

const GENRES = ['Fiction', 'Dystopia', 'Technology', 'Science', 'History', 'Self-Help', 'Finance', 'Sci-Fi']

const empty = { title: '', author: '', isbn: '', genre: '', publisher: '', publishYear: '', totalCopies: 1, availableCopies: 1, description: '' }

export default function Books() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const load = (q) => getBooks(q ? { search: q } : {}).then(r => setBooks(r.data))

  useEffect(() => { load() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load(search)
  }

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (b) => {
    setForm({ ...b, publishYear: b.publishYear || '', description: b.description || '' })
    setEditing(b.id); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, publishYear: Number(form.publishYear), totalCopies: Number(form.totalCopies), availableCopies: Number(form.availableCopies) }
      if (editing) { await updateBook(editing, payload); toast.success('Book updated!') }
      else { await createBook(payload); toast.success('Book added!') }
      setModal(false); load()
    } catch(err) { toast.error(err.response?.data?.error || 'Failed to save book') }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try { await deleteBook(id); toast.success('Book deleted'); load() }
    catch { toast.error('Cannot delete — may have active transactions') }
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Book Catalog</div>
          <div className="page-subtitle">{books.length} books found</div>
        </div>
        <button className="btn btn-primary" id="add-book-btn" onClick={openAdd}>＋ Add Book</button>
      </div>

      <div className="toolbar">
        <form className="search-box" onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <span className="search-icon">🔍</span>
          <input id="book-search" placeholder="Search by title, author, ISBN…" value={search} onChange={e => setSearch(e.target.value)} />
        </form>
        <button className="btn btn-ghost" onClick={() => { setSearch(''); load() }}>Clear</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th>
            <th>Year</th><th>Copies</th><th>Available</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {books.length === 0 && (
              <tr><td colSpan={9}><div className="empty-state"><div className="empty-icon">📚</div><p>No books found</p></div></td></tr>
            )}
            {books.map((b, i) => (
              <tr key={b.id}>
                <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{b.title}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{b.author}</td>
                <td><span className="badge badge-accent">{b.genre}</span></td>
                <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 12 }}>{b.isbn}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{b.publishYear}</td>
                <td>{b.totalCopies}</td>
                <td>
                  <span className={`badge ${b.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {b.availableCopies}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}>✏️</button>
                    <button className="btn btn-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }} onClick={() => handleDelete(b.id, b.title)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Book' : 'Add New Book'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input className="form-control" value={form.title} onChange={f('title')} required placeholder="Book title" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author *</label>
                    <input className="form-control" value={form.author} onChange={f('author')} required placeholder="Author name" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ISBN</label>
                    <input className="form-control" value={form.isbn} onChange={f('isbn')} placeholder="978-..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Genre</label>
                    <select className="form-control" value={form.genre} onChange={f('genre')}>
                      <option value="">Select genre</option>
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Publisher</label>
                    <input className="form-control" value={form.publisher} onChange={f('publisher')} placeholder="Publisher" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input className="form-control" type="number" value={form.publishYear} onChange={f('publishYear')} placeholder="2024" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Copies</label>
                    <input className="form-control" type="number" min="1" value={form.totalCopies} onChange={f('totalCopies')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Available Copies</label>
                    <input className="form-control" type="number" min="0" value={form.availableCopies} onChange={f('availableCopies')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={f('description')} placeholder="Book description…" style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-book-btn">{editing ? 'Update Book' : 'Add Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

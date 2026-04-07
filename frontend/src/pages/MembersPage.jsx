import React, { useEffect, useState } from 'react'
import { getMembers, createMember, updateMember, deleteMember } from '../api/members'
import toast from 'react-hot-toast'

const empty = { name: '', email: '', phone: '', address: '', status: 'ACTIVE' }

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const load = (q) => getMembers(q ? { search: q } : {}).then(r => setMembers(r.data))
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (m) => { setForm({ ...m }); setEditing(m.id); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateMember(editing, form)
        toast.success('Member updated!')
      } else {
        await createMember(form)
        toast.success('Member added!')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save member')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the system?`)) return
    try {
      await deleteMember(id)
      toast.success('Member removed')
      load()
    } catch {
      toast.error('Cannot delete member with active transactions')
    }
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Members</div>
          <div className="page-subtitle">{members.length} registered members</div>
        </div>
        <button className="btn btn-primary" id="add-member-btn" onClick={openAdd}>+ Add Member</button>
      </div>

      <div className="toolbar">
        <form className="search-box" onSubmit={e => { e.preventDefault(); load(search) }}>
          <span className="search-icon">?</span>
          <input id="member-search" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
        </form>
        <button className="btn btn-ghost" onClick={() => { setSearch(''); load() }}>Clear</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {members.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">MB</div><p>No members found</p></div></td></tr>
            )}
            {members.map((m, i) => (
              <tr key={m.id}>
                <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                      {m.name.slice(0, 1)}
                    </div>
                    {m.name}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{m.email}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{m.phone}</td>
                <td style={{ color: 'var(--text-muted)' }}>{m.membershipDate}</td>
                <td>
                  <span className={`badge ${m.status === 'ACTIVE' ? 'badge-success' : 'badge-muted'}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}>Edit</button>
                    <button className="btn btn-sm" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }} onClick={() => handleDelete(m.id, m.name)}>Delete</button>
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
              <div className="modal-title">{editing ? 'Edit Member' : 'Add New Member'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>x</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" value={form.name} onChange={f('name')} required placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-control" type="email" value={form.email} onChange={f('email')} required placeholder="email@example.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={form.phone} onChange={f('phone')} placeholder="Phone number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={form.status} onChange={f('status')}>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={form.address} onChange={f('address')} placeholder="Full address" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-member-btn">{editing ? 'Update' : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

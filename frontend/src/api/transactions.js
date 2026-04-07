import api from './axios'
export const getTransactions = () => api.get('/transactions')
export const getOverdue = () => api.get('/transactions/overdue')
export const issueBook = (bookId, memberId) => api.post('/transactions/issue', memberId ? { bookId, memberId } : { bookId })
export const returnBook = (id) => api.post(`/transactions/${id}/return`)
export const getDashboardStats = () => api.get('/dashboard/stats')

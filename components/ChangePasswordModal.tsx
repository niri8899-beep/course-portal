'use client'
import { useState } from 'react'
import { changePassword } from '@/lib/auth'

interface Props {
  email: string
  onClose: () => void
  onSuccess: () => void
}

export default function ChangePasswordModal({ email, onClose, onSuccess }: Props) {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }
    if (password !== confirm) {
      setError('הסיסמאות אינן זהות')
      return
    }

    setLoading(true)
    const res = await changePassword(email, password)
    setLoading(false)

    if (res.success) {
      onSuccess()
    } else {
      setError(res.error ?? 'אירעה שגיאה')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">שינוי סיסמה</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="סגור"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-5">הזינו סיסמה חדשה פעמיים כדי לעדכן.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">סיסמה חדשה</label>
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-beige-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              placeholder="לפחות 6 תווים"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">אימות סיסמה</label>
            <input
              type="password"
              name="confirm-password"
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-beige-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              placeholder="הזינו שוב את הסיסמה"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600
                         bg-beige-100 hover:bg-beige-200 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-primary-600 hover:bg-primary-700 disabled:opacity-60
                         transition-colors"
            >
              {loading ? 'מעדכן...' : 'שמירה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

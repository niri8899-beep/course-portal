'use client'
import { useState } from 'react'
import { changePassword } from '@/lib/auth'

interface Props {
  onSuccess: () => void
}

export default function ChangePasswordModal({ onSuccess }: Props) {
  const [newPass, setNewPass]     = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [showNew, setShowNew]     = useState(false)
  const [showConf, setShowConf]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPass.length < 6) { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return }
    if (newPass !== confirm)  { setError('הסיסמאות אינן תואמות'); return }
    if (newPass === '12345')  { setError('לא ניתן לשמור את הסיסמה הראשונית'); return }
    changePassword(newPass)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-beige-200 p-8 animate-slide-up">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-2xl mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">הגדרת סיסמה אישית</h2>
          <p className="text-sm text-slate-500 mt-2">
            לאבטחת חשבונך, נא הגדר סיסמה חדשה לפני שתמשיך
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">סיסמה חדשה</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-beige-300 bg-beige-50
                           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                           text-slate-800 transition-all placeholder:text-slate-400"
                placeholder="לפחות 6 תווים"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600"
              >
                {showNew ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">אימות סיסמה</label>
            <div className="relative">
              <input
                type={showConf ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-beige-300 bg-beige-50
                           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                           text-slate-800 transition-all placeholder:text-slate-400"
                placeholder="הזן שוב את הסיסמה"
                required
              />
              <button
                type="button"
                onClick={() => setShowConf(v => !v)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600"
              >
                {showConf ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 active:scale-95
                       text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                       shadow-md hover:shadow-lg mt-2"
          >
            שמור סיסמה והמשך ←
          </button>
        </form>
      </div>
    </div>
  )
}

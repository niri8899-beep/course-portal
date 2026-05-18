'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPassword } from '@/lib/auth'

function ResetPasswordForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''

  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }
    if (password !== confirm) {
      setError('הסיסמאות אינן תואמות')
      return
    }

    setLoading(true)
    const result = await resetPassword(token, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'שגיאה')
      return
    }
    setDone(true)
    setTimeout(() => router.push('/'), 2000)
  }

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">קישור לא תקין</h2>
        <p className="text-sm text-slate-500">הקישור לאיפוס הסיסמה חסר או שגוי.</p>
        <Link href="/forgot-password" className="inline-block mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700">
          בקשת קישור חדש
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">הסיסמה אופסה בהצלחה</h2>
        <p className="text-sm text-slate-500">מעבירים אתכם למסך ההתחברות...</p>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">הגדרת סיסמה חדשה</h2>
      <p className="text-sm text-slate-500 mb-6">בחרו סיסמה חדשה לחשבון שלכם.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">סיסמה חדשה</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              required
              minLength={6}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-beige-300 bg-beige-50
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                         text-slate-800 placeholder:text-slate-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600 text-sm"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">אימות סיסמה</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="הזן שוב את הסיסמה"
            required
            className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50
                       focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                       text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 active:scale-95
                     text-white font-semibold py-3 rounded-xl transition-all duration-200
                     shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'שומר...' : 'שמירת סיסמה'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary-200 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-beige-300 rounded-full opacity-60 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <img src="/logo.png" alt="אנגלית בקלות" className="w-28 h-28 object-contain drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900">אנגלית בקלות</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-beige-200 p-8">
          <Suspense fallback={<p className="text-center text-sm text-slate-500">טוען...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

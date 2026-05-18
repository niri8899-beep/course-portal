'use client'
import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await requestPasswordReset(email)
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'שגיאה')
      return
    }
    setSent(true)
  }

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
          {sent ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">בדקו את תיבת המייל</h2>
              <p className="text-sm text-slate-500">
                אם הכתובת רשומה אצלנו, נשלח אליה קישור לאיפוס הסיסמה. הקישור תקף לשעה אחת.
              </p>
              <Link
                href="/"
                className="inline-block mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                חזרה להתחברות
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">איפוס סיסמה</h2>
              <p className="text-sm text-slate-500 mb-6">
                הזינו את כתובת האימייל שלכם ונשלח אליכם קישור לאיפוס הסיסמה.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    כתובת אימייל
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    dir="ltr"
                    placeholder="your@email.com"
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
                  {loading ? 'שולח...' : 'שליחת קישור לאיפוס'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-beige-100 text-center">
                <Link href="/" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  חזרה להתחברות
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

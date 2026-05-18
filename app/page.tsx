'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted]           = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && localStorage.getItem('cp_current_user')) {
      router.replace('/dashboard')
    }
  }, [router])

  if (!mounted) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'שגיאה')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary-200 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-beige-300 rounded-full opacity-60 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <img
              src="/logo.png"
              alt="אנגלית בקלות"
              className="w-28 h-28 object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary-900">אנגלית בקלות</h1>
          <p className="text-slate-500 text-sm mt-1">ברוכים הבאים לפלטפורמת הלמידה</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-beige-200 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            התחברות לקורס
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                סיסמה
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="הזן סיסמה"
                  required
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
              <div className="text-left mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  שכחת סיסמה?
                </Link>
              </div>
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
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  מתחבר...
                </span>
              ) : (
                'כניסה לקורס'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-beige-100 text-center">
            <p className="text-sm text-slate-500">
              עדיין לא רכשת את הקורס?{' '}
              <Link
                href="/purchase"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                לרכישת הקורס
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

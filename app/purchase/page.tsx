'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const COURSE_PRICE = 79

function PurchaseForm() {
  const params = useSearchParams()

  const [email, setEmail]               = useState('')
  const [emailLocked, setEmailLocked]   = useState(false)
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [mounted, setMounted]           = useState(false)

  useEffect(() => {
    setMounted(true)
    const qpEmail = params.get('email')
    if (qpEmail) {
      setEmail(qpEmail.toLowerCase().trim())
      setEmailLocked(true)
    }
    if (params.get('failed')) {
      setError('התשלום לא הושלם. אפשר לנסות שוב.')
    }
  }, [params])

  if (!mounted) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const normEmail = email.toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
      setError('נא להזין כתובת אימייל תקינה')
      return
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }
    if (password !== confirm) {
      setError('הסיסמאות אינן תואמות')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password }),
      })
      const data = await res.json()
      if (!data.success || !data.paymentUrl) {
        setError(data.error ?? 'אירעה שגיאה. נסו שוב.')
        setLoading(false)
        return
      }
      window.location.href = data.paymentUrl
    } catch {
      setError('שגיאת חיבור לשרת')
      setLoading(false)
    }
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
          <p className="text-slate-500 text-sm mt-1">רכישת הקורס הדיגיטלי</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-beige-200 p-8">
          {/* Price summary */}
          <div className="flex items-center justify-between bg-beige-50 border border-beige-200 rounded-2xl px-5 py-4 mb-6">
            <span className="font-semibold text-slate-800">קורס דיגיטלי</span>
            <span className="text-xl font-bold text-primary-700">{COURSE_PRICE} ₪</span>
          </div>

          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            בחרו סיסמה לחשבון שלכם. לאחר התשלום החשבון ייפתח אוטומטית ותוכלו
            להתחבר עם כתובת האימייל והסיסמה שבחרתם.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">כתובת אימייל</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                readOnly={emailLocked}
                dir="ltr"
                placeholder="your@email.com"
                required
                className={`w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50
                           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                           text-slate-800 placeholder:text-slate-400 transition-all
                           ${emailLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">בחירת סיסמה</label>
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
                placeholder="הקלידו שוב את הסיסמה"
                required
                minLength={6}
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
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  מעבירים לתשלום...
                </span>
              ) : (
                `מעבר לתשלום מאובטח · ${COURSE_PRICE} ₪`
              )}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-5 leading-relaxed">
            התשלום מתבצע בעמוד מאובטח של חברת הסליקה קארדקום.
            חשבונית מס תישלח לכתובת האימייל שלכם.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PurchasePage() {
  return (
    <Suspense fallback={null}>
      <PurchaseForm />
    </Suspense>
  )
}

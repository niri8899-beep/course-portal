'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type State = 'checking' | 'done' | 'pending'

// Cardcom appends the payment-page id to the redirect URL under one of these
// keys (it has varied across versions) — accept any of them.
const ID_KEYS = ['LowProfileId', 'lowProfileId', 'lowprofileid', 'lowprofilecode']

function SuccessContent() {
  const params = useSearchParams()
  const [state, setState] = useState<State>('checking')

  useEffect(() => {
    let lowProfileId: string | null = null
    for (const key of ID_KEYS) {
      const v = params.get(key)
      if (v) { lowProfileId = v; break }
    }

    if (!lowProfileId) {
      // No id in the URL — the webhook will still activate the account.
      setState('pending')
      return
    }

    let cancelled = false
    let attempts = 0

    async function confirm(id: string) {
      attempts++
      try {
        const res = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lowProfileId: id }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.success) {
          setState('done')
          return
        }
      } catch {
        /* fall through to retry */
      }
      if (cancelled) return
      if (attempts < 4) {
        setTimeout(() => confirm(id), 2000)
      } else {
        setState('pending')
      }
    }

    confirm(lowProfileId)
    return () => { cancelled = true }
  }, [params])

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary-200 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-beige-300 rounded-full opacity-60 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="אנגלית בקלות" className="w-28 h-28 object-contain drop-shadow-md mx-auto" />
          <h1 className="text-2xl font-bold text-primary-900 mt-2">אנגלית בקלות</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-beige-200 p-8 text-center">
          {state === 'checking' && (
            <>
              <span className="inline-block w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <h2 className="text-lg font-semibold text-slate-800">מאמתים את התשלום...</h2>
              <p className="text-sm text-slate-500 mt-2">רק רגע, לא לסגור את העמוד.</p>
            </>
          )}

          {state === 'done' && (
            <>
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-lg font-semibold text-slate-800">התשלום התקבל!</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                החשבון שלך נפתח. חשבונית מס נשלחה לכתובת האימייל שלך.
                אפשר להתחבר עכשיו עם האימייל והסיסמה שבחרת.
              </p>
              <Link
                href="/"
                className="inline-block w-full mt-6 bg-primary-600 hover:bg-primary-700 active:scale-95
                           text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                כניסה לקורס
              </Link>
            </>
          )}

          {state === 'pending' && (
            <>
              <div className="text-5xl mb-3">⏳</div>
              <h2 className="text-lg font-semibold text-slate-800">התשלום התקבל</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                ייתכן שאימות התשלום ייקח עד דקה. נסו להתחבר עם האימייל והסיסמה
                שבחרתם — אם מופיעה הודעה שהתשלום לא אומת, המתינו רגע ונסו שוב.
              </p>
              <Link
                href="/"
                className="inline-block w-full mt-6 bg-primary-600 hover:bg-primary-700 active:scale-95
                           text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                למסך ההתחברות
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}

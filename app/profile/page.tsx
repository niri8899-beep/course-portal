'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import ChangePasswordModal from '@/components/ChangePasswordModal'
import { getCurrentUser } from '@/lib/auth'
import { fetchCompleted, overallPercent } from '@/lib/progress'
import { courseData, TOTAL_LESSONS } from '@/lib/courseData'

interface Profile {
  email: string
  passwordChanged: boolean
  createdAt: string
  completedCount: number
  lastActivity: string | null
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [overall, setOverall]   = useState(0)
  const [doneModules, setDone]  = useState(0)
  const [loading, setLoading]   = useState(true)
  const [ready, setReady]       = useState(false)
  const [showModal, setModal]   = useState(false)
  const [toast, setToast]       = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) { router.replace('/'); return }

    Promise.all([
      fetch(`/api/profile?email=${encodeURIComponent(u)}`).then(r => r.json()),
      fetchCompleted(u),
    ]).then(([prof, set]) => {
      if (!prof.error) setProfile(prof)
      setOverall(overallPercent(set))
      setDone(courseData.modules.filter(m =>
        m.lessons.every(l => set.has(`${m.id}_${l.id}`))
      ).length)
      setLoading(false)
    })

    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [router])

  function handleSuccess() {
    setModal(false)
    setProfile(p => p ? { ...p, passwordChanged: true } : p)
    setToast(true)
    setTimeout(() => setToast(false), 3200)
  }

  const shown  = 'opacity-100 translate-y-0'
  const hidden = 'opacity-0 translate-y-4'

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-slate-500">
          <p>לא ניתן לטעון את פרטי המשתמש.</p>
        </div>
      </AppLayout>
    )
  }

  const stats = [
    { label: 'שיעורים שהושלמו', value: `${profile.completedCount}/${TOTAL_LESSONS}`, icon: '✅' },
    { label: 'התקדמות כוללת',   value: `${overall}%`,                                icon: '📊' },
    { label: 'מודולים שהושלמו', value: `${doneModules}/${courseData.modules.length}`, icon: '📚' },
    { label: 'פעילות אחרונה',   value: formatDate(profile.lastActivity),             icon: '🕒' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">הפרופיל שלי</h1>
          <p className="text-slate-500 text-sm mt-1">הנתונים האישיים וההתקדמות שלך בקורס</p>
        </div>

        {/* Identity card */}
        <div className={`rounded-3xl bg-gradient-to-bl from-primary-700 to-primary-900 text-white p-6
                         transition-all duration-500 ${ready ? shown : hidden}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              👤
            </div>
            <div className="min-w-0">
              <p className="font-bold text-lg leading-tight truncate" dir="ltr">{profile.email}</p>
              <p className="text-primary-200 text-sm mt-1">חבר/ה מאז {formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 gap-3 transition-all duration-500 delay-100 ${ready ? shown : hidden}`}>
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-beige-200 p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-lg font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Account details */}
        <div className={`bg-white rounded-3xl border border-beige-200 shadow-sm p-6
                         transition-all duration-500 delay-200 ${ready ? shown : hidden}`}>
          <h2 className="font-semibold text-slate-800 mb-4">פרטי חשבון</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">אימייל</span>
              <span className="font-medium text-slate-800" dir="ltr">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between border-t border-beige-100 pt-3">
              <span className="text-slate-500">תאריך הצטרפות</span>
              <span className="font-medium text-slate-800">{formatDate(profile.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-beige-100 pt-3">
              <span className="text-slate-500">סיסמה</span>
              <span className="font-medium text-slate-800">
                {profile.passwordChanged ? 'שונתה על ידך' : 'סיסמה ראשונית'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setModal(true)}
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            שינוי סיסמה
          </button>
        </div>

      </div>

      {showModal && (
        <ChangePasswordModal
          email={profile.email}
          onClose={() => setModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
          <div className="bg-green-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl">
            הסיסמה שונתה בהצלחה ✓
          </div>
        </div>
      )}
    </AppLayout>
  )
}

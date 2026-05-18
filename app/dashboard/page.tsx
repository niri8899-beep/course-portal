'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { overallPercent, fetchCompleted } from '@/lib/progress'
import { courseData, TOTAL_LESSONS, introVideo } from '@/lib/courseData'

export default function DashboardPage() {
  const router = useRouter()
  const [progress, setProgress]       = useState(0)
  const [completed, setCompleted]     = useState(0)
  const [ready, setReady]             = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (u) {
      fetchCompleted(u).then(set => {
        setProgress(overallPercent(set))
        setCompleted(set.size)
      })
    }
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const transBase = 'transition-all duration-700'
  const shown     = `${transBase} opacity-100 translate-y-0`
  const hidden    = `${transBase} opacity-0 translate-y-5`

  return (
    <AppLayout>
      <div className="space-y-7">

        {/* Hero */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-bl from-primary-700 to-primary-900 text-white p-7 sm:p-9 ${ready ? shown : hidden}`}>
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo.png"
                alt="אנגלית בקלות"
                className="w-14 h-14 object-contain rounded-xl bg-white/10 p-1"
              />
              <div>
                <p className="font-bold text-white text-base leading-tight">אנגלית בקלות</p>
                <p className="text-primary-200 text-xs">by Nirit</p>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-3">
              ברוכים הבאים לקורס:<br />
              אנגלית לקריירה — להתקבל ולדבר בביטחון
            </h1>
            <p className="text-primary-100 text-sm leading-relaxed max-w-xl">
              קורס דיגיטלי ומעשי שיעזור לכם לדבר שוטף באנגלית ולהרגיש בטוחים יותר בראיונות עבודה ובשיחות מקצועיות.
            </p>
            <button
              onClick={() => router.push('/modules')}
              className="mt-6 inline-flex items-center gap-2 bg-white text-primary-700 font-semibold
                         px-6 py-3 rounded-xl hover:bg-primary-50 active:scale-95
                         transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              התחלת למידה
              <span className="text-base">←</span>
            </button>
          </div>
        </div>

        {/* Intro video */}
        <div className={`${ready ? shown : hidden} delay-100`}>
          <h2 className="font-semibold text-slate-800 mb-4">{introVideo.title}</h2>
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`https://player.vimeo.com/video/${introVideo.vimeoId}${
                  introVideo.vimeoHash ? `?h=${introVideo.vimeoHash}&` : '?'
                }title=0&byline=0&portrait=0`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={introVideo.title}
              />
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className={`bg-white rounded-3xl border border-beige-200 shadow-sm p-6 ${ready ? shown : hidden} delay-100`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">ההתקדמות שלי</h2>
            <span className="text-2xl font-bold text-primary-600">{progress}%</span>
          </div>
          <div className="w-full bg-beige-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-l from-primary-500 to-primary-700 transition-all duration-1000 ease-out"
              style={{ width: ready ? `${progress}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{completed} שיעורים הושלמו</span>
            <span>{TOTAL_LESSONS - completed} נותרו</span>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-4 ${ready ? shown : hidden}`} style={{ transitionDelay: '150ms' }}>
          {[
            { value: courseData.modules.length, label: 'מודולים',  color: 'text-primary-600' },
            { value: TOTAL_LESSONS,             label: 'שיעורים',  color: 'text-primary-600' },
            { value: completed,                 label: 'הושלמו',   color: 'text-amber-500'   },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-beige-200 shadow-sm p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Module quick links */}
        <div className={ready ? shown : hidden} style={{ transitionDelay: '200ms' }}>
          <h2 className="font-semibold text-slate-800 mb-4">המודולים שלי</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {courseData.modules.map(m => (
              <button
                key={m.id}
                onClick={() => router.push(`/module/${m.id}`)}
                className="bg-white rounded-2xl border border-beige-200 shadow-sm p-4
                           hover:shadow-md hover:border-primary-200 active:scale-95
                           transition-all duration-200 flex items-center gap-4 text-right group"
              >
                <div className="w-11 h-11 bg-beige-100 rounded-xl flex items-center justify-center text-xl
                               group-hover:bg-primary-50 transition-colors flex-shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400">מודול {m.id}</p>
                  <p className="font-medium text-slate-700 text-sm truncate">{m.title}</p>
                </div>
                <span className="text-slate-300 group-hover:text-primary-400 transition-colors text-sm">←</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}

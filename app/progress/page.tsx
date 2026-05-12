'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { overallPercent, modulePercent, getCompletedSet, isComplete } from '@/lib/progress'
import { courseData, TOTAL_LESSONS } from '@/lib/courseData'

export default function ProgressPage() {
  const router = useRouter()
  const [overall, setOverall]   = useState(0)
  const [modPct, setModPct]     = useState<Record<number, number>>({})
  const [total, setTotal]       = useState(0)
  const [ready, setReady]       = useState(false)
  const [user, setUser]         = useState<string | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      setOverall(overallPercent(u))
      setTotal(getCompletedSet(u).size)
      const map: Record<number, number> = {}
      courseData.modules.forEach(m => { map[m.id] = modulePercent(u, m.id, m.lessons.length) })
      setModPct(map)
    }
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const shown  = 'opacity-100 translate-y-0'
  const hidden = 'opacity-0 translate-y-5'

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ההתקדמות שלי</h1>
          <p className="text-slate-500 text-sm mt-1">סקירת ההתקדמות בכל המודולים</p>
        </div>

        {/* Overall card */}
        <div className={`rounded-3xl bg-gradient-to-bl from-primary-700 to-primary-900 text-white p-7
                         transition-all duration-600 ${ready ? shown : hidden}`}>
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-primary-200 text-sm">התקדמות כוללת</p>
              <p className="text-5xl font-bold mt-1 leading-none">{overall}%</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">{total}/{TOTAL_LESSONS}</p>
              <p className="text-primary-200 text-sm">שיעורים</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: ready ? `${overall}%` : '0%' }}
            />
          </div>

          {overall === 100 && (
            <div className="mt-5 bg-white/15 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-bold">מדהים! השלמת את הקורס כולו!</p>
              <p className="text-primary-200 text-sm mt-1">כל הכבוד על ההשקעה והעמידה ביעד</p>
            </div>
          )}
        </div>

        {/* Per-module */}
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">פירוט לפי מודול</h2>
          {courseData.modules.map((m, idx) => {
            const pct   = modPct[m.id] ?? 0
            const done  = pct === 100
            const delay = { transitionDelay: `${100 + idx * 70}ms` }
            const vis   = ready ? shown : hidden

            return (
              <div
                key={m.id}
                className={`bg-white rounded-2xl border p-5 transition-all duration-500
                            ${done ? 'border-green-200' : 'border-beige-200'}
                            ${vis}`}
                style={delay}
              >
                {/* Header row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                                   ${done ? 'bg-green-50' : 'bg-beige-100'}`}>
                    {done ? '✅' : m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 truncate">{m.title}</span>
                      {done && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                          הושלם
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">מודול {m.id} · {m.lessons.length} שיעורים</p>
                  </div>
                  <button
                    onClick={() => router.push(`/module/${m.id}`)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
                  >
                    המשך →
                  </button>
                </div>

                {/* Lesson dots */}
                <div className="flex gap-1.5 mb-3">
                  {m.lessons.map(lesson => {
                    const lessonDone = user ? isComplete(user, m.id, lesson.id) : false
                    return (
                      <button
                        key={lesson.id}
                        title={lesson.title}
                        onClick={() => router.push(`/lesson/${m.id}/${lesson.id}`)}
                        className={`flex-1 h-2 rounded-full transition-colors hover:opacity-70
                                    ${lessonDone ? 'bg-green-500' : 'bg-beige-200'}`}
                      />
                    )
                  })}
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-beige-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-1000 ease-out
                                  ${done ? 'bg-green-500' : 'bg-primary-500'}`}
                      style={{ width: ready ? `${pct}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-left">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </AppLayout>
  )
}

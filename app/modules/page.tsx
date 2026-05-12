'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { modulePercent } from '@/lib/progress'
import { courseData } from '@/lib/courseData'

export default function ModulesPage() {
  const router = useRouter()
  const [modPct, setModPct] = useState<Record<number, number>>({})
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (u) {
      const map: Record<number, number> = {}
      courseData.modules.forEach(m => { map[m.id] = modulePercent(u, m.id, m.lessons.length) })
      setModPct(map)
    }
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">מודולי הקורס</h1>
          <p className="text-slate-500 text-sm mt-1">בחרו מודול והתחילו ללמוד</p>
        </div>

        <div className="space-y-4">
          {courseData.modules.map((m, idx) => {
            const pct       = modPct[m.id] ?? 0
            const done      = pct === 100
            const style     = { transitionDelay: `${idx * 70}ms` }
            const visible   = ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'

            return (
              <div
                key={m.id}
                onClick={() => router.push(`/module/${m.id}`)}
                className={`bg-white rounded-3xl border shadow-sm cursor-pointer
                            hover:shadow-lg active:scale-[0.99] group
                            transition-all duration-300 overflow-hidden
                            ${done ? 'border-green-200' : 'border-beige-200 hover:border-primary-200'}
                            ${visible}`}
                style={style}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                                    transition-colors duration-200
                                    ${done ? 'bg-green-50' : 'bg-beige-100 group-hover:bg-primary-50'}`}>
                      {done ? '✅' : m.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
                          מודול {m.id}
                        </span>
                        {done && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                            ✓ הושלם
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-800 leading-tight">{m.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{m.description}</p>
                      <p className="text-xs text-slate-400 mt-1">📖 {m.lessons.length} שיעורים</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-300 group-hover:text-primary-400 transition-colors pt-1 flex-shrink-0">
                      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>התקדמות</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-beige-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out
                                    ${done ? 'bg-green-500' : 'bg-gradient-to-l from-primary-500 to-primary-700'}`}
                        style={{ width: ready ? `${pct}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}

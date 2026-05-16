'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { isComplete, modulePercent } from '@/lib/progress'
import { courseData } from '@/lib/courseData'

export default function ModulePage() {
  const { id }    = useParams<{ id: string }>()
  const router    = useRouter()
  const moduleId  = parseInt(id)
  const module    = courseData.modules.find(m => m.id === moduleId)

  const [doneMap, setDoneMap]   = useState<Record<number, boolean>>({})
  const [pct, setPct]           = useState(0)
  const [ready, setReady]       = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (u && module) {
      const map: Record<number, boolean> = {}
      module.lessons.forEach(l => { map[l.id] = isComplete(u, moduleId, l.id) })
      setDoneMap(map)
      setPct(modulePercent(u, moduleId, module.lessons.length))
    }
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [moduleId, module])

  if (!module) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-slate-500">
          <p>מודול לא נמצא</p>
          <button onClick={() => router.push('/modules')} className="mt-4 text-primary-600 hover:underline text-sm">
            חזרה למודולים
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">

        {/* Back */}
        <button
          onClick={() => router.push('/modules')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          חזרה למודולים
        </button>

        {/* Module header */}
        <div className={`rounded-3xl bg-gradient-to-bl from-primary-700 to-primary-900 text-white p-6
                         transition-all duration-500 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
              {module.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary-200 text-xs mb-1">מודול {module.id} / {courseData.modules.length}</p>
              <h1 className="text-xl font-bold leading-tight">{module.title}</h1>
              <p className="text-primary-100 text-sm mt-1">{module.description}</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-xs text-primary-200 mb-1.5">
              <span>התקדמות במודול</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: ready ? `${pct}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-800">שיעורים</h2>
          {module.lessons.map((lesson, idx) => {
            const done    = doneMap[lesson.id]
            const style   = { transitionDelay: `${80 + idx * 55}ms` }
            const visible = ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'

            return (
              <div
                key={lesson.id}
                onClick={() => router.push(`/lesson/${moduleId}/${lesson.id}`)}
                className={`bg-white rounded-2xl border p-4 sm:p-5 cursor-pointer group
                            hover:shadow-md active:scale-[0.99] transition-all duration-200
                            ${done ? 'border-green-200' : 'border-beige-200 hover:border-primary-200'}
                            ${visible}`}
                style={style}
              >
                <div className="flex items-center gap-4">
                  {/* Number / check */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                                   flex-shrink-0 transition-colors duration-200
                                   ${done
                                     ? 'bg-green-100 text-green-600'
                                     : 'bg-beige-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600'
                                   }`}>
                    {done ? '✓' : lesson.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-slate-400">שיעור {lesson.id}</span>
                      {done && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">הושלם</span>
                      )}
                    </div>
                    <p className="font-medium text-slate-800 text-sm leading-snug">{lesson.title}</p>
                  </div>

                  {/* Arrow */}
                  <div className="text-slate-300 group-hover:text-primary-400 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

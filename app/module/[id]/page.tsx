'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { isInSet, modulePercent, fetchCompleted } from '@/lib/progress'
import { courseData, outroVideo, contactLinks } from '@/lib/courseData'

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
      fetchCompleted(u).then(set => {
        const map: Record<number, boolean> = {}
        module.lessons.forEach(l => { map[l.id] = isInSet(set, moduleId, l.id) })
        setDoneMap(map)
        setPct(modulePercent(set, moduleId, module.lessons.length))
      })
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

        {/* Closing video — shown at the end of the last module */}
        {moduleId === courseData.modules.length && (
          <div className="space-y-3 pt-2">
            <h2 className="font-semibold text-slate-800">סרטון סיום</h2>

            <div className={`transition-all duration-500 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                🎉 סיום הקורס
              </span>
              <h3 className="text-lg font-bold text-slate-800 leading-snug mt-2">
                {outroVideo.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1.5">כל הכבוד שהגעת עד לכאן!</p>
            </div>

            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={`https://player.vimeo.com/video/${outroVideo.vimeoId}${
                    outroVideo.vimeoHash ? `?h=${outroVideo.vimeoHash}&` : '?'
                  }title=0&byline=0&portrait=0&color=2563eb`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={outroVideo.title}
                />
              </div>
            </div>

            {contactLinks.length > 0 && (
              <div className="bg-white rounded-3xl border border-beige-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-1">בואו נישאר בקשר</h3>
                <p className="text-sm text-slate-500 mb-4">
                  יש לכם שאלה? מוזמנים ליצור איתי קשר בכל אחת מהדרכים הבאות:
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {contactLinks.map(link => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                                 bg-beige-100 text-slate-700 font-medium text-sm
                                 hover:bg-primary-50 hover:text-primary-700
                                 active:scale-95 transition-all duration-200"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  )
}

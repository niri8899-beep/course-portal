'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { isComplete, markComplete } from '@/lib/progress'
import { courseData } from '@/lib/courseData'

// Public Vimeo sample videos used as placeholders
const VIMEO_IDS = ['76979871', '148751763', '168670449', '217499569', '287093939']

export default function LessonPage() {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams<{ moduleId: string; lessonId: string }>()
  const router    = useRouter()
  const mId       = parseInt(mIdStr)
  const lId       = parseInt(lIdStr)
  const module    = courseData.modules.find(m => m.id === mId)
  const lesson    = module?.lessons.find(l => l.id === lId)

  const [done, setDone]             = useState(false)
  const [toast, setToast]           = useState(false)
  const [ready, setReady]           = useState(false)
  const [user, setUser]             = useState<string | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u && module && lesson) setDone(isComplete(u, mId, lId))
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [mId, lId, module, lesson])

  function handleMarkComplete() {
    if (!user || !module || !lesson || done) return
    markComplete(user, mId, lId)
    setDone(true)
    setToast(true)
    setTimeout(() => setToast(false), 3200)
  }

  function handleDownloadPDF() {
    // Placeholder — replace with real download URL
    alert(`הורדת קובץ PDF:\n${lesson?.title}`)
  }

  if (!module || !lesson) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-slate-500">
          <p>שיעור לא נמצא</p>
          <button onClick={() => router.push('/modules')} className="mt-4 text-primary-600 hover:underline text-sm">
            חזרה למודולים
          </button>
        </div>
      </AppLayout>
    )
  }

  const vimeoId   = VIMEO_IDS[(lId - 1) % VIMEO_IDS.length]
  const prevLesson = module.lessons.find(l => l.id === lId - 1)
  const nextLesson = module.lessons.find(l => l.id === lId + 1)
  const nextMod    = courseData.modules.find(m => m.id === mId + 1)

  const shown  = 'opacity-100 translate-y-0'
  const hidden = 'opacity-0 translate-y-4'

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <button onClick={() => router.push('/modules')} className="hover:text-primary-600 transition-colors">
            מודולים
          </button>
          <span>/</span>
          <button onClick={() => router.push(`/module/${mId}`)} className="hover:text-primary-600 transition-colors">
            {module.title}
          </button>
          <span>/</span>
          <span className="text-slate-600 font-medium">שיעור {lId}</span>
        </nav>

        {/* Lesson title */}
        <div className={`transition-all duration-500 ${ready ? shown : hidden}`}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              מודול {mId} · שיעור {lId}
            </span>
            {done && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                ✓ הושלם
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">{lesson.title}</h1>
          <p className="text-sm text-slate-400 mt-1.5">⏱ {lesson.duration} · 📚 {module.title}</p>
        </div>

        {/* Video player */}
        <div className={`bg-slate-900 rounded-3xl overflow-hidden shadow-2xl
                         transition-all duration-500 delay-100 ${ready ? shown : hidden}`}>
          <div className="relative" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&color=2563eb`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className={`flex flex-col sm:flex-row gap-3
                         transition-all duration-500 delay-200 ${ready ? shown : hidden}`}>
          <button
            onClick={handleMarkComplete}
            disabled={done}
            className={[
              'flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200',
              'flex items-center justify-center gap-2 text-sm',
              done
                ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                : 'bg-primary-600 hover:bg-primary-700 active:scale-95 text-white shadow-md hover:shadow-lg',
            ].join(' ')}
          >
            <span className="text-base">{done ? '✓' : '○'}</span>
            <span>{done ? 'השיעור הושלם!' : 'סמן כהושלם'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-semibold text-sm
                       bg-white border border-beige-300 text-slate-700 shadow-sm
                       hover:bg-beige-50 hover:shadow-md active:scale-95
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>📄</span>
            <span>הורדת קובץ PDF</span>
          </button>
        </div>

        {/* Lesson nav */}
        <div className={`flex justify-between gap-4 pt-4 border-t border-beige-200
                         transition-all duration-500 delay-300 ${ready ? shown : hidden}`}>
          {prevLesson ? (
            <button
              onClick={() => router.push(`/lesson/${mId}/${prevLesson.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
                         bg-white border border-beige-200 text-slate-600
                         hover:bg-beige-50 hover:shadow-sm active:scale-95 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              שיעור קודם
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button
              onClick={() => router.push(`/lesson/${mId}/${nextLesson.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                         bg-primary-600 hover:bg-primary-700 active:scale-95 text-white
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              שיעור הבא
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : nextMod ? (
            <button
              onClick={() => router.push(`/module/${nextMod.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                         bg-primary-600 hover:bg-primary-700 active:scale-95 text-white
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>המודול הבא ←</span>
            </button>
          ) : (
            <button
              onClick={() => router.push('/progress')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                         bg-amber-500 hover:bg-amber-600 active:scale-95 text-white
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              🎉 ראה את ההתקדמות שלי
            </button>
          )}
        </div>

      </div>

      {/* Completion toast */}
      {toast && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
          <div className="bg-green-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl
                          flex items-center gap-2.5 text-sm font-medium animate-slide-up">
            <span className="text-lg">🎉</span>
            <span>כל הכבוד! השיעור סומן כהושלם</span>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

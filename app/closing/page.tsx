'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { getCurrentUser } from '@/lib/auth'
import { fetchCompleted, overallPercent } from '@/lib/progress'
import { outroVideo, contactLinks } from '@/lib/courseData'

export default function ClosingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) { router.replace('/'); return }
    fetchCompleted(u).then(set => {
      setAllowed(overallPercent(set) === 100)
    })
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [router])

  const shown  = 'opacity-100 translate-y-0'
  const hidden = 'opacity-0 translate-y-4'

  if (allowed === null) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (!allowed) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-slate-500">
          <p>סרטון הסיום ייפתח לאחר השלמת כל הקורס.</p>
          <button onClick={() => router.push('/modules')} className="mt-4 text-primary-600 hover:underline text-sm">
            חזרה למודולים
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">

        {/* Header */}
        <div className={`transition-all duration-500 ${ready ? shown : hidden}`}>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            🎉 סיום הקורס
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mt-2">
            {outroVideo.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">כל הכבוד שהגעת עד לכאן!</p>
        </div>

        {/* Video player */}
        <div className={`bg-slate-900 rounded-3xl overflow-hidden shadow-2xl
                         transition-all duration-500 delay-100 ${ready ? shown : hidden}`}>
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

        {/* Contact links */}
        {contactLinks.length > 0 && (
          <div className={`bg-white rounded-3xl border border-beige-200 shadow-sm p-6
                           transition-all duration-500 delay-200 ${ready ? shown : hidden}`}>
            <h2 className="font-semibold text-slate-800 mb-1">בואו נישאר בקשר</h2>
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
    </AppLayout>
  )
}

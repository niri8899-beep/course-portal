'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/lib/auth'
import Sidebar from './Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser]           = useState<string | null>(null)
  const [mounted, setMounted]     = useState(false)
  const [sidebarOpen, setSidebar] = useState(false)

  useEffect(() => {
    setMounted(true)
    const u = getCurrentUser()
    if (!u) { router.replace('/'); return }
    setUser(u)
  }, [router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-beige-100 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* Sidebar — first in DOM → right side in RTL flex */}
      <Sidebar
        userEmail={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
      />

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-beige-200
                           flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebar(true)}
            className="p-2 rounded-xl hover:bg-beige-100 transition-colors"
            aria-label="פתח תפריט"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="אנגלית בקלות" className="w-7 h-7 object-contain" />
            <span className="font-bold text-primary-900 text-sm">אנגלית בקלות</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

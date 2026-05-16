'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  userEmail: string
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { href: '/dashboard', label: 'דף הבית',   icon: '🏠' },
  { href: '/modules',   label: 'מודולים',    icon: '📚' },
  { href: '/progress',  label: 'התקדמות',   icon: '📊' },
  { href: '/closing',   label: 'סרטון סיום', icon: '🎉' },
]

export default function Sidebar({ userEmail, onLogout, isOpen, onClose }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={[
        'fixed top-0 right-0 h-full w-72 bg-white z-30 flex flex-col',
        'border-l border-beige-200 shadow-xl',
        'transform transition-transform duration-300 ease-in-out',
        'lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {/* Brand */}
      <div className="px-5 py-4 border-b border-beige-100">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="אנגלית בקלות"
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-primary-900 text-sm leading-tight truncate">אנגלית בקלות</p>
            <p className="text-xs text-slate-400 mt-0.5">by Nirit</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                active
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-beige-100 hover:text-primary-700',
              ].join(' ')}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User / logout */}
      <div className="p-4 border-t border-beige-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-beige-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm">👤</span>
          </div>
          <p className="text-xs text-slate-600 truncate flex-1 min-w-0" dir="ltr">{userEmail}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full py-2 rounded-xl text-sm text-slate-500 hover:text-red-500
                     hover:bg-red-50 transition-all duration-200 font-medium"
        >
          התנתקות
        </button>
      </div>
    </aside>
  )
}

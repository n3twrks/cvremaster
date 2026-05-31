'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Mail, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/cv', label: 'Mon CV', Icon: FileText },
  { href: '/cover-letters', label: 'Lettres', Icon: Mail },
]

const bottomItems = [
  { href: '/settings', label: 'Compte', Icon: User },
]

export default function NavRail() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="flex flex-col items-center w-14 shrink-0 bg-[#FAFAF8] border-r border-[#E5E4E0] h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center h-14 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#1A1A18] flex items-center justify-center">
          <span className="text-[#FAFAF8] text-[10px] font-mono font-medium tracking-tight">CV</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-[#E5E4E0] mb-2" />

      {/* Main nav */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isActive(href) ? 'bg-[#1A1A18] text-[#FAFAF8]' : 'text-[#9D9C98] hover:bg-[#F0EFEC] hover:text-[#1A1A18]'
            }`}
          >
            <Icon size={18} />
          </Link>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1 pb-4">
        {bottomItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isActive(href) ? 'bg-[#1A1A18] text-[#FAFAF8]' : 'text-[#9D9C98] hover:bg-[#F0EFEC] hover:text-[#1A1A18]'
            }`}
          >
            <Icon size={18} />
          </Link>
        ))}
      </div>
    </nav>
  )
}

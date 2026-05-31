'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E4E0]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A18] flex items-center justify-center shrink-0">
            <span className="text-[#FAFAF8] text-[10px] font-mono font-medium">CV</span>
          </div>
          <span className="font-display text-lg text-[#1A1A18]">CVRemaster</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cv"
            className="text-sm font-body text-[#6B6A66] hover:text-[#1A1A18] transition-colors hidden sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/cv"
            className="px-4 py-2 bg-[#1B4332] text-white text-sm font-body font-medium rounded-lg hover:bg-[#163A2B] transition-colors"
          >
            Créer mon CV
          </Link>
        </div>
      </div>
    </nav>
  )
}

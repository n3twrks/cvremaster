import Link from 'next/link'

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-[#E5E4E0] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A18] flex items-center justify-center shrink-0">
                <span className="text-[#FAFAF8] text-[10px] font-mono font-medium">CV</span>
              </div>
              <span className="font-display text-lg text-[#1A1A18]">CVRemaster</span>
            </Link>
            <p className="text-sm font-body text-[#9D9C98] leading-relaxed max-w-xs">
              Créez, optimisez et partagez votre CV grâce à l&apos;intelligence artificielle.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-body font-medium text-[#1A1A18] mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Créer mon CV', href: '/cv' },
                { label: 'Lettres de motivation', href: '/cover-letters' },
                { label: 'Templates', href: '/cv' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm font-body text-[#6B6A66] hover:text-[#1A1A18] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-body font-medium text-[#1A1A18] mb-4 text-sm uppercase tracking-wider">À propos</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Compte', href: '/settings' },
                { label: 'Mentions légales', href: '#' },
                { label: 'Politique de confidentialité', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm font-body text-[#6B6A66] hover:text-[#1A1A18] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E5E4E0] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs font-body text-[#9D9C98]">
            © {new Date().getFullYear()} CVRemaster. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

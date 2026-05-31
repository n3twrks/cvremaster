import Link from 'next/link'

export default function CTABannerSection() {
  return (
    <section className="bg-[#1B4332] py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
            Créez et éditez votre CV<br className="hidden sm:block" />
            en quelques clics, sans limites.
          </h2>
          <p className="text-[#A7D9B8] font-body text-lg max-w-xl">
            Démarquez-vous avec un template élégant et décrochez l&apos;entretien de vos rêves.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/cv"
              className="px-6 py-3 bg-[#E8A838] text-[#1A1A18] font-body font-medium rounded-lg hover:bg-[#D4962E] transition-colors text-center"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="#essayer"
              className="px-6 py-3 border border-[#A7D9B8] text-[#A7D9B8] font-body font-medium rounded-lg hover:bg-[#163A2B] transition-colors text-center"
            >
              Importer mon CV
            </Link>
          </div>
        </div>

        {/* Decorative illustration */}
        <div className="shrink-0 w-48 h-48 relative hidden lg:flex items-center justify-center">
          <div className="w-40 h-48 bg-white/10 rounded-2xl border border-white/20 p-4 space-y-3">
            <div className="h-3 bg-white/40 rounded w-24" />
            <div className="h-2 bg-white/20 rounded w-32" />
            <div className="h-px bg-white/10" />
            {[75, 90, 65, 80].map((w, i) => (
              <div key={i} className="h-1.5 bg-white/20 rounded" style={{ width: `${w}%` }} />
            ))}
            <div className="absolute -top-2 -right-2 bg-[#E8A838] text-[#1A1A18] text-[10px] font-mono font-bold px-2 py-1 rounded-full">
              92
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

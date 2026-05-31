import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-[#FAFAF8] pt-16 pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D8EDDF] border border-[#A7D9B8] rounded-full text-xs font-body font-medium text-[#1B4332]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
            Analyse IA par section · Nouveau
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.1] text-[#1A1A18]">
            Créez votre CV parfait<br />
            <span className="text-[#1B4332]">en quelques minutes</span>
          </h1>

          <p className="text-[#6B6A66] font-body text-lg leading-relaxed max-w-xl">
            L&apos;IA analyse, améliore et met en forme votre CV pour décrocher plus d&apos;entretiens. Importez votre PDF existant ou partez de zéro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <Link
              href="/cv"
              className="w-full sm:w-auto px-6 py-3 bg-[#1B4332] text-white font-body font-medium rounded-lg hover:bg-[#163A2B] transition-colors text-center"
            >
              Créer mon CV gratuitement
            </Link>
            <Link
              href="#essayer"
              className="w-full sm:w-auto px-6 py-3 border border-[#E5E4E0] text-[#1A1A18] font-body font-medium rounded-lg hover:bg-[#F4F3F0] transition-colors text-center"
            >
              Importer mon CV PDF
            </Link>
          </div>

          <p className="text-xs font-body text-[#9D9C98]">Gratuit · Aucune carte requise</p>
        </div>

        {/* Right — decorative CV mockup */}
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
          <div className="relative">
            {/* Main card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E4E0] p-5 space-y-4">
              {/* Header area */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1B4332] shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-[#1A1A18] rounded w-36" />
                  <div className="h-2.5 bg-[#6B6A66] rounded w-48" />
                  <div className="flex gap-1.5 mt-1">
                    <div className="h-2 bg-[#E5E4E0] rounded w-20" />
                    <div className="h-2 bg-[#E5E4E0] rounded w-24" />
                  </div>
                </div>
              </div>
              {/* Divider */}
              <div className="h-px bg-[#E5E4E0]" />
              {/* Experience */}
              <div className="space-y-2">
                <div className="h-2.5 bg-[#1B4332] rounded w-24" />
                {[80, 95, 70].map((w, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-2 bg-[#1A1A18] rounded" style={{ width: `${w}%` }} />
                    <div className="h-1.5 bg-[#E5E4E0] rounded w-full" />
                    <div className="h-1.5 bg-[#E5E4E0] rounded" style={{ width: `${w - 15}%` }} />
                  </div>
                ))}
              </div>
              <div className="h-px bg-[#E5E4E0]" />
              {/* Skills */}
              <div className="space-y-2">
                <div className="h-2.5 bg-[#1B4332] rounded w-20" />
                <div className="flex flex-wrap gap-1.5">
                  {[60, 45, 70, 55, 40].map((w, i) => (
                    <div key={i} className="h-5 bg-[#D8EDDF] rounded-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* AI badge floating */}
            <div className="absolute -top-3 -right-3 bg-[#E8A838] text-[#1A1A18] text-xs font-body font-medium px-3 py-1.5 rounded-full shadow-md">
              ✨ Analyse IA
            </div>

            {/* Score badge */}
            <div className="absolute -bottom-3 -left-3 bg-white border border-[#E5E4E0] rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#D8EDDF] flex items-center justify-center">
                <span className="text-[#1B4332] text-[10px] font-mono font-bold">92</span>
              </div>
              <span className="text-xs font-body text-[#1A1A18] font-medium">Score ATS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Upload, Sparkles, LayoutTemplate, Download } from 'lucide-react'

const STEPS = [
  {
    Icon: Upload,
    number: '01',
    title: 'Importez ou rédigez',
    description: 'Glissez votre CV PDF existant ou commencez depuis une page blanche.',
  },
  {
    Icon: Sparkles,
    number: '02',
    title: "L'IA améliore votre contenu",
    description: 'Notre IA analyse chaque section, reformule les bullet points et maximise votre score ATS.',
  },
  {
    Icon: LayoutTemplate,
    number: '03',
    title: 'Choisissez votre template',
    description: '6 templates professionnels validés par des recruteurs. Un click pour changer.',
  },
  {
    Icon: Download,
    number: '04',
    title: 'Téléchargez et postulez',
    description: 'Export en PDF haute qualité, prêt à envoyer aux recruteurs.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A18]">
            Créez votre CV en 4 étapes
          </h2>
          <p className="mt-3 text-[#6B6A66] font-body text-lg">Simple, rapide, efficace.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ Icon, number, title, description }, i) => (
            <div key={i} className="relative bg-[#FAFAF8] border border-[#E5E4E0] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#D8EDDF] flex items-center justify-center">
                  <Icon size={18} className="text-[#1B4332]" />
                </div>
                <span className="font-mono text-2xl font-medium text-[#E5E4E0]">{number}</span>
              </div>
              <div>
                <h3 className="font-body font-medium text-[#1A1A18] mb-1.5">{title}</h3>
                <p className="font-body text-sm text-[#6B6A66] leading-relaxed">{description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 text-[#E5E4E0] z-10">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

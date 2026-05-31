import { Sparkles, BarChart2, ShieldCheck, FileDown, Mail, LayoutTemplate } from 'lucide-react'

const FEATURES = [
  {
    Icon: Sparkles,
    title: 'Éditeur IA en temps réel',
    description: "Chattez avec l'IA pour reformuler, compléter ou améliorer n'importe quelle partie de votre CV.",
  },
  {
    Icon: BarChart2,
    title: 'Analyse par section',
    description: 'Chaque section reçoit un score avec des conseils ciblés pour maximiser vos chances.',
  },
  {
    Icon: ShieldCheck,
    title: 'Optimisation ATS',
    description: 'Votre CV est structuré pour passer les filtres automatiques des logiciels de recrutement.',
  },
  {
    Icon: FileDown,
    title: 'Export PDF & HTML',
    description: 'Téléchargez votre CV en haute qualité ou partagez-le via un lien direct.',
  },
  {
    Icon: Mail,
    title: 'Lettres de motivation',
    description: "Générez une lettre de motivation personnalisée en quelques secondes grâce à l'IA.",
  },
  {
    Icon: LayoutTemplate,
    title: '6 templates professionnels',
    description: "Des designs modernes adaptés à tous les secteurs et niveaux d'expérience.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#FAFAF8] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A18]">
            6 raisons d&apos;utiliser CVRemaster
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ Icon, title, description }, i) => (
            <div key={i} className="bg-white border border-[#E5E4E0] rounded-xl p-6 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-[#D8EDDF] flex items-center justify-center">
                <Icon size={20} className="text-[#1B4332]" />
              </div>
              <h3 className="font-body font-medium text-[#1A1A18]">{title}</h3>
              <p className="font-body text-sm text-[#6B6A66] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

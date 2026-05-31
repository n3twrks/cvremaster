import Link from 'next/link'

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    preview: (
      <div className="w-full h-full bg-white flex">
        <div className="flex-1 p-3 space-y-2">
          <div className="h-3 bg-[#1A1A18] rounded w-24" />
          <div className="h-1.5 bg-[#6B6A66] rounded w-32" />
          <div className="h-px bg-[#E5E4E0] my-1" />
          <div className="space-y-1">
            {[70, 90, 80].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
          </div>
          <div className="h-px bg-[#E5E4E0] my-1" />
          <div className="space-y-1">
            {[85, 65, 75].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sidebar-dark',
    name: 'Sidebar Dark',
    preview: (
      <div className="w-full h-full flex">
        <div className="w-1/3 bg-[#2D2D2B] p-2 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#6B6A66] mx-auto" />
          {[60, 75, 50].map((w, i) => <div key={i} className="h-1 bg-[#6B6A66] rounded" style={{ width: `${w}%` }} />)}
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          {[80, 90, 70, 85, 65].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    ),
  },
  {
    id: 'teal-horizontal',
    name: 'Teal Horizontal',
    preview: (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="h-8 bg-[#0D9488] px-3 flex items-end pb-1">
          <div className="h-2.5 bg-white rounded w-20 opacity-90" />
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          {[90, 75, 85, 65, 80].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    ),
  },
  {
    id: 'teal-sidebar',
    name: 'Teal Sidebar',
    preview: (
      <div className="w-full h-full flex">
        <div className="w-1/3 bg-[#F0FDFB] border-r border-[#99F6E4] p-2 space-y-1.5">
          {[60, 45, 70, 55].map((w, i) => <div key={i} className="h-1 bg-[#0D9488] rounded opacity-50" style={{ width: `${w}%` }} />)}
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          {[80, 90, 70, 85].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    ),
  },
  {
    id: 'navy-dark',
    name: 'Navy Dark',
    preview: (
      <div className="w-full h-full flex">
        <div className="w-2/5 bg-[#1E3A5F] p-2 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#4A7AB5] mx-auto" />
          {[70, 55, 65].map((w, i) => <div key={i} className="h-1 bg-[#4A7AB5] rounded opacity-60" style={{ width: `${w}%` }} />)}
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          {[85, 70, 90, 65].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    ),
  },
  {
    id: 'pastel-sidebar',
    name: 'Pastel',
    preview: (
      <div className="w-full h-full flex">
        <div className="w-1/3 bg-[#FDDCB5] p-2 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#F4A261] mx-auto" />
          {[65, 50, 70].map((w, i) => <div key={i} className="h-1 bg-[#E8834A] rounded opacity-50" style={{ width: `${w}%` }} />)}
        </div>
        <div className="flex-1 p-2 space-y-1.5">
          {[80, 65, 85, 70].map((w, i) => <div key={i} className="h-1 bg-[#E5E4E0] rounded" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    ),
  },
]

export default function TemplateShowcaseSection() {
  return (
    <section className="bg-[#1B4332] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-white">
              Choisissez votre template professionnel
            </h2>
            <p className="mt-2 text-[#A7D9B8] font-body">
              Tous nos templates sont validés par des recruteurs et optimisés ATS.
            </p>
          </div>
          <Link
            href="/cv"
            className="shrink-0 px-5 py-2.5 bg-white text-[#1B4332] text-sm font-body font-medium rounded-lg hover:bg-[#F4F3F0] transition-colors"
          >
            Voir tous les templates →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TEMPLATES.map((tpl) => (
            <Link key={tpl.id} href="/cv" className="group">
              <div className="bg-white rounded-lg overflow-hidden aspect-[3/4] border-2 border-transparent group-hover:border-[#E8A838] transition-colors">
                {tpl.preview}
              </div>
              <p className="mt-2 text-center text-xs font-body text-[#A7D9B8] group-hover:text-white transition-colors">
                {tpl.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

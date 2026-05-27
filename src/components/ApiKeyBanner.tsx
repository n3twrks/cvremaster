'use client'

export default function ApiKeyBanner() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#D8EDDF] border-b border-[#E5E4E0] text-sm font-body">
      <span className="inline-block w-2 h-2 rounded-full bg-[#1B4332]" />
      <span className="text-[#1B4332] font-medium">API Gemini connectée</span>
    </div>
  )
}

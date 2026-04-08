export default function LoadingAudit() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-40 bg-neutral-200 rounded-lg mb-2" />
      <div className="h-4 w-28 bg-neutral-100 rounded mb-6" />

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-neutral-50 last:border-0">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-72 bg-neutral-200 rounded mb-1.5" />
              <div className="h-3 w-32 bg-neutral-100 rounded" />
            </div>
            <div className="h-3 w-24 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

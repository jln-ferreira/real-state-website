export default function LoadingProperties() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-32 bg-neutral-200 rounded-lg mb-2" />
          <div className="h-4 w-24 bg-neutral-100 rounded" />
        </div>
        <div className="h-9 w-36 bg-neutral-200 rounded-xl" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white border border-neutral-100 shadow-sm">
            <div className="h-8 w-12 bg-neutral-200 rounded mb-1" />
            <div className="h-3 w-16 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 h-9 bg-neutral-200 rounded-xl" />
        <div className="h-9 w-36 bg-neutral-200 rounded-xl" />
        <div className="h-9 w-36 bg-neutral-200 rounded-xl" />
      </div>

      {/* Table rows */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-neutral-50 last:border-0">
            <div className="w-10 h-10 rounded-lg bg-neutral-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-48 bg-neutral-200 rounded mb-1.5" />
              <div className="h-3 w-32 bg-neutral-100 rounded" />
            </div>
            <div className="hidden sm:block h-5 w-20 bg-neutral-100 rounded-full" />
            <div className="hidden md:block h-4 w-28 bg-neutral-200 rounded" />
            <div className="h-4 w-16 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoadingBlog() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-24 bg-neutral-200 rounded-lg mb-2" />
          <div className="h-4 w-20 bg-neutral-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-neutral-200 rounded-xl" />
      </div>

      {/* Search bar */}
      <div className="h-10 w-full max-w-sm bg-neutral-200 rounded-xl mb-6" />

      {/* Blog post rows */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-neutral-50 last:border-0">
            <div className="w-16 h-12 rounded-lg bg-neutral-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-64 bg-neutral-200 rounded mb-2" />
              <div className="h-3 w-40 bg-neutral-100 rounded" />
            </div>
            <div className="hidden sm:block h-5 w-16 bg-neutral-100 rounded-full" />
            <div className="h-4 w-20 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

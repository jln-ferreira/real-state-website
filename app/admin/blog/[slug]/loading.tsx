export default function LoadingBlogEdit() {
  return (
    <div className="w-full max-w-3xl animate-pulse">
      {/* Breadcrumb */}
      <div className="h-3 w-40 bg-neutral-200 rounded mb-4" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="h-7 w-48 bg-neutral-200 rounded-lg mb-2" />
          <div className="h-3 w-36 bg-neutral-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-neutral-100 rounded-xl" />
          <div className="h-9 w-32 bg-neutral-200 rounded-xl" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-8 rounded-t ${i === 0 ? 'w-24 bg-neutral-300' : 'w-20 bg-neutral-100'}`} />
        ))}
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 bg-neutral-200 rounded mb-1.5" />
            <div className={`w-full bg-neutral-100 rounded-lg ${i === 2 ? 'h-40' : 'h-10'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

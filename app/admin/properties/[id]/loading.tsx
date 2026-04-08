export default function LoadingPropertyEdit() {
  return (
    <div className="w-full max-w-3xl animate-pulse">
      {/* Breadcrumb */}
      <div className="h-3 w-48 bg-neutral-200 rounded mb-4" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="h-7 w-56 bg-neutral-200 rounded-lg mb-2" />
          <div className="h-3 w-40 bg-neutral-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-neutral-100 rounded-xl" />
          <div className="h-9 w-32 bg-neutral-200 rounded-xl" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-8 rounded-t ${i === 0 ? 'w-24 bg-neutral-300' : 'w-20 bg-neutral-100'}`} />
        ))}
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <div className="h-3 w-16 bg-neutral-200 rounded mb-1.5" />
          <div className="h-10 w-full bg-neutral-100 rounded-lg" />
        </div>
        <div>
          <div className="h-3 w-20 bg-neutral-200 rounded mb-1.5" />
          <div className="h-32 w-full bg-neutral-100 rounded-lg" />
        </div>
        <div>
          <div className="h-3 w-24 bg-neutral-200 rounded mb-1.5" />
          <div className="h-10 w-full bg-neutral-100 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function LoadingNewProperty() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-8 w-48 bg-neutral-200 rounded-lg animate-pulse mb-8" />
      <div className="bg-white rounded-2xl border border-[#E6E6EF] p-6 space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 bg-neutral-100 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

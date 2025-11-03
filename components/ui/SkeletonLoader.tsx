interface SkeletonLoaderProps {
  type: 'card' | 'form' | 'list'
  count?: number
  className?: string
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse" role="status" aria-live="polite">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-10 bg-gray-200 rounded w-20" />
        <div className="h-10 bg-gray-200 rounded w-20" />
      </div>
      <span className="sr-only">Loading configuration...</span>
    </div>
  )
}

function SkeletonForm() {
  return (
    <div className="bg-white rounded-lg p-6 animate-pulse" role="status" aria-live="polite">
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
        <div className="flex gap-3 justify-end">
          <div className="h-10 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
      </div>
      <span className="sr-only">Loading form...</span>
    </div>
  )
}

function SkeletonList({ count = 3 }: { count: number }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-2/5 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      ))}
      <span className="sr-only">Loading list...</span>
    </div>
  )
}

export function SkeletonLoader({ type, count = 3, className = '' }: SkeletonLoaderProps) {
  const Component = {
    card: SkeletonCard,
    form: SkeletonForm,
    list: () => <SkeletonList count={count} />
  }[type]

  return (
    <div className={className}>
      <Component />
    </div>
  )
}

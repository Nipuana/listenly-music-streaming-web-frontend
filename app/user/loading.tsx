import { Skeleton } from "@/components/ui/skeleton"

export default function UserLoading() {
  return (
    <div className="min-h-[60vh] p-6">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-8 w-1/3 mb-6" />

        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

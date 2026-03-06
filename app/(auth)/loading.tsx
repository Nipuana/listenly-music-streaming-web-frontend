import { Skeleton } from "@/components/ui/skeleton"

export default function AuthGroupLoading() {
  return (
    <div className="min-h-[50vh] p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </div>
  )
}

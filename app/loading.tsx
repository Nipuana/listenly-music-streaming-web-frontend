import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex">
        <aside className="w-72 p-6 space-y-4 border-r border-muted">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-6 space-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-8 w-1/3 mb-6" />

            <section className="grid gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </section>
          </div>
        </main>
      </div>

      <div className="h-20 border-t border-muted p-4">
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Liked songs list skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Card className="bg-card/60 backdrop-blur-md border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center space-x-4 hover:bg-accent/50 transition-colors">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
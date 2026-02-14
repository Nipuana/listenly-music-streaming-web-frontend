import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header skeleton */}
      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main content with sidebar offset */}
      <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary">
        {/* Sidebar skeleton */}
        <div className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-72 border-r bg-card/80 backdrop-blur-xl">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 p-4">
              <Skeleton className="h-12 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="ml-0 lg:ml-72 xl:ml-72 p-app-gutter md:p-app-gutter-md overflow-auto min-h-screen">
          <div className="app-container space-y-8">
            {/* Welcome Banner skeleton */}
            <Card className="border-none shadow-2xl bg-gradient-primary overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recently Played skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-card/60 backdrop-blur-md border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Your Playlists skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="bg-card/60 backdrop-blur-md border-border/50">
                    <CardContent className="p-4">
                      <Skeleton className="h-32 w-full rounded mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
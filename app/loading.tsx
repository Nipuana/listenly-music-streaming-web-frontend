import { Skeleton } from "../components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <Skeleton className="h-8 w-1/2 rounded-lg mb-2" />
        <Skeleton className="h-6 w-full rounded mb-2" />
        <Skeleton className="h-6 w-5/6 rounded mb-2" />
        <Skeleton className="h-6 w-2/3 rounded mb-2" />
        <Skeleton className="h-12 w-12 rounded-full mt-4" />
      </div>
    </div>
  );
}

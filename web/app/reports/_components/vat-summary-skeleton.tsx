import { Skeleton } from "@/components/ui/skeleton"

export function VatSummarySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

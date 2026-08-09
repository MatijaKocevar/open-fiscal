import { Skeleton } from "@/components/ui/skeleton"

export function InvoiceTableSkeleton() {
  return (
    <div className="border rounded-lg divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="section" aria-busy="true">
      <Skeleton className="loading-heading" />
      <div className="product-grid">
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} className="loading-card" />
        ))}
      </div>
    </div>
  );
}

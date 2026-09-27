import { Suspense } from "react";
import { Shop } from "@/components/catalog";
export const metadata = { title: "Shop the collection" };
export default function Page() {
  return (
    <Suspense fallback={<div className="section">Loading the good stuff…</div>}>
      <Shop />
    </Suspense>
  );
}

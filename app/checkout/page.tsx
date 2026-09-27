import { Suspense } from "react";
import { Checkout } from "@/components/checkout";
export const metadata = { title: "Checkout" };
export default function Page() {
  return (
    <Suspense fallback={<div className="section">Loading the good stuff…</div>}>
      <Checkout />
    </Suspense>
  );
}

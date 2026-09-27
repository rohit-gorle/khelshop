import { Suspense } from "react";
import { Success } from "@/components/checkout";
export const metadata = { title: "Your order" };
export default function Page() {
  return (
    <Suspense fallback={<div className="section">Loading the good stuff…</div>}>
      <Success />
    </Suspense>
  );
}

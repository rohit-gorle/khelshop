import { Suspense } from "react";
import { Lookbook } from "@/components/editorial";
export const metadata = { title: "Court culture lookbook" };
export default function Page() {
  return (
    <Suspense fallback={<div className="section">Loading the good stuff…</div>}>
      <Lookbook />
    </Suspense>
  );
}

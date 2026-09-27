import { Suspense } from "react";
import { About } from "@/components/editorial";
export const metadata = { title: "Our manifesto" };
export default function Page() {
  return (
    <Suspense fallback={<div className="section">Loading the good stuff…</div>}>
      <About />
    </Suspense>
  );
}

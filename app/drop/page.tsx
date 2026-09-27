import { Suspense } from "react";
import { Drop } from "@/components/home";
export const metadata = { title: "The next drop" };
export default function Page() {
  return (
    <Suspense fallback={<div className="section">Loading the good stuff…</div>}>
      <Drop />
    </Suspense>
  );
}

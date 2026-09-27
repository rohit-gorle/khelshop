import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/store";
import { Shell } from "@/components/shell";
export const metadata: Metadata = {
  metadataBase: new URL("https://khelshop.in"),
  title: {
    default: "Khelshop — Built for the bold.",
    template: "%s | Khelshop",
  },
  description:
    "Court-ready gear. Everyday attitude. Discover 40-hole and 48-hole Khel pickleballs and the Khel Vision phone mount.",
  openGraph: {
    title: "Khelshop — Built for the bold.",
    description: "Court-ready gear. Everyday attitude.",
    type: "website",
    locale: "en_IN",
    siteName: "Khelshop",
  },
  twitter: { card: "summary", title: "Khelshop — Built for the bold." },
  icons: { icon: "/brand/khel-symbol.jpeg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}

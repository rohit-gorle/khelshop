import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/store";
import { Shell } from "@/components/shell";
export const metadata: Metadata = {
  metadataBase: new URL("https://khelshop.in"),
  title: {
    default: "Khelshop (Khel Shop) — Sports Goods Built for the Bold",
    template: "%s | Khelshop",
  },
  description:
    "Khel Shop (Khelshop.in) — court-ready sports goods. Shop 40-hole & 48-hole Khel pickleballs and the Khel Vision net phone mount. Built for the bold.",
  keywords: [
    "khelshop",
    "khel shop",
    "khel",
    "sports goods",
    "pickleball",
    "pickleballs india",
    "40 hole pickleball",
    "48 hole pickleball",
    "phone mount",
    "sports gear india",
  ],
  openGraph: {
    title: "Khelshop (Khel Shop) — Sports Goods Built for the Bold",
    description:
      "Court-ready sports goods. Khel pickleballs & the Khel Vision phone mount.",
    url: "https://khelshop.in",
    type: "website",
    locale: "en_IN",
    siteName: "Khelshop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khelshop (Khel Shop) — Sports Goods Built for the Bold",
    description: "Court-ready sports goods. Built for the bold.",
  },
  icons: { icon: "/brand/khel-symbol.jpeg" },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://khelshop.in/#organization",
      name: "Khelshop",
      alternateName: ["Khel Shop", "Khel"],
      url: "https://khelshop.in",
      logo: "https://khelshop.in/brand/khel-symbol.jpeg",
    },
    {
      "@type": "WebSite",
      "@id": "https://khelshop.in/#website",
      url: "https://khelshop.in",
      name: "Khelshop",
      alternateName: "Khel Shop",
      publisher: { "@id": "https://khelshop.in/#organization" },
    },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}

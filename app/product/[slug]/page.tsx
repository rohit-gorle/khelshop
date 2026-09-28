import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductDetail } from "@/components/catalog";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = products.find((p) => p.slug === params.slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description,
    openGraph: {
      title: `${p.name} | Khelshop`,
      description: p.description,
      url: `https://khelshop.in/product/${p.slug}`,
    },
  };
}
export default function Page({ params }: { params: { slug: string } }) {
  const p = products.find((p) => p.slug === params.slug);
  if (!p) notFound();
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((img) => `https://khelshop.in${img}`),
    brand: { "@type": "Brand", name: "Khelshop" },
    offers: {
      "@type": "Offer",
      url: `https://khelshop.in/product/${p.slug}`,
      priceCurrency: "INR",
      price: p.price,
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail key={p.id} product={p} />
    </>
  );
}

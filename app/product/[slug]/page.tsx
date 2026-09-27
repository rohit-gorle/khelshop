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
  return <ProductDetail key={p.id} product={p} />;
}

import type { MetadataRoute } from "next";
import { products } from "@/data/products";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/shop",
    "/drop",
    "/lookbook",
    "/about",
    ...products.map((p) => `/product/${p.slug}`),
  ].map((path) => ({
    url: `https://khelshop.in${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}

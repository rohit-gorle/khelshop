export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  imagesByColor?: Record<string, string[]>;
  sizes: string[];
  colors: string[];
  category: "pickleballs" | "phone-mounts";
  tags: ("new" | "bestseller" | "limited")[];
  rating: number;
  reviewCount: number;
  description: string;
  stock: number;
  holes?: 40 | 48;
  previewPrice?: boolean;
};
const ball = (file: string) => `/images/pickleballs/${file}.jpg`;
const green48 = ["48-Greeen.1", "48-Greeen.2", "48-Greeen.3", "48-Green.4"].map(
  ball,
);
const yellow48 = [1, 2, 3, 4].map((i) => ball(`48-Yellow.${i}`));
const green40 = [1, 2, 3, 4].map((i) => ball(`40-Yellow.${i}`));
export const imagery = {
  court: ball("48-Greeen.2"),
  editorial: ball("48-Yellow.4"),
  hero: ball("48-Greeen.1"),
  forty: ball("40-Yellow.1"),
  fortyKit: ball("40-Yellow.4"),
  green: green48[0],
  yellow: yellow48[0],
};
export const products: Product[] = [
  {
    id: "khel-1",
    slug: "khel-vision-net-phone-mount",
    name: "Khel Vision — Net Phone Mount",
    price: 1499,
    compareAtPrice: 1999,
    images: [
      "/images/original-3.jpg",
      "/images/original-0.jpg",
      "/images/original-2.jpg",
      "/images/original-1.jpg",
    ],
    sizes: ["One size"],
    colors: ["Original"],
    category: "phone-mounts",
    tags: ["bestseller"],
    rating: 4.8,
    reviewCount: 42,
    description:
      "Clip. Record. Improve. Your phone, your court, every angle. The Khel Vision mount clips to your net post, so you can replay the rally long after the lights go out.",
    stock: 30,
  },
  {
    id: "khel-2",
    slug: "khel-40-hole-pickleballs",
    name: "Khel 40 — Pickleballs",
    price: 899,
    images: green40,
    imagesByColor: { "Light green": green40 },
    sizes: ["4-pack"],
    colors: ["Light green"],
    category: "pickleballs",
    tags: ["bestseller"],
    rating: 4.8,
    reviewCount: 28,
    description:
      "The next rally is calling. Meet Khel 40: our 40-hole pickleball in light green. Bring your crew, grab your paddle, and make a game of it.",
    stock: 30,
    holes: 40,
    previewPrice: true,
  },
  {
    id: "khel-3",
    slug: "khel-48-hole-pickleballs",
    name: "Khel 48 — Pickleballs",
    price: 899,
    images: green48,
    imagesByColor: { "Light green": green48, "Fluorescent yellow": yellow48 },
    sizes: ["4-pack"],
    colors: ["Light green", "Fluorescent yellow"],
    category: "pickleballs",
    tags: ["new"],
    rating: 4.9,
    reviewCount: 36,
    description:
      "Your game, in full colour. Khel 48 is our 48-hole pickleball, available in light green or fluorescent yellow. Choose your colour and keep the rally going.",
    stock: 30,
    holes: 48,
    previewPrice: true,
  },
];
export function productImages(p: Product, color?: string) {
  return p.imagesByColor?.[color || p.colors[0]] || p.images;
}
export function colorClass(color: string) {
  return color.toLowerCase().replace(/\s+/g, "-");
}
export function categoryLabel(category: string) {
  return category === "phone-mounts"
    ? "Phone mounts"
    : category === "pickleballs"
      ? "Pickleballs"
      : category;
}
export const featured = [products[1], products[2], products[0]];
export const DROP_AT = "2026-10-01T12:00:00+05:30";
export const FREE_SHIPPING = 2999;
export const SHIPPING = 149;

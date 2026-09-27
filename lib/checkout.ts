import { z } from "zod";
import { products, FREE_SHIPPING, SHIPPING } from "@/data/products";
export const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  address: z.string().trim().min(5, "Enter a street address").max(200),
  city: z.string().trim().min(2, "Enter your city").max(100),
  state: z.string().trim().min(2, "Choose your state").max(100),
  pin: z.string().regex(/^[1-9]\d{5}$/, "Enter a 6-digit PIN code"),
});
export type Address = z.infer<typeof addressSchema>;
export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        size: z.string(),
        color: z.string(),
        qty: z.number().int().min(1).max(30),
      }),
    )
    .min(1)
    .max(30),
  promo: z.string().max(20).default(""),
  address: addressSchema,
  requestId: z.string().uuid(),
});
export function calculate(
  items: { id: string; qty: number; size: string; color: string }[],
  promo: string,
) {
  const count = new Map<string, number>();
  let subtotal = 0;
  for (const l of items) {
    const p = products.find((p) => p.id === l.id);
    if (
      !p ||
      !p.stock ||
      !Number.isInteger(l.qty) ||
      l.qty < 1 ||
      !p.sizes.includes(l.size) ||
      !p.colors.includes(l.color)
    )
      throw Error("A bag item is unavailable. Please update your bag.");
    const n = (count.get(p.id) || 0) + l.qty;
    if (n > p.stock) throw Error("This quantity is unavailable.");
    count.set(p.id, n);
    subtotal += p.price * l.qty;
  }
  const code = promo.trim().toUpperCase();
  if (code && code !== "HEAT10")
    throw Error("That code is not on the guest list. Try HEAT10.");
  const discount = code === "HEAT10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}

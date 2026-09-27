"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster, toast } from "sonner";
import { products, type Product } from "@/data/products";
import Lenis from "lenis";
export type CartLine = { id: string; size: string; color: string; qty: number };
export type Order = {
  id: string;
  items: CartLine[];
  total: number;
  discount: number;
  shipping: number;
  mode: "demo" | "stripe";
  date: string;
};
type Store = {
  cart: CartLine[];
  wishlist: string[];
  ready: boolean;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  quizOpen: boolean;
  setQuizOpen: (v: boolean) => void;
  add: (p: Product, size?: string, color?: string, qty?: number) => void;
  quantity: (index: number, qty: number) => void;
  toggleWish: (id: string) => void;
  clear: () => void;
};
const Context = createContext<Store | null>(null);
function read(key: string, fallback: unknown) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]),
    [wishlist, setWishlist] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [cartOpen, setCartOpen] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [quizOpen, setQuizOpen] = useState(false);
  useEffect(() => {
    const saved = read("khel-cart", []);
    if (Array.isArray(saved))
      setCart(
        saved.filter((l: CartLine) => {
          const p = products.find((p) => p.id === l?.id);
          return (
            p &&
            Number.isInteger(l.qty) &&
            l.qty > 0 &&
            l.qty <= p.stock &&
            p.sizes.includes(l.size) &&
            p.colors.includes(l.color)
          );
        }),
      );
    const wish = read("khel-wishlist", []);
    if (Array.isArray(wish))
      setWishlist(
        wish.filter(
          (id: unknown) =>
            typeof id === "string" && products.some((p) => p.id === id),
        ),
      );
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      localStorage.setItem("khel-cart", JSON.stringify(cart));
      localStorage.setItem("khel-wishlist", JSON.stringify(wishlist));
    }
  }, [cart, wishlist, ready]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = media.matches
      ? undefined
      : new Lenis({ autoRaf: true, anchors: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.destroy();
    };
  }, []);
  const clear = useCallback(() => setCart([]), []);
  const add = useCallback(
    (p: Product, size = p.sizes[0], color = p.colors[0], qty = 1) => {
      if (
        !p.stock ||
        !p.sizes.includes(size) ||
        !p.colors.includes(color) ||
        !Number.isInteger(qty) ||
        qty < 1
      )
        return;
      setCart((old) => {
        const at = old.findIndex(
          (l) => l.id === p.id && l.size === size && l.color === color,
        );
        const total = old
          .filter((l) => l.id === p.id)
          .reduce((s, l) => s + l.qty, 0);
        const allowed = Math.min(qty, p.stock - total);
        if (allowed <= 0) return old;
        return at < 0
          ? [...old, { id: p.id, size, color, qty: allowed }]
          : old.map((l, i) => (i === at ? { ...l, qty: l.qty + allowed } : l));
      });
      toast.success("Good taste. Added to your bag.");
      window.dispatchEvent(new CustomEvent("khel:add"));
    },
    [],
  );
  useEffect(() => {
    type MC = {
      registerTool: (
        tool: unknown,
        options: { signal: AbortSignal },
      ) => void | Promise<void>;
    };
    const doc = document as Document & { modelContext?: MC };
    if (!doc.modelContext) return;
    const lifecycle = new AbortController();
    Promise.resolve(
      doc.modelContext.registerTool(
        {
          name: "search_khelshop_products",
          title: "Search Khelshop products",
          description: "Read matching mock catalog products and prices in INR.",
          inputSchema: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute: (input: unknown) => {
            if (
              !input ||
              typeof input !== "object" ||
              !("query" in input) ||
              typeof input.query !== "string"
            )
              throw Error("query must be a string");
            const q = input.query.toLowerCase();
            return products
              .filter((p) =>
                `${p.name} ${p.category}`.toLowerCase().includes(q),
              )
              .map(({ id, name, price, stock }) => ({
                id,
                name,
                price,
                stock,
              }));
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    return () => lifecycle.abort();
  }, []);
  return (
    <Context.Provider
      value={{
        cart,
        wishlist,
        ready,
        cartOpen,
        setCartOpen,
        searchOpen,
        setSearchOpen,
        quizOpen,
        setQuizOpen,
        add,
        quantity: (index, qty) =>
          setCart((old) =>
            old.flatMap((l, i) => {
              if (i !== index) return [l];
              const p = products.find((p) => p.id === l.id)!;
              const other = old
                .filter((x, j) => j !== index && x.id === l.id)
                .reduce((s, x) => s + x.qty, 0);
              return qty <= 0
                ? []
                : [
                    {
                      ...l,
                      qty: Math.min(
                        p.stock - other,
                        Math.max(1, Math.floor(qty)),
                      ),
                    },
                  ];
            }),
          ),
        toggleWish: (id) =>
          setWishlist((old) =>
            old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
          ),
        clear,
      }}
    >
      {children}
      <Toaster position="bottom-center" richColors />
    </Context.Provider>
  );
}
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">
        <StoreProvider>{children}</StoreProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
export function useStore() {
  const c = useContext(Context);
  if (!c) throw Error("Missing StoreProvider");
  return c;
}

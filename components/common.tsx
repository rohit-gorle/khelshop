"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Heart, Plus, Minus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useStore } from "./store";
import {
  type Product,
  DROP_AT,
  colorClass,
  categoryLabel,
} from "@/data/products";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const { add, wishlist, toggleWish } = useStore();
  return (
    <article className="product-card">
      <div className={`product-photo ${p.category}`}>
        <Link href={`/product/${p.slug}`} aria-label={`View ${p.name}`}>
          <img src={p.images[0]} alt={p.name} loading="lazy" />
        </Link>
        <Badge>{p.stock ? p.tags[0] : "Sold out"}</Badge>
        <button
          className={`wish-button ${wishlist.includes(p.id) ? "is-wished" : ""}`}
          aria-label={`${wishlist.includes(p.id) ? "Remove" : "Save"} ${p.name} ${wishlist.includes(p.id) ? "from" : "to"} wishlist`}
          onClick={() => toggleWish(p.id)}
        >
          <Heart
            size={18}
            fill={wishlist.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          className="quick-add"
          disabled={!p.stock}
          onClick={() => add(p)}
        >
          Quick add · {p.sizes[0]}
          <Plus size={17} />
        </button>
      </div>
      <div className="product-meta">
        <span>{categoryLabel(p.category)}</span>
        <span>★ {p.rating.toFixed(1)}</span>
      </div>
      <Link href={`/product/${p.slug}`}>
        <h3>{p.name}</h3>
      </Link>
      <p className="product-price">Coming soon</p>
      <div className="swatch-row">
        {p.colors.map((c) => (
          <span key={c} title={c} className={`swatch ${colorClass(c)}`} />
        ))}
        <small>
          {p.holes
            ? `${p.holes} HOLES · ${p.colors.length} ${p.colors.length === 1 ? "COLOUR" : "COLOURS"}`
            : "RECORD EVERY RALLY"}
        </small>
      </div>
    </article>
  );
}
export function ProductRow({
  products,
  title,
  eyebrow,
}: {
  products: Product[];
  title: string;
  eyebrow?: string;
}) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow || "THE GOOD STUFF"}</p>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" href="/shop">
          Shop all <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="product-carousel">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
export function Stepper({
  value,
  onChange,
  max = 30,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="stepper">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () =>
      setLeft(Math.max(0, new Date(DROP_AT).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="countdown" aria-label="Time until the next drop">
      {["DAYS", "HRS", "MIN", "SEC"].map((label, i) => (
        <div key={label}>
          <strong>
            {left === null
              ? "--"
              : String(
                  Math.floor(left / [86400000, 3600000, 60000, 1000][i]) %
                    [999, 24, 60, 60][i],
                ).padStart(2, "0")}
          </strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
export function EmailCapture({
  kind = "newsletter",
}: {
  kind?: "newsletter" | "waitlist";
}) {
  const [email, setEmail] = useState(""),
    [done, setDone] = useState(false);
  return (
    <form
      className="email-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1") {
          setDone(true);
          toast.success("Demo signup saved for this visit.");
          return;
        }
        try {
          const res = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, kind }),
          });
          const data = await res.json();
          if (!res.ok) throw Error(data.error);
          setDone(true);
          toast.success(
            data.demo
              ? "Demo signup complete. No email was sent."
              : "You're on the list. Stay ready.",
          );
        } catch {
          toast.error("Could not join right now. Please try again.");
        }
      }}
    >
      {done ? (
        <p className="signup-done">
          {process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1"
            ? "You’re in. Demo signup complete."
            : "You’re in. Stay ready."}{" "}
          {kind === "waitlist" && (
            <small>
              Demo queue position: #342 · Share the drop with your crew.
            </small>
          )}
        </p>
      ) : (
        <>
          <label className="sr-only" htmlFor={`email-${kind}`}>
            Email address
          </label>
          <input
            id={`email-${kind}`}
            type="email"
            placeholder="Your email goes here"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            aria-label={
              kind === "waitlist"
                ? "Join the waitlist"
                : "Subscribe to newsletter"
            }
          >
            <ArrowRight size={21} />
          </Button>
        </>
      )}
    </form>
  );
}
export function Marquee() {
  return (
    <div
      className="marquee"
      aria-label="Free shipping over ₹2,999. New drop October 1. Play your own way."
    >
      <div aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i}>
            FREE SHIPPING OVER ₹2,999 <b>✳</b> NEW DROP 10.01 <b>✳</b> PLAY YOUR
            OWN WAY <b>✳</b>{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

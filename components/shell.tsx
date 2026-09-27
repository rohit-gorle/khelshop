"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  Moon,
  Sun,
  ArrowUpRight,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  products,
  FREE_SHIPPING,
  productImages,
  categoryLabel,
} from "@/data/products";
import { money } from "@/lib/utils";
import { useStore } from "./store";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { EmailCapture, Stepper, ProductCard } from "./common";
const links = [
  ["Shop", "/shop"],
  ["The drop", "/drop"],
  ["Lookbook", "/lookbook"],
  ["Manifesto", "/about"],
];
export function Shell({ children }: { children: React.ReactNode }) {
  const s = useStore(),
    { resolvedTheme, setTheme } = useTheme(),
    path = usePathname(),
    router = useRouter();
  const [menu, setMenu] = useState(false),
    [wish, setWish] = useState(false),
    [flying, setFlying] = useState(false);
  useEffect(() => {
    const add = () => {
      setFlying(true);
      setTimeout(() => setFlying(false), 700);
    };
    window.addEventListener("khel:add", add);
    return () => window.removeEventListener("khel:add", add);
  }, []);
  useEffect(() => {
    setMenu(false);
  }, [path]);
  const total = s.cart.reduce(
    (v, l) => v + products.find((p) => p.id === l.id)!.price * l.qty,
    0,
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        INDIA, YOUR NEXT GOOD GAME STARTS HERE.{" "}
        <Link href="/shop">FREE SHIPPING OVER ₹2,999 ↗</Link>
      </div>
      <header className="nav">
        <Link className="logo" href="/" aria-label="Khelshop home">
          <span className="brand-symbol">
            <img src="/brand/khel-symbol.jpeg" alt="" />
          </span>
          khelshop
        </Link>
        <nav aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              className={path === href ? "active" : ""}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button"
            onClick={() => s.setSearchOpen(true)}
            aria-label="Search products"
          >
            <Search size={20} />
          </button>
          <button
            className="icon-button desktop-icon"
            onClick={() => setWish(true)}
            aria-label={`Wishlist, ${s.wishlist.length} products`}
          >
            <Heart size={20} />
            {s.wishlist.length > 0 && <i />}
          </button>
          <button
            className="icon-button theme-button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle colour theme"
          >
            <Sun className="sun" size={18} />
            <Moon className="moon" size={18} />
          </button>
          <button
            className={`icon-button bag-icon ${flying ? "bag-bounce" : ""}`}
            onClick={() => s.setCartOpen(true)}
            aria-label={`Open bag, ${s.cart.reduce((n, l) => n + l.qty, 0)} items`}
          >
            <ShoppingBag size={20} />
            <span>{s.cart.reduce((n, l) => n + l.qty, 0)}</span>
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {flying && (
          <motion.span
            className="flying-bag"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: 120, y: -180, scale: 0.3 }}
            transition={{ duration: 0.65 }}
          >
            <ShoppingBag size={28} />
          </motion.span>
        )}
      </AnimatePresence>
      <main id="main">{children}</main>
      <footer>
        <div className="footer-top">
          <div>
            <p className="eyebrow">THE INNER CIRCLE</p>
            <h2>
              Get the <em>heat first.</em>
            </h2>
            <p>No spam, just heat. New drops. Good stories. First dibs.</p>
          </div>
          <EmailCapture />
        </div>
        <div className="footer-links">
          <div className="footer-brand">
            <img src="/brand/khel-logo.jpeg" alt="Khel" />
            <p>
              For the love of the game.
              <br />
              From India, with attitude.
            </p>
          </div>
          <div>
            <span>EXPLORE</span>
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <span>YOUR NEXT MOVE</span>
            <button onClick={() => s.setQuizOpen(true)}>Find your fit ↗</button>
            <button onClick={() => setWish(true)}>Your wishlist</button>
            <Link href="/about#shipping">Shipping & returns</Link>
            <a href="mailto:hello@khelshop.in">Say hello ↗</a>
          </div>
          <div>
            <span>FIND YOUR PEOPLE</span>
            {["Instagram", "TikTok", "Discord"].map((label) => (
              <button
                key={label}
                onClick={() => router.push("/about#community")}
              >
                {label} <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </div>
        <Link href="/" className="footer-wordmark">
          khelshop<span>®</span>
        </Link>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} KHELSHOP. ALL PLAY, NO PRETENCE.
          </span>
          <span>PREVIEW STORE · SAMPLE REVIEWS</span>
          <span>INDIA / INR ₹</span>
        </div>
      </footer>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent className="bottom-sheet">
          <DialogTitle className="modal-title">Your next move.</DialogTitle>
          <DialogDescription className="muted">
            Make it a good one.
          </DialogDescription>
          <div className="mobile-links">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
                <ArrowUpRight />
              </Link>
            ))}
            <button
              onClick={() => {
                setMenu(false);
                setWish(true);
              }}
            >
              Wishlist <Heart />
            </button>
            <button
              onClick={() => {
                setMenu(false);
                s.setQuizOpen(true);
              }}
            >
              Find your fit <ArrowRight />
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={s.cartOpen} onOpenChange={s.setCartOpen}>
        <DialogContent className="drawer">
          <DialogTitle className="modal-title">
            Your bag. <em>Good choices.</em>
          </DialogTitle>
          <DialogDescription className="muted">
            {s.cart.length
              ? `${s.cart.reduce((n, l) => n + l.qty, 0)} court-ready essentials`
              : "Your bag is starving."}
          </DialogDescription>
          {s.cart.length ? (
            <>
              <div className="shipping-progress">
                <p>
                  {total >= FREE_SHIPPING
                    ? "Free shipping. You earned it."
                    : `${money(FREE_SHIPPING - total)} away from free shipping`}
                </p>
                <progress
                  value={Math.min(total, FREE_SHIPPING)}
                  max={FREE_SHIPPING}
                />
              </div>
              <div className="cart-lines">
                {s.cart.map((l, i) => {
                  const p = products.find((p) => p.id === l.id)!;
                  return (
                    <div
                      className="cart-line"
                      key={`${l.id}-${l.size}-${l.color}`}
                    >
                      <Link
                        onClick={() => s.setCartOpen(false)}
                        href={`/product/${p.slug}`}
                      >
                        <img
                          src={productImages(p, l.color)[0]}
                          alt={`${p.name} — ${l.color}`}
                        />
                      </Link>
                      <div>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={() => s.setCartOpen(false)}
                        >
                          <h3>{p.name}</h3>
                        </Link>
                        <p>
                          {l.size} / {l.color}
                        </p>
                        <Stepper
                          value={l.qty}
                          onChange={(q) => s.quantity(i, q)}
                          max={
                            p.stock -
                            s.cart
                              .filter((x, j) => j !== i && x.id === l.id)
                              .reduce((n, x) => n + x.qty, 0)
                          }
                        />
                      </div>
                      <div>
                        <strong>{money(p.price * l.qty)}</strong>
                        <button
                          className="icon-button"
                          onClick={() => s.quantity(i, 0)}
                          aria-label={`Remove ${p.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-total">
                <p>
                  <span>Subtotal</span>
                  <strong>{money(total)}</strong>
                </p>
                <small>Shipping and discounts calculated at checkout.</small>
                <Button asChild>
                  <Link href="/checkout" onClick={() => s.setCartOpen(false)}>
                    Checkout <ArrowUpRight size={18} />
                  </Link>
                </Button>
                <button
                  className="text-link"
                  onClick={() => s.setCartOpen(false)}
                >
                  Keep exploring
                </button>
              </div>
            </>
          ) : (
            <div className="empty">
              <ShoppingBag size={56} strokeWidth={1} />
              <h2>
                Feed it
                <br />
                <em>something good.</em>
              </h2>
              <Button asChild>
                <Link href="/shop" onClick={() => s.setCartOpen(false)}>
                  Explore the goods <ArrowUpRight size={18} />
                </Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={wish} onOpenChange={setWish}>
        <DialogContent className="wide-modal">
          <DialogTitle className="modal-title">Your wish list.</DialogTitle>
          <DialogDescription className="muted">
            Saved for your next good game.
          </DialogDescription>
          {s.wishlist.length ? (
            <div className="product-grid wishlist-grid">
              {products
                .filter((p) => s.wishlist.includes(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a"))
                        setWish(false);
                    }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty">
              <Heart size={40} />
              <p>
                A little heart goes a long way. Save your favourites as you
                shop.
              </p>
              <Button
                onClick={() => {
                  setWish(false);
                  router.push("/shop");
                }}
              >
                Find your favourites
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={s.searchOpen} onOpenChange={s.setSearchOpen}>
        <DialogContent className="search-modal">
          <DialogTitle className="sr-only">Search Khelshop</DialogTitle>
          <DialogDescription className="sr-only">
            Search products by name or category. Use arrow keys to choose a
            result.
          </DialogDescription>
          <Command>
            <Command.Input
              placeholder="Find your next favourite…"
              aria-label="Search products"
            />
            <Command.List>
              <Command.Empty>
                Nothing found. Try “pickleball” or “vision”.
              </Command.Empty>
              <Command.Group heading="THE GOOD STUFF">
                {products.map((p) => (
                  <Command.Item
                    key={p.id}
                    value={`${p.name} ${p.category}`}
                    onSelect={() => {
                      s.setSearchOpen(false);
                      router.push(`/product/${p.slug}`);
                    }}
                  >
                    <img src={p.images[0]} alt="" />
                    <span>
                      {p.name}
                      <small>{categoryLabel(p.category)}</small>
                    </span>
                    <strong>{money(p.price)}</strong>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
            <div className="search-help">
              ↑ ↓ to explore · Enter to open · Esc to close
            </div>
          </Command>
        </DialogContent>
      </Dialog>
      <FitQuiz />
    </>
  );
}
function FitQuiz() {
  const { quizOpen, setQuizOpen } = useStore();
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState<string[]>([]);
  const questions = [
    {
      q: "What brings you to the court?",
      a: ["The match", "The movement", "The whole vibe"],
    },
    {
      q: "What’s your next move?",
      a: ["Play more rallies", "Record my game", "Both, please"],
    },
    {
      q: "Pick your colour.",
      a: ["Light green", "Fluorescent yellow", "Either works"],
    },
    {
      q: "Which ball are you eyeing?",
      a: ["40 holes", "48 holes", "Help me explore"],
    },
  ];
  const priority =
    answers[1] === "Record my game"
      ? products[0]
      : answers[3] === "40 holes"
        ? products[1]
        : products[2];
  const picks = [priority, ...products.filter((p) => p.id !== priority.id)];
  return (
    <Dialog
      open={quizOpen}
      onOpenChange={(v) => {
        setQuizOpen(v);
        if (!v) {
          setStep(0);
          setAnswers([]);
        }
      }}
    >
      <DialogContent className="quiz-modal">
        <DialogTitle className="modal-title">
          Find your <em>fit.</em>
        </DialogTitle>
        <DialogDescription className="muted">
          Four questions. Your kind of game.
        </DialogDescription>
        {step < 4 ? (
          <>
            <div className="quiz-progress">
              {questions.map((_, i) => (
                <span key={i} className={i <= step ? "active" : ""} />
              ))}
            </div>
            <p className="eyebrow">0{step + 1} / 04</p>
            <h2>{questions[step].q}</h2>
            <div className="quiz-options">
              {questions[step].a.map((a) => (
                <Button
                  variant="outline"
                  key={a}
                  onClick={() => {
                    setAnswers((old) => [...old.slice(0, step), a]);
                    setStep(step + 1);
                  }}
                >
                  {a}
                  <ArrowUpRight size={18} />
                </Button>
              ))}
            </div>
            {step > 0 && (
              <button className="text-link" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
          </>
        ) : (
          <>
            <h2>Your court kit.</h2>
            <p className="muted">
              Start with {priority.name}.{" "}
              {answers[2] === "Fluorescent yellow"
                ? "Choose Khel 48 for fluorescent yellow."
                : "Light green is available in both ball models."}
            </p>
            <div className="quiz-results">
              {picks.map((p) => (
                <Link
                  key={p.id}
                  onClick={() => setQuizOpen(false)}
                  href={`/product/${p.slug}`}
                >
                  <img src={p.images[0]} alt={p.name} />
                  <h3>{p.name}</h3>
                  <span>{money(p.price)}</span>
                </Link>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setAnswers([]);
              }}
            >
              Play again
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

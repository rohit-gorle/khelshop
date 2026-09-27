"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import {
  SlidersHorizontal,
  Search,
  ArrowUpRight,
  Heart,
  Truck,
  RefreshCw,
  Leaf,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import {
  products,
  type Product,
  productImages,
  colorClass,
  categoryLabel,
} from "@/data/products";
import { money } from "@/lib/utils";
import { useStore } from "./store";
import { ProductCard, ProductRow, Stepper } from "./common";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Accordion, AccordionItem } from "./ui/accordion";
export function Shop() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "all"),
    [size, setSize] = useState("all"),
    [color, setColor] = useState("all"),
    [price, setPrice] = useState(7000),
    [stock, setStock] = useState(false),
    [sort, setSort] = useState("featured"),
    [query, setQuery] = useState(""),
    [open, setOpen] = useState(false);
  useEffect(() => setCategory(params.get("category") || "all"), [params]);
  const found = useMemo(() => {
    const source = query
      ? new Fuse(products, {
          keys: ["name", "category", "tags"],
          threshold: 0.35,
        })
          .search(query)
          .map((r) => r.item)
      : products;
    const result = source.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (size === "all" || p.sizes.includes(size)) &&
        (color === "all" || p.colors.includes(color)) &&
        p.price <= price &&
        (!stock || p.stock > 0),
    );
    return result.sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "hype"
            ? b.reviewCount - a.reviewCount
            : sort === "new"
              ? Number(b.tags.includes("new")) - Number(a.tags.includes("new"))
              : 0,
    );
  }, [query, category, size, color, price, stock, sort]);
  const reset = () => {
    setCategory("all");
    setSize("all");
    setColor("all");
    setPrice(7000);
    setStock(false);
    setQuery("");
  };
  const filters = (
    <>
      <div className="filter-group">
        <h3>Your playground</h3>
        {["all", "pickleballs", "phone-mounts"].map((c) => (
          <label key={c}>
            <input
              type="radio"
              name="category"
              checked={category === c}
              onChange={() => setCategory(c)}
            />
            {c === "all" ? "All the goods" : categoryLabel(c)}
            <span>
              {c === "all"
                ? products.length
                : products.filter((p) => p.category === c).length}
            </span>
          </label>
        ))}
      </div>
      <div className="filter-group">
        <label className="filter-select-label">
          Pack / fit
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="all">All packs & fits</option>
            {["4-pack", "One size"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="filter-group">
        <h3>Colour</h3>
        {["all", "Light green", "Fluorescent yellow", "Original"].map((c) => (
          <label key={c}>
            <input
              type="radio"
              name="color"
              checked={color === c}
              onChange={() => setColor(c)}
            />
            {c === "all" ? "All colours" : c}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <label htmlFor="price-range">Up to {money(price)}</label>
        <input
          id="price-range"
          type="range"
          min="500"
          max="7000"
          step="100"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={stock}
          onChange={(e) => setStock(e.target.checked)}
        />
        In stock only
      </label>
      <button className="text-link" onClick={reset}>
        Reset filters
      </button>
    </>
  );
  return (
    <>
      <section className="shop-heading">
        <p className="eyebrow">GOOD GEAR. ZERO GATEKEEPING.</p>
        <h1>
          ALL THE <em>GOODS.</em>
        </h1>
        <div className="shop-tabs">
          {["all", "pickleballs", "phone-mounts"].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c === "all" ? "Everything" : categoryLabel(c)}
              <span>
                {String(
                  c === "all"
                    ? products.length
                    : products.filter((p) => p.category === c).length,
                ).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </section>
      <div className="shop-toolbar">
        <span aria-live="polite">{found.length} good finds</span>
        <label className="shop-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the goods"
            aria-label="Search the catalog"
          />
        </label>
        <button
          className="filter-mobile button button-outline button-sm"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
        <label className="sort-label">
          <span>Sort by</span>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="new">New arrivals</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="hype">Most hyped</option>
          </select>
        </label>
      </div>
      <div className="shop-body">
        <aside className="filters-desktop" aria-label="Product filters">
          {!open && filters}
        </aside>
        {found.length ? (
          <div className="product-grid">
            {found.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>
              Nothing found.
              <br />
              <em>Try less picky filters.</em>
            </h2>
            <Button onClick={reset}>Start fresh</Button>
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bottom-sheet filter-sheet">
          <DialogTitle className="modal-title">Make it your own.</DialogTitle>
          <DialogDescription className="muted">
            Filter your next favourite.
          </DialogDescription>
          {open && filters}
          <Button onClick={() => setOpen(false)}>
            Show {found.length} finds
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ProductDetail({ product: p }: { product: Product }) {
  const { add, wishlist, toggleWish } = useStore();
  const [size, setSize] = useState(p.sizes[0]),
    [color, setColor] = useState(p.colors[0]),
    [qty, setQty] = useState(1),
    [active, setActive] = useState(0),
    [guide, setGuide] = useState(false),
    [review, setReview] = useState(false),
    [recent, setRecent] = useState<Product[]>([]),
    [localReviews, setLocalReviews] = useState<
      { name: string; text: string; rating: number }[]
    >([]);
  useEffect(() => {
    try {
      const ids: unknown = JSON.parse(
        localStorage.getItem("khel-recent") || "[]",
      );
      const list = Array.isArray(ids)
        ? ids.filter((x): x is string => typeof x === "string")
        : [];
      setRecent(
        list
          .filter((id) => id !== p.id)
          .map((id) => products.find((x) => x.id === id))
          .filter((x): x is Product => Boolean(x))
          .slice(0, 4),
      );
      localStorage.setItem(
        "khel-recent",
        JSON.stringify([p.id, ...list.filter((id) => id !== p.id)].slice(0, 8)),
      );
      const saved = JSON.parse(
        localStorage.getItem(`khel-reviews-${p.id}`) || "[]",
      );
      if (Array.isArray(saved))
        setLocalReviews(
          saved.filter(
            (r) =>
              typeof r.name === "string" &&
              typeof r.text === "string" &&
              r.rating >= 1 &&
              r.rating <= 5,
          ),
        );
    } catch {}
  }, [p.id]);
  const images = productImages(p, color);
  const addSelected = () => add(p, size, color, qty);
  return (
    <>
      <div className="breadcrumb">
        <Link href="/shop">All goods</Link>
        <span>/</span>
        <Link href={`/shop?category=${p.category}`}>
          {categoryLabel(p.category)}
        </Link>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      <section className="product-detail">
        <div className="gallery">
          <div
            className="gallery-main"
            onTouchStart={(e) => {
              e.currentTarget.dataset.touch = String(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              const delta =
                Number(e.currentTarget.dataset.touch) -
                e.changedTouches[0].clientX;
              if (Math.abs(delta) > 40)
                setActive(
                  (a) =>
                    (a + (delta > 0 ? 1 : -1) + images.length) % images.length,
                );
            }}
          >
            <img
              src={images[active]}
              alt={`${p.name}, view ${active + 1}`}
              fetchPriority="high"
            />
            <span className="badge">{p.tags[0]}</span>
          </div>
          <div className="thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={active === i ? "active" : ""}
                aria-label={`Show product image ${i + 1}`}
                aria-pressed={active === i}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
          <p className="image-note">
            {p.id === "khel-1"
              ? "Original Khel Vision photography."
              : "Khel product imagery · select a colour to explore its gallery."}
          </p>
        </div>
        <div className="buy-panel">
          <p className="eyebrow">
            KHELSHOP / {categoryLabel(p.category).toUpperCase()}
          </p>
          <h1>{p.name}</h1>
          <a href="#reviews" className="rating">
            <span>★★★★★</span>
            {p.rating.toFixed(1)}{" "}
            <small>({p.reviewCount} sample reviews)</small>
          </a>
          <div className="detail-price">
            {money(p.price)}{" "}
            {p.compareAtPrice && <del>{money(p.compareAtPrice)}</del>}
            <small>Inclusive of taxes</small>
          </div>
          <p className="description">{p.description}</p>
          {p.holes && (
            <div className="ball-specs">
              <span>
                <strong>{p.holes}</strong> holes
              </span>
              <span>
                {p.colors.length === 1 ? "Light green" : "2 colour options"}
              </span>
            </div>
          )}
          {p.previewPrice && (
            <p className="preview-price-note">
              Preview price · pack quantity and final pricing to be confirmed.
            </p>
          )}
          <div className="variant">
            <span>
              Colour — <strong>{color}</strong>
            </span>
            <div className="color-options">
              {p.colors.map((c) => (
                <button
                  key={c}
                  aria-label={`Select ${c}`}
                  aria-pressed={color === c}
                  onClick={() => {
                    setColor(c);
                    setActive(0);
                  }}
                  className={`${colorClass(c)} ${color === c ? "selected" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="variant">
            <div className="size-label">
              <span>
                {p.holes ? "Pack" : "Fit"} — <strong>{size}</strong>
              </span>
              <button className="text-link" onClick={() => setGuide(true)}>
                Product guide ↗
              </button>
            </div>
            <div className="size-options">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={size === s ? "selected" : ""}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="buy-actions">
            <Stepper value={qty} onChange={setQty} max={p.stock || 1} />
            <Button onClick={addSelected} disabled={!p.stock}>
              {p.stock ? "Add to bag" : "Sold out"}
              <ArrowUpRight size={18} />
            </Button>
            <button
              className="icon-button"
              onClick={() => toggleWish(p.id)}
              aria-label="Toggle product wishlist"
            >
              <Heart fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="product-promises">
            <span>
              <Truck size={17} /> Free shipping over ₹2,999
            </span>
            <span>
              <RefreshCw size={16} /> 30-day returns
            </span>
          </div>
          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details" title="The details">
              <p>{p.description}</p>
              {p.id === "khel-1" && (
                <ul>
                  <li>360° swivel for your court angle</li>
                  <li>Tool-free clip-on setup</li>
                  <li>Universal smartphone cradle</li>
                </ul>
              )}
              <p>
                Sample catalog specifications. Confirm final product details
                before ordering from the live store.
              </p>
            </AccordionItem>
            <AccordionItem value="shipping" title="Shipping & returns">
              <p>
                Demo policy: ₹149 shipping, free from ₹2,999. Estimated
                delivery: 3–7 business days across India. Unused goods can be
                returned within 30 days. No physical goods ship from this demo.
              </p>
            </AccordionItem>
            <AccordionItem value="sustainability" title="Made to play longer">
              <p>
                <Leaf size={17} /> Keep it in play: store dry, clean gently, and
                reuse packaging. Material and sourcing details will be published
                when verified.
              </p>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <ProductRow
        title="Complete your court kit."
        eyebrow="GOOD COMPANY FOR YOUR BAG"
        products={products.filter((x) => x.id !== p.id)}
      />
      <section id="reviews" className="section reviews">
        <div className="section-heading">
          <div>
            <p className="eyebrow">COURTSIDE CONVERSATIONS · SAMPLE REVIEWS</p>
            <h2>
              Word on <em>the court.</em>
            </h2>
          </div>
          <Button variant="outline" onClick={() => setReview(true)}>
            Write a review
          </Button>
        </div>
        <div className="reviews-layout">
          <div className="review-summary">
            <strong>{p.rating.toFixed(1)}</strong>
            <span>★★★★★</span>
            <p>{p.reviewCount} sample reviews</p>
            {[5, 4, 3, 2, 1].map((n, i) => (
              <div className="rating-bar" key={n}>
                <span>
                  {n} <Star size={10} />
                </span>
                <progress value={[76, 18, 4, 1, 1][i]} max={100} />
                <small>{[76, 18, 4, 1, 1][i]}%</small>
              </div>
            ))}
          </div>
          <div className="review-cards">
            {[
              ...localReviews,
              ...[
                {
                  name: "Aarav · Sample review",
                  text: "Straight from the bag to the court. Exactly my kind of gear.",
                  rating: 5,
                },
                {
                  name: "Maya · Sample review",
                  text: "The little details make the difference. Already part of my weekend routine.",
                  rating: 4,
                },
              ],
            ].map((r, i) => (
              <article key={i}>
                <span>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                <h3>{r.name}</h3>
                <p>{r.text}</p>
                {i < localReviews.length && <small>Saved on this device</small>}
              </article>
            ))}
          </div>
        </div>
      </section>
      {recent.length > 0 && (
        <ProductRow
          title="Back on your radar."
          eyebrow="RECENTLY VIEWED"
          products={recent}
        />
      )}
      <div className="mobile-buy">
        <span>
          {money(p.price)}
          <small>
            {size} / {color}
          </small>
        </span>
        <Button onClick={addSelected} disabled={!p.stock}>
          {p.stock ? "Add to bag" : "Sold out"}
          <ArrowUpRight size={17} />
        </Button>
      </div>
      <Dialog open={guide} onOpenChange={setGuide}>
        <DialogContent>
          <DialogTitle className="modal-title">Find your fit.</DialogTitle>
          <DialogDescription className="muted">
            Indicative sizing for the demo collection.
          </DialogDescription>
          {p.holes ? (
            <div className="product-guide">
              <p>
                <strong>{p.holes}-hole construction</strong>
              </p>
              <p>Available in {p.colors.join(" or ").toLowerCase()}.</p>
              <p>
                The current preview uses a 4-pack. Final pack quantity and
                pricing are awaiting confirmation.
              </p>
              <p>
                Choose the 40-hole or 48-hole model according to your game
                preference. We have not claimed certification or tournament
                approval.
              </p>
            </div>
          ) : (
            <p>
              One size. Khel Vision is designed for smartphones and net posts.
              Confirm final fit measurements before purchase.
            </p>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent>
          <DialogTitle className="modal-title">
            Your game. Your take.
          </DialogTitle>
          <DialogDescription className="muted">
            Demo reviews are saved only on this device.
          </DialogDescription>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const r = {
                name: String(f.get("name")).trim(),
                rating: Number(f.get("rating")),
                text: String(f.get("text")).trim(),
              };
              if (!r.name || !r.text) return;
              const next = [r, ...localReviews];
              localStorage.setItem(
                `khel-reviews-${p.id}`,
                JSON.stringify(next),
              );
              setLocalReviews(next);
              setReview(false);
              toast.success("Thanks for the courtside intel.");
            }}
          >
            <label>
              Your name
              <input name="name" required maxLength={60} />
            </label>
            <label>
              Rating
              <select name="rating">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option value={n} key={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </label>
            <label>
              Your review
              <textarea
                name="text"
                rows={4}
                required
                minLength={10}
                maxLength={1000}
              />
            </label>
            <Button type="submit">Post your review</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

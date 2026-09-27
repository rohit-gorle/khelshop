"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, ArrowRight } from "lucide-react";
import { products, imagery, type Product } from "@/data/products";
import { useStore } from "./store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { money } from "@/lib/utils";
export function Lookbook() {
  const [selected, setSelected] = useState<Product | null>(null),
    { add } = useStore();
  return (
    <>
      <header className="editorial-heading">
        <p className="eyebrow">KHELSHOP JOURNAL / VOL. 01</p>
        <h1>
          COURT <em>CULTURE.</em>
        </h1>
        <p>Two ball models. Every kind of rally.</p>
        <span>
          SWIPE TO EXPLORE <ArrowRight size={18} />
        </span>
      </header>
      <div
        className="lookbook-track"
        tabIndex={0}
        aria-label="Horizontal lookbook gallery"
      >
        <article className="lookbook-panel">
          <img
            src={imagery.fortyKit}
            alt="Khel 40-hole pickleballs beside a court bag"
          />
          <div>
            <span>01 / THE EVERYDAY ESCAPE</span>
            <h2>
              Your court.
              <br />
              <em>Your rules.</em>
            </h2>
          </div>
          <button
            style={{ top: "40%", left: "57%" }}
            className="hotspot"
            onClick={() => setSelected(products[1])}
            aria-label="Quick view Khel 40 pickleballs"
          >
            <Plus />
          </button>
        </article>
        <article className="lookbook-panel">
          <img
            src={imagery.editorial}
            alt="Fluorescent yellow Khel 48 pickleball above a paddle"
          />
          <div>
            <span>02 / AFTER THE FINAL WHISTLE</span>
            <h2>
              Stay a<br />
              <em>little longer.</em>
            </h2>
          </div>
          <button
            style={{ top: "45%", left: "48%" }}
            className="hotspot"
            onClick={() => setSelected(products[2])}
            aria-label="Quick view Khel 48 pickleballs"
          >
            <Plus />
          </button>
        </article>
        <article className="lookbook-panel">
          <img
            src="/images/original-1.jpg"
            alt="Khel Vision mount next to a court"
          />
          <div>
            <span>03 / EVERY RALLY MATTERS</span>
            <h2>
              Worth
              <br />
              <em>the replay.</em>
            </h2>
          </div>
          <button
            style={{ top: "34%", left: "60%" }}
            className="hotspot"
            onClick={() => setSelected(products[0])}
            aria-label="Quick view net phone mount"
          >
            <Plus />
          </button>
        </article>
      </div>
      <div className="lookbook-end">
        <p>The game doesn’t end at the baseline.</p>
        <Button asChild>
          <Link href="/shop">
            Shop the story <ArrowUpRight size={18} />
          </Link>
        </Button>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
      >
        <DialogContent className="quick-view">
          {selected && (
            <>
              <img src={selected.images[0]} alt={selected.name} />
              <DialogTitle className="modal-title">{selected.name}</DialogTitle>
              <DialogDescription>{selected.description}</DialogDescription>
              <strong>{money(selected.price)}</strong>
              <p className="muted">
                Quick add: {selected.sizes[0]} / {selected.colors[0]}
              </p>
              <Button onClick={() => add(selected)}>
                Add to bag <Plus size={18} />
              </Button>
              <Link
                className="text-link"
                href={`/product/${selected.slug}`}
                onClick={() => setSelected(null)}
              >
                All the details & sizes <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function About() {
  return (
    <>
      <section className="about-hero">
        <p className="eyebrow">THE KHELSHOP MANIFESTO</p>
        <h1>
          PLAY IS
          <br />
          <em>THE POINT.</em>
        </h1>
        <div className="about-intro">
          <p>
            Not the score.
            <br />
            Not the followers.
            <br />
            Not the perfect form.
          </p>
          <p>
            The feeling. That’s what we’re here for.
            <br />
            The crack of a clean shot. The last rally before sunset.
            <br />
            The people who make you stay for one more.
          </p>
        </div>
      </section>
      <section className="about-photo">
        <img src={imagery.court} alt="Khel pickleball on a sunlit court" />
        <span>MORE THAN A COURT. A COMMON GROUND.</span>
      </section>
      <section className="section about-story">
        <p className="eyebrow">FROM INDIA. FOR YOUR GAME.</p>
        <h2>
          We started with a mount.
          <br />
          <em>And a better point of view.</em>
        </h2>
        <p>
          Khelshop began with a simple idea: your best rallies deserve a replay.
          The Khel Vision mount puts your phone at court level, so you can
          record, learn, and share your game.
        </p>
        <p>
          Today, we’re keeping our focus on the essentials: 40-hole and 48-hole
          Khel pickleballs, and phone mounts that capture your game. Pick your
          ball. Find your angle. Keep playing.
        </p>
        <div className="values">
          {[
            [
              "01",
              "Show up.",
              "You don’t need permission to play. You just need to start.",
            ],
            [
              "02",
              "Play your way.",
              "Early bird or after-hours regular. There’s room for your kind of game.",
            ],
            [
              "03",
              "Keep it in play.",
              "Buy thoughtfully. Care for your gear. Make the good stuff last.",
            ],
          ].map(([n, title, copy]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section responsibility">
        <div>
          <p className="eyebrow">A LITTLE LESS WASTE. A LITTLE MORE PLAY.</p>
          <h2>
            Good intentions.
            <br />
            <em>Honest progress.</em>
          </h2>
        </div>
        <p>
          We believe in choosing well and using things longer. We’re working
          toward clear material, packaging, and sourcing information for every
          product. We’ll share verified details as they become available.
        </p>
      </section>
      <section className="section support-sections">
        <article id="shipping">
          <p className="eyebrow">SHIPPING & RETURNS</p>
          <h2>The practical stuff.</h2>
          <p>
            Demo policy: delivery across India in 3–7 business days. ₹149
            shipping, free over ₹2,999. Unused items can be returned within 30
            days. This preview uses demo checkout and does not ship orders.
          </p>
          <a className="text-link" href="mailto:hello@khelshop.in">
            hello@khelshop.in <ArrowUpRight size={17} />
          </a>
        </article>
        <article id="community">
          <p className="eyebrow">THE CLUB IS OPEN</p>
          <h2>
            Your people.
            <br />
            <em>Your next game.</em>
          </h2>
          <p>
            Our social channels are warming up. Join the newsletter below for
            launch news and community updates.
          </p>
        </article>
      </section>
    </>
  );
}

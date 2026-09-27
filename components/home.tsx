"use client";
import Link from "next/link";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Play, ArrowDown, MoveUpRight } from "lucide-react";
import { featured, products, imagery } from "@/data/products";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  ProductCard,
  ProductRow,
  Marquee,
  Countdown,
  EmailCapture,
  Reveal,
} from "./common";
import { useStore } from "./store";
export function Home() {
  const [film, setFilm] = useState(false),
    { setQuizOpen } = useStore();
  const x = useMotionValue(0),
    y = useMotionValue(0),
    rx = useTransform(x, [-1, 1], [-8, 8]),
    ry = useTransform(y, [-1, 1], [-6, 6]);
  const reduced = useReducedMotion();
  return (
    <>
      <section
        className="hero"
        onMouseMove={(e) => {
          if (reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          x.set(((e.clientX - r.left) / r.width) * 2 - 1);
          y.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.img
          style={reduced ? {} : { x: rx, y: ry, scale: 1.04 }}
          className="hero-image"
          src={imagery.hero}
          alt="Light green Khel 48-hole pickleball on a dark studio plinth"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-top">
          <span>THE COURT IS YOURS.</span>
          <span>VOL. 01 / COURT CULTURE</span>
        </div>
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            GOOD GEAR. GREAT GAME.
          </motion.p>
          <h1>
            {["BUILT FOR", "THE"].map((w, i) => (
              <motion.span
                className="hero-word"
                key={w}
                initial={reduced ? false : { opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.3 }}
              >
                {w}
                {i === 0 ? <br /> : " "}
              </motion.span>
            ))}
            <motion.em
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              BOLD.
            </motion.em>
          </h1>
          <p>
            Pickleballs made for your next rally.
            <br />
            Phone mounts that catch every moment.
          </p>
          <div className="hero-buttons">
            <Button asChild>
              <Link href="/shop">
                Shop the drop <ArrowUpRight size={19} />
              </Link>
            </Button>
            <button className="film-link" onClick={() => setFilm(true)}>
              <span>
                <Play size={14} fill="currentColor" />
              </span>
              Watch the film
            </button>
          </div>
        </div>
        <Link
          href={`/product/${products[2].slug}`}
          className="hero-product-tag"
        >
          <img src={imagery.yellow} alt="" />
          <span>
            <small>MEET YOUR GAME CHANGER</small>Khel 48 Pickleballs
            <small>48 holes. Two bold colours.</small>
          </span>
          <ArrowUpRight />
        </Link>
        <div className="hero-bottom">
          <span>FROM THE FIRST SERVE. TO THE LAST LIGHT.</span>
          <a href="#featured">
            SCROLL TO PLAY <ArrowDown size={13} />
          </a>
        </div>
      </section>
      <Marquee />
      <section id="featured" className="section">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE FIRST SERVE / DROP 001</p>
              <h2>
                Court essentials.
                <br />
                <em>Anything but ordinary.</em>
              </h2>
            </div>
            <div className="drop-teaser">
              <span>NEXT DROP IN</span>
              <Countdown />
              <Link className="text-link" href="/drop">
                Get first dibs <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="featured-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="collection-bottom">
            <p>Your game has a personality. Your gear should too.</p>
            <Link href="/shop" className="text-link">
              Explore the collection <ArrowUpRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
      <section className="category-section">
        <div className="section-heading">
          <h2>
            Find your <em>edge.</em>
          </h2>
          <span>ONE GAME. ENDLESS WAYS TO PLAY.</span>
        </div>
        <div className="category-grid">
          {[
            {
              name: "40-hole balls",
              img: imagery.forty,
              copy: "Keep the rally going.",
              href: `/product/${products[1].slug}`,
            },
            {
              name: "48-hole balls",
              img: imagery.yellow,
              copy: "Pick your colour.",
              href: `/product/${products[2].slug}`,
            },
            {
              name: "Phone mounts",
              img: "/images/original-1.jpg",
              copy: "Record every rally.",
              href: `/product/${products[0].slug}`,
            },
          ].map((c, i) => (
            <Link key={c.name} href={c.href} className="category-tile">
              <img loading="lazy" src={c.img} alt={`${c.name} collection`} />
              <div className="category-label">
                <span>
                  0{i + 1} / {c.copy}
                </span>
                <h3>
                  {c.name}
                  <MoveUpRight size={29} />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <ProductRow
        products={[products[2], products[1], products[0]]}
        title="Heavy rotation."
        eyebrow="THE CROWD FAVOURITES"
      />
      <section className="editorial-band">
        <img
          src={imagery.court}
          alt="Light green Khel 48 pickleball on the court at golden hour"
          loading="lazy"
        />
        <div>
          <p className="eyebrow">OFF THE CLOCK. ON THE COURT.</p>
          <h2>
            Less scrolling.
            <br />
            <em>More scoring.</em>
          </h2>
          <p>
            Leave the day behind. Bring your people.
            <br />
            We’ll bring the good stuff.
          </p>
          <Button asChild>
            <Link href="/lookbook">
              Explore the lookbook <ArrowUpRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM THE COURT, WITH LOVE</p>
            <h2>
              Good games.
              <br />
              <em>Better company.</em>
            </h2>
          </div>
          <span className="muted">Community moodboard · sample stories</span>
        </div>
        <div className="social-grid">
          {[
            {
              img: "/images/original-1.jpg",
              handle: "@the.rally.club",
              quote: "One more game is always the plan.",
            },
            {
              img: imagery.editorial,
              handle: "@afterhours.rally",
              quote: "The best part of my day starts here.",
            },
            {
              img: "/images/original-2.jpg",
              handle: "@courtside.collective",
              quote: "Hit record. Let the game do the talking.",
            },
            {
              img: imagery.court,
              handle: "@sunday.social",
              quote: "Same court. New favourite people.",
            },
          ].map((c) => (
            <article key={c.handle} className="social-card">
              <img src={c.img} alt="Court culture moodboard" loading="lazy" />
              <div>
                <span>★★★★★</span>
                <p>“{c.quote}”</p>
                <small>{c.handle}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="manifesto-strip">
        <p className="eyebrow">NO BENCHWARMER ENERGY.</p>
        <h2>
          Greatness isn’t a score.
          <br />
          It’s <em>showing up.</em>
        </h2>
        <p>
          We’re here for the love of the game.
          <br />
          The messy rallies. The small wins. Your kind of play.
        </p>
        <Link className="text-link" href="/about">
          Read the manifesto <ArrowUpRight size={18} />
        </Link>
      </section>
      <div className="fit-strip">
        <span>Good gear is personal.</span>
        <button onClick={() => setQuizOpen(true)}>
          Find your fit in 4 questions <ArrowUpRight size={21} />
        </button>
      </div>
      <Dialog open={film} onOpenChange={setFilm}>
        <DialogContent className="film-modal">
          <DialogTitle className="modal-title">Record every rally.</DialogTitle>
          <DialogDescription>
            A short visual story of the Khel Vision mount.
          </DialogDescription>
          <div className="film-frames">
            {[
              "/images/original-0.jpg",
              "/images/original-2.jpg",
              "/images/original-1.jpg",
            ].map((src, i) => (
              <img
                key={src}
                src={src}
                alt={
                  [
                    "Clip it to your net",
                    "Choose your angle",
                    "Play your game",
                  ][i]
                }
                style={{ animationDelay: `${i * 3}s` }}
              />
            ))}
            <strong>CLIP. RECORD. PLAY.</strong>
          </div>
          <p className="muted">
            A photo film using your original Khel Vision imagery.
          </p>
          <Button asChild>
            <Link
              href={`/product/${products[0].slug}`}
              onClick={() => setFilm(false)}
            >
              Meet Khel Vision <ArrowUpRight size={18} />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Drop() {
  return (
    <section className="drop-page">
      <img src={imagery.court} alt="Tennis courts" />
      <div className="drop-content">
        <p className="eyebrow">DROP 002 / OCTOBER 01, 2026 · 12 PM IST</p>
        <h1>
          GOOD THINGS
          <br />
          <em>DON’T WAIT.</em>
        </h1>
        <p>
          Your next obsession lands soon.
          <br />
          Get your name on the list.
        </p>
        <Countdown />
        <EmailCapture kind="waitlist" />
        <small>First access. No noise. Demo waitlist.</small>
        <Link className="text-link" href="/shop">
          Shop what’s here now <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

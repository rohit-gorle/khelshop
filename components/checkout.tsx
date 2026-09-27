"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowUpRight, Check, Lock, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useStore, type Order } from "./store";
import { products, productImages } from "@/data/products";
import { money } from "@/lib/utils";
import { calculate, addressSchema, type Address } from "@/lib/checkout";
import { Button } from "./ui/button";
const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publicKey?.startsWith("pk_test_")
  ? loadStripe(publicKey)
  : null;
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
export function Checkout() {
  const s = useStore(),
    router = useRouter();
  const [step, setStep] = useState(1),
    [promo, setPromo] = useState(""),
    [applied, setApplied] = useState(""),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [address, setAddress] = useState<Address>({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pin: "",
    }),
    [secret, setSecret] = useState(""),
    [busy, setBusy] = useState(false),
    [decline, setDecline] = useState(false);
  const totals = calculate(s.cart, applied),
    fingerprint = JSON.stringify(s.cart);
  useEffect(() => {
    setSecret("");
    setStep(1);
  }, [fingerprint, applied]);
  if (!s.ready) return <div className="section">Opening your bag…</div>;
  if (!s.cart.length)
    return (
      <div className="empty section">
        <h1>Your bag is starving.</h1>
        <p>Let’s find something good before you check out.</p>
        <Button asChild>
          <Link href="/shop">Shop the goods</Link>
        </Button>
      </div>
    );
  async function next() {
    const parsed = addressSchema.safeParse(address);
    if (!parsed.success) {
      const issues: Record<string, string> = {};
      parsed.error.issues.forEach(
        (i) => (issues[String(i.path[0])] = i.message),
      );
      setErrors(issues);
      return;
    }
    setErrors({});
    if (!stripePromise) {
      setStep(2);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: s.cart,
          promo: applied,
          address: parsed.data,
          requestId: crypto.randomUUID(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setSecret(data.clientSecret);
      setStep(2);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start payment.");
    } finally {
      setBusy(false);
    }
  }
  function demo() {
    if (decline) {
      toast.error(
        "Demo payment declined. Choose “Successful payment” to try again.",
      );
      return;
    }
    const order: Order = {
      id: `KHEL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      items: s.cart,
      total: totals.total,
      discount: totals.discount,
      shipping: totals.shipping,
      mode: "demo",
      date: new Date().toISOString(),
    };
    sessionStorage.setItem("khel-order", JSON.stringify(order));
    s.clear();
    router.push("/success?demo=1");
  }
  return (
    <section className="checkout-page">
      <Link className="text-link" href="/shop">
        <ArrowLeft size={16} />
        Back to the good stuff
      </Link>
      <div className="checkout-heading">
        <h1>
          Make it <em>yours.</em>
        </h1>
        <span>
          <Lock size={15} />
          {stripePromise ? "STRIPE TEST CHECKOUT" : "DEMO CHECKOUT · NO CHARGE"}
        </span>
      </div>
      <div className="checkout-layout">
        <div>
          <div className="checkout-steps">
            <button
              className={step === 1 ? "active" : ""}
              onClick={() => setStep(1)}
            >
              <span>{step === 2 ? <Check size={14} /> : "1"}</span>Your details
            </button>
            <i />
            <span className={step === 2 ? "active" : ""}>
              <b>2</b>Payment
            </span>
          </div>
          {step === 1 ? (
            <form
              className="form-stack checkout-form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void next();
              }}
            >
              <h2>Where’s the game?</h2>
              <p className="muted">
                Delivery within India. Use fictional details for this demo.
              </p>
              <div className="field-grid">
                {[
                  {
                    name: "name",
                    label: "Full name",
                    placeholder: "Alex Sharma",
                    auto: "name",
                  },
                  {
                    name: "email",
                    label: "Email address",
                    placeholder: "alex@example.com",
                    auto: "email",
                  },
                  {
                    name: "phone",
                    label: "Mobile number",
                    placeholder: "9876543210",
                    auto: "tel-national",
                  },
                  {
                    name: "address",
                    label: "Street address",
                    placeholder: "House, street and area",
                    auto: "street-address",
                  },
                  {
                    name: "city",
                    label: "City",
                    placeholder: "Bengaluru",
                    auto: "address-level2",
                  },
                  {
                    name: "pin",
                    label: "PIN code",
                    placeholder: "560001",
                    auto: "postal-code",
                  },
                ].map((f) => (
                  <label
                    key={f.name}
                    className={f.name === "address" ? "full" : ""}
                  >
                    {f.label}
                    <input
                      type={
                        f.name === "email"
                          ? "email"
                          : f.name === "phone"
                            ? "tel"
                            : "text"
                      }
                      inputMode={
                        f.name === "pin" || f.name === "phone"
                          ? "numeric"
                          : undefined
                      }
                      name={f.name}
                      autoComplete={f.auto}
                      placeholder={f.placeholder}
                      value={address[f.name as keyof Address]}
                      aria-invalid={!!errors[f.name]}
                      aria-describedby={
                        errors[f.name] ? `error-${f.name}` : undefined
                      }
                      onChange={(e) =>
                        setAddress({ ...address, [f.name]: e.target.value })
                      }
                    />
                    {errors[f.name] && (
                      <small id={`error-${f.name}`} className="field-error">
                        {errors[f.name]}
                      </small>
                    )}
                  </label>
                ))}
                <label className="full">
                  State / Union territory
                  <select
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    aria-invalid={!!errors.state}
                  >
                    <option value="">Select your state</option>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <small className="field-error">{errors.state}</small>
                  )}
                </label>
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? "Getting ready…" : "Continue to payment"}
                <ArrowUpRight size={18} />
              </Button>
            </form>
          ) : (
            <div className="payment-panel">
              <h2>The final serve.</h2>
              <p className="muted">
                {address.name} · {address.city}, {address.pin}
              </p>
              {stripePromise && secret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: secret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#0A0A0A",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <StripePayment total={totals.total} />
                </Elements>
              ) : (
                <div className="demo-payment">
                  <p>
                    This is a demo order. No card details, charges, or shipment.
                  </p>
                  <label>
                    <input
                      type="radio"
                      name="demo-result"
                      checked={!decline}
                      onChange={() => setDecline(false)}
                    />
                    Successful payment
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="demo-result"
                      checked={decline}
                      onChange={() => setDecline(true)}
                    />
                    Simulate a declined payment
                  </label>
                  <Button onClick={demo}>
                    Place demo order · {money(totals.total)}
                    <ArrowUpRight size={18} />
                  </Button>
                </div>
              )}
              <button className="text-link" onClick={() => setStep(1)}>
                Edit delivery details
              </button>
            </div>
          )}
        </div>
        <aside className="order-summary">
          <p className="eyebrow">THE LINEUP</p>
          {s.cart.map((l, i) => {
            const p = products.find((p) => p.id === l.id)!;
            return (
              <div className="summary-line" key={i}>
                <img
                  src={productImages(p, l.color)[0]}
                  alt={`${p.name} — ${l.color}`}
                />
                <div>
                  <h3>{p.name}</h3>
                  <span>
                    {l.size} / {l.color} · Qty {l.qty}
                  </span>
                </div>
                <strong>{money(p.price * l.qty)}</strong>
              </div>
            );
          })}
          <form
            className="promo-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (promo.trim().toUpperCase() === "HEAT10") {
                setApplied("HEAT10");
                toast.success("A little heat. 10% off applied.");
              } else
                toast.error("That code is not on the guest list. Try HEAT10.");
            }}
          >
            <input
              placeholder="Got a code? Try HEAT10"
              aria-label="Promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <Button variant="outline" size="sm" type="submit">
              Apply
            </Button>
          </form>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            {applied && (
              <div className="discount">
                <dt>
                  HEAT10{" "}
                  <button
                    aria-label="Remove promo code"
                    onClick={() => {
                      setApplied("");
                      setPromo("");
                    }}
                  >
                    ×
                  </button>
                </dt>
                <dd>−{money(totals.discount)}</dd>
              </div>
            )}
            <div>
              <dt>Shipping</dt>
              <dd>{totals.shipping ? money(totals.shipping) : "On us"}</dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{money(totals.total)}</dd>
            </div>
          </dl>
          <p className="muted">
            Prices include taxes. This store uses mock inventory.
          </p>
        </aside>
      </div>
    </section>
  );
}
function StripePayment({ total }: { total: number }) {
  const stripe = useStripe(),
    elements = useElements(),
    router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <form
      className="form-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setBusy(true);
        setError("");
        try {
          const result = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/success` },
            redirect: "if_required",
          });
          if (result.error)
            setError(result.error.message || "Payment failed. Try again.");
          else if (result.paymentIntent?.status === "succeeded")
            router.push("/success");
          else setError("Payment is processing. Please check again shortly.");
        } catch {
          setError("Network error. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="test-card-note">
        Stripe test mode: 4242 4242 4242 4242 · any future expiry · any 3-digit
        CVC.
      </p>
      <PaymentElement />
      <p role="alert" className="field-error">
        {error}
      </p>
      <Button disabled={busy || !stripe || !elements} type="submit">
        {busy ? "Confirming…" : `Pay ${money(total)} · test mode`}
        <Lock size={16} />
      </Button>
    </form>
  );
}
export function Success() {
  const { clear } = useStore(),
    params = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    async function verify() {
      try {
        if (params.get("demo") === "1") {
          const data = JSON.parse(
            sessionStorage.getItem("khel-order") || "null",
          );
          if (
            !data ||
            data.mode !== "demo" ||
            !Array.isArray(data.items) ||
            !data.items.length
          )
            throw Error(
              "No demo order found. Your next good game starts in the shop.",
            );
          if (live) setOrder(data);
          return;
        }
        const res = await fetch("/api/order");
        const data = await res.json();
        if (!res.ok) throw Error(data.error || "Could not verify payment.");
        if (live) {
          setOrder(data);
          sessionStorage.setItem("khel-order", JSON.stringify(data));
          clear();
        }
      } catch (e) {
        if (live)
          setError(
            e instanceof Error ? e.message : "Could not confirm this order.",
          );
      }
    }
    void verify();
    return () => {
      live = false;
    };
  }, [params, clear]);
  if (error)
    return (
      <section className="empty section">
        <h2>Let’s check that.</h2>
        <p>{error}</p>
        <Button asChild>
          <Link href="/shop">Back to shop</Link>
        </Button>
      </section>
    );
  if (!order)
    return (
      <section className="empty section">
        <h2>Checking your order…</h2>
      </section>
    );
  return (
    <section className="success-page">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${i * 0.07}s`,
              background: i % 2 ? "#D4FF3F" : "#90947b",
            }}
          />
        ))}
      </div>
      <div className="success-check">
        <Check size={34} />
      </div>
      <p className="eyebrow">
        {order.mode === "demo"
          ? "DEMO ORDER CONFIRMED"
          : "STRIPE TEST PAYMENT CONFIRMED"}
      </p>
      <h1>
        GOOD GAME.
        <br />
        <em>GREAT TASTE.</em>
      </h1>
      <p>
        {order.mode === "demo"
          ? "Your demo order is in. No payment was taken."
          : "Your Stripe test payment is verified."}
        <br />
        No physical goods will be shipped.
      </p>
      <div className="confirmation">
        <span>ORDER {order.id}</span>
        <strong>{money(order.total)}</strong>
        <p>
          {order.items.reduce((n, l) => n + l.qty, 0)} items ·{" "}
          {new Date(order.date).toLocaleDateString("en-IN")}
        </p>
      </div>
      <div className="success-actions">
        <Button asChild>
          <Link href="/shop">
            Keep the game going <ArrowUpRight size={18} />
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              if (navigator.share)
                await navigator.share({
                  title: "My Khelshop fit",
                  text: "Found my next court fit at Khelshop.",
                  url: `${window.location.origin}/shop`,
                });
              else {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/shop`,
                );
                toast.success("Link copied. Share your fit.");
              }
            } catch {
              toast.info("Share cancelled.");
            }
          }}
        >
          Share your fit <Share2 size={17} />
        </Button>
      </div>
    </section>
  );
}

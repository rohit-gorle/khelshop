import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash } from "crypto";
import { checkoutSchema, calculate } from "@/lib/checkout";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("origin") &&
      req.headers.get("origin") !== req.nextUrl.origin
    )
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 },
      );
    const parsed = checkoutSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    const { items, promo, address, requestId } = parsed.data;
    const totals = calculate(items, promo);
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key?.startsWith("sk_test_"))
      return NextResponse.json(
        {
          error:
            "Stripe test mode is not configured. Use demo checkout or configure test keys.",
        },
        { status: 503 },
      );
    const stripe = new Stripe(key);
    const orderId = `KHEL-${requestId.slice(0, 8).toUpperCase()}`;
    const intent = await stripe.paymentIntents.create(
      {
        amount: totals.total * 100,
        currency: "inr",
        payment_method_types: ["card"],
        description: `Khelshop test order ${orderId}`,
        shipping: {
          name: address.name,
          phone: `+91${address.phone}`,
          address: {
            line1: address.address,
            city: address.city,
            state: address.state,
            postal_code: address.pin,
            country: "IN",
          },
        },
        metadata: {
          orderId,
          items: JSON.stringify(
            items.map((l) => [l.id, l.size, l.color, l.qty]),
          ),
          discount: String(totals.discount),
          shipping: String(totals.shipping),
        },
      },
      {
        idempotencyKey: `khel-${requestId}-${createHash("sha256").update(JSON.stringify(parsed.data)).digest("hex").slice(0, 16)}`,
      },
    );
    if (intent.livemode)
      return NextResponse.json(
        { error: "Only test payments are permitted." },
        { status: 400 },
      );
    const response = NextResponse.json({
      clientSecret: intent.client_secret,
      totals,
    });
    response.cookies.set("khel-payment", intent.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error &&
          !(error instanceof Stripe.errors.StripeError)
            ? error.message
            : "Could not start payment. Please try again.",
      },
      { status: 400 },
    );
  }
}

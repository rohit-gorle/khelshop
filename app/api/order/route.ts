import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const id = req.cookies.get("khel-payment")?.value,
    key = process.env.STRIPE_SECRET_KEY;
  if (!id || !key?.startsWith("sk_test_"))
    return NextResponse.json(
      { error: "No test payment to verify." },
      { status: 404 },
    );
  try {
    const intent = await new Stripe(key).paymentIntents.retrieve(id);
    if (intent.status !== "succeeded" || intent.livemode)
      return NextResponse.json(
        { error: "Payment is not complete yet.", status: intent.status },
        { status: 409 },
      );
    const lines = JSON.parse(intent.metadata.items) as [
      string,
      string,
      string,
      number,
    ][];
    return NextResponse.json(
      {
        id: intent.metadata.orderId,
        items: lines.map(([id, size, color, qty]) => ({
          id,
          size,
          color,
          qty,
        })),
        total: intent.amount / 100,
        discount: Number(intent.metadata.discount),
        shipping: Number(intent.metadata.shipping),
        mode: "stripe",
        date: new Date(intent.created * 1000).toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to verify payment. Please try again." },
      { status: 502 },
    );
  }
}

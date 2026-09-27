import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("origin") &&
      req.headers.get("origin") !== req.nextUrl.origin
    )
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const data = z
      .object({
        email: z.string().email().max(254),
        kind: z.enum(["newsletter", "waitlist"]),
      })
      .safeParse(await req.json());
    if (!data.success)
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    const endpoint = process.env.NEWSLETTER_WEBHOOK_URL;
    if (!endpoint) return NextResponse.json({ ok: true, demo: true });
    if (!endpoint.startsWith("https://")) throw Error("Invalid webhook URL");
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.data),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw Error("Subscription failed");
    return NextResponse.json({ ok: true, demo: false });
  } catch {
    return NextResponse.json(
      { error: "Could not subscribe. Please try again." },
      { status: 502 },
    );
  }
}

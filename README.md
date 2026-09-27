# Khelshop

A responsive Next.js 14 App Router storefront for **khelshop.in**, built around Khel pickleballs and the Khel Vision phone mount.

## Run

Use Node.js 20 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Next.js. On systems with a low file-watcher limit, use `WATCHPACK_POLLING=true npm run dev`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Development and production use separate build directories so the preview can remain running during a build.

## Products and imagery

The final catalog deliberately contains **only three products**, superseding the original request for 24 mock products:

- Khel 40 pickleballs: 40 holes, light green.
- Khel 48 pickleballs: 48 holes, light green or fluorescent yellow.
- Khel Vision net phone mount.

All product and editorial imagery comes from the supplied Khel assets. Selecting the 48-hole colour changes the four-photo gallery; the chosen colour and image follow the item into the bag and checkout. The original `40-Yellow` filenames are retained for provenance, while the customer-facing colour follows the supplied instruction: **Light green**.

Prices and inventory live in `data/products.ts`. The phone mount keeps the original ₹1,499 / ₹1,999 pricing. Both ball models temporarily use **₹899 per 4-pack**, prominently marked as preview pricing pending confirmation. The stock quantities and reviews are demo data. No certification, tournament approval, material, or performance claims have been invented. JPEG copies of the supplied PNGs reduce transfer size without changing their content; original PNG copies are preserved.

## Features

Home, shop, dynamic product pages, drop, lookbook, manifesto, checkout, success and custom 404. Shared Radix/shadcn-style accessible dialogs and accordion, buttons, badges and loading skeletons; Framer Motion transitions; Lenis smooth scrolling; reduced-motion support; system-aware light/dark themes.

Persistent bag and wishlist; quantity controls and remove; fuzzy catalog search plus Command-K palette; category, pack, colour, price and stock filters; sort; product galleries; locally saved sample reviews; recently viewed products; four-question recommendations; newsletter and waitlist forms; product hotspots; a photo-film made from the original mount photography.

SEO page metadata, OG text metadata, supplied Khel favicon, sitemap and robots. No new social sharing image was generated. External social account URLs were not supplied, so social controls lead to the community information section rather than invented profiles.

## Checkout modes

### No-charge demo (default)

Leave Stripe keys blank. Checkout validates Indian delivery fields, applies `HEAT10` (10% off merchandise), calculates ₹149 shipping or free shipping at ₹2,999 before discounts, simulates successful/declined payments, and creates a session-only confirmation. No card details, payment, shipment, or confirmation email. Demo orders are retained in sessionStorage; addresses are held in memory only.

### Stripe Elements test mode

Set matching `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` and `STRIPE_SECRET_KEY=sk_test_...` in `.env.local`, then restart/rebuild. Only test keys are accepted.

The API validates the bag, product variants, aggregate stock limits and address, calculates the amount from the server catalog, and creates an idempotent PaymentIntent. Stripe Elements collects payment details directly; the application never handles raw card numbers. A same-site HTTP-only cookie ties confirmation to the payment. `/api/order` retrieves the PaymentIntent server-side and only returns a confirmation for a succeeded, non-live payment.

Test with `4242 4242 4242 4242`, a future expiry and any 3-digit CVC. Also test declines and 3-D Secure with [Stripe's testing guidance](https://docs.stripe.com/testing). Never commit keys. Test-mode verification requires your own keys; none were provided during implementation.

This is a storefront prototype, not a fulfillment backend. Before live commerce, add durable orders/inventory, signed payment webhooks with idempotent fulfillment, production abuse controls, real shipping/tax policies and verified product pricing. Live payments are intentionally disabled. Next.js 14 was retained as explicitly requested; it is outside the current support window, so upgrade to a supported major before a public production launch.

## Newsletter and waitlist

With no `NEWSLETTER_WEBHOOK_URL`, submissions visibly report a demo signup and do not store or email addresses. Configure an HTTPS email-provider webhook to receive `{email, kind}` server-side. Demo queue position is explicitly labelled. No invented live waitlist or referral ranking.

## Hosting

Normal `npm run build` retains the Next.js server APIs and can deploy to a Node-compatible Next.js host such as Vercel. Connect `khelshop.in` there after verifying ownership and configuring DNS; this repository does not change domain DNS.

`npm run build:preview` builds a static export in `out/` for the private Sites preview. The script temporarily excludes API handlers, disables Stripe and restores the source in a `finally` block. That deployed preview supports the complete no-charge demo journey; Stripe and a real newsletter require the full Next.js server deployment. `.openai/hosting.json` identifies the private preview and its public static output only.

## Browser agent support

When `document.modelContext` is available, the page registers the read-only `search_khelshop_products` WebMCP tool. It validates its input and returns the same catalog shown in the interface.

## Design reference

[Battle Sports](https://battlesports.com/) informed the bold product-first layout and category presentation. Khel branding and supplied product imagery remain the focus. Fonts: Space Grotesk and Instrument Serif through Google Fonts.

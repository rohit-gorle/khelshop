const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const cache = new Map();
function load(relative) {
  const file = path.join(root, relative + ".ts");
  if (cache.has(file)) return cache.get(file);
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", output)(
    (id) => (id.startsWith("@/") ? load(id.slice(2)) : require(id)),
    mod,
    mod.exports,
  );
  cache.set(file, mod.exports);
  return mod.exports;
}
const { calculate, addressSchema, checkoutSchema } = load("lib/checkout");
const { products, productImages } = load("data/products");
const yellow = {
  id: "khel-3",
  size: "4-pack",
  color: "Fluorescent yellow",
  qty: 2,
};
test("discount and shipping match the checkout totals", () =>
  assert.deepEqual(calculate([yellow], "HEAT10"), {
    subtotal: 1798,
    discount: 180,
    shipping: 149,
    total: 1767,
  }));
test("shipping is free at the threshold before discounts", () =>
  assert.equal(calculate([{ ...yellow, qty: 4 }], "HEAT10").shipping, 0));
test("rejects nonexistent products, invalid variants, negative and fractional quantities", () => {
  for (const line of [
    { ...yellow, id: "unknown" },
    { ...yellow, color: "Red" },
    { ...yellow, qty: -1 },
    { ...yellow, qty: 1.5 },
  ])
    assert.throws(() => calculate([line], ""));
});
test("stock is capped across colour variants", () =>
  assert.throws(() =>
    calculate(
      [
        { ...yellow, qty: 20 },
        { ...yellow, color: "Light green", qty: 20 },
      ],
      "",
    ),
  ));
test("invalid promo is not silently accepted", () =>
  assert.throws(() => calculate([yellow], "INVALID")));
test("rejects malformed address and empty checkout", () => {
  assert.equal(addressSchema.safeParse({}).success, false);
  assert.equal(checkoutSchema.safeParse({ items: [] }).success, false);
});
test("only the two ball models and mount are offered", () => {
  assert.equal(products.length, 3);
  assert.deepEqual(
    products.filter((p) => p.holes).map((p) => p.holes),
    [40, 48],
  );
  assert.deepEqual(products[1].colors, ["Light green"]);
  assert.deepEqual(products[2].colors, ["Light green", "Fluorescent yellow"]);
});
test("yellow variant displays its own supplied gallery", () => {
  const images = productImages(products[2], "Fluorescent yellow");
  assert.equal(images.length, 4);
  assert.ok(images.every((url) => url.includes("48-Yellow")));
});

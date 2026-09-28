import { renameSync, existsSync, rmSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
// Static Sites preview includes demo checkout. Normal builds retain the Next.js API.
const api = "app/api",
  hold = ".api-preview-hold";
if (existsSync(hold))
  throw new Error("Restore .api-preview-hold to app/api before building.");
renameSync(api, hold);
try {
  if (existsSync("out")) rmSync("out", { recursive: true });
  const r = spawnSync(
    process.execPath,
    ["node_modules/next/dist/bin/next", "build"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        STATIC_PREVIEW: "1",
        NEXT_PUBLIC_STATIC_PREVIEW: "1",
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "",
      },
    },
  );
  if (r.status !== 0) process.exitCode = r.status || 1;
  else if (!existsSync("out/index.html")) {
    console.error(
      "ERROR: 'next build' succeeded but out/index.html was not created.\n" +
        `out/ exists: ${existsSync("out")}. ` +
        "The static export must land in <repo-root>/out/ for Cloudflare Pages. " +
        "Do not customize distDir for preview builds in next.config.mjs."
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Static export verified: out/ written (${readdirSync("out").length} top-level entries).`
    );
  }
} finally {
  renameSync(hold, api);
}

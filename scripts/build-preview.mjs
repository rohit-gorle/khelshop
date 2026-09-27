import { renameSync, existsSync, rmSync } from "node:fs";
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
} finally {
  renameSync(hold, api);
}

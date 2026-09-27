/** @type {import('next').NextConfig} */
const config = {
  distDir:
    process.env.STATIC_PREVIEW === "1"
      ? ".next-preview"
      : process.env.NODE_ENV === "development"
        ? ".next-dev"
        : ".next",
  ...(process.env.STATIC_PREVIEW === "1"
    ? { output: "export", trailingSlash: true }
    : {}),
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;

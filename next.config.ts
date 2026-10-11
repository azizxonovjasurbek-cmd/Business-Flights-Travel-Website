import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { buildSecurityHeaders } from "./src/lib/security-headers";

// Diagnostic-only — inert unless ANALYZE=true is set (`npm run analyze`),
// so it never affects a normal `next build`/production deploy.
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

// A CSP strict enough to matter, without breaking Next.js's own hydration
// script or the JSON-LD <script> tags rendered inline throughout the app
// (layout.tsx, destination/blog/FAQ structured data). Nonce-based script-src
// (no 'unsafe-inline') is the stricter option, but requires threading a
// per-request nonce through every one of those inline scripts via
// middleware — a real future hardening step, not something to bolt on
// without the testing that deserves. next/font self-hosts font files at
// build time (no fonts.gstatic.com at runtime), and next/image proxies
// remote images through same-origin /_next/image, so neither needs a CSP
// allowance here despite Unsplash being configured below.
// Dev-only relaxations — never applied to a production build. Turbopack's
// hot-reload client opens a same-origin WebSocket that browsers treat as a
// separate scheme from connect-src 'self', and React's dev-mode tooling
// uses eval() for component stack traces (never in production — see
// https://react.dev, this is stripped from the production build).
const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = buildSecurityHeaders(isDev);

const nextConfig: NextConfig = {
  // Cloudflare Workers (OpenNext) build: `pg` requires "pg-cloudflare" for its
  // Workers socket. pg-cloudflare's package.json maps that to ./dist/index.js
  // only under the "workerd" export condition; Next's standalone file tracing
  // resolves with Node conditions and so copies just dist/empty.js. OpenNext's
  // esbuild step then resolves with "workerd" and fails with
  // `Could not resolve "pg-cloudflare"`. Force the real files into the trace.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/pg-cloudflare/dist/**/*", "./node_modules/pg-cloudflare/esm/**/*"],
  },
  images: {
    // Editorial/destination imagery is sourced from Unsplash as placeholders
    // during development — swap for licensed/company-owned photography via
    // the `heroImage` fields in src/data/destinations.ts and src/data/blog-posts.ts.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Permanent redirects ONLY for retired/guessed article URLs that have an unambiguous
  // topical equivalent. None of these slugs exists in this repository's history, so they
  // come from outside links; where the topic matches an article we publish, a 308 keeps
  // the visitor (and any link value) on the right page. Other unknown blog URLs are
  // deliberately NOT redirected — they return a real 404 (see dynamicParams in
  // src/app/blog/[slug]/page.tsx) rather than being sent to an unrelated page.
  async redirects() {
    return [
      { source: "/blog/airport-lounge-guide-for-executives", destination: "/blog/business-class-airport-lounge-guide", permanent: true },
      { source: "/blog/business-class-travel-tips", destination: "/blog/long-haul-business-class-travel-tips", permanent: true },
      { source: "/blog/best-airlines-for-business-class-routes", destination: "/blog/best-business-class-airlines-long-haul", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

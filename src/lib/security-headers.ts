// Security headers shared by next.config.ts (applied by Next for requests that
// reach the Next server) and worker/index.mjs (applied to prerendered pages the
// Cloudflare fast path serves without starting Next). Keeping one definition
// means the two paths cannot drift apart.
//
// `isDev` adds the dev-only CSP relaxations (see next.config.ts) and is never
// true for a production build.

// No analytics loads anywhere in this app right now (see docs/ENVIRONMENT.md)
// — no third-party script hosts need allowing here. If that changes, widen
// this alongside whatever loads the script, not speculatively ahead of it.
export function buildSecurityHeaders(isDev: boolean): { key: string; value: string }[] {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    },
    // Only takes effect when actually served over HTTPS (the header itself is
    // harmless over plain HTTP); enforced at the hosting/reverse-proxy layer,
    // this just tells browsers to remember and require it going forward.
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ];
}

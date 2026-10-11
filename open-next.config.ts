import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// This site has no revalidation (no ISR / revalidate / `use cache`): every
// page is prerendered at build time. Without an incremental cache the Worker
// cannot find those prerendered pages, so statically generated routes with
// `dynamicParams = false` (destination city pages, blog posts) returned 404.
// The static-assets cache serves them read-only from the Worker's own static
// assets, so it needs no extra Cloudflare resources (no R2/KV binding).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

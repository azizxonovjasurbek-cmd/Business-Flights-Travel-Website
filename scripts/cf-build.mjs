#!/usr/bin/env node
// Build step used by `opennextjs-cloudflare build` (see `buildCommand` in
// open-next.config.ts). It runs the normal `next build`, then publishes the
// prerendered pages Next already generated as private static assets so the
// Cloudflare front entry (worker/index.mjs) can serve them without starting
// the Next.js server.
//
// WHY: on the Workers Free plan a request may use ~10 ms of CPU. Even with an
// incremental cache hit, running the Next/OpenNext handler for a prerendered
// page costs more than that, which surfaced in production as Error 1102
// ("Worker exceeded CPU time limit") on `/` and on the `?_rsc=` navigation /
// prefetch requests. Serving the files Next already rendered needs almost no CPU.
//
// `npm run build` (plain `next build`) is unchanged and does NOT run this file.

import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, ".next", "server", "app");
// Files under public/ are copied by OpenNext into the Worker's static assets.
// Anything under `cdn-cgi/` is reachable only through the Worker's ASSETS
// binding, not from the public internet (same trick OpenNext's own cache uses).
const destDir = path.join(root, "public", "cdn-cgi", "_prerendered");
const manifestPath = path.join(root, "worker", "prerender-manifest.json");

if (!process.argv.includes("--skip-next-build")) {
  execSync("npx next build", { stdio: "inherit", cwd: root, env: process.env });
}

if (!existsSync(appDir)) {
  throw new Error(`cf-build: ${appDir} not found; did \`next build\` succeed?`);
}

rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir, { recursive: true });

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

function readMeta(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

const pages = [];
const bodies = {};

for (const file of walk(appDir)) {
  const rel = path.relative(appDir, file).split(path.sep).join("/");

  if (rel.endsWith(".html")) {
    const base = rel.slice(0, -".html".length);
    // `_not-found`, `_global-error`: error pages, not routes to serve with 200.
    if (base.split("/").some((part) => part.startsWith("_"))) continue;
    const meta = readMeta(path.join(appDir, `${base}.meta`));
    if (!meta || (meta.status ?? 200) !== 200) continue;
    const route = base === "index" ? "/" : `/${base}`;

    // `.page`, not `.html`: Workers static assets redirect `/x.html` -> `/x`.
    const target = path.join(destDir, `${base}.page`);
    mkdirSync(path.dirname(target), { recursive: true });
    cpSync(file, target);

    const rsc = path.join(appDir, `${base}.rsc`);
    if (existsSync(rsc)) cpSync(rsc, path.join(destDir, `${base}.rsc`));
    const segments = path.join(appDir, `${base}.segments`);
    if (existsSync(segments)) cpSync(segments, path.join(destDir, `${base}.segments`), { recursive: true });
    pages.push(route);
  } else if (rel.endsWith(".body")) {
    // Prerendered route handlers: sitemap.xml, robots.txt, manifest, OG images, icons.
    const base = rel.slice(0, -".body".length);
    const meta = readMeta(path.join(appDir, `${base}.meta`));
    if (!meta || (meta.status ?? 200) !== 200 || !meta.headers?.["content-type"]) continue;
    const target = path.join(destDir, `${base}.body`);
    mkdirSync(path.dirname(target), { recursive: true });
    cpSync(file, target);
    bodies[`/${base}`] = [meta.headers["content-type"], meta.headers["cache-control"] ?? "public, max-age=0, must-revalidate"];
  }
}

pages.sort();
mkdirSync(path.dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify({ pages, bodies }));
console.log(`[cf-build] published ${pages.length} prerendered pages and ${Object.keys(bodies).length} route-handler bodies as private assets`);

#!/usr/bin/env node
// scripts/generate-sitemap.cjs
// Generates public/sitemap.xml from pages directory at build time.
// Run: node scripts/generate-sitemap.cjs
// Add to package.json build: "build": "node scripts/generate-sitemap.cjs && next build"

const fs = require("fs");
const path = require("path");

const DOMAIN = "https://ofertemutare.ro";
const PAGES_DIR = path.join(__dirname, "..", "pages");
const OUTPUT = path.join(__dirname, "..", "public", "sitemap.xml");

// Directories & files to exclude from sitemap
const EXCLUDE_DIRS = ["api", "admin", "company", "customer", "upload", "_app.tsx", "_document.tsx"];
const EXCLUDE_FILES = ["_app.tsx", "_document.tsx", "404.tsx", "500.tsx"];

// Priority map by path depth / type
function getPriority(route) {
  if (route === "/") return "1.0";
  if (route === "/faq") return "0.9";
  if (["/about", "/contact", "/blog", "/calculator", "/partener"].includes(route)) return "0.8";
  if (route.startsWith("/articole/")) return "0.7";
  if (route.startsWith("/servicii/")) return "0.7";
  if (route.startsWith("/mutari/")) return "0.7";
  return "0.6";
}

function getChangefreq(route) {
  if (route === "/") return "weekly";
  if (route === "/faq" || route === "/blog") return "weekly";
  if (route.startsWith("/articole/")) return "monthly";
  return "monthly";
}

function collectPages(dir, basePath = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const entry of entries) {
    const name = entry.name;

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(name)) continue;
      routes = routes.concat(collectPages(path.join(dir, name), `${basePath}/${name}`));
    } else if (entry.isFile() && (name.endsWith(".tsx") || name.endsWith(".ts"))) {
      if (EXCLUDE_FILES.includes(name)) continue;
      // Skip dynamic routes like [slug].tsx
      if (name.includes("[")) continue;

      let route;
      if (name === "index.tsx" || name === "index.ts") {
        route = basePath || "/";
      } else {
        route = `${basePath}/${name.replace(/\.tsx?$/, "")}`;
      }
      routes.push(route);
    }
  }
  return routes;
}

function buildSitemap(routes) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const urls = routes
    .sort()
    .map((route) => {
      return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangefreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// Main
const routes = collectPages(PAGES_DIR);
const sitemap = buildSitemap(routes);
fs.writeFileSync(OUTPUT, sitemap, "utf-8");
console.log(`✅ Sitemap generated: ${routes.length} URLs → public/sitemap.xml`);

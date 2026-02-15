// pages/sitemap.xml.ts
// Dynamic sitemap generation — auto-includes all static pages + dynamic city/route pages + blog articles
// Serves at /sitemap.xml via getServerSideProps (cached 1 hour)
import type { GetServerSidePropsContext } from "next";
import fs from "fs";
import path from "path";
import { getAllCitySlugs } from "@/data/geo/citySlugData";
import { getAllRoutePaths } from "@/data/geo/routeData";

const SITE_URL = "https://ofertemutare.ro";
const EXCLUDED_PATTERNS = [
  /^\/api\//,
  /^\/admin/,
  /^\/company/,
  /^\/customer/,
  /^\/upload/,
  /^\/reviews/,
  /^\/_/,
  /^\/404/,
  /^\/500/,
];

interface SitemapEntry {
  loc: string;
  lastmod: string;
  priority: string;
}

/** Walk pages/ directory and collect static routes with real file-modification dates */
function getStaticPages(): SitemapEntry[] {
  const pagesDir = path.join(process.cwd(), "pages");
  const entries: SitemapEntry[] = [];

  function walk(dir: string, prefix: string) {
    const dirEntries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of dirEntries) {
      if (entry.name.startsWith("_")) continue;
      // Skip dynamic route folders/files — handled separately below
      if (entry.name.startsWith("[")) continue;
      const fullPath = path.join(dir, entry.name);
      const routePath = prefix + "/" + entry.name;

      if (entry.isDirectory()) {
        walk(fullPath, routePath);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        if (entry.name === "sitemap.xml.ts") continue;
        const route =
          routePath
            .replace(/\.(tsx|ts)$/, "")
            .replace(/\/index$/, "") || "/";

        if (EXCLUDED_PATTERNS.some((p) => p.test(route))) continue;

        // Use real file modification time for accurate <lastmod>
        const stat = fs.statSync(fullPath);
        const lastmod = stat.mtime.toISOString().split("T")[0];

        // Assign priority based on page type
        let priority: string;
        if (route === "/") {
          priority = "1.0";
        } else if (
          /^\/servicii\//.test(route) ||
          /^\/mutari\/(tipuri|specializate)\//.test(route)
        ) {
          priority = "0.8";
        } else if (/^\/articole\//.test(route)) {
          priority = "0.7";
        } else if (route.split("/").length <= 2) {
          priority = "0.8";
        } else {
          priority = "0.6";
        }

        entries.push({ loc: route, lastmod, priority });
      }
    }
  }

  walk(pagesDir, "");
  return entries;
}

/** Generate entries for dynamic city and route pages */
function getDynamicPages(): SitemapEntry[] {
  const now = new Date().toISOString().split("T")[0];
  const entries: SitemapEntry[] = [];

  // City pages: /mutari/[from] — 41 cities
  const citySlugs = getAllCitySlugs();
  for (const slug of citySlugs) {
    entries.push({ loc: `/mutari/${slug}`, lastmod: now, priority: "0.9" });
  }

  // Route pages: /mutari/[from]/[to] — ~150 routes
  const routePaths = getAllRoutePaths();
  for (const rp of routePaths) {
    entries.push({
      loc: `/mutari/${rp.params.from}/${rp.params.to}`,
      lastmod: now,
      priority: "0.8",
    });
  }

  return entries;
}

function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map(
    ({ loc, lastmod, priority }) =>
      `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const staticPages = getStaticPages();
  const dynamicPages = getDynamicPages();

  // Sort: homepage first, then alphabetical
  const allPages = [...staticPages, ...dynamicPages].sort((a, b) => {
    if (a.loc === "/") return -1;
    if (b.loc === "/") return 1;
    return a.loc.localeCompare(b.loc);
  });

  const sitemap = generateSitemap(allPages);

  res.setHeader("Content-Type", "text/xml; charset=UTF-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=600");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}

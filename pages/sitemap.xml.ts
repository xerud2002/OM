// pages/sitemap.xml.ts
// Dynamic sitemap generation — auto-includes all static pages + blog articles
import type { GetServerSidePropsContext } from "next";
import fs from "fs";
import path from "path";

const SITE_URL = "https://ofertemutare.ro";
const EXCLUDED_PATTERNS = [
  /^\/api\//,
  /^\/admin/,
  /^\/company/,
  /^\/customer/,
  /^\/upload/,
  /^\/_/,
  /^\/404/,
  /^\/500/,
];

function getStaticPages(): string[] {
  const pagesDir = path.join(process.cwd(), "pages");
  const pages: string[] = [];

  function walk(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith("_") || entry.name.startsWith("[")) continue;
      const fullPath = path.join(dir, entry.name);
      const routePath = prefix + "/" + entry.name;

      if (entry.isDirectory()) {
        walk(fullPath, routePath);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        if (entry.name === "sitemap.xml.ts" || entry.name === "robots.txt.ts") continue;
        const route = routePath
          .replace(/\.(tsx|ts)$/, "")
          .replace(/\/index$/, "") || "/";

        // Skip excluded patterns
        if (EXCLUDED_PATTERNS.some((p) => p.test(route))) continue;
        pages.push(route);
      }
    }
  }

  walk(pagesDir, "");
  return pages;
}

function generateSitemap(pages: string[]): string {
  const now = new Date().toISOString().split("T")[0];

  const urls = pages.map((page) => {
    const priority = page === "/" ? "1.0" : page.split("/").length <= 2 ? "0.8" : "0.6";
    const changefreq = page === "/" ? "daily" : "weekly";
    return `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const pages = getStaticPages();
  const sitemap = generateSitemap(pages);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=600");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}

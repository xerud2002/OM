// pages/sitemap.xml.tsx
import { GetServerSideProps } from 'next';

function Sitemap() {
  // This component is never rendered, it's just a placeholder
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofertemutare.ro';
  
  // Static pages - update these based on your actual routes
  const staticPages = [
    '',              // Homepage
    '/about',        // About page
    '/contact',      // Contact page
    '/form',         // Request form
    '/customer/auth', // Customer authentication
    '/company/auth',  // Company authentication
    '/faq',          // FAQ
    '/privacy',      // Privacy policy
    '/terms',        // Terms of service
    '/articles/impachetare',  // Article pages
    '/articles/pregatire',
    '/articles/survey',
    '/articles/tips',
    '/guides/mutare',
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages
  .map((page) => {
    const url = `${baseUrl}${page}`;
    const priority = page === '' ? '1.0' : 
                    page.startsWith('/articles') || page.startsWith('/guides') ? '0.7' :
                    page === '/form' ? '0.9' : '0.8';
    const changefreq = page === '' ? 'weekly' :
                      page.startsWith('/articles') || page.startsWith('/guides') ? 'monthly' :
                      page === '/form' ? 'weekly' : 'monthly';
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
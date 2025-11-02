// pages/robots.txt.tsx
import { GetServerSideProps } from 'next';

function RobotsTxt() {
  // This component is never rendered
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofertemutare.ro';
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow private user areas
Disallow: /customer/dashboard
Disallow: /company/dashboard
Disallow: /customer/settings
Disallow: /api/

# Allow important pages
Allow: /
Allow: /about
Allow: /contact
Allow: /form
Allow: /customer/auth
Allow: /company/auth
Allow: /faq
Allow: /privacy
Allow: /terms
Allow: /articles/
Allow: /guides/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional, helps with server load)
Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default RobotsTxt;
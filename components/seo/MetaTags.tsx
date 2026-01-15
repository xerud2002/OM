import Head from "next/head";

interface MetaTagsProps {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export default function MetaTags({
  title,
  description,
  canonical,
  keywords,
  ogImage = "/pics/index.webp",
  ogType = "website",
}: MetaTagsProps) {
  const fullUrl = `https://ofertemutare.ro${canonical}`;
  const fullImageUrl = `https://ofertemutare.ro${ogImage}`;

  return (
    <Head>
      {/* Essential Meta Tags */}
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      {/* SEO Core */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="ro_RO" />
      <meta property="og:site_name" content="OferteMutare.ro" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO */}
      <meta name="author" content="OferteMutare.ro" />
      <meta name="language" content="Romanian" />

      {/* Theme Color for Mobile */}
      <meta name="theme-color" content="#7c3aed" />
    </Head>
  );
}

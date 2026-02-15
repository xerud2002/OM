import Head from "next/head";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQPageSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function LocalBusinessSchema({ city, serviceName }: { city?: string; serviceName: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceName,
    broker: {
      "@type": "Organization",
      name: "OferteMutare.ro",
      url: "https://ofertemutare.ro",
      logo: "https://ofertemutare.ro/pics/index.webp",
      ...(city && {
        areaServed: {
          "@type": "City",
          name: city,
        },
      }),
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url?: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `https://ofertemutare.ro${item.url}` }),
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  image,
}: {
  title: string;
  description: string;
  datePublished: string;
  image: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: "OferteMutare.ro",
    },
    publisher: {
      "@type": "Organization",
      name: "OferteMutare.ro",
      logo: {
        "@type": "ImageObject",
        url: "https://ofertemutare.ro/pics/index.webp",
      },
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function AggregateRatingSchema({
  ratingValue,
  reviewCount,
}: {
  ratingValue: number;
  reviewCount: number;
}) {
  if (!reviewCount || reviewCount < 1) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://ofertemutare.ro/#business",
    name: "OferteMutare.ro",
    url: "https://ofertemutare.ro",
    image: "https://ofertemutare.ro/pics/index.webp",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

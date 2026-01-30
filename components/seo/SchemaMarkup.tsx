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
    provider: {
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
    // Note: aggregateRating removed - requires real reviews to be valid
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

export function AggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = "5",
}: {
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OferteMutare.ro",
    url: "https://ofertemutare.ro",
    logo: "https://ofertemutare.ro/pics/index.webp",
    description:
      "Platformă modernă pentru conectarea clienților cu firme de mutări verificate din România.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue,
      reviewCount: reviewCount,
      bestRating: bestRating,
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

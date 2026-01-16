// components/seo/ServiceSchema.tsx
// Reusable Service Schema.org component for SEO

interface ServiceOffer {
  name: string;
  description: string;
  price?: string;
}

interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  offers: ServiceOffer[];
  provider?: string;
}

export default function ServiceSchema({
  serviceName,
  description,
  offers,
  provider = "OferteMutare.ro",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://ofertemutare.ro",
    },
    areaServed: {
      "@type": "Country",
      name: "România",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Servicii ${serviceName}`,
      itemListElement: offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          description: offer.description,
        },
        ...(offer.price && {
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "RON",
            price: offer.price,
          },
        }),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

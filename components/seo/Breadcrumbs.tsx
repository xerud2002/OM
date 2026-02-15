import Head from "next/head";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Hide the visual breadcrumb trail, render only JSON-LD */
  schemaOnly?: boolean;
}

/**
 * Renders both a visible breadcrumb navigation trail and BreadcrumbList JSON-LD schema.
 * The last item is rendered as plain text (current page), all others as links.
 */
export default function Breadcrumbs({ items, schemaOnly = false }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href && { item: `https://ofertemutare.ro${item.href}` }),
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      {/* Visual Breadcrumbs */}
      {!schemaOnly && (
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-4 pb-2 sm:px-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isFirst = index === 0;

              return (
                <li key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                  )}
                  {isLast ? (
                    <span className="font-medium text-gray-900" aria-current="page">
                      {item.name}
                    </span>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 transition-colors hover:text-emerald-600"
                    >
                      {isFirst && <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                      {item.name}
                    </Link>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
}

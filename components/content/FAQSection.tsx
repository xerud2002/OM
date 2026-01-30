interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQSection({ items, title = "Întrebări Frecvente" }: FAQSectionProps) {
  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">{title}</h2>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border border-gray-200 bg-white p-3.5 hover:border-emerald-300 transition-colors sm:p-5"
          >
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900 list-none sm:text-base">
              <span className="pr-2">{item.question}</span>
              <svg
                className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed sm:mt-4 sm:text-base">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

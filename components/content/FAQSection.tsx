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
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border border-gray-200 bg-white p-5 hover:border-purple-300 transition-colors"
          >
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 list-none">
              <span>{item.question}</span>
              <svg
                className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-gray-700 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

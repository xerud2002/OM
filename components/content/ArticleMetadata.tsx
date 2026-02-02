import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ArticleMetadata({ date = "Februarie 2026", readTime = "5 min" }: { date?: string; readTime?: string }) {
    return (
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 mt-4 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <CalendarDaysIcon className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-gray-700">Actualizat: {date}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Timp citire: {readTime}</span>
            </div>
        </div>
    );
}

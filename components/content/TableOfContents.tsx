import Link from "next/link";
import { ListBulletIcon } from "@heroicons/react/24/outline";

interface TocItem {
    id: string;
    text: string;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
    if (items.length === 0) return null;

    return (
        <div className="my-8 rounded-xl bg-slate-50 p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
                <ListBulletIcon className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">Cuprins</h3>
            </div>
            <nav>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={`#${item.id}`}
                                className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors text-sm sm:text-base block"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

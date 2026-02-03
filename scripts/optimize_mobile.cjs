const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');

function optimizeMobile() {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (!file.endsWith('.tsx')) return;
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. Fix Table Overflow
        // Pattern: <div className="... overflow-hidden ...">...<table>
        // We want to replace 'overflow-hidden' with 'overflow-x-auto' if it wraps a table.
        // It's hard to be context-aware with Regex. 
        // But specifically for my generated tables, they are likely consistent.
        // "overflow-hidden rounded-xl border border-gray-200"

        if (content.includes('className="overflow-hidden rounded-xl border border-gray-200"')) {
            content = content.replace(
                'className="overflow-hidden rounded-xl border border-gray-200"',
                'className="overflow-x-auto rounded-xl border border-gray-200"'
            );
            modified = true;
            console.log(`[${file}] Fixed Table overflow`);
        }

        // 2. Fix Giant Headings on Mobile
        // Look for text-5xl or text-4xl that doesn't have a breakpoint prefix.
        // My titles usually have "text-3xl ... md:text-5xl". That is good.
        // Let's check for "text-5xl" without "md:".

        // This Regex matches "text-5xl" NOT preceded by "md:" or "lg:" or "sm:".
        // Using negative lookbehind is supported in modern Node.
        // /(?<!(md:|lg:|sm:|xl:))text-5xl/g

        const bigTextRegex = /(?<!(md:|lg:|sm:|xl:))text-5xl/g;
        if (bigTextRegex.test(content)) {
            // Check context. If it's already "text-3xl ... text-5xl" (implied mobile 5xl?), no.
            // Usually classes are space separated.
            // If I see "text-5xl", I should probably make it "text-3xl md:text-5xl".

            // However, verify if "text-3xl" is already there?
            // "mb-8 text-3xl font-extrabold ... md:text-5xl" -> this is safe.
            // My previous templates used this.

            // Let's look for "mb-12 text-5xl" (example).

            content = content.replace(/className="([^"]*)\btext-5xl\b([^"]*)"/g, (match, p1, p2) => {
                if (match.includes('md:text-5xl')) return match; // Already responsive
                return `className="${p1}text-3xl md:text-5xl${p2}"`;
            });
            // Repeat for text-4xl -> text-2xl md:text-4xl?
            content = content.replace(/className="([^"]*)\btext-4xl\b([^"]*)"/g, (match, p1, p2) => {
                if (match.includes('md:text-4xl')) return match;
                return `className="${p1}text-2xl md:text-4xl${p2}"`;
            });

            // modified = true; // Regex replace might allow false positives/no-ops to set modified=true if not careful.
            // I'll assume if string length changed, it's modified. But complex.
            // Let's trust logic.
        }

        // 3. Ensure Images are responsive
        // Look for <img ... className="..."> without w-full
        // Or <Image ... className="..."> without w-full/h-auto

        // Generally my images have "h-auto w-full".
        // Let's check for any <img> missing 'w-full'.
        // This is risky if icons are intentionally small.
        // But main article images should be responsive.

        // Strategy: Look for "mb-6 overflow-hidden rounded-2xl shadow-xl" wrapper.
        // The image inside SHOULD have w-full.

        // Regex replacement for specific classes often used in my blog headers:
        // class="... object-cover ..."

        // Let's stick to the Table fix mostly, as that's the big breaker. 
        // Text sizes are usually fine (Tailwind prose plugin handles p/h2/h3).
        // The H1 title was confirmed responsive in previous check.

        if (modified) {
            fs.writeFileSync(filePath, content);
        }
    });
}

optimizeMobile();

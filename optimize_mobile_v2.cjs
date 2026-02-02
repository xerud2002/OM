const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');

function optimizeMobileAdvanced() {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (!file.endsWith('.tsx')) return;
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Smart Replace: overflow-hidden -> overflow-x-auto ONLY if it looks like a Table container (has border)
        // Images usually have shadow but no border in this design.
        // Tables have border-gray-200.

        // Regex: className="([^"]*overflow-hidden[^"]*)"

        const classRegex = /className="([^"]*overflow-hidden[^"]*)"/g;

        content = content.replace(classRegex, (match, classString) => {
            // Check if it's a table candidate
            if (classString.includes('border') && (classString.includes('rounded-xl') || classString.includes('rounded-lg'))) {
                // It's likely a table or textual card.
                // Replace overflow-hidden with overflow-x-auto
                if (classString.includes('overflow-hidden')) {
                    const newClass = classString.replace('overflow-hidden', 'overflow-x-auto');
                    modified = true;
                    console.log(`[${file}] Converted to scrollable: ${classString}`);
                    return `className="${newClass}"`;
                }
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
        }
    });
}

optimizeMobileAdvanced();

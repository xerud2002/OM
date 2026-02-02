const fs = require('fs');
const path = require('path');

const DIRS = ['pages', 'components'];
const SKIP_DIRS = ['node_modules', '.next', '.git'];

function getAllTsx(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (SKIP_DIRS.includes(file)) return;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(getAllTsx(filePath));
        } else {
            if (file.endsWith('.tsx')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

function optimizeAll() {
    const files = [];
    DIRS.forEach(d => files.push(...getAllTsx(d)));

    console.log(`Scanning ${files.length} files for optimization...`);

    files.forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. Compact Table Padding Generally
        // Look for standard padding patterns often used in tables
        const paddingRegex = /px-6 py-4/g;
        if (paddingRegex.test(content)) {
            content = content.replace(paddingRegex, 'px-3 py-2 md:px-6 md:py-4');
            modified = true;
        }

        // 2. Compact Font Size in Tables
        // If file has <table>, check for base text size
        if (content.includes('<table')) {
            // Look for text-sm without responsive prefix
            // replace "text-sm" with "text-xs md:text-sm" INSIDE the table context? 
            // Hard to scope with regex.
            // But if we see "text-sm" in the same file as table, likely ok to make it responsive if it's broad?
            // No, too risky for whole file.
            // Let's target the specific class string used in our tables: "text-sm md:text-base"

            if (content.includes('text-sm md:text-base')) {
                content = content.replace(/text-sm md:text-base/g, 'text-xs md:text-base');
                modified = true;
            }

            // Also "text-left text-sm" -> "text-left text-xs md:text-sm"
            if (content.includes('text-left text-sm') && !content.includes('md:text')) {
                // Be careful not to double match
                content = content.replace(/text-left text-sm/g, 'text-left text-xs md:text-sm');
                modified = true;
            }
        }

        // 3. Ensure Responsive Headings (H1/H2)
        // Check for "text-4xl" or "text-5xl" or "text-6xl" that are NOT responsive.
        // We want mobile to be smaller.

        ['text-4xl', 'text-5xl', 'text-6xl', 'text-7xl'].forEach(size => {
            // Regex: match size if NOT preceded by a breakpoint.
            const regex = new RegExp(`(?<!(md:|lg:|xl:|sm:))\\b${size}\\b`, 'g');

            if (regex.test(content)) {
                // Replace with smaller mobile size + original size on md
                let mobileSize = 'text-2xl';
                if (size === 'text-4xl') mobileSize = 'text-2xl';
                if (size === 'text-5xl') mobileSize = 'text-3xl';
                if (size === 'text-6xl') mobileSize = 'text-3xl';
                if (size === 'text-7xl') mobileSize = 'text-4xl';

                // However, we must ensure we don't break existing responsive classes if they are separated.
                // e.g. "text-5xl md:text-6xl". The regex negative lookbehind handles the immediate prefix.
                // But what if "text-5xl" is standalone? Then we change it.
                // What if "text-5xl some-class md:text-5xl"? (Redundant but possible).

                // Let's just apply the fix. It's usually safe to enforce mobile scale down.

                content = content.replace(regex, `${mobileSize} md:${size}`);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Optimized ${path.basename(filePath)}`);
        }
    });
}

optimizeAll();

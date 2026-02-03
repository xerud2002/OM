const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix {currentYear} inside TableOfContents items
    // Pattern: text: "Some text {currentYear}"
    // We only want to replace it INSIDE the TableOfContents items string, 
    // but globally for simplicity in string literals is usually fine in these generated files.
    // However, we want to avoid replacing the Variable definition `const currentYear = ...`.

    // Safer: Replace `{currentYear}` with `2026` ONLY inside existing string literals that look like ToC items?
    // Or just in all string literals in the Component usage?

    // Let's replace specifically in the ToC block if possible.
    // But extracted text by grep showed it's in `text: "..."`.

    if (content.includes('TableOfContents')) {
        // Regex for the items array?
        // Let's go simple: Replace `text: ".*{currentYear}.*"` with 2026.
        const tocRegex = /(text:\s*"[^"]*){currentYear}([^"]*")/g;
        if (tocRegex.test(content)) {
            content = content.replace(tocRegex, '$12026$2');
            modified = true;
            console.log(`[${file}] Fixed {currentYear} in ToC`);
        }
    }

    // 2. Specific fix for cele-mai-bune-cartiere-bucuresti.tsx
    if (file === 'cele-mai-bune-cartiere-bucuresti.tsx') {
        // Remove bad ToC entry
        if (content.includes('{ id: "zonaname", text: "{zona.name}" },')) {
            content = content.replace('{ id: "zonaname", text: "{zona.name}" },', '');
            modified = true;
            console.log(`[${file}] Removed {zona.name} from ToC`);
        }

        // Remove duplicate ID in loop
        if (content.includes('<h2 id="zonaname"')) {
            content = content.replace('<h2 id="zonaname"', '<h2');
            modified = true;
            console.log(`[${file}] Removed duplicate id="zonaname"`);
        }
    }

    // 3. General cleanup: fix any `{currentYear}` left in string literals in ToC props I missed?
    // Example: id: "something-currentyear" -> id: "something-2026"
    // Regex: `id: "[^"]*currentyear[^"]*"`

    const idRegex = /(id:\s*"[^"]*)currentyear([^"]*")/g; // lowercase usually from slugify
    if (idRegex.test(content)) {
        content = content.replace(idRegex, '$12026$2');
        modified = true;
        console.log(`[${file}] Fixed currentyear in IDs`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
    }
});

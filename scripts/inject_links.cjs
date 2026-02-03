const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

const KEYWORDS = [
    { text: 'mutări București', url: '/mutari/bucuresti' },
    { text: 'mutare București', url: '/mutari/bucuresti' },
    { text: 'Cluj-Napoca', url: '/mutari/cluj-napoca' },
    { text: 'transport piane', url: '/mutari/specializate/piane' },
    { text: 'transport pian', url: '/mutari/specializate/piane' },
    { text: 'montaj mobilă', url: '/servicii/montaj/mobila' },
    { text: 'împachetare', url: '/servicii/impachetare/profesionala' },
    { text: 'materiale de împachetare', url: '/servicii/impachetare/materiale' },
    { text: 'cutii', url: '/servicii/impachetare/materiale' },
    { text: 'depozitare', url: '/servicii/depozitare' },
    { text: 'debarasare', url: '/servicii/debarasare' },
    { text: 'mutare firmă', url: '/mutari/tipuri/birouri' },
    { text: 'mutări firme', url: '/mutari/tipuri/birouri' },
    { text: 'mutare birou', url: '/mutari/tipuri/birouri' },
];

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Simple strategy: Replace first occurrence in <p> tags
    // We match <p>...</p> content.
    // NOTE: This is a bit fragile with regex, but strict parser is too heavy.
    // We will iterate keyword by keyword and replace ONLY ONCE per file.

    let modified = false;

    KEYWORDS.forEach(kw => {
        // Skip if link already exists
        if (content.includes(`href="${kw.url}"`)) return;

        // Regex lookbehind to ensure we are not inside a tag attribute or already linked
        // JS regex doesn't support advanced lookbehind in all versions nicely for this.
        // Simplified: Search for " word " inside the file, but risking replacing inside attributes.
        // Safer: Split by <p> tags and operate inside.

        const pRegex = /(<p[^>]*>)(.*?)(<\/p>)/gs;
        let replaced = false;

        content = content.replace(pRegex, (match, openTag, text, closeTag) => {
            if (replaced) return match; // Already replaced this keyword in this file

            // Check if keyword exists in this text block
            // Also ensure we don't replace inside an existing <a> tag
            if (text.includes(kw.text) && !text.includes(`>${kw.text}<`) && !text.includes('href=')) {
                // Check bounds (word boundaries) - approximate
                const regex = new RegExp(`(^|\\s|>)(${kw.text})(?=\\s|<|$|[.,])`, 'i');
                if (regex.test(text)) {
                    text = text.replace(regex, `$1<Link href="${kw.url}" className="text-indigo-600 hover:underline font-medium">$2</Link>`);
                    replaced = true;
                    modified = true;
                }
            }
            return `${openTag}${text}${closeTag}`;
        });
    });

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated links in ${file}`);
    }
});

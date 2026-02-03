const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('TableOfContents')) {
        console.log(`Skipping ${file} - already has ToC`);
        return;
    }

    // 1. Find all H2s
    // Regex matches: <h2 ...>(.*?)</h2>
    // Note: We need to capture attributes to preserve them, but inject id if missing.

    const h2Regex = /<h2(.*?)>(.*?)<\/h2>/g;
    const tocItems = [];
    let match;
    let newContent = content;

    // We start from scratch to replace
    // Better strategy: Replace one by one and build list

    // Reset regex index? No, simple replace with callback function
    newContent = newContent.replace(h2Regex, (fullMatch, attrs, text) => {
        // Cleanup text (remove nested tags if any, though unlikely in headings here)
        const cleanText = text.replace(/<[^>]*>?/gm, '');
        const id = slugify(cleanText);

        tocItems.push({ id, text: cleanText });

        // Check if id already exists
        if (attrs.includes('id=')) return fullMatch;

        return `<h2 id="${id}"${attrs}>${text}</h2>`;
    });

    if (tocItems.length < 2) {
        console.log(`Skipping ${file} - not enough headings for ToC`);
        return;
    }

    // 2. Add Import
    if (!newContent.includes('import TableOfContents')) {
        newContent = newContent.replace(
            'import ArticleMetadata from "@/components/content/ArticleMetadata";',
            'import ArticleMetadata from "@/components/content/ArticleMetadata";\nimport TableOfContents from "@/components/content/TableOfContents";'
        );
    }

    // 3. Inject Component
    // Inject AFTER ArticleMetadata
    const tocComponent = `\n            <TableOfContents items={[${tocItems.map(i => `\n              { id: "${i.id}", text: "${i.text}" }`).join(',')} \n            ]} />`;

    if (newContent.includes('<ArticleMetadata />')) {
        newContent = newContent.replace('<ArticleMetadata />', `<ArticleMetadata />${tocComponent}`);
    } else {
        // Fallback
        console.log(`No ArticleMetadata found in ${file}, skipping injection`);
        return;
    }

    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${file} with ToC (${tocItems.length} items)`);
});

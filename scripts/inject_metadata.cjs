const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('ArticleMetadata')) {
        console.log(`Skipping ${file} - already has metadata`);
        return;
    }

    // 1. Add Import
    // We already added Schema imports, so we can hook after that or after LayoutWrapper
    if (content.includes('import { ArticleSchema')) {
        content = content.replace(
            '} from "@/components/seo/SchemaMarkup";',
            '} from "@/components/seo/SchemaMarkup";\nimport ArticleMetadata from "@/components/content/ArticleMetadata";'
        );
    } else {
        // Fallback if Schema imports are somehow missing (unlikely given previous step)
        content = content.replace(
            'import LayoutWrapper from "@/components/layout/Layout";',
            'import LayoutWrapper from "@/components/layout/Layout";\nimport ArticleMetadata from "@/components/content/ArticleMetadata";'
        );
    }

    // 2. Inject Component
    // Look for </h1> tag. It's usually <h1 className="...">Title</h1>
    // We want to insert AFTER the closing </h1>

    if (content.includes('</h1>')) {
        content = content.replace('</h1>', '</h1>\n            <ArticleMetadata />');
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find <h1> in ${file}`);
    }
});

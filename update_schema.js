const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('ArticleSchema')) {
        console.log(`Skipping ${file} - already has schema`);
        return;
    }

    // Add imports
    content = content.replace(
        'import LayoutWrapper from "@/components/layout/Layout";',
        'import LayoutWrapper from "@/components/layout/Layout";\nimport { ArticleSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";'
    );

    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(' | OferteMutare.ro', '') : 'Ghid Mutare';

    // Extract description
    const descMatch = content.match(/name="description"\s+content="(.*?)"/);
    const desc = descMatch ? descMatch[1] : 'Articol despre mutări';

    // Extract image
    const imgMatch = content.match(/property="og:image"\s+content="(.*?)"/);
    const image = imgMatch ? imgMatch[1] : 'https://ofertemutare.ro/pics/index.webp';

    const schemaBlock = `
      <ArticleSchema
        title="${title}"
        description="${desc}"
        datePublished="2026-02-02"
        image="${image}"
      />
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "/" },
          { name: "Articole", url: "/articole" },
          { name: "${title}" },
        ]}
      />
`;

    // Inject before LayoutWrapper
    content = content.replace('<LayoutWrapper>', `${schemaBlock}      <LayoutWrapper>`);

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});

const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

const IMAGES = {
    boxes: '/pics/blog/boxes.png',
    checklist: '/pics/blog/checklist.png',
    team: '/pics/blog/team.png'
};

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('<img') && content.includes('/pics/blog/')) {
        console.log(`Skipping ${file} - already has blog image`);
        return;
    }

    // Determine image based on filename/content
    let selectedImage = IMAGES.team; // Default
    const lowerFile = file.toLowerCase();

    if (lowerFile.includes('impachetare') || lowerFile.includes('materiale') || lowerFile.includes('cutii')) {
        selectedImage = IMAGES.boxes;
    } else if (lowerFile.includes('pregatire') || lowerFile.includes('sfaturi') || lowerFile.includes('ghid') || lowerFile.includes('checklist')) {
        selectedImage = IMAGES.checklist;
    } else if (lowerFile.includes('bucuresti') || lowerFile.includes('cluj') || lowerFile.includes('evaluare')) {
        selectedImage = IMAGES.team;
    }

    // Prepare Image Component
    // Using standard img tag for simplicity and compatibility within typical containers, or Next Image if imported.
    // Let's use a nice styled img tag.

    const imageBlock = `
            <div className="my-8 overflow-hidden rounded-xl shadow-lg">
              <img 
                src="${selectedImage}" 
                alt="Ilustrație mutare" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>`;

    // Inject matching strategy:
    // If ToC exists, inject AFTER ToC.
    // If NOT, inject after ArticleMetadata.
    // If NOT, inject after first paragraph.

    let injected = false;

    if (content.includes('<TableOfContents')) {
        // Replace the closing tag of ToC to append image
        // But ToC is self closing usually `<TableOfContents ... />`
        // So replace `/>` of ToC? No, too risky withregex.
        // Replace `items={[...]} />`

        const tocEndIndex = content.indexOf(']} />');
        if (tocEndIndex !== -1) {
            content = content.replace(']} />', `]} />\n${imageBlock}`);
            injected = true;
        }
    }

    if (!injected && content.includes('<ArticleMetadata />')) {
        content = content.replace('<ArticleMetadata />', `<ArticleMetadata />\n${imageBlock}`);
        injected = true;
    }

    if (injected) {
        fs.writeFileSync(filePath, content);
        console.log(`Injected image ${selectedImage} into ${file}`);
    } else {
        console.log(`Could not inject image into ${file}`);
    }
});

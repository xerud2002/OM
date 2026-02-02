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

    // 1. Determine Desired Image
    let desiredImage = IMAGES.team;
    const lowerFile = file.toLowerCase();

    if (lowerFile.includes('impachetare') || lowerFile.includes('materiale') || lowerFile.includes('cutii') || lowerFile.includes('fragil')) {
        desiredImage = IMAGES.boxes;
    } else if (lowerFile.includes('pregatire') || lowerFile.includes('sfaturi') || lowerFile.includes('ghid') || lowerFile.includes('checklist')) {
        desiredImage = IMAGES.checklist;
    } else if (lowerFile.includes('bucuresti') || lowerFile.includes('cluj') || lowerFile.includes('evaluare')) {
        desiredImage = IMAGES.team;
    }

    // 2. Remove my injected <img> block
    // Pattern: <div className="my-8 overflow-hidden rounded-xl shadow-lg">...<img ...>...</div>
    const injectedRegex = /<div className="my-8 overflow-hidden rounded-xl shadow-lg">\s*<img[\s\S]*?<\/div>/g;

    let hasInjected = false;
    if (injectedRegex.test(content)) {
        content = content.replace(injectedRegex, '');
        hasInjected = true;
        console.log(`[${file}] Removed injected <img> block.`);
    }

    // 3. Update existing <Image /> if present
    // Look for <Image ... src="..." ... />
    // We want to replace src attribute.

    const imageRegex = /(<Image[^>]*src=")([^"]*)("[^>]*>)/;

    if (imageRegex.test(content)) {
        content = content.replace(imageRegex, (match, prefix, oldSrc, suffix) => {
            console.log(`[${file}] Updating <Image> src from ${oldSrc} to ${desiredImage}`);
            return `${prefix}${desiredImage}${suffix}`;
        });
        // Check if `width` and `height` need adjust? 
        // Existing images might have sizes. The new ones are roughly square/4:3.
        // Let's assume layout handles it (className="w-full h-auto").
        // But Next.js Image needs width/height. We'll keep existing ones, likely will distort if aspect ratio is vastly different?
        // Or we can remove width/height and use layout="responsive"? 
        // Modern Next.js uses width/height to infer aspect ratio.
        // Let's rely on existing props for now.
    } else {
        // 4. If NO <Image /> existed, but we HAD injected one, we need to put it back (but as <Image> preferably)
        // Or put back the <img> block if it's easier.
        // Let's put back the <img> block logic but only if no <Image> was found.

        if (hasInjected) {
            console.log(`[${file}] No <Image> found, re-injecting <img> (deduplicated).`);
            // Re-inject after ToC or Metadata (same logic as before)

            const imageBlock = `
            <div className="my-8 overflow-hidden rounded-xl shadow-lg">
              <img 
                src="${desiredImage}" 
                alt="Ilustrație mutare" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>`;

            let injected = false;
            if (content.includes('<TableOfContents')) {
                const parts = content.split(']} />');
                if (parts.length > 1) {
                    content = parts[0] + ']} />\n' + imageBlock + parts.slice(1).join(']} />');
                    injected = true;
                }
            }

            if (!injected && content.includes('<ArticleMetadata />')) {
                content = content.replace('<ArticleMetadata />', `<ArticleMetadata />\n${imageBlock}`);
                injected = true;
            }
        }
    }

    fs.writeFileSync(filePath, content);
});

const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');

function compactTables() {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (!file.endsWith('.tsx')) return;
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. Compact Header Cells (th)
        // px-6 py-4 -> px-3 py-3 md:px-6 md:py-4
        if (content.includes('px-6 py-4')) {
            content = content.replace(/px-6 py-4/g, 'px-3 py-3 md:px-6 md:py-4');
            modified = true;
        }

        // 2. Adjust Table Font Size
        // text-sm md:text-base -> text-xs md:text-base (or md:text-sm)
        // My table def: <table className="w-full text-left text-sm md:text-base">

        if (content.includes('text-sm md:text-base')) {
            content = content.replace('text-sm md:text-base', 'text-xs md:text-base');
            modified = true;
        }

        // 3. Extra check for headers font size?
        // Usually inherited. But if th has font-semibold, text-xs helps.

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`[${file}] Compacted table padding and font.`);
        }
    });
}

compactTables();

const fs = require('fs');
const path = require('path');

const dir = path.join('pages', 'articole');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match the image block we added
    // <div className="my-8 overflow-hidden rounded-xl shadow-lg">
    //   <img ... />
    // </div>

    // We want to keep ONLY THE FIRST occurrence.

    const imgBlockStart = '<div className="my-8 overflow-hidden rounded-xl shadow-lg">';

    const parts = content.split(imgBlockStart);

    if (parts.length > 2) {
        console.log(`Found ${parts.length - 1} images in ${file}. Removing duplicates...`);

        // Strategy: Keep parts[0] + imgBlockStart + parts[1].
        // But wait, parts[1] contains the rest of the file which might have MORE occurrences.
        // We need to reconstruct.

        // Actually, logic is: 
        // Part 0 is pre-first-image.
        // Part 1 starts with image closure + content.
        // Part 2 starts with image closure + content.

        // This is tricky because split removes the delimiter.

        // Let's use regex replace global but with a counter?
        // Or simpler: Remove ALL images, then re-inject ONE properly?
        // Safer: Identify the blocks and remove secondary ones.

        // Let's analyze the split.
        // content = P0 + IMG + P1 + IMG + P2 ...

        // New content should be: P0 + IMG + P1 + (removed IMG) + P2 ...

        // We need to find where the IMG block ends. 
        // It ends with </div>.

        // A safer regex for the specific block:
        const blockRegex = /<div className="my-8 overflow-hidden rounded-xl shadow-lg">[\s\S]*?<img[\s\S]*?<\/div>/g;

        let count = 0;
        const newContent = content.replace(blockRegex, (match) => {
            count++;
            if (count === 1) return match; // Keep first
            return ''; // Remove others
        });

        fs.writeFileSync(filePath, newContent);
        console.log(`Cleaned duplicates in ${file}`);
    } else {
        console.log(`No duplicates in ${file}`);
    }
});

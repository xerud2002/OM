const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = 'public';
const SRC_DIR = '.'; // Root to scan for source files (pages, components, etc)
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', '.gemini', 'tmp'];

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// 1. Find all images in public
function getAllImages(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllImages(filePath));
        } else {
            const ext = path.extname(file).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

// 2. Scan and Replace in Source Files
function replaceInFile(filePath, mapping) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Mapping: key = original relative path (or filename), value = new relative path (or filename)
    // We need to be smart. Code usually refers to '/pics/foo.png' or 'pics/foo.png'.
    // The mapping keys will be full file paths relative to root, e.g. 'public/pics/foo.png'.

    // We should iterate over mapping
    for (const [originalPath, newPath] of Object.entries(mapping)) {
        // Prepare replacement strings
        // Code usage usually strips 'public' prefix.
        // e.g. public\pics\foo.png -> /pics/foo.png

        const originalRel = originalPath.split(path.sep).join('/'); // Normalize to forward slashes
        const newRel = newPath.split(path.sep).join('/');

        const origUsage = originalRel.replace(/^public/, ''); // /pics/foo.png
        const newUsage = newRel.replace(/^public/, '');       // /pics/foo.webp

        // Replace both with leading slash and without (just in case)
        // Also strictly match extension to avoid partial replacements if names overlap
        // e.g. foo.png

        if (content.includes(origUsage)) {
            content = content.split(origUsage).join(newUsage);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated references in ${filePath}`);
    }
}

function getAllSourceFiles(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            if (file.startsWith('.')) return; // skip hidden
            if (EXCLUDE_DIRS.includes(file)) return;

            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(getAllSourceFiles(filePath));
            } else {
                const ext = path.extname(file).toLowerCase();
                if (['.tsx', '.ts', '.js', '.jsx', '.css', '.json', '.md'].includes(ext)) {
                    results.push(filePath);
                }
            }
        });
    } catch (e) {
        console.error(`Error reading dir ${dir}:`, e);
    }
    return results;
}

async function main() {
    const images = getAllImages(PUBLIC_DIR);
    console.log(`Found ${images.length} images to optimize.`);

    const mapping = {}; // oldPath -> newPath

    for (const imgPath of images) {
        const dir = path.dirname(imgPath);
        const ext = path.extname(imgPath);
        const name = path.basename(imgPath, ext);
        const newPath = path.join(dir, `${name}.webp`);

        console.log(`Converting ${imgPath} -> ${newPath}`);

        try {
            await sharp(imgPath)
                .webp({ quality: 80 })
                .toFile(newPath);

            // Delete original
            fs.unlinkSync(imgPath);

            mapping[imgPath] = newPath;
        } catch (err) {
            console.error(`Failed to convert ${imgPath}:`, err);
        }
    }

    console.log("Updating source code references...");
    const sourceFiles = getAllSourceFiles(SRC_DIR);

    sourceFiles.forEach(file => {
        replaceInFile(file, mapping);
    });

    console.log("Done.");
}

main();

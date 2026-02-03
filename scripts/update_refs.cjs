const fs = require('fs');
const path = require('path');

const SRC_DIRS = ['pages', 'components'];
const EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.css'];

function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            if (EXTENSIONS.includes(path.extname(file))) {
                results.push(filePath);
            }
        }
    });
    return results;
}

function updateReferences() {
    let files = [];
    SRC_DIRS.forEach(dir => {
        if (fs.existsSync(dir)) {
            files = files.concat(getAllFiles(dir));
        }
    });

    files.forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Regex to find image paths ending in .png or .jpg
        // We look for typical paths like "/pics/..." or "pics/..."
        // Capture group 1: path before extension
        // Capture group 2: extension
        const regex = /("|\/|')(pics\/[^"'\n\r]+?)\.(png|jpg|jpeg)/gi;

        if (regex.test(content)) {
            content = content.replace(regex, (match, prefix, pathPart, ext) => {
                // prefix is usually " or / or '
                // pathPart is everything up to extension.
                // We return prefix + pathPart + .webp

                // BE CAREFUL: prefix might be part of the path if regex caught it.
                // My regex: ("|\/|') matches the delimiter or slash.
                // Actually safer: replace .png" with .webp" etc inside known string contexts?

                // Let's use a simpler heuristic:
                // replace .png with .webp if it looks like an image path.

                // Just replacing .png with .webp globally might break valid text.
                // But replacing `/pics/.*.png` is safer.

                return `${prefix}${pathPart}.webp`;
            });
            modified = true;
            console.log(`Updated ${filePath}`);
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
        }
    });
}

updateReferences();

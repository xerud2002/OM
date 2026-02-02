const fs = require('fs');
const path = require('path');

const filePath = path.join('pages', 'articole', 'cat-costa-mutarea-2026.tsx');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Target: <p className="mt-4 text-sm text-gray-500">...*Prețurile sunt estimative...</p>
    // We want to verify the text existence and replace.

    if (content.includes('*Prețurile sunt estimative pentru o mutare locală')) {
        // Regex to match the P tag around it.
        // The P tag starts with <p className="mt-4 text-sm text-gray-500">
        // But might be spread on lines.

        // Let's replace the inner text if simple replace fails.
        // actually simplest: replace the specific unique sentence fragment?

        // But I also want to change `text-sm` -> `text-xs md:text-sm`.

        // Step 1: Replace class
        content = content.replace(
            'className="mt-4 text-sm text-gray-500"',
            'className="mt-4 text-xs md:text-sm text-gray-500"'
        );

        // Step 2: Replace text
        content = content.replace(
            '*Prețurile sunt estimative pentru o mutare locală',
            '*Sursă date: <strong>OferteMutare.ro - Analiză Piață {currentYear}</strong>. Prețurile sunt estimative pentru o mutare locală'
        );

        fs.writeFileSync(filePath, content);
        console.log('Citation added successfully');
    } else {
        console.log('Target string not found');
    }
}

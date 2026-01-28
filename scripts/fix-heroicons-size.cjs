const fs = require("fs");
const path = require("path");

// Mapping from size to Tailwind className
const sizeMap = {
  14: "h-3.5 w-3.5",
  16: "h-4 w-4",
  18: "h-4 w-4",
  20: "h-5 w-5",
  24: "h-6 w-6",
  28: "h-7 w-7",
  32: "h-8 w-8",
  36: "h-9 w-9",
  40: "h-10 w-10",
  48: "h-12 w-12",
};

function fixSizeProps(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Pattern 1: size={number} with existing className
  // e.g., <Icon size={20} className="text-red" />
  const pattern1 = /<([A-Z][a-zA-Z0-9.]*)\s+([^>]*?)size={(\d+)}\s+className="([^"]+)"([^>]*?)\/>/g;
  content = content.replace(pattern1, (match, icon, before, size, existingClass, after) => {
    const sizeClass = sizeMap[size] || `h-${size / 4} w-${size / 4}`;
    modified = true;
    return `<${icon} ${before}className="${sizeClass} ${existingClass}"${after}/>`;
  });

  // Pattern 2: className first, then size
  // e.g., <Icon className="text-red" size={20} />
  const pattern2 = /<([A-Z][a-zA-Z0-9.]*)\s+([^>]*?)className="([^"]+)"\s+size={(\d+)}([^>]*?)\/>/g;
  content = content.replace(pattern2, (match, icon, before, existingClass, size, after) => {
    const sizeClass = sizeMap[size] || `h-${size / 4} w-${size / 4}`;
    modified = true;
    return `<${icon} ${before}className="${sizeClass} ${existingClass}"${after}/>`;
  });

  // Pattern 3: size={number} without className
  // e.g., <Icon size={20} />
  const pattern3 = /<([A-Z][a-zA-Z0-9.]*)\s+([^>]*?)size={(\d+)}([^>]*?)\/>/g;
  content = content.replace(pattern3, (match, icon, before, size, after) => {
    const sizeClass = sizeMap[size] || `h-${size / 4} w-${size / 4}`;
    modified = true;
    return `<${icon} ${before}className="${sizeClass}"${after}/>`;
  });

  // Pattern 4: Multiline with size attribute
  // e.g., <Icon\n  size={20}\n  className="..." />
  const pattern4 = /<([A-Z][a-zA-Z0-9.]*)\s+([^>]*?)\s+size={(\d+)}\s+([^>]*?)>/g;
  content = content.replace(pattern4, (match, icon, before, size, after) => {
    const sizeClass = sizeMap[size] || `h-${size / 4} w-${size / 4}`;
    modified = true;

    // Check if className exists in the after part
    if (after.includes('className="')) {
      const updatedAfter = after.replace(/className="([^"]+)"/, `className="${sizeClass} $1"`);
      return `<${icon} ${before}${updatedAfter}>`;
    } else {
      return `<${icon} ${before}className="${sizeClass}" ${after}>`;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

function walkDir(dir, fileCallback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules" && file !== "scripts") {
        walkDir(filePath, fileCallback);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileCallback(filePath);
    }
  });
}

// Main execution
const rootDir = path.join(__dirname, "..");
let fixedCount = 0;

console.log("🔧 Fixing Heroicons size props...\n");

walkDir(rootDir, (filePath) => {
  if (fixSizeProps(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✨ Complete! Fixed ${fixedCount} files.`);

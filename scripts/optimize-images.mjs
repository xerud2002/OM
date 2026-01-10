import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, parse } from "path";

const PICS_DIR = "./public/pics";
const QUALITY = 80; // WebP quality (80 is good balance)
const MAX_WIDTH = 1920; // Max width for display images

async function optimizeImages() {
  const files = await readdir(PICS_DIR);
  const pngFiles = files.filter((f) => f.endsWith(".png"));

  console.log(`Found ${pngFiles.length} PNG files to optimize:\n`);

  for (const file of pngFiles) {
    const inputPath = join(PICS_DIR, file);
    const { name } = parse(file);
    const outputPath = join(PICS_DIR, `${name}.webp`);

    const inputStats = await stat(inputPath);
    const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const outputStats = await stat(outputPath);
      const outputSizeKB = (outputStats.size / 1024).toFixed(0);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(0);

      console.log(
        `✅ ${file} (${inputSizeMB}MB) → ${name}.webp (${outputSizeKB}KB) [-${reduction}%]`
      );
    } catch (err) {
      console.error(`❌ Failed to convert ${file}:`, err.message);
    }
  }

  console.log("\n🎉 Done! Now update code references from .png to .webp");
  console.log("You can delete the original .png files after verifying.");
}

optimizeImages();

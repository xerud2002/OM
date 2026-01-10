import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

async function createFacebookImages() {
  console.log("Creating Facebook-optimized images...\n");

  // Create text-based logo like the header (SVG to PNG)
  const logoSvg = `
    <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#059669"/>
          <stop offset="100%" style="stop-color:#065f46"/>
        </linearGradient>
      </defs>
      <rect width="180" height="180" fill="white"/>
      <text x="90" y="80" font-family="Arial, sans-serif" font-size="30" font-weight="bold" text-anchor="middle" fill="url(#textGrad)">Oferte</text>
      <text x="90" y="115" font-family="Arial, sans-serif" font-size="30" font-weight="bold" text-anchor="middle" fill="#10b981">mutare</text>
      <text x="140" y="100" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#059669">.ro</text>
    </svg>
  `;

  // Profile Picture: 180x180px with text logo
  try {
    await sharp(Buffer.from(logoSvg))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, "fb-profile-180x180.png"));
    console.log("✅ Profile picture created: public/fb-profile-180x180.png (180x180px)");
  } catch (err) {
    console.error("❌ Error creating profile picture:", err.message);
  }

  // Also create a larger version for better quality (Facebook will resize)
  const logoSvgLarge = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#059669"/>
          <stop offset="100%" style="stop-color:#065f46"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="white"/>
      <text x="200" y="175" font-family="Arial, sans-serif" font-size="62" font-weight="bold" text-anchor="middle" fill="url(#textGrad2)">Oferte</text>
      <text x="200" y="250" font-family="Arial, sans-serif" font-size="62" font-weight="bold" text-anchor="middle" fill="#10b981">mutare</text>
      <text x="305" y="215" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#059669">.ro</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(logoSvgLarge))
      .resize(400, 400)
      .png()
      .toFile(path.join(publicDir, "fb-profile-400x400.png"));
    console.log("✅ Profile picture (HD) created: public/fb-profile-400x400.png (400x400px)");
  } catch (err) {
    console.error("❌ Error creating HD profile picture:", err.message);
  }

  // Cover Photo: 820x312px
  try {
    await sharp(path.join(publicDir, "pics", "index.webp"))
      .resize(820, 312, {
        fit: "cover",
        position: "center",
      })
      .png()
      .toFile(path.join(publicDir, "fb-cover-820x312.png"));
    console.log("✅ Cover photo created: public/fb-cover-820x312.png (820x312px)");
  } catch (err) {
    console.error("❌ Error creating cover photo:", err.message);
  }

  // Alternative cover from duba2.webp
  try {
    await sharp(path.join(publicDir, "pics", "duba2.webp"))
      .resize(820, 312, {
        fit: "cover",
        position: "center",
      })
      .png()
      .toFile(path.join(publicDir, "fb-cover-duba-820x312.png"));
    console.log("✅ Alternative cover created: public/fb-cover-duba-820x312.png (820x312px)");
  } catch (err) {
    console.error("❌ Error creating alternative cover:", err.message);
  }

  console.log("\n📁 Files saved in: c:\\Users\\Cip\\Desktop\\OM\\public\\");
  console.log("\nUpload to Facebook:");
  console.log("  • Profile: fb-profile-400x400.png (recommended - better quality)");
  console.log("  • Cover:   fb-cover-820x312.png OR fb-cover-duba-820x312.png");
}

createFacebookImages();

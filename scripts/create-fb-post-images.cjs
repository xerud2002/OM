const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const WIDTH = 1200;
const HEIGHT = 630;

const posts = [
  {
    id: 1,
    title: "Găsește firme de",
    titleHighlight: "mutări de încredere",
    subtitle: "Verificate. Recenzate. Garantate.",
    stat: "100%",
    statLabel: "firme verificate",
    url: "ofertemutare.ro",
    path: "/",
    // Gradient: Deep Blue → Teal (Trust colors)
    colors: { start: "#0f4c81", mid: "#0d7377", end: "#14a3a8", accent: "#2dd4bf" },
    // Custom benefits for this ad
    benefits: [
      "✓ Firme cu CUI verificat",
      "✓ Recenzii reale de la clienți",
      "✓ Prețuri transparente",
      "✓ Fără costuri ascunse",
    ],
  },
  {
    id: 2,
    title: "Cum economisești",
    titleHighlight: "la mutare?",
    subtitle: "Compară până la 5 oferte de la firme verificate.",
    stat: "40%",
    statLabel: "economie medie",
    url: "ofertemutare.ro",
    path: "/",
    // Gradient: Emerald → Teal → Cyan
    colors: { start: "#059669", mid: "#0d9488", end: "#0891b2", accent: "#10b981" },
  },
  {
    id: 3,
    title: "Ambalare corectă",
    titleHighlight: "= mutare reușită",
    subtitle: "Folie cu bule, hârtie, cutii potrivite.",
    stat: "0",
    statLabel: "obiecte stricate",
    url: "ofertemutare.ro/articles/impachetare",
    path: "/articles/impachetare",
    // Gradient: Purple → Pink → Rose
    colors: { start: "#7c3aed", mid: "#a855f7", end: "#ec4899", accent: "#c084fc" },
  },
  {
    id: 4,
    title: "Te muți",
    titleHighlight: "în curând?",
    subtitle: "Postează o cerere. Primești oferte.",
    stat: "5",
    statLabel: "oferte primite",
    url: "ofertemutare.ro/customer/auth",
    path: "/customer/auth",
    // Gradient: Blue → Indigo → Violet
    colors: { start: "#2563eb", mid: "#4f46e5", end: "#7c3aed", accent: "#818cf8" },
  },
  {
    id: 5,
    title: "Organizarea",
    titleHighlight: "face diferența",
    subtitle: "Etichetează cutiile pe camere.",
    stat: "50%",
    statLabel: "timp economisit",
    url: "ofertemutare.ro/articles/pregatire",
    path: "/articles/pregatire",
    // Gradient: Orange → Amber → Yellow
    colors: { start: "#ea580c", mid: "#f59e0b", end: "#eab308", accent: "#fbbf24" },
  },
  {
    id: 6,
    title: "Economisești",
    titleHighlight: "până la 40%",
    subtitle: "Când compari oferte, prețul scade.",
    stat: "40%",
    statLabel: "mai puțin",
    url: "ofertemutare.ro/articles/tips",
    path: "/articles/tips",
    // Gradient: Green → Emerald → Teal
    colors: { start: "#16a34a", mid: "#059669", end: "#0d9488", accent: "#34d399" },
  },
  {
    id: 7,
    title: "Alege ziua",
    titleHighlight: "potrivită",
    subtitle: "Flexibilitatea ta = preț mai bun.",
    stat: "20%",
    statLabel: "discount în zi liberă",
    url: "ofertemutare.ro/guides/mutare",
    path: "/guides/mutare",
    // Gradient: Cyan → Sky → Blue
    colors: { start: "#06b6d4", mid: "#0ea5e9", end: "#3b82f6", accent: "#38bdf8" },
  },
  {
    id: 8,
    title: "Firme verificate",
    titleHighlight: "100%",
    subtitle: "Fără spam. Doar oferte reale.",
    stat: "100%",
    statLabel: "verificate",
    url: "ofertemutare.ro/about",
    path: "/about",
    // Gradient: Rose → Red → Orange
    colors: { start: "#f43f5e", mid: "#ef4444", end: "#f97316", accent: "#fb7185" },
  },
  {
    id: 9,
    title: "3 minute.",
    titleHighlight: "5 oferte.",
    subtitle: "Completezi formularul. Restul e la noi.",
    stat: "3 min",
    statLabel: "timp completare",
    url: "ofertemutare.ro/customer/auth",
    path: "/customer/auth",
    // Gradient: Fuchsia → Purple → Indigo
    colors: { start: "#d946ef", mid: "#a855f7", end: "#6366f1", accent: "#e879f9" },
  },
];

function createPostSVG(post) {
  const escapeXml = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const { start, mid, end, accent } = post.colors;

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dynamic gradient background -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${start}"/>
      <stop offset="50%" style="stop-color:${mid}"/>
      <stop offset="100%" style="stop-color:${end}"/>
    </linearGradient>
    
    <!-- Mesh gradient overlay -->
    <radialGradient id="meshGrad1" cx="20%" cy="20%" r="60%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="meshGrad2" cx="80%" cy="80%" r="50%">
      <stop offset="0%" style="stop-color:${end};stop-opacity:0.4"/>
      <stop offset="100%" style="stop-color:${end};stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="meshGrad3" cx="90%" cy="20%" r="40%">
      <stop offset="0%" style="stop-color:${start};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:${start};stop-opacity:0"/>
    </radialGradient>
    
    <!-- Accent gradient using post colors -->
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:white"/>
      <stop offset="100%" style="stop-color:${accent}"/>
    </linearGradient>
    
    <!-- Official logo gradient (emerald like website) -->
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#059669"/>
      <stop offset="100%" style="stop-color:#065f46"/>
    </linearGradient>
    
    <!-- Glass card gradient -->
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:white;stop-opacity:0.05"/>
    </linearGradient>
  </defs>
  
  <!-- Background with gradient -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  
  <!-- Mesh gradient overlays for depth -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#meshGrad1)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#meshGrad2)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#meshGrad3)"/>
  
  <!-- Floating shapes -->
  <circle cx="100" cy="100" r="250" fill="white" opacity="0.03"/>
  <circle cx="1100" cy="500" r="300" fill="${end}" opacity="0.1"/>
  <circle cx="600" cy="-100" r="200" fill="${start}" opacity="0.08"/>
  
  <!-- Decorative lines -->
  <rect x="0" y="200" width="80" height="4" fill="white" opacity="0.2"/>
  <rect x="1120" y="400" width="80" height="4" fill="white" opacity="0.2"/>
  
  <!-- Enhanced Stat Card (right side) - IMPROVED -->
  <g transform="translate(800, 80)">
    <!-- Card background with better glass effect -->
    <rect x="0" y="0" width="340" height="420" rx="28" fill="white" opacity="0.08"/>
    <rect x="0" y="0" width="340" height="420" rx="28" fill="none" stroke="white" stroke-width="2" opacity="0.15"/>
    
    <!-- Inner glow -->
    <rect x="8" y="8" width="324" height="404" rx="24" fill="none" stroke="${accent}" stroke-width="1" opacity="0.1"/>
    
    <!-- Main stat circle -->
    <g transform="translate(170, ${post.benefits ? "100" : "130"})">
      <!-- Outer decorative ring -->
      <circle cx="0" cy="0" r="${post.benefits ? "80" : "100"}" fill="none" stroke="white" stroke-width="1" opacity="0.1"/>
      <!-- Progress track -->
      <circle cx="0" cy="0" r="${post.benefits ? "68" : "88"}" fill="none" stroke="${accent}" stroke-width="8" opacity="0.15"/>
      <!-- Progress arc -->
      <circle cx="0" cy="0" r="${post.benefits ? "68" : "88"}" fill="none" stroke="${accent}" stroke-width="8" stroke-dasharray="440 200" stroke-linecap="round" transform="rotate(-90)"/>
      <!-- Inner glow circle -->
      <circle cx="0" cy="0" r="${post.benefits ? "55" : "72"}" fill="${accent}" opacity="0.08"/>
      <!-- Inner circle -->
      <circle cx="0" cy="0" r="${post.benefits ? "48" : "65"}" fill="white" opacity="0.05"/>
      <!-- Stat number -->
      <text y="15" font-family="Arial, Helvetica, sans-serif" font-size="${post.benefits ? "44" : "56"}" font-weight="800" fill="${accent}" text-anchor="middle">
        ${escapeXml(post.stat)}
      </text>
    </g>
    
    <!-- Stat label -->
    <text x="170" y="${post.benefits ? "210" : "270"}" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="600">
      ${escapeXml(post.statLabel)}
    </text>
    
    <!-- Divider line with gradient -->
    <rect x="40" y="${post.benefits ? "235" : "300"}" width="260" height="2" rx="1" fill="${accent}" opacity="0.3"/>
    
    <!-- Feature list - dynamic based on post.benefits -->
    ${
      post.benefits
        ? `
    <g transform="translate(40, 255)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="white" font-weight="500">${post.benefits[0]}</text>
    </g>
    <g transform="translate(40, 285)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="white" font-weight="500">${post.benefits[1]}</text>
    </g>
    <g transform="translate(40, 315)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="white" font-weight="500">${post.benefits[2]}</text>
    </g>
    <g transform="translate(40, 345)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="white" font-weight="500">${post.benefits[3]}</text>
    </g>
    `
        : `
    <g transform="translate(40, 330)">
      <rect x="0" y="0" width="260" height="36" rx="18" fill="white" opacity="0.05"/>
      <circle cx="20" cy="18" r="12" fill="${accent}" opacity="0.3"/>
      <text x="20" y="23" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">✓</text>
      <text x="42" y="23" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="white" font-weight="500">Compară instant prețurile</text>
    </g>
    <g transform="translate(40, 374)">
      <rect x="0" y="0" width="260" height="36" rx="18" fill="white" opacity="0.05"/>
      <circle cx="20" cy="18" r="12" fill="${accent}" opacity="0.3"/>
      <text x="20" y="23" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">✓</text>
      <text x="42" y="23" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="white" font-weight="500">100% gratuit, fără obligații</text>
    </g>
    `
    }
  </g>
  
  <!-- Main content (left side) -->
  <g transform="translate(80, 130)">
    <!-- Main title -->
    <text y="70" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="white">
      ${escapeXml(post.title)}
    </text>
    
    <!-- Highlighted title (yellow) -->
    <text y="145" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="url(#accentGrad)">
      ${escapeXml(post.titleHighlight)}
    </text>
    
    <!-- Yellow underline accent -->
    <rect y="165" width="200" height="6" rx="3" fill="${accent}"/>
    
    <!-- Subtitle -->
    <text y="220" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="white" opacity="0.8">
      ${escapeXml(post.subtitle)}
    </text>
  </g>
  
  <!-- Bottom bar -->
  <rect y="530" width="${WIDTH}" height="100" fill="rgba(0,0,0,0.6)"/>
  
  <!-- Gradient line separator -->
  <defs>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0"/>
      <stop offset="20%" style="stop-color:${accent}"/>
      <stop offset="80%" style="stop-color:${end}"/>
      <stop offset="100%" style="stop-color:${end};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="530" width="${WIDTH}" height="3" fill="url(#lineGrad)"/>
  
  <!-- Footer Logo (left) -->
  <g transform="translate(60, 560)">
    <text font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">
      <tspan fill="#059669">Oferte</tspan><tspan fill="#10b981">mutare</tspan><tspan fill="#059669" font-size="16">.ro</tspan>
    </text>
    <text y="28" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="white" opacity="0.5">
      Platforma #1 pentru comparare oferte mutări
    </text>
  </g>
  
  <!-- CTA Button (center-right) -->
  <g transform="translate(480, 552)">
    <rect width="260" height="52" rx="26" fill="${accent}"/>
    <text x="130" y="34" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#0f172a" text-anchor="middle">
      Cere oferte GRATIS →
    </text>
  </g>
  
  <!-- Trust icons (right) -->
  <g transform="translate(780, 555)">
    <!-- Checkmark icons -->
    <g>
      <circle cx="12" cy="12" r="12" fill="#059669" opacity="0.2"/>
      <text x="12" y="17" font-family="Arial, sans-serif" font-size="14" fill="#10b981" text-anchor="middle">✓</text>
      <text x="30" y="17" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="white" opacity="0.8">Verificat</text>
    </g>
    <g transform="translate(100, 0)">
      <circle cx="12" cy="12" r="12" fill="#059669" opacity="0.2"/>
      <text x="12" y="17" font-family="Arial, sans-serif" font-size="14" fill="#10b981" text-anchor="middle">✓</text>
      <text x="30" y="17" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="white" opacity="0.8">Gratuit</text>
    </g>
    <g transform="translate(190, 0)">
      <circle cx="12" cy="12" r="12" fill="#059669" opacity="0.2"/>
      <text x="12" y="17" font-family="Arial, sans-serif" font-size="14" fill="#10b981" text-anchor="middle">✓</text>
      <text x="30" y="17" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="white" opacity="0.8">Rapid</text>
    </g>
    
    <!-- Second row -->
    <text y="45" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#fbbf24" font-weight="600">
      500+ mutări realizate cu succes
    </text>
  </g>
</svg>`;
}

async function createPostImages() {
  const outputDir = path.join(__dirname, "..", "public", "fb-posts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.warn("🎨 Generating Moz-style Facebook post images...\n");

  for (const post of posts) {
    const outputPath = path.join(outputDir, `post-${post.id}.png`);
    const svg = createPostSVG(post);

    try {
      await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(outputPath);
      console.warn(`✅ Post ${post.id}: ${post.title} ${post.titleHighlight}`);
    } catch (error) {
      console.error(`❌ Error creating post ${post.id}:`, error.message);
    }
  }

  console.warn("\n🎉 Done! Moz-style images saved to: public/fb-posts/");
  console.warn("📐 Size: 1200x630px (optimal for Facebook)");
}

createPostImages().catch(console.error);

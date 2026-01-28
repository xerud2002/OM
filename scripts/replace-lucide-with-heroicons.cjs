const fs = require("fs");
const path = require("path");

// Mapping from Lucide icon names to Heroicons
const iconMapping = {
  // Common icons
  Shield: "ShieldCheckIcon",
  ThumbsUp: "HandThumbUpIcon",
  Clock: "ClockIcon",
  Award: "TrophyIcon",
  HeartHandshake: "HeartIcon",
  Heart: "HeartIcon",

  // Navigation & UI
  ArrowRight: "ArrowRightIcon",
  ArrowLeft: "ArrowLeftIcon",
  ChevronRight: "ChevronRightIcon",
  ChevronDown: "ChevronDownIcon",
  ChevronLeft: "ChevronLeftIcon",
  X: "XMarkIcon",
  Menu: "Bars3Icon",
  Check: "CheckIcon",
  CheckCircle: "CheckCircleIcon",
  CheckCircle2: "CheckCircleIcon",

  // Communication
  Mail: "EnvelopeIcon",
  Phone: "PhoneIcon",
  PhoneCall: "PhoneIcon",
  Bell: "BellIcon",
  MessageCircle: "ChatBubbleLeftRightIcon",
  MessageSquare: "ChatBubbleBottomCenterTextIcon",

  // User & People
  User: "UserIcon",
  Users: "UsersIcon",
  UserCheck: "UserCircleIcon",

  // Business & Building
  Building2: "BuildingOfficeIcon",
  Building: "BuildingOffice2Icon",
  MapPin: "MapPinIcon",
  Home: "HomeIcon",

  // Actions & Items
  Package: "CubeIcon",
  Box: "ArchiveBoxIcon",
  Wrench: "WrenchScrewdriverIcon",
  Truck: "TruckIcon",
  Warehouse: "BuildingStorefrontIcon",
  Trash2: "TrashIcon",

  // Files & Documents
  FileText: "DocumentTextIcon",
  FileVideo: "VideoCameraIcon",
  Clipboard: "ClipboardDocumentIcon",
  BookOpen: "BookOpenIcon",

  // Status & Feedback
  Loader2: "ArrowPathIcon",
  AlertTriangle: "ExclamationTriangleIcon",
  AlertCircle: "ExclamationCircleIcon",
  Info: "InformationCircleIcon",
  Sparkles: "SparklesIcon",

  // Upload & Download
  Upload: "ArrowUpTrayIcon",

  // Lists & Organization
  List: "ListBulletIcon",
  Inbox: "InboxIcon",
  Archive: "ArchiveBoxIcon",
  ArchiveIcon: "ArchiveBoxIcon",

  // Charts & Analytics
  TrendingUp: "ArrowTrendingUpIcon",
  TrendingDown: "ArrowTrendingDownIcon",
  BarChart3: "ChartBarIcon",

  // Editing & Actions
  Edit3: "PencilIcon",
  Save: "CheckIcon",
  Search: "MagnifyingGlassIcon",
  Filter: "FunnelIcon",
  Send: "PaperAirplaneIcon",
  Settings: "Cog6ToothIcon",

  // Money & Commerce
  DollarSign: "CurrencyDollarIcon",
  Coins: "CurrencyDollarIcon",

  // Misc
  Calculator: "CalculatorIcon",
  Unlock: "LockOpenIcon",
  HandshakeIcon: "HandRaisedIcon",
  Handshake: "HandRaisedIcon",
  Gift: "GiftIcon",
  Target: "ArrowTrendingUpIcon",
  Rocket: "RocketLaunchIcon",
  Video: "VideoCameraIcon",
  Camera: "CameraIcon",
  ImageIcon: "PhotoIcon",
  PauseCircle: "PauseCircleIcon",
  Music: "MusicalNoteIcon",
  Bed: "HomeIcon",
  Sofa: "HomeIcon",
  Layers: "Squares2X2Icon",
  Monitor: "ComputerDesktopIcon",
  Server: "ServerIcon",
  Briefcase: "BriefcaseIcon",
  Key: "KeyIcon",
  GraduationCap: "AcademicCapIcon",
  Percent: "ReceiptPercentIcon",
  Recycle: "ArrowPathIcon",
  Thermometer: "FireIcon",
  ShoppingCart: "ShoppingCartIcon",
  Circle: "StopIcon",
  Wine: "BeakerIcon",
  Frame: "PhotoIcon",
  Piano: "MusicalNoteIcon",
  Factory: "BuildingOffice2Icon",
  // Misc
  Star: "StarIcon",
  Quote: "ChatBubbleLeftIcon",
  PlusSquare: "PlusCircleIcon",
  XCircle: "XCircleIcon",
  RotateCcw: "ArrowPathIcon",
  Lightbulb: "LightBulbIcon",
  Eye: "EyeIcon",
  Lock: "LockClosedIcon",
  Zap: "BoltIcon",
  ShieldCheck: "ShieldCheckIcon",
  HelpCircle: "QuestionMarkCircleIcon",
  Calendar: "CalendarIcon",
  Facebook: "BuildingOfficeIcon", // No direct Facebook icon
  ArrowUpDown: "ArrowsUpDownIcon",
  PlusCircle: "PlusCircleIcon",
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Check if file uses lucide-react
  if (!content.includes('from "lucide-react"')) {
    return false;
  }

  console.log(`Processing: ${filePath}`);

  // Extract the import line
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*["']lucide-react["'];/;
  const match = content.match(importRegex);

  if (!match) return false;

  const importedIcons = match[1]
    .split(",")
    .map((icon) => icon.trim())
    .filter((icon) => icon.length > 0)
    .map((icon) => {
      // Handle "as" aliases like "Archive as ArchiveIcon"
      const parts = icon.split(/\s+as\s+/);
      if (parts.length === 2) {
        return { lucide: parts[0].trim(), alias: parts[1].trim() };
      }
      return { lucide: icon, alias: icon };
    });

  // Map to Heroicons with aliases
  const heroicons = importedIcons
    .map((item) => {
      const heroIcon = iconMapping[item.lucide];
      if (!heroIcon) {
        console.warn(`  ⚠️  No mapping for: ${item.lucide}`);
        return null;
      }
      // Always create an alias to match the original Lucide name
      return `${heroIcon} as ${item.alias}`;
    })
    .filter((icon) => icon !== null);

  if (heroicons.length === 0) return false;

  // Replace import statement
  const newImport = `import { ${heroicons.join(", ")} } from "@heroicons/react/24/outline";`;
  content = content.replace(importRegex, newImport);

  // Replace className usage - Heroicons don't use strokeWidth
  content = content.replace(/\sstrokeWidth={[^}]*}/g, "");

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  ✅ Updated: ${heroicons.length} icons`);
  return true;
}

function walkDir(dir, fileCallback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules") {
        walkDir(filePath, fileCallback);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileCallback(filePath);
    }
  });
}

// Main execution
const rootDir = path.join(__dirname, "..");
let updatedCount = 0;

console.log("🔄 Replacing Lucide with Heroicons...\n");

walkDir(rootDir, (filePath) => {
  if (replaceInFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\n✨ Complete! Updated ${updatedCount} files.`);

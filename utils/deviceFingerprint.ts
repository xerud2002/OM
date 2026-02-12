// utils/deviceFingerprint.ts
// Client-side device fingerprinting for fraud detection
// Generates a semi-unique hash based on browser/device characteristics

/**
 * Generate a device fingerprint hash from browser attributes.
 * This is NOT a replacement for server-side IP tracking, but adds
 * an extra signal for detecting multi-account abuse.
 */
export async function generateDeviceFingerprint(): Promise<string> {
  const components: string[] = [];

  // 1. Screen
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
  components.push(`${window.devicePixelRatio || 1}`);

  // 2. Navigator
  components.push(navigator.language || "");
  components.push(navigator.platform || "");
  components.push(String(navigator.hardwareConcurrency || 0));
  components.push(String((navigator as any).deviceMemory || 0));

  // 3. Timezone
  try {
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    components.push("tz-unknown");
  }
  components.push(String(new Date().getTimezoneOffset()));

  // 4. WebGL renderer (highly discriminating)
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "");
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
      }
    }
  } catch {
    components.push("webgl-unavailable");
  }

  // 5. Canvas fingerprint (subtle rendering differences between devices)
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(0, 0, 200, 50);
      ctx.fillStyle = "#069";
      ctx.fillText("OferteMutare.ro 🏠", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("fingerprint", 4, 32);
      components.push(canvas.toDataURL().slice(-50)); // last 50 chars of data URL
    }
  } catch {
    components.push("canvas-unavailable");
  }

  // 6. Installed fonts probe (quick check via canvas width)
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const testFonts = [
        "Arial", "Verdana", "Times New Roman", "Courier New",
        "Georgia", "Trebuchet MS", "Impact", "Comic Sans MS",
      ];
      const widths: string[] = [];
      for (const font of testFonts) {
        ctx.font = `16px "${font}", monospace`;
        widths.push(String(Math.round(ctx.measureText("mmmmmmmmmmlli").width)));
      }
      components.push(widths.join(","));
    }
  } catch {
    components.push("fonts-unavailable");
  }

  // 7. Touch support
  components.push(String("ontouchstart" in window));
  components.push(String(navigator.maxTouchPoints || 0));

  // Hash all components into a fingerprint
  const raw = components.join("|");
  return await sha256(raw);
}

/**
 * SHA-256 hash using SubtleCrypto (available in all modern browsers)
 */
async function sha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback: simple hash for environments without SubtleCrypto (e.g. HTTP)
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit int
    }
    return `fallback-${Math.abs(hash).toString(16)}`;
  }
}

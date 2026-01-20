/**
 * Interaction-based script loader
 * Defers loading of third-party scripts until first user interaction
 * to improve initial page load performance.
 */

let hasLoaded = false;
let loadCallbacks: (() => void)[] = [];

function triggerLoad() {
  if (hasLoaded) return;
  hasLoaded = true;

  // Remove all event listeners
  const events = ["click", "scroll", "keydown", "touchstart", "mousemove"];
  events.forEach((e) => window.removeEventListener(e, triggerLoad));

  // Execute all registered callbacks
  loadCallbacks.forEach((cb) => {
    try {
      cb();
    } catch (error) {
      console.error("Error in interaction loader callback:", error);
    }
  });

  // Clear callbacks
  loadCallbacks = [];
}

/**
 * Register a function to be called on first user interaction.
 * Common interactions: click, scroll, keydown, touchstart, mousemove
 */
export function loadOnInteraction(loadFn: () => void) {
  if (hasLoaded) {
    // Already loaded, execute immediately
    loadFn();
    return;
  }

  // Add to callbacks
  loadCallbacks.push(loadFn);

  // Only set up listeners once (for the first registration)
  if (loadCallbacks.length === 1) {
    const events = ["click", "scroll", "keydown", "touchstart", "mousemove"];
    events.forEach((e) =>
      window.addEventListener(e, triggerLoad, { once: true, passive: true })
    );
  }
}

/**
 * Load Google Analytics on interaction
 */
export function loadGoogleAnalytics(gaId: string) {
  loadOnInteraction(() => {
    // Create and inject GA script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    (window as unknown as { dataLayer: unknown[] }).dataLayer =
      (window as unknown as { dataLayer: unknown[] }).dataLayer || [];

    function gtag(...args: unknown[]) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    }

    gtag("js", new Date());
    gtag("config", gaId);
  });
}

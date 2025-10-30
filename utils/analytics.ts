let initialized = false;

function getGaId(): string | null {
  if (typeof window === "undefined") return null;
  return (process.env.NEXT_PUBLIC_GA_ID as string) || null;
}

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  const GA_ID = getGaId();
  if (!GA_ID) return;

  // Inject gtag script if not present
  if (!document.querySelector('script[src*="www.googletagmanager.com/gtag/js"]')) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }
  if (!(window as any).dataLayer) {
    (window as any).dataLayer = [];
  }
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = (window as any).gtag || gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
  initialized = true;
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const GA_ID = getGaId();
  if (!GA_ID) return;
  try {
    initAnalytics();
    (window as any).gtag("event", eventName, params || {});
  } catch {
    // swallow
  }
}

export function trackPageview(path: string) {
  trackEvent("page_view", { page_path: path });
}

"use client";

import { useEffect } from "react";

/**
 * Tawk.to Live Chat Widget
 *
 * To use:
 * 1. Sign up at https://www.tawk.to (FREE)
 * 2. Get your Property ID and Widget ID from dashboard
 * 3. Replace TAWK_PROPERTY_ID and TAWK_WIDGET_ID below with your actual IDs
 *
 * Alternative chat services:
 * - Crisp.chat (free tier available)
 * - Tidio (free tier available)
 * - Intercom (paid)
 */

const TAWK_PROPERTY_ID = "YOUR_PROPERTY_ID"; // Replace with your Tawk.to property ID
const TAWK_WIDGET_ID = "default"; // Replace with your widget ID

export default function LiveChatWidget() {
  useEffect(() => {
    // Don't load if IDs not configured
    if (TAWK_PROPERTY_ID === "YOUR_PROPERTY_ID") {
      return;
    }

    // Load Tawk.to script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Cleanup
    return () => {
      // Remove Tawk widget on unmount
      const tawkScript = document.querySelector(`script[src*="tawk.to"]`);
      if (tawkScript) tawkScript.remove();

      // Clean up Tawk API
      if ((window as any).Tawk_API) {
        delete (window as any).Tawk_API;
      }
    };
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Simple custom chat bubble (fallback if Tawk not configured)
 * You can customize this or remove it once Tawk is set up
 */
export function SimpleChatBubble() {
  const handleClick = () => {
    // Open contact page or trigger modal
    window.location.href = "/contact";
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-2xl text-white shadow-2xl transition-all hover:scale-110"
      aria-label="Chat cu noi"
      title="Ai nevoie de ajutor? Contactează-ne!"
    >
      💬
    </button>
  );
}

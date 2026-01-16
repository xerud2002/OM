"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackCTAClick } from "@/utils/analytics";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-open after delay (only once)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setIsOpen(true);
      }
    }, 15000); // Open after 15s

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
    trackCTAClick("whatsapp_open", "widget");
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setHasInteracted(true);
  };

  const handleStartChat = () => {
    trackCTAClick("whatsapp_start", "widget");
    // Replace with your actual WhatsApp business number
    const phoneNumber = "40700000000"; 
    const message = encodeURIComponent("Bună ziua! Am nevoie de ajutor cu o mutare.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 md:bottom-6 md:right-6 md:left-auto font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 h-auto w-[300px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-[#075E54] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">OferteMutare.ro</h3>
                    <p className="text-xs text-emerald-100">Răspundem rapid 👋</p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-[#E5DDD5] p-5 bg-opacity-50" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
              <div className="mr-8 rounded-tr-lg rounded-br-lg rounded-bl-lg bg-white p-3 shadow-sm text-sm text-gray-800">
                Bună! 👋 Cu ce te putem ajuta astăzi legat de mutarea ta?
                <div className="mt-1 text-right text-[10px] text-gray-400">
                  {new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white p-3">
              <button
                onClick={handleStartChat}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#128C7E] hover:shadow-lg"
              >
                <Send size={18} />
                Începe Chat pe WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isOpen ? handleClose : handleOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 transition-all hover:shadow-xl"
        aria-label="Chat WhatsApp"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
        
        {/* Notification dot if closed and not interacted */}
        {!isOpen && !hasInteracted && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}

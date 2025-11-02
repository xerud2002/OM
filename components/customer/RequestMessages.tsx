"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onRequestMessagesAggregate, Message } from "@/utils/messagesHelpers";

export default function RequestMessages({ requestId, userId }: { requestId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!requestId) return;
    const unsub = onRequestMessagesAggregate(
      requestId,
      (msgs) => setMessages(msgs),
      (err) => console.warn("RequestMessages aggregate error", err)
    );
    return () => unsub();
  }, [requestId]);

  if (!messages.length) return null;

  const last = messages.slice(-3);

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white/60 p-3">
      <p className="mb-2 text-xs font-semibold text-gray-700">Istoric mesaje (ultimele 3)</p>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {last.map((m) => {
            const isOwn = m.senderId === userId;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm ${
                    isOwn ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isOwn && (
                    <p className={`mb-0.5 text-[10px] font-semibold ${isOwn ? "text-emerald-100" : "text-gray-600"}`}>
                      {m.senderName || (m.senderType === "company" ? "Companie" : "Client")}
                    </p>
                  )}
                  <p>{m.text}</p>
                  <p className={`mt-0.5 text-[10px] ${isOwn ? "text-emerald-100" : "text-gray-500"}`}>
                    {m.createdAt?.toDate
                      ? new Date(m.createdAt.toDate()).toLocaleTimeString("ro-RO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onOfferMessages, sendOfferMessage, Message } from "@/utils/messagesHelpers";
import { MessageCircle, Send } from "lucide-react";

type Offer = {
  id: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: string;
  createdAt?: any;
};

type Request = {
  id: string;
  requestCode?: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
};

type MessagesViewProps = {
  requests: Request[];
  userId: string;
  userName: string;
};

export default function MessagesView({ requests, userId, userName }: MessagesViewProps) {
  const [offersWithMessages, setOffersWithMessages] = useState<
    Array<{ request: Request; offer: Offer; messages: Message[]; unreadCount: number }>
  >([]);
  const [selectedConversation, setSelectedConversation] = useState<{
    request: Request;
    offer: Offer;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load all offers with messages for the customer's requests
  useEffect(() => {
    if (!requests.length) {
      setLoading(false);
      return;
    }

    const unsubscribers: Array<() => void> = [];

    // For each request, subscribe to all offers and their messages
    Promise.all(
      requests.map(async (request) => {
        const { collection, query, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/services/firebase");

        const offersRef = collection(db, "requests", request.id, "offers");
  const q = query(offersRef);
  const offersSnap = await getDocs(q);

        offersSnap.docs.forEach((offerDoc) => {
          const offer = { id: offerDoc.id, ...offerDoc.data() } as Offer;

          // Subscribe to messages for this offer
          const unsub = onOfferMessages(request.id, offer.id, (msgs) => {
            const unreadCount = msgs.filter((m) => !m.read && m.senderId !== userId).length;

            setOffersWithMessages((prev) => {
              const existing = prev.find((item) => item.offer.id === offer.id);
              if (existing) {
                // Update existing
                return prev.map((item) =>
                  item.offer.id === offer.id
                    ? { ...item, messages: msgs, unreadCount }
                    : item
                );
              } else {
                // Add new
                return [...prev, { request, offer, messages: msgs, unreadCount }];
              }
            });
          });

          unsubscribers.push(unsub);
        });
      })
    ).finally(() => setLoading(false));

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [requests, userId]);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const unsub = onOfferMessages(
      selectedConversation.request.id,
      selectedConversation.offer.id,
      (msgs) => {
        setMessages(msgs);
      }
    );

    return () => unsub();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageText.trim()) return;

    setSending(true);
    try {
      await sendOfferMessage(
        selectedConversation.request.id,
        selectedConversation.offer.id,
        "customer",
        userId,
        messageText,
        userName
      );
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("A apărut o eroare la trimiterea mesajului.");
    } finally {
      setSending(false);
    }
  };

  // Filter only offers with messages
  const conversationsWithMessages = offersWithMessages.filter(
    (item) => item.messages.length > 0
  );

  return (
    <div className="grid h-[600px] grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Conversations List */}
      <div className="overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 lg:col-span-1">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">💬 Conversații</h3>

        {loading ? (
          <p className="text-center text-sm text-gray-500">Se încarcă...</p>
        ) : conversationsWithMessages.length === 0 ? (
          <p className="text-center text-sm italic text-gray-400">
            Nicio conversație încă. Când companiile răspund la ofertele lor, mesajele vor apărea
            aici.
          </p>
        ) : (
          <div className="space-y-2">
            {conversationsWithMessages.map((item) => (
              <motion.button
                key={item.offer.id}
                onClick={() => setSelectedConversation({ request: item.request, offer: item.offer })}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selectedConversation?.offer.id === item.offer.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.offer.companyName}</p>
                    <p className="text-xs text-gray-500">
                      {item.request.requestCode || item.request.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-600">
                      {item.messages[item.messages.length - 1]?.text || "..."}
                    </p>
                  </div>
                  {item.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {item.unreadCount}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Messages Panel */}
      <div className="flex flex-col rounded-xl border border-gray-200 bg-white lg:col-span-2">
        {!selectedConversation ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Selectează o conversație pentru a vedea mesajele</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedConversation.offer.companyName}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.request.requestCode || selectedConversation.request.id.slice(0, 8)} •{" "}
                {selectedConversation.request.fromCity} → {selectedConversation.request.toCity}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Ofertă: {selectedConversation.offer.price} lei
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <AnimatePresence>
                {messages.map((msg) => {
                  const isOwn = msg.senderId === userId;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-emerald-500 text-white"
                            : "border border-gray-200 bg-gray-50 text-gray-900"
                        }`}
                      >
                        {!isOwn && (
                          <p className="mb-1 text-xs font-semibold text-gray-600">
                            {msg.senderName || "Companie"}
                          </p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`mt-1 text-xs ${
                            isOwn ? "text-emerald-100" : "text-gray-500"
                          }`}
                        >
                          {msg.createdAt?.toDate
                            ? new Date(msg.createdAt.toDate()).toLocaleTimeString("ro-RO", {
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

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Scrie mesajul tău..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !sending) {
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !messageText.trim()}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400"
                >
                  <Send size={16} />
                  {sending ? "..." : "Trimite"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

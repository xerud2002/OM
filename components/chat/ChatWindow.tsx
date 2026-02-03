"use client";

import { useEffect, useState, useRef } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

type Props = {
  requestId: string;
  offerId: string;
  otherPartyName: string; // The name of the company (if customer) or customer (if company)
  currentUserRole: "company" | "customer";
  onClose: () => void;
};

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderRole: "company" | "customer";
  createdAt: any;
};

export default function ChatWindow({ requestId, offerId, otherPartyName, currentUserRole, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!requestId || !offerId) return;

    const q = query(
      collection(db, "requests", requestId, "offers", offerId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
      setMessages(msgs);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsub();
  }, [requestId, offerId]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;
    
    const text = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      // 1. Add message
      await addDoc(collection(db, "requests", requestId, "offers", offerId, "messages"), {
        text,
        senderId: auth.currentUser.uid,
        senderRole: currentUserRole,
        createdAt: serverTimestamp(),
      });

      // 2. Update offer/request with last message info (optional, for list previews)
      // await updateDoc(...)
    } catch (err) {
      console.error("Error sending message:", err);
      // Maybe show toast
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white shadow-xl ring-1 ring-black/10 sm:rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3 sm:px-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Chat cu {otherPartyName}
          </h3>
          <p className="text-xs text-slate-500">
             Discută detaliile ofertei
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6"
      >
        <div className="space-y-4">
          {messages.length === 0 && (
             <div className="py-10 text-center text-sm text-slate-400">
               Începe conversația...
             </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-slate-900 rounded-bl-none ring-1 ring-slate-200"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`mt-1 text-[10px] ${isMe ? "text-emerald-100" : "text-slate-400"}`}>
                    {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), "HH:mm") : "..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4 sm:px-6">
        <form 
          onSubmit={handleSend}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="rounded-full bg-emerald-600 p-2.5 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

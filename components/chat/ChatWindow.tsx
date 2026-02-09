"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  limitToLast,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Image from "next/image";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "@/services/firebase";
import { logger } from "@/utils/logger";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  CameraIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon, PlayIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

type Props = {
  requestId: string;
  offerId: string;
  otherPartyName: string;
  currentUserRole: "company" | "customer";
  onClose: () => void;
  offerMessage?: string;
};

type Attachment = {
  url: string;
  type: "image" | "video";
  name: string;
};

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderRole: "company" | "customer";
  createdAt: any;
  attachment?: Attachment;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif";
const ACCEPTED_VIDEO_TYPES = "video/mp4,video/quicktime,video/webm,video/3gpp";

export default function ChatWindow({
  requestId,
  offerId,
  otherPartyName,
  currentUserRole,
  onClose,
  offerMessage,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    file: File;
    url: string;
    type: "image" | "video";
  } | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // Close attach menu on outside click
  useEffect(() => {
    if (!showAttachMenu) return;
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAttachMenu]);

  // Subscribe to messages
  useEffect(() => {
    if (!requestId || !offerId) return;

    const q = query(
      collection(db, "requests", requestId, "offers", offerId, "messages"),
      orderBy("createdAt", "asc"),
      limitToLast(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Message
      );
      setMessages(msgs);

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsub();
  }, [requestId, offerId]);

  // Subscribe to typing indicator
  useEffect(() => {
    if (!requestId || !offerId) return;
    const typingDocRef = doc(db, "requests", requestId, "offers", offerId, "typing", currentUserRole === "company" ? "customer" : "company");
    const unsub = onSnapshot(typingDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const ts = data?.timestamp;
        if (ts) {
          const now = Date.now();
          const typingTime = ts.toMillis ? ts.toMillis() : ts.seconds * 1000;
          setIsTyping(now - typingTime < 4000);
        }
      } else {
        setIsTyping(false);
      }
    });
    return () => unsub();
  }, [requestId, offerId, currentUserRole]);

  // Emit typing indicator
  const emitTyping = useCallback(() => {
    if (!auth.currentUser || !requestId || !offerId) return;
    const typingDocRef = doc(db, "requests", requestId, "offers", offerId, "typing", currentUserRole);
    setDoc(typingDocRef, { timestamp: serverTimestamp() }).catch(() => {});
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      deleteDoc(typingDocRef).catch(() => {});
    }, 3000);
  }, [requestId, offerId, currentUserRole]);

  // Upload file to Firebase Storage
  const uploadFile = useCallback(
    async (file: File): Promise<Attachment> => {
      if (!auth.currentUser) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop() || "file";
      const timestamp = Date.now();
      const storagePath = `chats/${requestId}/${offerId}/${auth.currentUser.uid}_${timestamp}.${ext}`;
      const storageRef = ref(storage, storagePath);

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type,
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => {
            logger.error("Upload error:", error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url,
                type: file.type.startsWith("video/") ? "video" : "image",
                name: file.name,
              });
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    },
    [requestId, offerId]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShowAttachMenu(false);
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        import("sonner").then(({ toast }) =>
          toast.error("Fișierul este prea mare. Maxim 10MB.")
        );
        return;
      }

      const url = URL.createObjectURL(file);
      const type: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      setPreviewFile({ file, url, type });
      e.target.value = "";
    },
    []
  );

  // Cancel preview
  const cancelPreview = useCallback(() => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  }, [previewFile]);

  // Send message (with optional attachment)
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = newMessage.trim();
    const hasAttachment = !!previewFile;

    if (!text && !hasAttachment) return;
    if (!auth.currentUser) return;

    setNewMessage("");
    setSending(true);

    try {
      let attachment: Attachment | undefined;

      if (previewFile) {
        setUploading(true);
        try {
          attachment = await uploadFile(previewFile.file);
        } catch {
          import("sonner").then(({ toast }) =>
            toast.error("Eroare la încărcarea fișierului")
          );
          setSending(false);
          setUploading(false);
          return;
        }
        URL.revokeObjectURL(previewFile.url);
        setPreviewFile(null);
        setUploading(false);
        setUploadProgress(0);
      }

      const msgData: Record<string, unknown> = {
        text: text || "",
        senderId: auth.currentUser.uid,
        senderRole: currentUserRole,
        createdAt: serverTimestamp(),
      };
      if (attachment) {
        msgData.attachment = attachment;
      }

      await addDoc(
        collection(db, "requests", requestId, "offers", offerId, "messages"),
        msgData
      );
    } catch (err) {
      logger.error("Error sending message:", err);
      import("sonner").then(({ toast }) =>
        toast.error("Eroare la trimiterea mesajului")
      );
    } finally {
      setSending(false);
    }
  };

  // Group messages by date for date separators
  const getDateLabel = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (msgDate.getTime() === today.getTime()) return "Azi";
    if (msgDate.getTime() === yesterday.getTime()) return "Ieri";
    return `${date.getDate()} ${["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()]} ${date.getFullYear()}`;
  };

  // Render attachment in message bubble
  const renderAttachment = (attachment: Attachment) => {
    if (attachment.type === "image") {
      return (
        <button
          onClick={() => setLightboxUrl(attachment.url)}
          className="mt-1.5 block overflow-hidden rounded-xl"
        >
          <Image
            src={attachment.url}
            alt={attachment.name}
            width={320}
            height={240}
            className="max-h-48 sm:max-h-64 md:max-h-80 w-auto max-w-full rounded-xl object-cover"
            loading="lazy"
          />
        </button>
      );
    }
    if (attachment.type === "video") {
      return (
        <div className="mt-1.5 overflow-hidden rounded-xl">
          <video
            src={attachment.url}
            controls
            playsInline
            preload="metadata"
            className="max-h-48 sm:max-h-64 md:max-h-80 w-auto max-w-full rounded-xl"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col bg-white shadow-xl ring-1 ring-black/10 sm:rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            Chat cu {otherPartyName}
          </h3>
          <p className="text-[10px] text-slate-500 sm:text-xs">
            Discută detaliile ofertei
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-500 active:bg-slate-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-3 py-4 sm:px-6 sm:py-6"
      >
        <div className="space-y-3 sm:space-y-4">
          {offerMessage && (
            <div className="mx-auto max-w-[95%] sm:max-w-[90%] rounded-xl bg-blue-50 px-3 py-2.5 sm:px-4 sm:py-3 text-center ring-1 ring-blue-100">
              <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                Mesajul ofertei
              </p>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-blue-700">
                &ldquo;{offerMessage}&rdquo;
              </p>
            </div>
          )}
          {messages.length === 0 && !offerMessage && (
            <div className="py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-400">
              Începe conversația...
            </div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.senderRole === currentUserRole;
            // Date separator
            const msgDate = msg.createdAt?.toDate ? msg.createdAt.toDate() : null;
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const prevDate = prevMsg?.createdAt?.toDate ? prevMsg.createdAt.toDate() : null;
            const showDateSep = msgDate && (!prevDate || getDateLabel(msgDate) !== getDateLabel(prevDate));
            return (
              <div key={msg.id}>
                {showDateSep && (
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400 whitespace-nowrap">{getDateLabel(msgDate)}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm shadow-sm ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-slate-900 rounded-bl-none ring-1 ring-slate-200"
                  }`}
                >
                  {msg.text && <p className="text-[13px] sm:text-sm break-words">{msg.text}</p>}
                  {msg.attachment && renderAttachment(msg.attachment)}
                  <p
                    className={`mt-1 text-[9px] sm:text-[10px] ${
                      isMe ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {msg.createdAt?.toDate
                      ? format(msg.createdAt.toDate(), "HH:mm")
                      : "..."}
                  </p>
                </div>
                </div>
              </div>
            );
          })}
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-3 bg-white text-slate-900 rounded-bl-none ring-1 ring-slate-200 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="border-t bg-white px-3 sm:px-6 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500">
              {uploadProgress}%
            </span>
          </div>
        </div>
      )}

      {/* File preview */}
      {previewFile && (
        <div className="border-t bg-gray-50 px-3 sm:px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200">
              {previewFile.type === "image" ? (
                <Image
                  src={previewFile.url}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-800">
                  <PlayIcon className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-sm font-medium text-gray-700">
                {previewFile.file.name}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                {(previewFile.file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <button
              onClick={cancelPreview}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Input + attach */}
      <div className="border-t bg-white px-3 py-2.5 sm:px-6 sm:py-4">
        <form onSubmit={handleSend} className="flex items-end gap-1.5 sm:gap-2">
          {/* Attachment button */}
          <div className="relative" ref={attachMenuRef}>
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="rounded-full p-2 sm:p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200"
              disabled={uploading || sending}
              aria-label="Atașează fișier"
              aria-expanded={showAttachMenu}
              aria-haspopup="true"
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-44 sm:w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/10 z-20">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  <PhotoIcon className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Foto din galerie</span>
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  <VideoCameraIcon className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Video din galerie</span>
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  <CameraIcon className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">Fotografiază</span>
                </button>
              </div>
            )}
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept={ACCEPTED_VIDEO_TYPES}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              emitTyping();
            }}
            placeholder="Scrie un mesaj..."
            aria-label="Scrie un mesaj"
            className="min-w-0 flex-1 rounded-full border border-slate-300 bg-slate-50 px-3.5 py-2 sm:px-4 sm:py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            disabled={uploading || sending}
          />

          {/* Send */}
          <button
            type="submit"
            disabled={(!newMessage.trim() && !previewFile) || sending || uploading}
            className="shrink-0 rounded-full bg-emerald-600 p-2 sm:p-2.5 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition"
            aria-label="Trimite mesaj"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Image lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <a
            href={lightboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 z-10"
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
          </a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

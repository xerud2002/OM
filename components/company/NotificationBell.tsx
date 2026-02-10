import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon as Bell,
  XMarkIcon as X,
  CheckIcon as Check,
} from "@heroicons/react/24/outline";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { logger } from "@/utils/logger";

type Notification = {
  id: string;
  type: string;
  requestId: string;
  message: string;
  title: string;
  read: boolean;
  createdAt: any;
};

type NotificationBellProps = {
  companyId: string;
};

export default function NotificationBell({ companyId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "companies", companyId, "notifications"),
        orderBy("createdAt", "desc"),
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Notification[];
          setNotifications(data);
          setLoading(false);
        },
        (error) => {
          // Collection might not exist yet or index missing, that's OK
          logger.log("Notifications error:", error.message);
          setNotifications([]);
          setLoading(false);
        },
      );

      return () => unsub();
    } catch (error) {
      logger.log("Notifications setup error:", error);
      setLoading(false);
    }
  }, [companyId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(
        db,
        "companies",
        companyId,
        "notifications",
        notificationId,
      );
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      logger.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter((n) => !n.read)
        .map((n) => {
          const notifRef = doc(
            db,
            "companies",
            companyId,
            "notifications",
            n.id,
          );
          return updateDoc(notifRef, { read: true });
        });
      await Promise.all(promises);
    } catch (error) {
      logger.error("Error marking all as read:", error);
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "acum";
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}z`;
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Notifications Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-blue-50 to-white px-4 py-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Notificări</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500">
                      {unreadCount} necitite
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      Marchează toate
                    </button>
                  )}
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="rounded-lg p-1 transition-colors hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-500">Nicio notificare</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`group relative px-4 py-3 transition-colors hover:bg-gray-50 ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {notification.title || "Notificare nouă"}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {notification.message ||
                                "Ai o notificare nouă. Verifică detaliile."}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-gray-400">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-blue-100"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Marchează ca citit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, User, MessageSquare, FileText, CheckCircle, Image } from "lucide-react";
import { db } from "@/services/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Notification } from "@/types";

type GroupedNotification = {
  customerId: string;
  customerName: string;
  requestId: string;
  requestCode?: string;
  notifications: Notification[];
  unreadCount: number;
  latestTimestamp: any;
  summary: {
    messages: number;
    offers: number;
    accepted: number;
    media: number;
  };
};

type NotificationBellProps = {
  companyId: string;
};

export default function NotificationBell({ companyId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, "companies", companyId, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(data);
      setLoading(false);
    });

    return () => unsub();
  }, [companyId]);

  // Group notifications by customer
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: GroupedNotification } = {};

    notifications.forEach((notif) => {
      const key = `${notif.customerId}_${notif.requestId}`;
      
      if (!groups[key]) {
        groups[key] = {
          customerId: notif.customerId || "unknown",
          customerName: notif.customerName || "Client necunoscut",
          requestId: notif.requestId,
          requestCode: notif.requestCode,
          notifications: [],
          unreadCount: 0,
          latestTimestamp: notif.createdAt,
          summary: {
            messages: 0,
            offers: 0,
            accepted: 0,
            media: 0,
          },
        };
      }

      groups[key].notifications.push(notif);
      
      if (!notif.read) {
        groups[key].unreadCount++;
      }

      // Count by type
      if (notif.type === "new_message") groups[key].summary.messages++;
      if (notif.type === "new_offer") groups[key].summary.offers++;
      if (notif.type === "offer_accepted") groups[key].summary.accepted++;
      if (notif.type === "media_uploaded") groups[key].summary.media++;

      // Keep latest timestamp
      if (notif.createdAt?.toMillis() > groups[key].latestTimestamp?.toMillis()) {
        groups[key].latestTimestamp = notif.createdAt;
      }
    });

    // Sort by latest activity
    return Object.values(groups).sort(
      (a, b) => b.latestTimestamp?.toMillis() - a.latestTimestamp?.toMillis()
    );
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(db, "companies", companyId, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markGroupAsRead = async (group: GroupedNotification) => {
    try {
      const promises = group.notifications
        .filter((n) => !n.read)
        .map((n) => {
          const notifRef = doc(db, "companies", companyId, "notifications", n.id);
          return updateDoc(notifRef, { read: true });
        });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error marking group as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter((n) => !n.read)
        .map((n) => {
          const notifRef = doc(db, "companies", companyId, "notifications", n.id);
          return updateDoc(notifRef, { read: true });
        });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error marking all as read:", error);
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

  const getGroupSummaryText = (group: GroupedNotification) => {
    const parts = [];
    
    if (group.summary.messages > 0) {
      parts.push(`${group.summary.messages} mesaj${group.summary.messages > 1 ? "e" : ""}`);
    }
    if (group.summary.offers > 0) {
      parts.push(`${group.summary.offers} ofert${group.summary.offers > 1 ? "e" : "ă"}`);
    }
    if (group.summary.accepted > 0) {
      parts.push(`${group.summary.accepted} acceptat${group.summary.accepted > 1 ? "e" : "ă"}`);
    }
    if (group.summary.media > 0) {
      parts.push(`${group.summary.media} media`);
    }

    return parts.join(" • ");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_message":
        return <MessageSquare size={16} className="text-sky-600" />;
      case "new_offer":
        return <FileText size={16} className="text-purple-600" />;
      case "offer_accepted":
        return <CheckCircle size={16} className="text-emerald-600" />;
      case "media_uploaded":
        return <Image size={16} className="text-amber-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
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
              className="absolute right-0 top-full z-50 mt-2 w-[420px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl md:w-[480px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-3 py-3 md:px-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 md:text-lg">Notificări</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500">{unreadCount} necitite</p>
                  )}
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
                    >
                      <span className="hidden sm:inline">Marchează toate</span>
                      <span className="sm:hidden">
                        <Check size={16} />
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="rounded-lg p-1 transition-colors hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[60vh] overflow-y-auto md:max-h-[500px]">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  </div>
                ) : groupedNotifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={48} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">Nicio notificare</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {groupedNotifications.map((group) => (
                      <div
                        key={`${group.customerId}_${group.requestId}`}
                        className={`group relative px-3 py-3 transition-colors hover:bg-gray-50 md:px-4 ${
                          group.unreadCount > 0 ? "bg-emerald-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-md md:h-12 md:w-12">
                              <User size={20} className="md:h-6 md:w-6" />
                            </div>
                            {group.unreadCount > 0 && (
                              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
                                {group.unreadCount > 9 ? "9+" : group.unreadCount}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            {/* Header with customer name and request code */}
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 md:text-base">
                                  {group.customerName}
                                </h4>
                                {group.requestCode && (
                                  <p className="text-xs text-gray-500">{group.requestCode}</p>
                                )}
                              </div>
                              <p className="shrink-0 text-xs text-gray-400">
                                {getTimeAgo(group.latestTimestamp)}
                              </p>
                            </div>

                            {/* Summary of notifications */}
                            <div className="mb-2 flex flex-wrap items-center gap-1.5">
                              {group.summary.messages > 0 && (
                                <div className="flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                                  <MessageSquare size={12} />
                                  <span>{group.summary.messages}</span>
                                </div>
                              )}
                              {group.summary.offers > 0 && (
                                <div className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                                  <FileText size={12} />
                                  <span>{group.summary.offers}</span>
                                </div>
                              )}
                              {group.summary.accepted > 0 && (
                                <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                  <CheckCircle size={12} />
                                  <span>{group.summary.accepted}</span>
                                </div>
                              )}
                              {group.summary.media > 0 && (
                                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                  <Image size={12} />
                                  <span>{group.summary.media}</span>
                                </div>
                              )}
                            </div>

                            {/* Summary text */}
                            <p className="mb-2 text-xs text-gray-600 md:text-sm">
                              {getGroupSummaryText(group)}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  window.location.href = `/company/requests?id=${group.requestId}`;
                                }}
                                className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                              >
                                Vezi cererea
                              </button>
                              {group.unreadCount > 0 && (
                                <button
                                  onClick={() => markGroupAsRead(group)}
                                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
                                >
                                  <Check size={14} />
                                  <span className="hidden sm:inline">Citit</span>
                                </button>
                              )}
                            </div>

                            {/* Individual notifications (expandable) */}
                            <div className="mt-2">
                              <button
                                onClick={() => toggleGroupExpansion(`${group.customerId}_${group.requestId}`)}
                                className="flex w-full cursor-pointer items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
                              >
                                <span className="text-base">
                                  {expandedGroups.has(`${group.customerId}_${group.requestId}`) ? "▼" : "▶"}
                                </span>
                                Vezi toate ({group.notifications.length})
                              </button>
                              
                              {expandedGroups.has(`${group.customerId}_${group.requestId}`) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-2 space-y-1 border-l-2 border-gray-200 pl-3"
                                >
                                  {group.notifications.map((notif) => (
                                    <div
                                      key={notif.id}
                                      className="flex items-start gap-2 rounded-md p-2 text-xs hover:bg-gray-50"
                                    >
                                      {getNotificationIcon(notif.type)}
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-700">{notif.title}</p>
                                        <p className="text-gray-500">{notif.message}</p>
                                      </div>
                                      {!notif.read && (
                                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                      )}
                                    </div>
                                  ))}
                                </motion.div>
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

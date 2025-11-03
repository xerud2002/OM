"use client";

import { useEffect, useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import { db } from "@/services/firebase";
import { collection, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { createRequest as createRequestHelper } from "@/utils/firestoreHelpers";
import { PlusSquare, List, Inbox, Archive as ArchiveIcon } from "lucide-react";
import { formatDateRO, formatMoveDateDisplay } from "@/utils/date";
import { sendEmail } from "@/utils/emailHelpers";
import OfferComparison from "@/components/customer/OfferComparison";
import RequestForm from "@/components/customer/RequestForm";
import MyRequestCard from "@/components/customer/MyRequestCard";
import { MessageSquare } from "lucide-react";
import { auth } from "@/services/firebase";
import { toast } from "sonner";
import { updateRequestStatus, archiveRequest, unarchiveRequest } from "@/utils/firestoreHelpers";

type Request = {
  id: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
  details?: string;
  fromCounty?: string;
  toCounty?: string;
  rooms?: number | string;
  volumeM3?: number;
  phone?: string;
  budgetEstimate?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  specialItems?: string;
  customerName?: string | null;
  customerEmail?: string | null;
  archived?: boolean;
};

type Offer = {
  id: string;
  companyName?: string;
  price?: number;
  message?: string;
  status?: "pending" | "accepted" | "declined";
};

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]); // active (non-archived)
  const [archivedRequests, setArchivedRequests] = useState<Request[]>([]);
  const [offersByRequest, setOffersByRequest] = useState<Record<string, Offer[]>>({});

  const [form, setForm] = useState<any>(() => {
    // Try to restore form from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customerDashboardForm");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // mediaFiles can't be serialized, so always reset to empty array
          return { ...parsed, mediaFiles: [] };
        } catch (err) {
          console.warn("Failed to parse saved form", err);
        }
      }
    }
    // Default form state
    return {
      fromCity: "",
      fromCounty: "",
      toCity: "",
      toCounty: "",
      moveDate: "",
      moveDateMode: "exact",
      moveDateStart: "",
      moveDateEnd: "",
      moveDateFlexDays: 3,
      details: "",
      fromType: "house",
      toType: "house",
      fromFloor: "",
      toFloor: "",
      fromElevator: false,
      toElevator: false,
      fromRooms: "",
      toRooms: "",
      rooms: "", // legacy aggregation for UI
      volumeM3: "",
      phone: "",
      contactName: "",
      contactFirstName: "",
      contactLastName: "",
      needPacking: false,
      hasElevator: false,
      budgetEstimate: 0,
      specialItems: "",
      serviceMoving: false,
      servicePacking: false,
      serviceDisassembly: false,
      serviceCleanout: false,
      serviceStorage: false,
      surveyType: "quick-estimate",
      mediaUpload: "later",
      mediaFiles: [],
    };
  });

  const [activeTab, setActiveTab] = useState<"new" | "requests" | "offers" | "archive">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customerActiveTab");
      if (saved === "new" || saved === "requests" || saved === "offers" || saved === "archive")
        return saved as any;
    }
    return "new";
  });
  // Two-column layout: we render selected content on the right; no modal needed
  const [loading, setLoading] = useState<boolean>(true);

  const totalOffers = useMemo(() => {
    const allOffers = Object.values(offersByRequest).flat();
    // Filter out any invalid/empty offers
    const validOffers = allOffers.filter((offer) => offer && offer.id && offer.companyName);
    return validOffers.length;
  }, [offersByRequest]);
  // Aggregated no longer needed for UI; keep if future export requires it
  // const aggregatedOffers = useMemo(() => Object.values(offersByRequest).flat(), [offersByRequest]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Choose a default selected request for the Oferte tab (the first with offers, else first request)
  useEffect(() => {
    if (requests.length === 0) {
      setSelectedRequestId(null);
      return;
    }
    // prefer a request that has offers
    const withOffers = requests.find((r) => (offersByRequest[r.id] || []).length > 0)?.id;
    setSelectedRequestId((prev) => prev || withOffers || requests[0].id);
  }, [requests, offersByRequest]);

  // Handlers to accept/decline from aggregated view
  const acceptFromAggregated = async (requestId: string, offerId: string) => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId }),
      });
      if (!resp.ok) {
        // Fallback in dev when Admin isn't configured: perform client-side updates
        if (resp.status === 503) {
          const { writeBatch, doc } = await import("firebase/firestore");
          const batch = writeBatch(db);
          // Accept selected offer
          batch.update(doc(db, "requests", requestId, "offers", offerId), { status: "accepted" });
          // Decline the rest (based on local state we already hold)
          const others = (offersByRequest[requestId] || []).filter((o) => o.id !== offerId);
          for (const o of others) {
            batch.update(doc(db, "requests", requestId, "offers", o.id), { status: "declined" });
          }
          // Mark request as accepted
          batch.update(doc(db, "requests", requestId), { status: "accepted" });
          await batch.commit();
        } else {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }
      }
      toast.success("Oferta a fost acceptată!");
    } catch (err) {
      console.error("Failed to accept offer", err);
      toast.error("Eroare la acceptarea ofertei");
    }
  };

  const declineFromAggregated = async (requestId: string, offerId: string) => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId }),
      });
      if (!resp.ok) {
        if (resp.status === 503) {
          const { doc, updateDoc } = await import("firebase/firestore");
          await updateDoc(doc(db, "requests", requestId, "offers", offerId), {
            status: "declined",
          });
        } else {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }
      }
      toast.success("Oferta a fost refuzată");
    } catch (err) {
      console.error("Failed to decline offer", err);
      toast.error("Eroare la refuzarea ofertei");
    }
  };

  // Sort requests by creation date (newest first)
  const sortedRequests = useMemo(() => {
    const list = [...requests];
    const getCreated = (r: any) =>
      r.createdAt?.toMillis ? r.createdAt.toMillis() : r.createdAt || 0;
    return list.sort((a: any, b: any) => getCreated(b) - getCreated(a));
  }, [requests]);

  useEffect(() => {
    const unsubAuth = onAuthChange((u: any) => {
      setUser(u);
      if (!u) {
        // Clear all data when user logs out
        setRequests([]);
        setArchivedRequests([]);
        setOffersByRequest({});
        return;
      }
      const q = query(
        collection(db, "requests"),
        where("customerId", "==", u.uid),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        const activeDocs = docs.filter((doc: any) => !doc.archived);
        const archivedDocs = docs.filter((doc: any) => !!doc.archived);
        setRequests(activeDocs);
        setArchivedRequests(archivedDocs);
        setLoading(false);
      });
      return () => unsub();
    });
    return () => unsubAuth();
  }, []);

  // Real-time offers listener for all user requests
  useEffect(() => {
    if (requests.length === 0) {
      // Clear offers when no requests
      setOffersByRequest({});
      return;
    }

    const unsubscribers: Array<() => void> = [];

    requests.forEach((r) => {
      const offersQuery = query(
        collection(db, "requests", r.id, "offers"),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(
        offersQuery,
        (snap) => {
          const offersList = snap.docs.map((d) => ({
            id: d.id,
            requestId: r.id,
            ...(d.data() as any),
          }));
          setOffersByRequest((prev) => ({ ...prev, [r.id]: offersList }));
        },
        (error) => {
          console.warn(`Error listening to offers for request ${r.id}:`, error);
          // Set empty array for this request if there's an error
          setOffersByRequest((prev) => ({ ...prev, [r.id]: [] }));
        }
      );
      unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [requests]);

  // Persist activeTab across sessions
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("customerActiveTab", activeTab);
    }
  }, [activeTab]);

  // Persist form state to localStorage on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Exclude mediaFiles (not serializable) from localStorage
        const formToSave = { ...form };
        delete formToSave.mediaFiles;
        localStorage.setItem("customerDashboardForm", JSON.stringify(formToSave));
      } catch (err) {
        console.warn("Failed to save form to localStorage", err);
      }
    }
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { toast } = await import("sonner");

    try {
      // Client-side validation for mandatory fields
      const errors: string[] = [];

      const hasAtLeastOneService =
        !!form.serviceMoving ||
        !!form.servicePacking ||
        !!form.serviceDisassembly ||
        !!form.serviceCleanout ||
        !!form.serviceStorage;

      const digitsOnly = (v: any) =>
        typeof v === "number" ? Number.isInteger(v) : /^\d+$/.test((v || "").toString());

      // Property details (both ends)
      if (!form.fromType) errors.push("Tip proprietate (plecare)");
      if (!form.toType) errors.push("Tip proprietate (destinație)");
      if (!form.fromRooms || !digitsOnly(form.fromRooms))
        errors.push("Număr camere (plecare – doar cifre)");
      if (!form.toRooms || !digitsOnly(form.toRooms))
        errors.push("Număr camere (destinație – doar cifre)");

      // Address essentials
      if (!form.fromCounty) errors.push("Județ (plecare)");
      if (!form.fromCity) errors.push("Localitate (plecare)");
      if (!form.toCounty) errors.push("Județ (destinație)");
      if (!form.toCity) errors.push("Localitate (destinație)");

      // Contact
      if (!(form as any).contactFirstName?.trim()) errors.push("Prenume");
      if (!(form as any).contactLastName?.trim()) errors.push("Nume");
      if (!form.phone?.trim()) errors.push("Număr de telefon");

      // Services at least one
      if (!hasAtLeastOneService) errors.push("Alege cel puțin un serviciu");

      // Survey type chosen (defensive)
      if (!form.surveyType) errors.push("Survey / estimare");

      if (errors.length) {
        toast.error(`Te rugăm să completezi corect câmpurile obligatorii: ${errors.join(", ")}`);
        return;
      }

      // Compute legacy rooms for cards (prefer destination, then pickup)
      const aggregatedRooms = (form.toRooms ?? form.fromRooms ?? form.rooms) || "";

      // Create request in Firestore
      const requestId = await createRequestHelper({
        ...form,
        rooms: aggregatedRooms,
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerEmail: user.email,
        createdAt: serverTimestamp(),
      } as any);

      // If user chose "now" for media upload, upload files immediately
      if (form.mediaUpload === "now" && form.mediaFiles && form.mediaFiles.length > 0) {
        try {
          console.warn(
            `Auth UID: ${user.uid}, uploading ${form.mediaFiles.length} file(s) via API route`
          );

          const { uploadFileViaAPI } = await import("@/utils/storageUpload");
          const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");

          const uploadedUrls: string[] = [];

          for (let i = 0; i < form.mediaFiles.length; i++) {
            const file = form.mediaFiles[i];

            console.warn(`Uploading ${file.name} (${i + 1}/${form.mediaFiles.length})`);
            // Upload via Next.js API route (server-side, no CORS issues)
            const downloadURL = await uploadFileViaAPI(file, requestId, user.uid);
            uploadedUrls.push(downloadURL);
            console.warn(`Upload success: ${downloadURL}`);
          }

          // Update request document with media URLs
          const requestRef = doc(db, "requests", requestId);
          await updateDoc(requestRef, {
            mediaUrls: arrayUnion(...uploadedUrls),
          });

          toast.success(`Cererea și ${uploadedUrls.length} fișier(e) au fost încărcate cu succes!`);
        } catch (uploadError) {
          console.error("Media upload error:", uploadError);
          console.error("Upload error details:", {
            code: (uploadError as any)?.code,
            message: (uploadError as any)?.message,
            serverResponse: (uploadError as any)?.serverResponse,
          });
          toast.warning("Cererea a fost creată, dar fișierele nu au putut fi încărcate.");
        }
      }
      // If user chose "later" for media upload, generate upload link and send email
      else if (form.mediaUpload === "later") {
        try {
          const resp = await fetch("/api/generateUploadLink", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId,
              customerEmail: user.email,
              customerName: user.displayName || user.email,
            }),
          });
          const result = await resp.json();

          if (result.ok && result.uploadLink) {
            // Helpful UX: copy link to clipboard so user can access it immediately
            try {
              if (typeof window !== "undefined" && navigator?.clipboard) {
                await navigator.clipboard.writeText(result.uploadLink);
                toast.info("Link-ul pentru upload a fost copiat în clipboard.");
              }
            } catch (copyErr) {
              console.warn("Could not copy upload link to clipboard", copyErr);
            }

            const emailParams = {
              to_email: result.customerEmail,
              to_name: result.customerName || "Client",
              upload_link: result.uploadLink,
            };
            try {
              await sendEmail(emailParams);
              toast.success(
                "Cererea a fost trimisă! Vei primi un email cu link pentru upload poze."
              );
            } catch (emailError) {
              console.error("Email send error:", emailError);
              toast.warning(
                "Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis. Link-ul este în clipboard."
              );
            }
          } else {
            toast.warning("Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis.");
          }
        } catch (err) {
          console.warn("Failed to generate upload link", err);
          toast.warning("Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis.");
        }
      } else {
        toast.success("Cererea a fost trimisă cu succes!");
      }

      // Clear form after successful submission
      const emptyForm = {
        fromCity: "",
        fromCounty: "",
        toCity: "",
        toCounty: "",
        moveDate: "",
        moveDateMode: "exact",
        moveDateStart: "",
        moveDateEnd: "",
        moveDateFlexDays: 3,
        details: "",
        fromType: "house",
        toType: "house",
        fromFloor: "",
        toFloor: "",
        fromElevator: false,
        toElevator: false,
        fromRooms: "",
        toRooms: "",
        rooms: "",
        volumeM3: "",
        phone: "",
        contactName: "",
        contactFirstName: "",
        contactLastName: "",
        needPacking: false,
        hasElevator: false,
        budgetEstimate: 0,
        specialItems: "",
        serviceMoving: false,
        servicePacking: false,
        serviceDisassembly: false,
        serviceCleanout: false,
        serviceStorage: false,
        surveyType: "quick-estimate",
        mediaUpload: "later",
        mediaFiles: [],
      };
      setForm(emptyForm);
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("customerDashboardForm");
      }
      setActiveTab("requests");
    } catch (err) {
      console.error("Failed to submit request", err);
      toast.error("Eroare la trimiterea cererii. Te rugăm să încerci din nou.");
    }
  };

  const resetForm = () => {
    const emptyForm = {
      fromCity: "",
      fromCounty: "",
      toCity: "",
      toCounty: "",
      moveDate: "",
      moveDateMode: "exact",
      moveDateStart: "",
      moveDateEnd: "",
      moveDateFlexDays: 3,
      details: "",
      fromType: "house",
      toType: "house",
      fromFloor: "",
      toFloor: "",
      fromElevator: false,
      toElevator: false,
      fromRooms: "",
      toRooms: "",
      rooms: "",
      volumeM3: "",
      phone: "",
      contactName: "",
      contactFirstName: "",
      contactLastName: "",
      needPacking: false,
      hasElevator: false,
      budgetEstimate: 0,
      specialItems: "",
      serviceMoving: false,
      servicePacking: false,
      serviceDisassembly: false,
      serviceCleanout: false,
      serviceStorage: false,
      surveyType: "quick-estimate",
      mediaUpload: "later",
      mediaFiles: [],
    };
    setForm(emptyForm);
    // Also clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("customerDashboardForm");
    }
  };

  return (
    <RequireRole allowedRole="customer">
      <LayoutWrapper>
        <section className="mx-auto max-w-[1400px] px-0 py-8 sm:px-4">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bună, {user?.displayName || "Client"}!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestionează cererile tale de mutare și ofertele primite
                </p>
              </div>
              <button
                onClick={() => setActiveTab("new")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
              >
                <PlusSquare size={20} />
                Cerere nouă
              </button>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Cereri active</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{requests.length}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-100 p-3">
                    <List size={24} className="text-emerald-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-emerald-100 opacity-20" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-sky-600">Oferte primite</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{totalOffers}</p>
                  </div>
                  <div className="rounded-xl bg-sky-100 p-3">
                    <Inbox size={24} className="text-sky-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-sky-100 opacity-20" />
              </motion.div>

              {/* Removed "Medie oferte" card as requested */}
            </div>
          </div>

          {/* Navigation Tabs (order: Cerere Nouă, Oferte, Cererile mele) */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
            {/* Cerere Nouă */}
            <button
              onClick={() => setActiveTab("new")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "new" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <PlusSquare size={18} />
                <span>Cerere Nouă</span>
              </div>
              {activeTab === "new" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>

            {/* Oferte */}
            <button
              onClick={() => setActiveTab("offers")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "offers" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox size={18} />
                <span>Oferte</span>
                {/* Only show badge if there are actual offers */}
                {totalOffers > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    {totalOffers}
                  </span>
                )}
              </div>
              {activeTab === "offers" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>

            {/* Cererile mele */}
            <button
              onClick={() => setActiveTab("requests")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "requests" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <List size={18} />
                <span>Cererile mele</span>
              </div>
              {activeTab === "requests" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>

            {/* Arhivă */}
            <button
              onClick={() => setActiveTab("archive")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "archive" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <ArchiveIcon size={18} />
                <span>Arhivă</span>
              </div>
              {activeTab === "archive" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>
          </div>

          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-visible rounded-none border-x-0 border-b border-t border-gray-100 bg-white p-0 shadow-lg sm:rounded-2xl sm:border sm:p-6 md:p-8"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-4 text-sm text-gray-500">Se încarcă cererile...</p>
                  </div>
                </div>
              ) : sortedRequests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
                >
                  <div className="rounded-full bg-emerald-100 p-4">
                    <List size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Nicio cerere încă</h3>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Creează prima ta cerere de mutare și primește oferte de la firme verificate
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <PlusSquare size={20} />
                    Creează prima cerere
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {sortedRequests.map((r, index) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MyRequestCard
                        request={r as any}
                        offersCount={(offersByRequest[r.id] || []).length}
                        onStatusChange={async (requestId, newStatus) => {
                          try {
                            await updateRequestStatus(requestId, newStatus);
                            toast.success(
                              newStatus === "closed"
                                ? "Cererea a fost marcată ca închisă"
                                : newStatus === "paused"
                                  ? "Cererea a fost pusă în așteptare"
                                  : "Cererea a fost reactivată"
                            );
                          } catch (error) {
                            console.error("Error updating status:", error);
                            toast.error("Nu s-a putut actualiza statusul cererii");
                          }
                        }}
                        onArchive={async (requestId) => {
                          try {
                            await archiveRequest(requestId);
                            toast.success("Cererea a fost arhivată");
                          } catch (error) {
                            console.error("Error archiving request:", error);
                            toast.error("Nu s-a putut arhiva cererea");
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "new" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-none border-x-0 border-b border-t border-gray-100 bg-white p-0 shadow-lg sm:rounded-2xl sm:border sm:p-6 md:p-8"
            >
              <RequestForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onReset={resetForm}
              />
            </motion.div>
          )}

          {activeTab === "offers" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-0 shadow-sm">
              {requests.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-3 w-fit rounded-full bg-sky-100 p-4">
                    <Inbox size={32} className="text-sky-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Nu ai încă cereri</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Creează o cerere pentru a primi oferte.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-[300px,1fr]">
                  {/* Sidebar: requests list */}
                  <aside className="border-b border-gray-100 sm:border-b-0 sm:border-r">
                    <div className="sticky top-[80px] max-h-[calc(100vh-120px)] overflow-auto p-4">
                      <h3 className="mb-3 text-sm font-semibold text-gray-800">Cererile mele</h3>
                      <div className="space-y-2">
                        {requests.map((r) => {
                          const cnt = (offersByRequest[r.id] || []).length;
                          const active = selectedRequestId === r.id;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setSelectedRequestId(r.id)}
                              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                                active
                                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-gray-900">
                                    {r.fromCity || r.fromCounty} → {r.toCity || r.toCounty}
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {(() => {
                                      const d = formatMoveDateDisplay(r as any, { month: "short" });
                                      return d && d !== "-" ? d : "fără dată";
                                    })()}
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                  {cnt}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>

                  {/* Main: offers for selected request */}
                  <main className="p-4 sm:p-6">
                    {!selectedRequestId ? (
                      <div className="py-10 text-center text-sm text-gray-500">
                        Selectează o cerere din stânga pentru a vedea ofertele.
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Oferte primite</h3>
                            <p className="text-sm text-gray-500">
                              Relevante pentru cererea selectată
                            </p>
                          </div>
                        </div>

                        {!(offersByRequest[selectedRequestId] || []).length ? (
                          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                            <div className="rounded-full bg-sky-100 p-4">
                              <Inbox size={32} className="text-sky-600" />
                            </div>
                            <h4 className="mt-3 text-base font-semibold text-gray-900">
                              Nicio ofertă încă
                            </h4>
                            <p className="mt-1 max-w-sm text-sm text-gray-500">
                              Firmele vor trimite oferte aici după ce procesează cererea ta.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(offersByRequest[selectedRequestId] || []).map(
                              (o: any, index: number) => (
                                <OfferRow
                                  key={o.id}
                                  index={index}
                                  requestId={selectedRequestId}
                                  offer={o}
                                  onAccept={acceptFromAggregated}
                                  onDecline={declineFromAggregated}
                                />
                              )
                            )}
                          </div>
                        )}

                        {/* Comparison for selected request only */}
                        {(offersByRequest[selectedRequestId] || []).length > 1 && (
                          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                              Compară oferte
                            </h3>
                            <OfferComparison
                              offers={(offersByRequest[selectedRequestId] as any[]).map((o) => ({
                                id: o.id,
                                requestId: selectedRequestId,
                                companyName: (o as any).companyName,
                                price: (o as any).price,
                                message: (o as any).message,
                                status: (o as any).status,
                                createdAt: (o as any).createdAt,
                                favorite: false,
                              }))}
                              onAccept={acceptFromAggregated}
                              onDecline={declineFromAggregated}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </main>
                </div>
              )}
            </div>
          )}

          {activeTab === "archive" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-visible rounded-none border-x-0 border-b border-t border-gray-100 bg-white p-0 shadow-lg sm:rounded-2xl sm:border sm:p-6 md:p-8"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-4 text-sm text-gray-500">Se încarcă arhiva...</p>
                  </div>
                </div>
              ) : archivedRequests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
                >
                  <div className="rounded-full bg-gray-100 p-4">
                    <ArchiveIcon size={32} className="text-gray-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Arhivă goală</h3>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Cererile arhivate vor apărea aici.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {archivedRequests.map((r: any, index: number) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-2"
                    >
                      <MyRequestCard
                        request={r as any}
                        offersCount={0}
                        readOnly
                        onStatusChange={() => {}}
                        onArchive={() => {}}
                      />
                      <div className="flex justify-end px-6 pb-2">
                        <button
                          onClick={async () => {
                            try {
                              await unarchiveRequest(r.id);
                              toast.success("Cererea a fost reactivată");
                            } catch (error) {
                              console.error("Error unarchiving request:", error);
                              toast.error("Nu s-a putut reactiva cererea");
                            }
                          }}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                        >
                          Reactivează
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}

function OfferRow({
  index,
  requestId,
  offer,
  onAccept,
  onDecline,
}: {
  index: number;
  requestId: string;
  offer: any;
  // eslint-disable-next-line no-unused-vars
  onAccept: (requestId: string, offerId: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onDecline: (requestId: string, offerId: string) => Promise<void> | void;
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [text, setText] = useState("");

  const sendMessage = async () => {
    const t = text.trim();
    if (!t) {
      toast.error("Scrie un mesaj înainte de a trimite.");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Trebuie să fii autentificat pentru a trimite mesajul.");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/message", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, offerId: offer.id, text: t }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }
      toast.success("Mesaj trimis");
      setText("");
      setShowMessage(false);
    } catch (err) {
      console.error("sendMessage failed", err);
      const msg = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error(`Eroare la trimiterea mesajului: ${msg}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4"
    >
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{offer.companyName}</p>
          {offer.message && <p className="mt-1 text-sm text-gray-600">{offer.message}</p>}
          {offer.createdAt?.toDate && (
            <p className="mt-1 text-xs text-gray-400">
              {formatDateRO(offer.createdAt, { month: "short" })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-emerald-600">{offer.price} lei</p>
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(requestId, offer.id)}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Acceptă
            </button>
            <button
              onClick={() => onDecline(requestId, offer.id)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Refuză
            </button>
            <button
              onClick={() => setShowMessage((s) => !s)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <MessageSquare size={16} /> Mesaj
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Scrie un mesaj către firmă..."
            className="w-full resize-y rounded-md border border-gray-200 p-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setShowMessage(false)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm"
            >
              Anulează
            </button>
            <button
              onClick={sendMessage}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Trimite
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

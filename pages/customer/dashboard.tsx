"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RequireRole from "@/components/auth/RequireRole";
import {
  PlusSquare,
  List,
  Inbox,
  Archive as ArchiveIcon,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { formatDateRO, formatMoveDateDisplay } from "@/utils/date";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { db, auth } from "@/services/firebase";
import { collection, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { sendEmail } from "@/utils/emailHelpers";
import {
  createRequest as createRequestHelper,
  updateRequestStatus,
  archiveRequest,
  unarchiveRequest,
} from "@/utils/firestoreHelpers";
import { trackRequestCreated } from "@/utils/analytics";

// Lazy load heavy components to reduce initial bundle
const RequestForm = dynamic(() => import("@/components/customer/RequestForm"), {
  loading: () => <div className="h-96 animate-pulse rounded-xl bg-gray-100" />,
  ssr: false,
});

const OfferComparison = dynamic(() => import("@/components/customer/OfferComparison"), {
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-gray-100" />,
  ssr: false,
});

const MyRequestCard = dynamic(() => import("@/components/customer/MyRequestCard"), {
  loading: () => <div className="mb-4 h-32 animate-pulse rounded-xl bg-gray-100" />,
  ssr: false,
});

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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]); // active (non-archived)
  const [archivedRequests, setArchivedRequests] = useState<Request[]>([]);
  const [offersByRequest, setOffersByRequest] = useState<Record<string, Offer[]>>({});
  const autoSubmitTriggeredRef = useRef(false);

  const [form, setForm] = useState<any>(() => {
    // Try to restore form from localStorage on mount
    if (typeof window !== "undefined") {
      // First check if there's a home page form (takes priority for auto-submit flow)
      const homeForm = localStorage.getItem("homeRequestForm");
      if (homeForm) {
        try {
          const parsed = JSON.parse(homeForm);
          return { ...parsed, mediaFiles: [] };
        } catch (err) {
          console.warn("Failed to parse home form", err);
        }
      }

      // Otherwise use dashboard form
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
      fromStreet: "",
      fromNumber: "",
      toCity: "",
      toCounty: "",
      toStreet: "",
      toNumber: "",
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
      serviceTransportOnly: false,
      servicePiano: false,
      serviceFewItems: false,
      surveyType: "quick-estimate",
      mediaUpload: "later",
      mediaFiles: [],
      acceptedTerms: false,
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

  // Auto-submit form if coming from home page with pending request
  useEffect(() => {
    const shouldAutoSubmit = router.query.autoSubmit === "true";
    const hasHomeForm = typeof window !== "undefined" && localStorage.getItem("homeRequestForm");

    if (shouldAutoSubmit && hasHomeForm && user && !autoSubmitTriggeredRef.current) {
      autoSubmitTriggeredRef.current = true;

      // Trigger form submission after a short delay to ensure everything is loaded
      const timer = setTimeout(() => {
        // Get submit button and simulate click
        const submitBtn = document.querySelector("[data-auto-submit]");
        if (submitBtn instanceof HTMLButtonElement) {
          submitBtn.click();
        }

        // Clean up home form from localStorage after submission attempt
        localStorage.removeItem("homeRequestForm");

        // Remove autoSubmit from URL without reload
        router.replace("/customer/dashboard", undefined, { shallow: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [router.query.autoSubmit, user, router]);

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

    // Check terms acceptance first
    if (!form.acceptedTerms) {
      toast.error("Trebuie să accepți termenii și condițiile pentru a continua.");
      return;
    }

    try {
      // Client-side validation for mandatory fields
      const errors: string[] = [];

      const hasAtLeastOneService =
        !!form.serviceMoving ||
        !!form.servicePacking ||
        !!form.serviceDisassembly ||
        !!form.serviceCleanout ||
        !!form.serviceStorage ||
        !!(form as any).serviceTransportOnly ||
        !!(form as any).servicePiano ||
        !!(form as any).serviceFewItems;

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
      // Strada/Număr nu mai sunt obligatorii
      if (!form.toCounty) errors.push("Județ (destinație)");
      if (!form.toCity) errors.push("Localitate (destinație)");
      // Strada/Număr nu mai sunt obligatorii

      // Contact - validare se face doar la submit, nu mai afișăm notificare prematură
      // if (!(form as any).contactFirstName?.trim()) errors.push("Prenume");
      // if (!(form as any).contactLastName?.trim()) errors.push("Nume");
      // if (!form.phone?.trim()) errors.push("Număr de telefon");

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

      trackRequestCreated(
        form.fromCity || form.fromCounty || "unknown",
        form.toCity || form.toCounty || "unknown",
        Number(aggregatedRooms) || 0
      );

      // If user chose "now" for media upload, upload files immediately
      if (form.mediaUpload === "now" && form.mediaFiles && form.mediaFiles.length > 0) {
        try {
          console.warn(
            `Auth UID: ${user.uid}, uploading ${form.mediaFiles.length} file(s) via API route`
          );

          const { ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
          const { storage } = await import("@/services/firebase");
          const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");

          const uploadedUrls: string[] = [];

          for (let i = 0; i < form.mediaFiles.length; i++) {
            const file = form.mediaFiles[i];

            console.warn(`Uploading ${file.name} (${i + 1}/${form.mediaFiles.length})`);

            try {
              const fileName = `${Date.now()}_${file.name}`;
              const storagePath = `requests/${requestId}/customers/${user.uid}/${fileName}`;
              const storageRef = ref(storage, storagePath);

              // Upload file
              const uploadTask = uploadBytesResumable(storageRef, file);

              // Wait for upload to complete
              const downloadURL = await new Promise<string>((resolve, reject) => {
                uploadTask.on(
                  "state_changed",
                  null,
                  (error) => reject(error),
                  async () => {
                    try {
                      const url = await getDownloadURL(uploadTask.snapshot.ref);
                      resolve(url);
                    } catch (error) {
                      reject(error);
                    }
                  }
                );
              });

              uploadedUrls.push(downloadURL);
              console.warn(`Upload success: ${downloadURL}`);
            } catch (err) {
              console.error(`Failed to upload ${file.name}:`, err);
              throw err;
            }
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
        fromStreet: "",
        fromNumber: "",
        toCity: "",
        toCounty: "",
        toStreet: "",
        toNumber: "",
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
        serviceTransportOnly: false,
        servicePiano: false,
        serviceFewItems: false,
        surveyType: "quick-estimate",
        mediaUpload: "later",
        mediaFiles: [],
      };
      setForm(emptyForm);
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("customerDashboardForm");
        localStorage.removeItem("homeRequestForm"); // Also clear home page form
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
      fromStreet: "",
      fromNumber: "",
      toCity: "",
      toCounty: "",
      toStreet: "",
      toNumber: "",
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
      serviceTransportOnly: false,
      servicePiano: false,
      serviceFewItems: false,
      surveyType: "quick-estimate",
      mediaUpload: "later",
      mediaFiles: [],
      acceptedTerms: false,
    };
    setForm(emptyForm);
    // Also clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("customerDashboardForm");
    }
  };

  return (
    <RequireRole allowedRole="customer">
      <div className="min-h-screen bg-linear-to-b from-white to-emerald-50">
        {/* Hero background with gradient */}
        <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute top-20 -right-20 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-teal-400/10 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-350 px-4 pt-20 pb-8 sm:px-6 sm:pt-24 lg:pb-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Bună,{" "}
                <span className="bg-linear-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                  {user?.displayName?.split(" ")[0] || "Client"}
                </span>
                ! 👋
              </h1>
            </motion.div>
          </div>
        </div>

        <section className="mx-auto max-w-350 px-4 py-6 sm:px-6 sm:py-10">
          {/* Navigation Tabs - Modern pill style */}
          <div className="mb-6 sm:mb-10">
            <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-gray-900/5 sm:inline-flex">
              {/* Cerere Nouă */}
              <button
                onClick={() => setActiveTab("new")}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 sm:px-6 ${
                  activeTab === "new"
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <PlusSquare size={18} />
                <span className="hidden sm:inline">Cerere Nouă</span>
                <span className="sm:hidden">Nouă</span>
              </button>

              {/* Oferte */}
              <button
                onClick={() => setActiveTab("offers")}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 sm:px-6 ${
                  activeTab === "offers"
                    ? "bg-linear-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Inbox size={18} />
                <span>Oferte</span>
                {totalOffers > 0 && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm ${
                      activeTab === "offers"
                        ? "bg-white/20 text-white ring-1 ring-white/30"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {totalOffers}
                  </span>
                )}
              </button>

              {/* Cererile mele */}
              <button
                onClick={() => setActiveTab("requests")}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 sm:px-6 ${
                  activeTab === "requests"
                    ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <List size={18} />
                <span className="hidden sm:inline">Cererile mele</span>
                <span className="sm:hidden">Cereri</span>
              </button>

              {/* Arhivă */}
              <button
                onClick={() => setActiveTab("archive")}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 sm:px-6 ${
                  activeTab === "archive"
                    ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ArchiveIcon size={18} />
                <span>Arhivă</span>
              </button>
            </div>
          </div>

          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 sm:p-8"
            >
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-5 text-gray-500">Se încarcă cererile...</p>
                  </div>
                </div>
              ) : sortedRequests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-3xl bg-linear-to-br from-emerald-50 via-teal-50 to-sky-50 p-12 text-center sm:p-16"
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/40">
                      <List size={40} className="text-white" />
                    </div>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-gray-900">Nicio cerere încă</h3>
                  <p className="mt-4 max-w-md text-base text-gray-600">
                    Începe acum și primește oferte personalizate de la firme de mutări verificate
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/50"
                  >
                    <PlusSquare size={24} className="transition-transform group-hover:rotate-90" />
                    Creează prima cerere
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
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
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-xl shadow-gray-100/50 sm:p-8"
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
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-100/50">
              {requests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-500 shadow-xl shadow-sky-500/30">
                    <Inbox size={36} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Nu ai încă cereri</h3>
                  <p className="mt-2 text-gray-500">
                    Creează o cerere pentru a primi oferte de la firme verificate.
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <PlusSquare size={18} />
                    Creează prima cerere
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-0 lg:grid-cols-[320px,1fr]">
                  {/* Sidebar: requests list */}
                  <aside className="border-b border-gray-100 bg-linear-to-br from-gray-50 to-white lg:border-r lg:border-b-0">
                    <div className="sticky top-20 max-h-[calc(100vh-120px)] overflow-auto p-5">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <List size={16} className="text-emerald-600" />
                        Selectează o cerere
                      </h3>
                      <div className="space-y-3">
                        {requests.map((r) => {
                          const cnt = (offersByRequest[r.id] || []).length;
                          const active = selectedRequestId === r.id;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setSelectedRequestId(r.id)}
                              className={`w-full rounded-xl border-2 px-4 py-4 text-left transition-all duration-300 ${
                                active
                                  ? "border-emerald-400 bg-linear-to-r from-emerald-50 to-teal-50 shadow-lg shadow-emerald-500/10"
                                  : "border-transparent bg-white shadow-sm hover:border-gray-200 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p
                                    className={`truncate font-bold ${active ? "text-emerald-700" : "text-gray-900"}`}
                                  >
                                    {r.fromCity || r.fromCounty} → {r.toCity || r.toCounty}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {(() => {
                                      const d = formatMoveDateDisplay(r as any, { month: "short" });
                                      return d && d !== "-" ? d : "fără dată";
                                    })()}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 rounded-xl px-3 py-1 text-sm font-bold ${
                                    active
                                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
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
                  <main className="p-5 lg:p-8">
                    {!selectedRequestId ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                          <Inbox size={28} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">
                          Selectează o cerere din stânga pentru a vedea ofertele.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Oferte primite</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Compară și selectează cea mai bună ofertă
                            </p>
                          </div>
                          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2">
                            <span className="text-sm font-medium text-emerald-700">Total:</span>
                            <span className="text-lg font-bold text-emerald-600">
                              {(offersByRequest[selectedRequestId] || []).length}
                            </span>
                          </div>
                        </div>

                        {!(offersByRequest[selectedRequestId] || []).length ? (
                          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-linear-to-br from-gray-50 to-white p-12 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-500 shadow-xl shadow-sky-500/30">
                              <Inbox size={36} className="text-white" />
                            </div>
                            <h4 className="mt-5 text-lg font-bold text-gray-900">
                              Nicio ofertă încă
                            </h4>
                            <p className="mt-2 max-w-sm text-gray-500">
                              Firmele verificate vor trimite oferte aici în curând. Te vom notifica!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
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
                          <div className="mt-8 rounded-2xl border border-gray-100 bg-linear-to-br from-white to-gray-50/50 p-6 shadow-lg">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                                ⚖️
                              </span>
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
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 sm:p-8"
            >
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-5 text-gray-500">Se încarcă arhiva...</p>
                  </div>
                </div>
              ) : archivedRequests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-linear-to-br from-gray-50 to-white p-14 text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-gray-400 to-gray-500 shadow-xl shadow-gray-500/20">
                    <ArchiveIcon size={36} className="text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">Arhivă goală</h3>
                  <p className="mt-3 max-w-md text-gray-500">
                    Cererile finalizate și arhivate vor apărea aici pentru referință.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {archivedRequests.map((r: any, index: number) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-3"
                    >
                      <MyRequestCard
                        request={r as any}
                        offersCount={0}
                        readOnly
                        onStatusChange={() => {}}
                        onArchive={() => {}}
                      />
                      <div className="flex justify-end px-6">
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
                          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-xl"
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
      </div>
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
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-sky-500" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Company info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
              {offer.companyName?.charAt(0)?.toUpperCase() || "F"}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{offer.companyName}</p>
              {offer.createdAt?.toDate && (
                <p className="text-xs text-gray-500">
                  {formatDateRO(offer.createdAt, { month: "short" })}
                </p>
              )}
            </div>
          </div>
          {offer.message && (
            <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{offer.message}</p>
          )}
        </div>

        {/* Price and actions */}
        <div className="flex flex-col items-end gap-3 sm:ml-6">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Preț ofertat</p>
            <p className="text-3xl font-bold text-emerald-600">
              {offer.price} <span className="text-lg">lei</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAccept(requestId, offer.id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CheckCircle2 size={16} />
              Acceptă
            </button>
            <button
              onClick={() => onDecline(requestId, offer.id)}
              className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Refuză
            </button>
            <button
              onClick={() => setShowMessage((s) => !s)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
            >
              <MessageSquare size={16} />
              Mesaj
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Scrie un mesaj către firmă..."
            className="w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm transition-all outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowMessage(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Anulează
            </button>
            <button
              onClick={sendMessage}
              className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl"
            >
              Trimite
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

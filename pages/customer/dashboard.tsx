"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { logger } from "@/utils/logger";
import RequireRole from "@/components/auth/RequireRole";
import {
  PlusCircleIcon as PlusSquare,
  ListBulletIcon as List,
  InboxIcon as Inbox,
  CheckCircleIcon as CheckCircle2,
  ChatBubbleBottomCenterTextIcon as MessageSquare,
} from "@heroicons/react/24/outline";
import { MovingRequest, Offer } from "@/types";
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

const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
  ssr: false,
});

const RequestFullDetails = dynamic(() => import("@/components/customer/RequestFullDetails"), {
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-gray-50" />,
  ssr: false,
});



export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<MovingRequest[]>([]); // active (non-archived)
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
          logger.warn("Failed to parse home form", err);
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
          logger.warn("Failed to parse saved form", err);
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

  const [activeTab, setActiveTab] = useState<"moves" | "new">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customerActiveTab");
      if (saved === "moves" || saved === "new")
        return saved as any;
    }
    return "moves";
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
  // const aggregatedOffers = useMemo(() => Object.values(offersByRequest).flat(), [offersByRequest]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [chatOffer, setChatOffer] = useState<any>(null);

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
      logger.error("Failed to accept offer", err);
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
      logger.error("Failed to decline offer", err);
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
        setOffersByRequest({});
        return;
      }
      const q = query(
        collection(db, "requests"),
        where("customerId", "==", u.uid),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as MovingRequest[];
        setRequests(docs);
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
          })) as Offer[];
          setOffersByRequest((prev) => ({ ...prev, [r.id]: offersList }));
        },
        (error) => {
          logger.warn(`Error listening to offers for request ${r.id}:`, error);
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
        logger.warn("Failed to save form to localStorage", err);
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
        errors.push("Număr camere (plecare, doar cifre)");
      if (!form.toRooms || !digitsOnly(form.toRooms))
        errors.push("Număr camere (destinație, doar cifre)");

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
          logger.log(
            `Auth UID: ${user.uid}, uploading ${form.mediaFiles.length} file(s) via API route`
          );

          const { ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
          const { storage } = await import("@/services/firebase");
          const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");

          const uploadedUrls: string[] = [];

          for (let i = 0; i < form.mediaFiles.length; i++) {
            const file = form.mediaFiles[i];

            logger.log(`Uploading ${file.name} (${i + 1}/${form.mediaFiles.length})`);

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
              logger.log(`Upload success: ${downloadURL}`);
            } catch (err) {
              logger.error(`Failed to upload ${file.name}:`, err);
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
          logger.error("Media upload error:", uploadError);
          logger.error("Upload error details:", {
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
              logger.warn("Could not copy upload link to clipboard", copyErr);
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
              logger.error("Email send error:", emailError);
              toast.warning(
                "Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis. Link-ul este în clipboard."
              );
            }
          } else {
            toast.warning("Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis.");
          }
        } catch (err) {
          logger.warn("Failed to generate upload link", err);
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
      logger.error("Failed to submit request", err);
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
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        {/* Hero background with gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
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
              <h1 className="text-2xl md:text-4xl font-bold text-white sm:text-5xl">
                Bună,{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                  {user?.displayName?.split(" ")[0] || "Client"}
                </span>
                ! 👋
              </h1>
            </motion.div>
          </div>
        </div>

        <section className="mx-auto max-w-350 px-4 py-6 sm:px-6 sm:py-10">
          {/* Navigation Tabs - Modern Segmented Control */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-2xl bg-white p-1.5 shadow-lg shadow-gray-900/5 ring-1 ring-gray-100">
              {/* Dashboard */}


              {/* My Moves (Unified) */}
              <button
                onClick={() => setActiveTab("moves")}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  activeTab === "moves"
                    ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md shadow-sky-500/20"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${activeTab === 'moves' ? 'bg-white/20' : 'bg-gray-100'}`}>
                   <List className="h-3 w-3" />
                </div>
                <span>Cererile Mele</span>
                {totalOffers > 0 && (
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${activeTab === 'moves' ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'}`}>
                    {totalOffers}
                  </span>
                )}
              </button>

              {/* Create New */}
              <button
                onClick={() => setActiveTab("new")}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  activeTab === "new"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${activeTab === 'new' ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <PlusSquare className="h-3 w-3" />
                </div>
                <span>Cerere Nouă</span>
              </button>
            </div>
          </div>



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

          {activeTab === "moves" && (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-100/50">
              {requests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-xl shadow-sky-500/30">
                    <Inbox className="h-9 w-9 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Nu ai încă cereri</h3>
                  <p className="mt-2 text-gray-500">
                    Creează o cerere pentru a primi oferte de la firme verificate.
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all"
                  >
                    <PlusSquare className="h-4 w-4" />
                    Creează prima cerere
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-0 lg:grid-cols-[320px,1fr]">
                  {/* Sidebar: requests list */}
                  <aside className="border-b border-gray-100 bg-slate-50 lg:border-r lg:border-b-0">
                    <div className="sticky top-20 max-h-[calc(100vh-120px)] overflow-auto p-4">
                      <h3 className="mb-4 flex items-center gap-2 px-1 text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        Lista Cereri
                      </h3>
                      <div className="space-y-2">
                        {requests.map((r) => {
                          const cnt = (offersByRequest[r.id] || []).length;
                          const active = selectedRequestId === r.id;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setSelectedRequestId(r.id)}
                              className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                                active
                                  ? "border-sky-500 bg-white shadow-md shadow-sky-100 ring-1 ring-sky-500"
                                  : "border-transparent hover:bg-white hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p
                                    className={`truncate text-sm font-bold ${active ? "text-gray-900" : "text-gray-700"}`}
                                  >
                                    {r.fromCity || r.fromCounty} <span className="text-gray-400">→</span> {r.toCity || r.toCounty}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {(() => {
                                      const d = formatMoveDateDisplay(r as any, { month: "short" });
                                      return d && d !== "-" ? d : "fără dată";
                                    })()}
                                  </p>
                                </div>
                                {cnt > 0 && (
                                  <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                      active
                                        ? "bg-sky-100 text-sky-700"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {cnt}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>

                  {/* Main content for selected request */}
                  <main className="bg-white p-5 lg:p-8">
                    {!selectedRequestId ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <List className="h-16 w-16 text-gray-300" />
                        <p className="mt-4 text-gray-500">Selectează o cerere din listă</p>
                      </div>
                    ) : (
                      <>
                        {/* Selected Request Header/Card */}
                        {(() => {
                           const r = requests.find(req => req.id === selectedRequestId);
                           if (!r) return null;
                           return (
                             <div className="mb-8 space-y-8">
                                <MyRequestCard
                                  request={r as any}
                                  offersCount={(offersByRequest[r.id] || []).length}
                                  onStatusChange={async (requestId, newStatus) => {
                                    try {
                                      await updateRequestStatus(requestId, newStatus);
                                      const { toast } = await import("sonner");
                                      toast.success("Status actualizat!");
                                    } catch (error) {
                                      logger.error("Error updating status:", error);
                                      const { toast } = await import("sonner");
                                      toast.error("Eroare la actualizare");
                                    }
                                  }}
                                />
                                <RequestFullDetails 
                                  request={r} 
                                  isOwner={user?.uid === r.customerId}
                                />
                             </div>
                           )
                        })()}

                        {/* Offers Section */}
                        <div className="mb-6 flex items-center justify-between border-t border-gray-100 pt-8">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Oferte pentru această cerere</h3>
                          </div>
                          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-1.5 ring-1 ring-gray-100">
                            <span className="text-xs font-semibold text-gray-500">Total:</span>
                            <span className="text-sm font-bold text-gray-900">
                              {(offersByRequest[selectedRequestId] || []).length}
                            </span>
                          </div>
                        </div>

                        {!(offersByRequest[selectedRequestId] || []).length ? (
                          <div className="rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 p-10 text-center">
                             <p className="text-sm font-medium text-gray-500">Încă nu ai primit oferte pentru această cerere.</p>
                             <p className="text-xs text-gray-400 mt-1">Vei fi notificat prin email când apar primele oferte.</p>
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
                                  onChat={(o: any) => setChatOffer(o)}
                                />
                              )
                            )}
                          </div>
                        )}

                        {/* Comparison Table */}
                        {(offersByRequest[selectedRequestId] || []).length > 1 && (
                          <div className="mt-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                               Compară Ofertele
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
                              onChat={(o) => setChatOffer(o)}
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


        </section>

        {chatOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="h-[600px] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <ChatWindow
                requestId={chatOffer.requestId || selectedRequestId}
                offerId={chatOffer.id}
                otherPartyName={chatOffer.companyName}
                currentUserRole="customer"
                onClose={() => setChatOffer(null)}
              />
            </div>
          </div>
        )}
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
  onChat,
}: {
  index: number;
  requestId: string;
  offer: any;
  // eslint-disable-next-line no-unused-vars
  onAccept: (requestId: string, offerId: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onDecline: (requestId: string, offerId: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onChat: (offer: any) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-sky-500" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Company info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              Acceptă
            </button>
            <button
              onClick={() => onDecline(requestId, offer.id)}
              className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Refuză
            </button>
            <button
              onClick={() => onChat(offer)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

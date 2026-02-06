import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotificationBell from "@/components/company/NotificationBell";
import { db } from "@/services/firebase";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { logger } from "@/utils/logger";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  InboxIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import LoadingSpinner, {
  LoadingContainer,
} from "@/components/ui/LoadingSpinner";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";

// Lazy load components
const RequestsView = dynamic(
  () => import("@/components/company/RequestsView"),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
    ),
    ssr: false,
  },
);

const CreditBalance = dynamic(
  () => import("@/components/company/CreditBalance"),
  {
    loading: () => (
      <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
    ),
    ssr: false,
  },
);

const ConfirmModal = dynamic(() => import("@/components/ConfirmModal"), {
  ssr: false,
});

export default function CompanyDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "accepted" | "pending" | "rejected" | "declined"
  >("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "offers">("requests");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [withdrawOffer, setWithdrawOffer] = useState<any>(null);
  const [offerError, setOfferError] = useState<string | null>(null);

  // Detect tab from URL
  useEffect(() => {
    const tab = router.query.tab as string;
    if (tab === "offers" || tab === "requests") {
      setActiveTab(tab);
    }
  }, [router.query.tab]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthChange((user) => setCompany(user));
    return () => unsub();
  }, []);

  // Fetch company name from Firestore
  useEffect(() => {
    if (!company?.uid) return;

    const fetchCompanyName = async () => {
      try {
        const companyDoc = await getDoc(doc(db, "companies", company.uid));
        if (companyDoc.exists()) {
          setCompanyName(companyDoc.data()?.companyName || "");
        }
      } catch (err) {
        logger.error("Error fetching company name:", err);
      }
    };

    fetchCompanyName();
  }, [company?.uid]);

  // Offers listener
  useEffect(() => {
    if (!company?.uid) return;
    setLoading(true);
    setOfferError(null);

    const q = query(
      collectionGroup(db, "offers"),
      where("companyId", "==", company.uid),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          requestId: doc.ref.parent.parent?.id,
          ...doc.data(),
        }));
        console.log(
          "[DEBUG] Offers loaded for company",
          company.uid,
          ":",
          data.length,
          data,
        );
        setOffers(data);
        setOfferError(null);
        setLoading(false);
      },
      (error: any) => {
        console.error("[DEBUG] Error loading offers:", error?.message || error);
        // Check if it's a missing index error
        if (error?.message?.includes("index")) {
          setOfferError("Index Firestore lipsă. Contactați administratorul.");
        } else {
          setOfferError(error?.message || "Eroare la încărcarea ofertelor");
        }
        setOffers([]);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [company?.uid]);

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const statusOk =
        statusFilter === "all"
          ? true
          : (o.status ?? "pending") === statusFilter;
      const q = search.toLowerCase();
      const text = `${o.message || ""} ${o.requestId || ""}`.toLowerCase();
      return statusOk && (!q || text.includes(q));
    });
  }, [offers, statusFilter, search]);

  // Stats
  const total = offers.length;
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const pending = offers.filter(
    (o) => !o.status || o.status === "pending",
  ).length;
  const rejected = offers.filter(
    (o) => o.status === "rejected" || o.status === "declined",
  ).length;

  const stats = [
    { label: "Total Oferte", value: total },
    { label: "Acceptate", value: accepted, changeType: "positive" as const },
    { label: "În Așteptare", value: pending },
    { label: "Respinse", value: rejected, changeType: "negative" as const },
  ];

  // Edit/delete actions
  async function updateOffer(offer: any, fields: Partial<any>) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await updateDoc(offerRef, fields);
    } catch (e) {
      logger.error("Failed to update offer", e);
    }
  }

  async function removeOffer(offer: any) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await deleteDoc(offerRef);
    } catch (e) {
      logger.error("Failed to delete offer", e);
    }
  }

  const handleTabChange = (tab: "requests" | "offers") => {
    setActiveTab(tab);
    router.push(`/company/dashboard?tab=${tab}`, undefined, { shallow: true });
  };

  // Navigation with dynamic current tab
  const navigation = [
    {
      name: "Cereri Disponibile",
      href: "/company/dashboard?tab=requests",
      icon: InboxIcon,
    },
    {
      name: "Ofertele Mele",
      href: "/company/dashboard?tab=offers",
      icon: DocumentTextIcon,
    },
    { name: "Credite", href: "/company/credits", icon: CreditCardIcon },
    {
      name: "Profil Companie",
      href: "/company/profile",
      icon: BuildingOfficeIcon,
    },
    { name: "Setări", href: "/company/settings", icon: Cog6ToothIcon },
  ];

  // Header actions (credits + notifications)
  const headerActions = (
    <div className="flex items-center gap-3">
      {company && <CreditBalance companyId={company.uid} />}
      {company && <NotificationBell companyId={company.uid} />}
    </div>
  );

  return (
    <RequireRole allowedRole="company">
      <DashboardLayout
        role="company"
        user={company}
        companyName={companyName}
        navigation={navigation}
        activeTab={activeTab}
        showStats={false}
        stats={stats}
        headerActions={headerActions}
      >
        {/* Tab switcher */}
        <div className="mb-6">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => handleTabChange("requests")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "requests"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <InboxIcon className="h-4 w-4" />
              Cereri clienți
            </button>
            <button
              onClick={() => handleTabChange("offers")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "offers"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              Ofertele mele
              {total > 0 && (
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === "offers"
                      ? "bg-white/20"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {total}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {company ? (
              <RequestsView companyFromParent={company} />
            ) : (
              <LoadingContainer>
                <LoadingSpinner size="lg" color="blue" />
              </LoadingContainer>
            )}
          </motion.div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Caută după mesaj sau ID..."
                focusColor="blue"
                className="flex-1 sm:max-w-sm"
              />
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Toate</option>
                  <option value="pending">În așteptare</option>
                  <option value="accepted">Acceptate</option>
                  <option value="declined">Declinate</option>
                </select>
              </div>
            </div>

            {/* Error message */}
            {offerError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                <p className="font-medium">Eroare: {offerError}</p>
                <p className="mt-1 text-sm">
                  Verificați consola browserului pentru detalii.
                </p>
              </div>
            )}

            {/* Debug panel - TEMPORARY for debugging */}
            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700 text-xs font-mono">
              <p>DEBUG: company.uid = {company?.uid || "null"}</p>
              <p>DEBUG: expected companyId = 7oE49PvCcrXZOXwedOOM2DLtpjY2</p>
              <p>
                DEBUG: uid matches expected ={" "}
                {company?.uid === "7oE49PvCcrXZOXwedOOM2DLtpjY2"
                  ? "YES ✓"
                  : "NO ✗"}
              </p>
              <p>DEBUG: offers.length = {offers.length}</p>
              <p>DEBUG: filteredOffers.length = {filteredOffers.length}</p>
              <p>DEBUG: loading = {loading.toString()}</p>
              <p>DEBUG: offerError = {offerError || "null"}</p>
              <p>DEBUG: statusFilter = {statusFilter}</p>
            </div>

            {/* Offers list */}
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner size="lg" color="blue" />
              </LoadingContainer>
            ) : filteredOffers.length > 0 ? (
              <div className="space-y-4">
                {filteredOffers.map((offer, i) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex">
                      {/* Status bar */}
                      <div
                        className={`w-1 ${
                          offer.status === "accepted"
                            ? "bg-emerald-500"
                            : offer.status === "rejected" ||
                                offer.status === "declined"
                              ? "bg-red-500"
                              : "bg-amber-500"
                        }`}
                      />

                      <div className="flex-1 p-5">
                        {/* Header */}
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                              {offer.requestCode ||
                                `REQ-${String(offer.requestId).slice(0, 6).toUpperCase()}`}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                offer.status === "accepted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : offer.status === "rejected" ||
                                      offer.status === "declined"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {offer.status === "accepted" && (
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                              )}
                              {(offer.status === "rejected" ||
                                offer.status === "declined") && (
                                <XCircleIcon className="h-3.5 w-3.5" />
                              )}
                              {(!offer.status ||
                                offer.status === "pending") && (
                                <ClockIcon className="h-3.5 w-3.5" />
                              )}
                              {offer.status === "accepted"
                                ? "Acceptată"
                                : offer.status === "rejected"
                                  ? "Respinsă"
                                  : offer.status === "declined"
                                    ? "Declinată"
                                    : "În așteptare"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-lg font-bold text-blue-700">
                              {offer.price ?? "—"} lei
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        {offer.message && (
                          <p className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 line-clamp-2">
                            {offer.message}
                          </p>
                        )}

                        {/* Actions */}
                        {editingId === offer.id ? (
                          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                  Preț (lei)
                                </label>
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                  Mesaj
                                </label>
                                <textarea
                                  value={editMessage}
                                  onChange={(e) =>
                                    setEditMessage(e.target.value)
                                  }
                                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                  rows={2}
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={async () => {
                                  setSavingId(offer.id);
                                  await updateOffer(offer, {
                                    price: Number(editPrice),
                                    message: editMessage,
                                  });
                                  setSavingId(null);
                                  setEditingId(null);
                                }}
                                disabled={savingId === offer.id}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                <CheckIcon className="h-4 w-4" />
                                {savingId === offer.id
                                  ? "Se salvează..."
                                  : "Salvează"}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <XMarkIcon className="h-4 w-4" />
                                Anulează
                              </button>
                              <button
                                onClick={() => setWithdrawOffer(offer)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                                Retrage
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                            <button
                              onClick={() => {
                                setEditingId(offer.id);
                                setEditPrice(String(offer.price ?? ""));
                                setEditMessage(offer.message ?? "");
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Editează
                            </button>
                            <button
                              onClick={() => setWithdrawOffer(offer)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Retrage
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div>
                <EmptyState
                  icon={PaperAirplaneIcon}
                  title="Nu ai oferte încă"
                  description={`Trimite oferte la cererile clienților. (UID: ${company?.uid?.slice(0, 8) || "?"}, Loaded: ${offers.length}, Filtered: ${filteredOffers.length})`}
                  action={{
                    label: "Vezi cererile",
                    onClick: () => handleTabChange("requests"),
                  }}
                  variant="dashed"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={!!withdrawOffer}
          onClose={() => setWithdrawOffer(null)}
          onConfirm={() => {
            if (withdrawOffer) removeOffer(withdrawOffer);
            setWithdrawOffer(null);
          }}
          title="Retrage oferta"
          message="Ești sigur că vrei să retragi această ofertă?"
          confirmText="Retrage"
          cancelText="Anulează"
          variant="danger"
          icon="trash"
        />
      </DashboardLayout>
    </RequireRole>
  );
}

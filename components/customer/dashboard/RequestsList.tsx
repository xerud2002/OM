import { motion } from "framer-motion";
import { ListBulletIcon as List, PlusCircleIcon as PlusSquare } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import MyRequestCard from "@/components/customer/MyRequestCard";
import { updateRequestStatus, archiveRequest } from "@/utils/firestoreHelpers";

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

interface RequestsListProps {
  sortedRequests: Request[];
  offersByRequest: Record<string, any[]>;
  loading: boolean;
  onNewRequest: () => void;
}

export default function RequestsList({
  sortedRequests,
  offersByRequest,
  loading,
  onNewRequest,
}: RequestsListProps) {
  const handleStatusChange = async (
    requestId: string,
    newStatus: "closed" | "active" | "paused" | "cancelled"
  ) => {
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
      logger.error("Error updating status:", error);
      toast.error("Nu s-a putut actualiza statusul cererii");
    }
  };

  const handleArchive = async (requestId: string) => {
    try {
      await archiveRequest(requestId);
      toast.success("Cererea a fost arhivată");
    } catch (error) {
      logger.error("Error archiving request:", error);
      toast.error("Nu s-a putut arhiva cererea");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="mt-5 text-gray-500">Se încarcă cererile...</p>
        </div>
      </div>
    );
  }

  if (sortedRequests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-12 text-center sm:p-16"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/40">
            <List className="h-10 w-10 text-white" />
          </div>
        </div>
        <h3 className="mt-8 text-2xl font-bold text-gray-900">Nicio cerere încă</h3>
        <p className="mt-4 max-w-md text-base text-gray-600">
          Începe acum și primește oferte personalizate de la firme de mutări verificate
        </p>
        <button
          onClick={onNewRequest}
          className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/50"
        >
          <PlusSquare className="h-6 w-6 transition-transform group-hover:rotate-90" />
          Creează prima cerere
        </button>
      </motion.div>
    );
  }

  return (
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
            onStatusChange={handleStatusChange}
            onArchive={handleArchive}
          />
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from "framer-motion";
import { ArchiveBoxIcon as ArchiveIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import MyRequestCard from "@/components/customer/MyRequestCard";
import { unarchiveRequest } from "@/utils/firestoreHelpers";

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

interface ArchivedRequestsListProps {
  archivedRequests: Request[];
  loading: boolean;
}

export default function ArchivedRequestsList({
  archivedRequests,
  loading,
}: ArchivedRequestsListProps) {
  const handleUnarchive = async (requestId: string) => {
    try {
      await unarchiveRequest(requestId);
      toast.success("Cererea a fost reactivată");
    } catch (error) {
      logger.error("Error unarchiving request:", error);
      toast.error("Nu s-a putut reactiva cererea");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="mt-5 text-gray-500">Se încarcă arhiva...</p>
        </div>
      </div>
    );
  }

  if (archivedRequests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white p-14 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-xl shadow-gray-500/20">
          <ArchiveIcon className="h-9 w-9 text-white" />
        </div>
        <h3 className="mt-6 text-xl font-bold text-gray-900">Arhivă goală</h3>
        <p className="mt-3 max-w-md text-gray-500">
          Cererile finalizate și arhivate vor apărea aici pentru referință.
        </p>
      </motion.div>
    );
  }

  return (
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
              onClick={() => handleUnarchive(r.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-xl"
            >
              Reactivează
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

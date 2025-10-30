import { useState } from "react";
import { X, Send } from "lucide-react";
import StarRating from "./StarRating";
import { toast } from "sonner";

interface LeaveReviewModalProps {
  companyId: string;
  companyName: string;
  requestId: string;
  customerName: string;
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LeaveReviewModal({
  companyId,
  companyName,
  requestId,
  customerName,
  customerId,
  isOpen,
  onClose,
  onSuccess,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Te rugăm să selectezi un rating între 1 și 5 stele");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Te rugăm să scrii un comentariu de minim 10 caractere");
      return;
    }

    setSubmitting(true);

    try {
      const { addReview } = await import("@/utils/reviewHelpers");
      
      await addReview({
        companyId,
        customerId,
        customerName,
        requestId,
        rating,
        comment: comment.trim(),
      });

      toast.success("Mulțumim pentru review! 🎉");
      
      // Reset form
      setRating(5);
      setComment("");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Eroare la trimiterea review-ului. Te rugăm să încerci din nou.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lasă un review</h2>
          <p className="mt-1 text-gray-600">
            Pentru mutarea realizată cu <span className="font-semibold">{companyName}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Rating Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Cum a fost experiența ta?
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
              <span className="text-2xl font-bold text-amber-600">{rating}.0</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {rating === 5 && "🌟 Excelent! Ne bucurăm că ai fost mulțumit!"}
              {rating === 4 && "👍 Foarte bine! Mulțumim pentru feedback!"}
              {rating === 3 && "👌 Bine, dar poate fi îmbunătățit"}
              {rating === 2 && "😐 Ne pare rău, ce nu a fost în regulă?"}
              {rating === 1 && "😞 Ne cerem scuze pentru experiența negativă"}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="mb-6">
            <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-gray-700">
              Spune-ne mai multe despre experiența ta
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="De exemplu: Echipa a fost punctuală, profesionistă și a avut grijă de bunurile mele. Recomand cu încredere!"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
              minLength={10}
              maxLength={1000}
            />
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span>Minim 10 caractere</span>
              <span>{comment.length}/1000</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              disabled={submitting}
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={submitting || comment.trim().length < 10}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Se trimite...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Publică Review-ul
                </>
              )}
            </button>
          </div>
        </form>

        {/* Privacy Note */}
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          <strong>Notă:</strong> Review-ul tău va fi public și vizibil pentru toți utilizatorii platformei.
        </div>
      </div>
    </div>
  );
}

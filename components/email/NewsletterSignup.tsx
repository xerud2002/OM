"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterSignup({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Te rog introdu o adresă de email validă");
      return;
    }

    setStatus("loading");

    try {
      // TODO: Replace with actual API call to email service
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setStatus("success");
      setMessage("✅ Te-ai înscris cu succes! Verifică inbox-ul.");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch {
      setStatus("error");
      setMessage("Oops! Ceva nu a mers bine. Încearcă din nou.");
    }
  };

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <Mail className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-bold text-gray-900">Newsletter Mutări</h3>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Primește sfaturi exclusive și oferte speciale săptămânal
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplu.ro"
          disabled={status === "loading" || status === "success"}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:bg-gray-400"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Se trimite...</span>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Înscris!</span>
            </>
          ) : (
            <span>Abonează-te</span>
          )}
        </button>
      </form>

      {message && (
        <p className={`mt-2 text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

"use client";

import { Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface UrgencyBannerProps {
  city?: string;
  className?: string;
}

export default function UrgencyBanner({ city = "București", className = "" }: UrgencyBannerProps) {
  const [requestCount, setRequestCount] = useState(23);
  const [activeUsers, setActiveUsers] = useState(84);

  useEffect(() => {
    // Randomize numbers slightly for realism
    const interval = setInterval(() => {
      setRequestCount(20 + Math.floor(Math.random() * 10));
      setActiveUsers(75 + Math.floor(Math.random() * 20));
    }, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          <p className="text-sm text-orange-900">
            🔥 <strong>{requestCount} cereri</strong> astăzi în {city}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <p className="text-sm text-orange-900">
            👥 <strong>{activeUsers} utilizatori</strong> verifică oferte acum
          </p>
        </div>
      </div>
    </div>
  );
}

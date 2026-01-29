import { CheckCircleIcon as CheckCircle, MapPinIcon as MapPin, UsersIcon as Users } from "@heroicons/react/24/outline";

export default function TrustSignals({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1.5">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-gray-700">Serviciu 100% gratuit</span>
      </div>
      <div className="flex items-center gap-1.5">
        <MapPin className="h-4 w-4 text-blue-500" />
        <span className="text-gray-700">Firme locale din orașul tău</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-orange-500" />
        <span className="text-gray-700">Fără obligații</span>
      </div>
    </div>
  );
}

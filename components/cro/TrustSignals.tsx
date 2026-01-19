import { CheckCircle, Shield, Lock, Users } from "lucide-react";

export default function TrustSignals({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1.5">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-gray-700">500+ clienți mulțumiți</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Shield className="h-4 w-4 text-blue-500" />
        <span className="text-gray-700">Firme verificate manual</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Lock className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700">Date protejate SSL</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-orange-500" />
        <span className="text-gray-700">100% gratuit, fără obligație</span>
      </div>
    </div>
  );
}

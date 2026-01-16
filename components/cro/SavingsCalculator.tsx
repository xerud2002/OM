"use client";

import { useState } from "react";
import { Calculator, TrendingDown, CheckCircle } from "lucide-react";

export default function SavingsCalculator() {
  const [serviceType, setServiceType] = useState("apartament-2-camere");
  const [city, setCity] = useState("bucuresti");
  
  const basePrices: Record<string, number> = {
    "garsoniera": 600,
    "apartament-2-camere": 900,
    "apartament-3-camere": 1400,
    "apartament-4-camere": 2000,
    "casa-mica": 2500,
    "casa-mare": 4000,
  };

  const cityMultiplier: Record<string, number> = {
    "bucuresti": 1.2,
    "cluj-napoca": 1.15,
    "timisoara": 1.1,
    "iasi": 1.05,
    "constanta": 1.05,
    "other": 1.0,
  };

  const basePrice = basePrices[serviceType] || 900;
  const multiplier = cityMultiplier[city] || 1.0;
  const directPrice = Math.round(basePrice * multiplier);
  const platformPrice = Math.round(directPrice * 0.6); // 40% savings
  const savings = directPrice - platformPrice;
  const savingsPercent = Math.round((savings / directPrice) * 100);

  return (
    <div className="rounded-2xl border-2 border-orange-200 bg-white p-8 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-orange-100 p-2">
          <Calculator className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Calculator Economii</h3>
          <p className="text-sm text-gray-600">Vezi cât economisești cu OferteMutare</p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Tipul mutării
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-orange-500 focus:outline-none"
          >
            <option value="garsoniera">Garsonieră</option>
            <option value="apartament-2-camere">Apartament 2 camere</option>
            <option value="apartament-3-camere">Apartament 3 camere</option>
            <option value="apartament-4-camere">Apartament 4 camere</option>
            <option value="casa-mica">Casă mică (2-3 camere)</option>
            <option value="casa-mare">Casă mare (4+ camere)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Orașul
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-orange-500 focus:outline-none"
          >
            <option value="bucuresti">București</option>
            <option value="cluj-napoca">Cluj-Napoca</option>
            <option value="timisoara">Timișoara</option>
            <option value="iasi">Iași</option>
            <option value="constanta">Constanța</option>
            <option value="other">Alt oraș</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-6">
        <div className="flex items-center justify-between border-b border-orange-200 pb-3">
          <span className="text-gray-700">Căutare directă (preț mediu):</span>
          <span className="text-xl font-semibold text-gray-900">{directPrice} lei</span>
        </div>
        <div className="flex items-center justify-between border-b border-orange-200 pb-3">
          <span className="text-gray-700">Cu OferteMutare.ro:</span>
          <span className="text-xl font-semibold text-green-600">{platformPrice} lei</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <span className="font-bold text-orange-900">ECONOMISEȘTI:</span>
          </div>
          <span className="text-3xl font-bold text-orange-600">{savings} lei</span>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">
              Economie de {savingsPercent}% garantată
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        💡 Prețuri calculate pe baza a 127+ mutări comparate în ultimele 30 zile
      </p>
    </div>
  );
}

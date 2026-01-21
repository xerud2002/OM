import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

// --- Types ---

export interface PromotionTier {
  minAmount: number;
  bonusPercent: number; // e.g., 10 for 10%
  active: boolean;
}

export interface SystemSettings {
  monetization: {
    trialDays: number; // Default: 14
    firstDepositBonusPercent: number; // e.g., 20
    pricingRules: Record<string, number>; // { "București": 50, "Ilfov": 40 } - Key works by County or City
  };
  promotions: {
    tiers: PromotionTier[];
    active: boolean;
  };
}

export const DEFAULT_SETTINGS: SystemSettings = {
  monetization: {
    trialDays: 14,
    firstDepositBonusPercent: 0,
    pricingRules: {},
  },
  promotions: {
    tiers: [],
    active: false,
  },
};

// --- System Settings Helpers ---

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const docRef = doc(db, "system_settings", "config");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SystemSettings;
    }
    // Initialize if doesn't exist
    await setDoc(docRef, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn("⚠️ Failed to load system settings, using defaults:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSystemSettings(
  section: keyof SystemSettings,
  data: Partial<SystemSettings[keyof SystemSettings]>
) {
  const docRef = doc(db, "system_settings", "config");
  await setDoc(docRef, { [section]: data }, { merge: true });
}

// --- Wallet Helpers ---

/**
 * Add funds to a company wallet with optional bonus calculation.
 * This should ideally be called from a secure server environment,
 * but for Phase 1 we implementing the logic here.
 */
export async function depositFunds(companyId: string, amount: number) {
  const settings = await getSystemSettings();
  let bonus = 0;

  // Check First Deposit (this logic needs transaction lock really, simplifying for now)
  const companyRef = doc(db, "companies", companyId);

  await runTransaction(db, async (transaction) => {
    const companyDoc = await transaction.get(companyRef);
    if (!companyDoc.exists()) throw new Error("Company not found");

    const data = companyDoc.data();
    let finalAmount = amount;

    // First deposit bonus?
    // Implementation note: we need to track if it's first deposit.
    // We'll rely on a field `hasDeposited: boolean` or check transaction history count.
    // For now, let's just check tiers.

    if (settings.promotions.active) {
      // Find highest applicable tier
      const applicableTier = settings.promotions.tiers
        .filter((t) => t.active && amount >= t.minAmount)
        .sort((a, b) => b.minAmount - a.minAmount)[0];

      if (applicableTier) {
        bonus = (amount * applicableTier.bonusPercent) / 100;
      }
    }

    const currentBalance = data.walletBalance || 0;
    const newBalance = currentBalance + amount + bonus;

    transaction.update(companyRef, {
      walletBalance: newBalance,
      updatedAt: serverTimestamp(),
    });
  });

  // Log transaction after successful update (outside transaction for simplicity)
  try {
    await addDoc(collection(db, "companies", companyId, "transactions"), {
      type: "deposit",
      amount,
      bonus,
      totalAdded: amount + bonus,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log transaction:", error);
    // Don't fail the whole operation if logging fails
  }

  return { amount, bonus };
}

// --- Pricing Helper ---

export function getLeadUnlockPrice(settings: SystemSettings, county: string, city: string): number {
  // Check specific City rule first
  if (settings.monetization.pricingRules[city]) {
    return settings.monetization.pricingRules[city];
  }

  // Check County rule
  if (settings.monetization.pricingRules[county]) {
    return settings.monetization.pricingRules[county];
  }

  // Fallback / Default
  return settings.monetization.pricingRules["DEFAULT"] || 50; // 50 RON default
}

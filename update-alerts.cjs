const fs = require('fs');

// Read the file
let content = fs.readFileSync('components/company/RequestsView.tsx', 'utf8');

// Add Alert import after JobSheetModal
content = content.replace(
  'import JobSheetModal from "./JobSheetModal";',
  'import JobSheetModal from "./JobSheetModal";\nimport Alert from "@/components/ui/Alert";'
);

// Replace the locked contact alert
const oldLockedAlert = `                  {/* Contact Details - Hidden by default, shown after unlock */}
                  {!unlockMap[r.id] ? (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="mb-2 text-xs font-medium text-amber-800">
                        🔒 Detaliile complete de contact sunt ascunse
                      </p>
                      <p className="mb-3 text-xs text-amber-700">
                        Deblochează pentru a vedea numele complet, email și telefon
                      </p>
                      <button
                        onClick={async () => {
                          if (!company?.uid) return;
                          if (
                            !confirm(
                              "Vrei să deblochezi detaliile de contact pentru această cerere? (simulare plată)"
                            )
                          )
                            return;
                          setUnlockingId(r.id);
                          try {
                            await unlockContact(r.id, company.uid);
                            trackEvent("contact_unlocked", { requestId: r.id, companyId: company.uid });
                          } catch (err) {
                            console.error("Unlock failed:", err);
                          } finally {
                            setUnlockingId(null);
                          }
                        }}
                        disabled={unlockingId === r.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400"
                      >
                        {unlockingId === r.id ? "Se deblochează..." : "🔓 Deblochează contactele"}
                      </button>
                    </div>`;

const newLockedAlert = `                  {/* Contact Details - Hidden by default, shown after unlock */}
                  {!unlockMap[r.id] ? (
                    <Alert
                      variant="locked"
                      title="Detalii de contact protejate"
                      className="mt-3"
                      action={
                        <button
                          onClick={async () => {
                            if (!company?.uid) return;
                            if (
                              !confirm(
                                "Vrei să deblochezi detaliile de contact pentru această cerere? (simulare plată)"
                              )
                            )
                              return;
                            setUnlockingId(r.id);
                            try {
                              await unlockContact(r.id, company.uid);
                              trackEvent("contact_unlocked", {
                                requestId: r.id,
                                companyId: company.uid,
                              });
                            } catch (err) {
                              console.error("Unlock failed:", err);
                            } finally {
                              setUnlockingId(null);
                            }
                          }}
                          disabled={unlockingId === r.id}
                          className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                        >
                          {unlockingId === r.id ? (
                            <span className="flex items-center gap-2">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                              Se deblochează...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              🔓 Deblochează contactele
                            </span>
                          )}
                        </button>
                      }
                    >
                      <p className="mb-2">
                        Pentru a contacta direct clientul, deblochează informațiile complete de
                        contact.
                      </p>
                      <p className="text-xs opacity-90">
                        Vei avea acces la: <strong>Nume complet, Email, Telefon</strong>
                      </p>
                    </Alert>`;

content = content.replace(oldLockedAlert, newLockedAlert);

// Replace the success alert
const oldSuccessAlert = `                  ) : (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="mb-2 text-xs font-semibold text-emerald-800">
                        ✅ Detalii complete de contact
                      </p>
                      <div className="space-y-1 text-sm text-emerald-900">
                        <p>
                          <span className="font-medium">Nume:</span> {r.customerName || "—"}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> {r.customerEmail || "—"}
                        </p>
                        <p>
                          <span className="font-medium">Telefon:</span> {r.phone || "—"}
                        </p>
                      </div>
                    </div>
                  )}`;

const newSuccessAlert = `                  ) : (
                    <Alert variant="success" title="Contact deblocat" className="mt-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2">
                          <span className="text-sm font-medium text-gray-600">Nume:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {r.customerName || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2">
                          <span className="text-sm font-medium text-gray-600">Email:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {r.customerEmail || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2">
                          <span className="text-sm font-medium text-gray-600">Telefon:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {r.phone || "—"}
                          </span>
                        </div>
                      </div>
                    </Alert>
                  )}`;

content = content.replace(oldSuccessAlert, newSuccessAlert);

// Write the file
fs.writeFileSync('components/company/RequestsView.tsx', content, 'utf8');

console.warn('RequestsView.tsx updated successfully!');

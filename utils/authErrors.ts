// utils/authErrors.ts
// Shared Firebase authentication error translations (Romanian)

export const translateFirebaseError = (error: any): string => {
  const code = error?.code || "";
  const translations: Record<string, string> = {
    // Auth errors
    "auth/invalid-email": "Adresa de email nu este validă.",
    "auth/user-disabled": "Acest cont a fost dezactivat.",
    "auth/user-not-found": "Nu există niciun cont cu acest email.",
    "auth/wrong-password": "Parola introdusă este incorectă.",
    "auth/email-already-in-use": "Există deja un cont cu acest email.",
    "auth/weak-password": "Parola trebuie să aibă cel puțin 6 caractere.",
    "auth/too-many-requests": "Prea multe încercări. Te rugăm să încerci mai târziu.",
    "auth/network-request-failed": "Eroare de conexiune. Verifică internetul.",
    "auth/popup-closed-by-user": "Fereastra de autentificare a fost închisă.",
    "auth/account-exists-with-different-credential":
      "Acest email este asociat cu o altă metodă de autentificare.",
    "auth/invalid-credential": "Email sau parolă incorectă.",
    "auth/operation-not-allowed": "Această metodă de autentificare nu este activată.",
    "auth/requires-recent-login": "Te rugăm să te reautentifici pentru această operație.",
    // Custom app errors
    NEEDS_PASSWORD: error?.message || "Te rugăm să te autentifici cu email și parolă.",
    USE_GOOGLE: error?.message || "Te rugăm să te autentifici cu Google.",
    USE_FACEBOOK: error?.message || "Te rugăm să te autentifici cu Facebook.",
    ROLE_CONFLICT: "Acest cont este deja înregistrat cu un alt tip de utilizator.",
  };
  return translations[code] || error?.message || "A apărut o eroare neașteptată.";
};

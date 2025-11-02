# 🔧 Ghid Integrare Notificări - Pentru Backend/API

## 📋 Cum să Creezi Notificări Noi

Când vrei să trimiți o notificare către o companie, folosește structura de mai jos.

---

## 📊 Schema Notificare

```typescript
type Notification = {
  id: string;                    // Auto-generat de Firestore
  type: "new_message" | "new_offer" | "offer_accepted" | "media_uploaded";
  requestId: string;             // ID-ul cererii (IMPORTANT pentru grupare)
  requestCode?: string;          // REQ-XXXXXX (pentru UI)
  customerId?: string;           // UID-ul clientului (IMPORTANT pentru grupare)
  customerName?: string;         // Nume client (IMPORTANT pentru UI)
  customerEmail?: string;        // Email client (optional)
  message: string;               // Mesaj detaliat
  title: string;                 // Titlu scurt
  read: boolean;                 // false la crearea
  createdAt: Timestamp;          // serverTimestamp()
  metadata?: {                   // Date extra (optional)
    offerId?: string;
    messageCount?: number;
    offerCount?: number;
  };
};
```

---

## 🔥 Exemple de Creare Notificări

### 1. **Mesaj Nou de la Client**

```typescript
// În pages/api/company/messages.ts sau similar
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

async function notifyCompanyNewMessage(
  companyId: string,
  requestId: string,
  requestCode: string,
  customerId: string,
  customerName: string
) {
  try {
    await addDoc(
      collection(db, "companies", companyId, "notifications"),
      {
        type: "new_message",
        requestId: requestId,
        requestCode: requestCode,
        customerId: customerId,
        customerName: customerName,
        title: "Mesaj nou",
        message: `${customerName} a trimis un mesaj`,
        read: false,
        createdAt: serverTimestamp(),
      }
    );
    console.log("✅ Notification created for new message");
  } catch (error) {
    console.error("❌ Error creating notification:", error);
  }
}

// Exemplu de folosire:
await notifyCompanyNewMessage(
  "company123",
  "req456",
  "REQ-000142",
  "customer789",
  "Ciprian Rotopanescu"
);
```

---

### 2. **Ofertă Nouă Trimisă**

```typescript
async function notifyCompanyOfferSent(
  companyId: string,
  requestId: string,
  requestCode: string,
  customerId: string,
  customerName: string,
  offerId: string
) {
  try {
    await addDoc(
      collection(db, "companies", companyId, "notifications"),
      {
        type: "new_offer",
        requestId: requestId,
        requestCode: requestCode,
        customerId: customerId,
        customerName: customerName,
        title: "Ofertă trimisă",
        message: `Oferta ta pentru ${requestCode} a fost primită de ${customerName}`,
        read: false,
        createdAt: serverTimestamp(),
        metadata: {
          offerId: offerId,
        },
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}
```

---

### 3. **Ofertă Acceptată** ✅

```typescript
async function notifyCompanyOfferAccepted(
  companyId: string,
  requestId: string,
  requestCode: string,
  customerId: string,
  customerName: string,
  offerId: string,
  price: number
) {
  try {
    await addDoc(
      collection(db, "companies", companyId, "notifications"),
      {
        type: "offer_accepted",
        requestId: requestId,
        requestCode: requestCode,
        customerId: customerId,
        customerName: customerName,
        title: "Ofertă acceptată! 🎉",
        message: `${customerName} a acceptat oferta ta de ${price} lei pentru ${requestCode}`,
        read: false,
        createdAt: serverTimestamp(),
        metadata: {
          offerId: offerId,
        },
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

// Deja implementat în: pages/api/notifyOfferAccepted.ts
```

---

### 4. **Media Uploadată** 📸

```typescript
async function notifyCompanyMediaUploaded(
  companyId: string,
  requestId: string,
  requestCode: string,
  customerId: string,
  customerName: string,
  mediaCount: number
) {
  try {
    await addDoc(
      collection(db, "companies", companyId, "notifications"),
      {
        type: "media_uploaded",
        requestId: requestId,
        requestCode: requestCode,
        customerId: customerId,
        customerName: customerName,
        title: "Media uploadată",
        message: `${customerName} a încărcat ${mediaCount} fișier${mediaCount > 1 ? "e" : ""} pentru ${requestCode}`,
        read: false,
        createdAt: serverTimestamp(),
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

// Deja implementat în: pages/api/notifyCompaniesOnUpload.ts
```

---

## 🔔 Notificare Bulk către Multiple Companii

Când vrei să notifici toate companiile (ex: cerere nouă deblocată):

```typescript
async function notifyAllCompaniesNewRequest(
  requestId: string,
  requestCode: string,
  customerId: string,
  customerName: string,
  fromCity: string,
  toCity: string
) {
  try {
    // 1. Get all companies
    const companiesSnapshot = await getDocs(collection(db, "companies"));
    
    // 2. Create notification for each
    const promises = companiesSnapshot.docs.map((companyDoc) => {
      return addDoc(
        collection(db, "companies", companyDoc.id, "notifications"),
        {
          type: "new_request",  // Tip nou (poate fi adăugat)
          requestId: requestId,
          requestCode: requestCode,
          customerId: customerId,
          customerName: customerName,
          title: "Cerere nouă disponibilă",
          message: `${customerName} caută o companie pentru mutare ${fromCity} → ${toCity}`,
          read: false,
          createdAt: serverTimestamp(),
        }
      );
    });

    await Promise.all(promises);
    console.log(`✅ Notified ${promises.length} companies`);
  } catch (error) {
    console.error("Error notifying companies:", error);
  }
}
```

---

## ✅ Checklist pentru Notificări Noi

Când creezi o notificare, asigură-te că:

- [x] **type** este unul din: `new_message`, `new_offer`, `offer_accepted`, `media_uploaded`
- [x] **requestId** este populat (pentru grupare și navigare)
- [x] **requestCode** este populat (pentru afișare în UI)
- [x] **customerId** este populat (pentru grupare pe client)
- [x] **customerName** este populat (afișat în UI)
- [x] **title** este scurt și descriptiv (max 50 chars)
- [x] **message** este clar și informativ
- [x] **read** este `false` la crearea
- [x] **createdAt** folosește `serverTimestamp()`

---

## 🎯 Best Practices

### 1. **Nu crea notificări duplicate**

```typescript
// BAD: Creează notificare la fiecare mesaj
await createNotification("new_message"); // msg 1
await createNotification("new_message"); // msg 2
await createNotification("new_message"); // msg 3
// Result: 3 notificări separate

// GOOD: Panoul grupează automat, dar evită spam
// Doar dacă e prima notificare necitită sau au trecut >30 min
```

### 2. **Folosește metadata pentru context extra**

```typescript
metadata: {
  offerId: "offer123",           // Link direct la ofertă
  messageCount: 5,               // Câte mesaje noi
  offerCount: 2,                 // Câte oferte noi
  priority: "high",              // Prioritate (pentru viitor)
  actionUrl: "/company/requests?id=req456"  // URL direct
}
```

### 3. **Cleanup notificări vechi**

```typescript
// Cloud Function sau Cron Job
// Șterge notificări citite mai vechi de 30 zile
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const oldNotifications = query(
  collection(db, "companies", companyId, "notifications"),
  where("read", "==", true),
  where("createdAt", "<", Timestamp.fromDate(thirtyDaysAgo))
);

const snapshot = await getDocs(oldNotifications);
const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
await Promise.all(deletePromises);
```

---

## 🔍 Debugging Notificări

### Check în Firestore Console

```
companies/{companyId}/notifications/{notificationId}
{
  type: "new_message",
  requestId: "req456",
  requestCode: "REQ-000142",
  customerId: "customer789",
  customerName: "Ciprian Rotopanescu",
  title: "Mesaj nou",
  message: "Ciprian Rotopanescu a trimis un mesaj",
  read: false,
  createdAt: Timestamp(2025, 11, 2, 10, 30)
}
```

### Log în Browser Console

```javascript
// În NotificationBell.tsx deja există:
useEffect(() => {
  const unsub = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("📨 Notifications loaded:", data);
    setNotifications(data);
  });
}, [companyId]);
```

### Test Manual

```typescript
// În browser console (cu Firebase SDK):
await firebase.firestore()
  .collection("companies")
  .doc("COMPANY_ID_HERE")
  .collection("notifications")
  .add({
    type: "new_message",
    requestId: "test123",
    requestCode: "REQ-000999",
    customerId: "test_customer",
    customerName: "Test Client",
    title: "Test Notification",
    message: "This is a test",
    read: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
```

---

## 📊 Firestore Security Rules

Asigură-te că ai regulile de securitate corecte:

```javascript
match /companies/{companyId}/notifications/{notificationId} {
  // Companies can only read their own notifications
  allow read: if request.auth != null && request.auth.uid == companyId;
  
  // Only server/admins can create notifications
  allow create: if request.auth != null && request.auth.token.admin == true;
  
  // Companies can update only 'read' field on their notifications
  allow update: if request.auth != null 
                && request.auth.uid == companyId
                && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);
  
  // No deletes by clients
  allow delete: if false;
}
```

---

## 🚀 Exemple de Integrare în API Routes

### În `pages/api/company/messages.ts`

```typescript
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { companyId, requestId, message, customerId, customerName, requestCode } = req.body;
    
    // 1. Save message to Firestore
    await addDoc(collection(db, "messages"), {
      companyId,
      requestId,
      customerId,
      message,
      createdAt: serverTimestamp()
    });
    
    // 2. Create notification for company
    await addDoc(
      collection(db, "companies", companyId, "notifications"),
      {
        type: "new_message",
        requestId,
        requestCode,
        customerId,
        customerName,
        title: "Mesaj nou",
        message: `${customerName} a trimis un mesaj`,
        read: false,
        createdAt: serverTimestamp()
      }
    );
    
    res.status(200).json({ success: true });
  }
}
```

---

## 📱 Mobile Push Notifications (Viitor)

Pentru notificări push pe mobile:

```typescript
// 1. Request permission
const permission = await Notification.requestPermission();

// 2. Get FCM token
const token = await getToken(messaging);

// 3. Save token to company profile
await updateDoc(doc(db, "companies", companyId), {
  fcmToken: token
});

// 4. În Cloud Function, trimite push:
await admin.messaging().send({
  token: companyFcmToken,
  notification: {
    title: "Mesaj nou",
    body: "Ciprian Rotopanescu a trimis un mesaj"
  },
  data: {
    requestId: "req456",
    type: "new_message"
  }
});
```

---

**Versiune**: 2.1.0  
**Data**: Noiembrie 2, 2025  
**Status**: ✅ Production Ready

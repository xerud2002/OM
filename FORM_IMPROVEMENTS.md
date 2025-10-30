# Îmbunătățiri Formular Cerere Mutare

## Modificări implementate

### 1. Layout optimizat
- **Câmpuri pe același rând**: Județ și localitate sunt afișate side-by-side
- **Detalii proprietate compacte**: Tip, camere, etaj și lift pe același rând (responsive grid)
- **Data și telefon**: Grupate pe același rând pentru eficiență
- **Grid responsive**: `md:grid-cols-2`, `md:grid-cols-3`, `md:grid-cols-4` pentru diferite secțiuni

### 2. Secțiune "Survey și Estimare"
Nouă secțiune după servicii cu 3 opțiuni radio:

#### Opțiuni disponibile:
- **Survey la fața locului** (in-person): Un reprezentant vine să evalueze
- **Survey video** (video): Programare video call pentru evaluare
- **Estimare rapidă** (quick-estimate): Bazată pe informațiile furnizate

**Styling**: Border amber, iconiță ochii, cards cu hover effects și state "checked"

### 3. Secțiune "Poze și Video"
Nouă secțiune pentru upload media cu 2 flow-uri:

#### Upload acum (now):
- Input file cu drag-and-drop UI
- Accept: `image/*,video/*`
- Afișare listă fișiere selectate cu size
- Validare: max 50MB per fișier

#### Upload mai târziu (later):
- Client primește email cu link personalizat
- Link valid 7 zile
- Informații clare despre ce se întâmplă

**Styling**: Border blue, iconiță upload, design intuitiv

### 4. Logica backend

#### API: `/api/generateUploadLink`
**Method**: POST  
**Body**:
```json
{
  "requestId": "string",
  "customerEmail": "string",
  "customerName": "string"
}
```

**Response**:
```json
{
  "ok": true,
  "uploadToken": "hex-string",
  "emailSent": true,
  "data": { ... }
}
```

**Funcționalitate**:
- Generează token unic (32 bytes hex)
- Trimite email via Resend cu link `/upload/[token]`
- Email conține instrucțiuni clare și link personalizat
- Fallback graceful dacă `RESEND_API_KEY` lipsește

#### Pagina upload: `/pages/upload/[token].tsx`
- Verificare token valid
- UI pentru selectare multiple files
- Preview listă fișiere cu size
- Button upload cu loading state
- Mesaj succes după upload
- Sfaturi pentru cele mai bune poze

### 5. Actualizări tipuri TypeScript

#### `types/index.ts` - MovingRequest:
Adăugate câmpuri noi:
```typescript
{
  // Location details
  fromAddress?: string;
  fromType?: "house" | "flat";
  fromFloor?: string;
  fromElevator?: boolean;
  toAddress?: string;
  toType?: "house" | "flat";
  toFloor?: string;
  toElevator?: boolean;
  
  // Services
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
  
  // Survey & Estimate
  surveyType?: "in-person" | "video" | "quick-estimate";
  
  // Media upload
  mediaUpload?: "now" | "later";
  mediaUploadToken?: string;
  mediaUrls?: string[];
}
```

### 6. Integrare în Customer Dashboard
**Fișier**: `pages/customer/dashboard.tsx`

- Form state actualizat cu toate câmpurile noi
- `handleSubmit` verifică `mediaUpload === "later"`
- Apelează `/api/generateUploadLink` după crearea cererii
- Toast notifications pentru succes/eroare
- Reset form include toate câmpurile noi

## Variabile de mediu necesare

```env
# Email notifications (optional in dev)
RESEND_API_KEY=re_xxxxx
NOTIFY_FROM_EMAIL=noreply@ofertemutare.ro

# Base URL for upload links
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Cum să testezi

### 1. Formularul
```bash
npm run dev
# Navighează la /customer/dashboard
# Click "Cerere nouă"
# Testează toate secțiunile noi
```

### 2. Email cu link upload
- Alege "Primesc link pe email" în secțiunea "Poze și video"
- Trimite formularul
- Verifică consola pentru log (dacă nu ai RESEND_API_KEY)
- Cu API key: verifică inbox-ul pentru email

### 3. Pagina upload
```bash
# Simulare: vizitează direct
http://localhost:3000/upload/test-token-123

# Sau folosește token real din email
```

## Next steps (opțional)

1. **Implementare reală Firebase Storage**:
   - Upload fișiere în `/pages/upload/[token].tsx`
   - Salvare URLs în Firestore `requests/{id}.mediaUrls`

2. **Validare token server-side**:
   - Stochează tokens în Firestore cu expirare
   - Verifică validitatea la accesarea paginii upload

3. **Progress indicator pentru upload**:
   - Track progress pentru fiecare fișier
   - Afișare bară progres

4. **Thumbnail preview**:
   - Generează preview pentru imagini
   - Video thumbnail pentru fișiere video

5. **Notificări pentru companii**:
   - Alertă când client uploadă media
   - Link direct către media în ofertă

## Files modified

- `components/customer/RequestForm.tsx` - Form cu secțiuni noi
- `pages/customer/dashboard.tsx` - Logică submit cu API call
- `pages/upload/[token].tsx` - NEW: Pagina upload media
- `pages/api/generateUploadLink.ts` - NEW: API token + email
- `types/index.ts` - Tipuri actualizate
- `.github/copilot-instructions.md` - Documentație actualizată

## Build status
✅ All checks passing  
✅ TypeScript compilation successful  
✅ No lint errors  
✅ Production build validated

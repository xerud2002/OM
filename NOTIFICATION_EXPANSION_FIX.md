# 🐛 Bug Fix - Notificări nu se expandau

## Problema
Când apăsai "Vezi toate (3)" în panoul de notificări, lista cu notificările individuale nu apărea.

## Cauza
Tag-ul HTML `<details>` nu funcționa corect cu React și nu se renda conținutul expandat.

## Soluția
Am înlocuit `<details>` HTML cu state management React:

### Înainte (Nu funcționa):
```tsx
<details className="mt-2">
  <summary>Vezi toate ({group.notifications.length})</summary>
  <div>
    {group.notifications.map(...)}
  </div>
</details>
```

### După (Funcționează):
```tsx
// 1. State pentru grupuri expandate
const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

// 2. Toggle function
const toggleGroupExpansion = (groupKey: string) => {
  setExpandedGroups((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(groupKey)) {
      newSet.delete(groupKey);
    } else {
      newSet.add(groupKey);
    }
    return newSet;
  });
};

// 3. Button cu conditional rendering
<button onClick={() => toggleGroupExpansion(`${group.customerId}_${group.requestId}`)}>
  <span>{expandedGroups.has(key) ? "▼" : "▶"}</span>
  Vezi toate ({group.notifications.length})
</button>

{expandedGroups.has(key) && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    transition={{ duration: 0.2 }}
  >
    {group.notifications.map(...)}
  </motion.div>
)}
```

## Features
- ✅ Click pe "▶ Vezi toate" expandează lista
- ✅ Arrow se schimbă în "▼" când e expandat
- ✅ Click din nou collapse lista
- ✅ Animație smooth cu Framer Motion (200ms)
- ✅ Fiecare grup se expandează independent
- ✅ State persistent între re-renders

## UI
```
Collapsed:
▶ Vezi toate (5)

Expanded:
▼ Vezi toate (5)
┃ 💬 Mesaj nou
┃    Clientul a trimis un mesaj         ●
┃ 📄 Ofertă trimisă
┃    Oferta ta a fost primită
┃ ✅ Ofertă acceptată
┃    Clientul a acceptat oferta ta!     ●
```

## Testing
- [x] Click expandează lista
- [x] Click collapse lista
- [x] Multiple grupuri independente
- [x] Animație smooth
- [x] Build pass ✅

**Status**: ✅ Fixed și testat  
**Build**: ✅ Passing (285 kB company dashboard)

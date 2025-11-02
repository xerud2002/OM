# 🎨 Preview Vizual - Noul Panou de Notificări

## Desktop View (≥768px)

```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notificări                    ✓ Marchează toate ✕│
│ 8 necitite                                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ [👤 5]  Ciprian Rotopanescu            acum   │   │
│ │         REQ-000142                      2m    │   │
│ │                                               │   │
│ │         [💬 5] [📄 1] [✅ 1]                  │   │
│ │                                               │   │
│ │         5 mesaje • 1 ofertă • 1 acceptată     │   │
│ │                                               │   │
│ │         [Vezi cererea]  [✓ Citit]             │   │
│ │                                               │   │
│ │         ▶ Vezi toate (7)                      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ [👤 2]  Maria Ionescu              acum 1h   │   │
│ │         REQ-000138                            │   │
│ │                                               │   │
│ │         [💬 2] [📄 1]                         │   │
│ │                                               │   │
│ │         2 mesaje • 1 ofertă                   │   │
│ │                                               │   │
│ │         [Vezi cererea]  [✓ Citit]             │   │
│ │                                               │   │
│ │         ▶ Vezi toate (3)                      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ [👤 1]  George Popescu            acum 30m   │   │
│ │         REQ-000145                            │   │
│ │                                               │   │
│ │         [💬 1] [📸 1]                         │   │
│ │                                               │   │
│ │         1 mesaj • 1 media                     │   │
│ │                                               │   │
│ │         [Vezi cererea]  [✓ Citit]             │   │
│ │                                               │   │
│ │         ▶ Vezi toate (2)                      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
     Width: 480px | Max-height: 500px
```

---

## Mobile View (<768px)

```
┌──────────────────────────────────────┐
│ 🔔 Notificări              [✓]  [✕] │
│ 8 necitite                           │
├──────────────────────────────────────┤
│                                      │
│ ┌────────────────────────────────┐  │
│ │ [👤5] Ciprian Rotopanescu  2m  │  │
│ │       REQ-000142               │  │
│ │                                │  │
│ │       [💬5] [📄1] [✅1]        │  │
│ │                                │  │
│ │       5 mesaje • 1 ofertă •    │  │
│ │       1 acceptată              │  │
│ │                                │  │
│ │       [Vezi cererea]  [✓]      │  │
│ │                                │  │
│ │       ▶ Vezi toate (7)         │  │
│ └────────────────────────────────┘  │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ [👤2] Maria Ionescu        1h  │  │
│ │       REQ-000138               │  │
│ │                                │  │
│ │       [💬2] [📄1]              │  │
│ │                                │  │
│ │       2 mesaje • 1 ofertă      │  │
│ │                                │  │
│ │       [Vezi cererea]  [✓]      │  │
│ │                                │  │
│ │       ▶ Vezi toate (3)         │  │
│ └────────────────────────────────┘  │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ [👤1] George Popescu      30m  │  │
│ │       REQ-000145               │  │
│ │                                │  │
│ │       [💬1] [📸1]              │  │
│ │                                │  │
│ │       1 mesaj • 1 media        │  │
│ │                                │  │
│ │       [Vezi cererea]  [✓]      │  │
│ │                                │  │
│ │       ▶ Vezi toate (2)         │  │
│ └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
  Width: calc(100vw-1rem) | Max-height: 60vh
```

---

## Expanded Details View

Când user dă click pe "Vezi toate (7)":

```
┌──────────────────────────────────────────────────┐
│ [👤 5]  Ciprian Rotopanescu            acum 2m   │
│         REQ-000142                                │
│                                                   │
│         [💬 5] [📄 1] [✅ 1]                      │
│                                                   │
│         5 mesaje • 1 ofertă • 1 acceptată         │
│                                                   │
│         [Vezi cererea]  [✓ Citit]                 │
│                                                   │
│         ▼ Vezi toate (7)                          │
│         ┃                                         │
│         ┃ 💬 Mesaj nou                         ● │
│         ┃    Clientul a trimis un mesaj          │
│         ┃                                         │
│         ┃ 💬 Mesaj nou                         ● │
│         ┃    Încă un mesaj de la client          │
│         ┃                                         │
│         ┃ 💬 Mesaj nou                         ● │
│         ┃    Mai multe întrebări                 │
│         ┃                                         │
│         ┃ 📄 Ofertă trimisă                      │
│         ┃    Oferta ta a fost primită            │
│         ┃                                         │
│         ┃ 💬 Mesaj nou                         ● │
│         ┃    Răspuns la ofertă                   │
│         ┃                                         │
│         ┃ ✅ Ofertă acceptată                     │
│         ┃    Clientul a acceptat oferta ta!      │
│         ┃                                         │
│         ┃ 💬 Mesaj nou                         ● │
│         ┃    Detalii despre acceptare            │
│                                                   │
└──────────────────────────────────────────────────┘

Legend:
● = Notificare necitită (green dot)
Border-left verde = Lista de notificări individuale
```

---

## Color Scheme

### Avatar Gradient
```
┌────────┐
│ Emerald│  User avatar background
│   →    │  Linear gradient
│  Sky   │  from-emerald-400 to-sky-500
└────────┘
```

### Badge Colors

**Messages** (Sky):
```
[💬 5]
bg: sky-100 (light blue background)
text: sky-700 (dark blue text)
icon: MessageSquare
```

**Offers** (Purple):
```
[📄 1]
bg: purple-100 (light purple background)
text: purple-700 (dark purple text)
icon: FileText
```

**Accepted** (Emerald):
```
[✅ 1]
bg: emerald-100 (light green background)
text: emerald-700 (dark green text)
icon: CheckCircle
```

**Media** (Amber):
```
[📸 1]
bg: amber-100 (light orange background)
text: amber-700 (dark orange text)
icon: Image
```

### Unread Indicators

**Counter badge on avatar**:
```
[👤 5]
   ^-- Red circle with white text
       bg-red-500, text-white
       positioned top-right of avatar
```

**Background highlight**:
```
Unread group: bg-emerald-50/50 (very light green)
Read group: bg-white
```

**Dot indicator** (in expanded view):
```
● = h-1.5 w-1.5 rounded-full bg-emerald-500
```

---

## Interaction States

### Hover Effects

**Group card hover**:
```
Normal:     bg-white
Hover:      bg-gray-50
Unread:     bg-emerald-50/50
```

**Button hovers**:
```
"Vezi cererea":
  Normal: bg-emerald-600 text-white
  Hover:  bg-emerald-700

"Citit":
  Normal: text-gray-600
  Hover:  bg-gray-200
```

### Button States

**Desktop**:
- "Vezi cererea" - Full text with padding
- "Citit" - Full text with checkmark icon

**Mobile**:
- "Vezi cerarea" - Same (important action)
- [✓] - Only icon (space saving)

---

## Animation Flow

### Panel Open/Close

```
Open:
  ┌─────┐
  │     │  opacity: 0 → 1
  │  ▲  │  scale: 0.95 → 1
  │ │ │ │  translateY: -10px → 0
  └─────┘  duration: 150ms ease-out

Close:
  ┌─────┐
  │  │  │  opacity: 1 → 0
  │  ▼  │  scale: 1 → 0.95
  │     │  translateY: 0 → -10px
  └─────┘  duration: 150ms ease-out
```

### Loading State

```
┌─────────────────────────┐
│                         │
│       ⟳ Loading...      │  Spinning circle
│                         │  emerald colors
│                         │  border-4 animation
└─────────────────────────┘
```

### Empty State

```
┌─────────────────────────┐
│                         │
│         🔔              │  Large bell icon
│                         │  text-gray-300
│   Nicio notificare      │  text-gray-500
│                         │
└─────────────────────────┘
```

---

## Responsive Breakpoints

| Screen Size | Panel Width | Avatar Size | Font Size | Spacing |
|-------------|-------------|-------------|-----------|---------|
| < 768px     | ~100vw-1rem | 40x40px     | text-sm   | px-3    |
| ≥ 768px     | 480px       | 48x48px     | text-base | px-4    |

---

## Touch Targets (Mobile)

All interactive elements have minimum 44x44px touch area:

```
[Vezi cererea] - 44px height minimum
[✓]            - 44x44px tap area
Avatar         - 40x40px + padding = 44px+
Badge close    - 44x44px
```

---

## Z-Index Hierarchy

```
Level 5: Notification Panel (z-50)
Level 4: Backdrop (z-40)
Level 3: Navbar (z-30)
Level 2: Content
Level 1: Background
```

---

## Accessibility Features

1. **Keyboard Navigation**:
   - Tab through groups
   - Enter to "Vezi cererea"
   - Space to toggle "Vezi toate"

2. **Screen Readers**:
   - Avatar: "Client: Ciprian Rotopanescu"
   - Badges: "5 mesaje necitite"
   - Buttons: Clear labels

3. **Focus Indicators**:
   - Blue outline on focus
   - Visible in all states

4. **Color Contrast**:
   - All text passes WCAG AA
   - Icons with sufficient contrast
   - Unread indicators clear

---

## Performance Optimizations

1. **useMemo for grouping**:
   - Prevents re-grouping on every render
   - Only recomputes when notifications change

2. **AnimatePresence**:
   - Smooth enter/exit animations
   - Automatic cleanup

3. **Lazy expansion**:
   - Details hidden by default
   - Rendered only when expanded

4. **Efficient updates**:
   - Firestore onSnapshot
   - Real-time with minimal queries

---

**Visual Design by**: GitHub Copilot  
**Status**: ✅ Implemented  
**Build**: ✅ Passing

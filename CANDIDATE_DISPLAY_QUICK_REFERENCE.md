# Candidate Display Quick Reference

## Files with Initials & Avatar Display

### 🎯 Primary Candidate Display Components

| File | Location | Initials | Avatar | Lines | Context |
|------|----------|----------|--------|-------|---------|
| **CarteCandidat** | `components/Recrutement/` | ✓ Calculated | ✓ Optional | 24-30, 87-92, 99-101 | Recruitment pipeline cards |
| **ModalCandidat** | `components/Recrutement/` | ✓ Function | ✓ H-14 W-14 | 82-88, 161-177, 181 | Candidate details modal |
| **ProfilCandidat** | `pages/Candidat/` | ✓ Calculated | ✓ H-16 W-16 | 13-35, 137-145, 147-154 | Candidate profile page |
| **ProchainsEntretiens** | `components/TableauDeBord/` | ✓ First+Last | ✗ Initials only | 6-11, 72, 125, 129 | Dashboard upcoming interviews |
| **LigneUtilisateur** | `components/Utilisateurs/` | ✓ Calculated | ✓ H-10 W-10 | 18-26, 39-54, 59-66 | User management table |

---

## Initials Generation Methods

### Method 1: All Initials (CarteCandidat, ModalCandidat, LigneUtilisateur)
```javascript
// "John William Smith" → "JWS"
const initials = name
  .split(" ")
  .map(n => n[0])
  .join("")
  .toUpperCase();
```

### Method 2: First + Last Only (ProchainsEntretiens)
```javascript
// "John William Smith" → "JS"
const parts = name.split(" ");
if (parts.length >= 2) {
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
```

### Method 3: Limited to 2 chars (ProfilCandidat)
```javascript
// "John William Smith" → "JW"
const initials = name
  .split(" ")
  .map(w => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();
```

---

## Pages/Routes Showing Candidates

### Admin/Recruiter Routes
| Route | Page File | What's Shown |
|-------|-----------|-------------|
| `/admin/recruitment` | `Recrutement.jsx` | Pipeline kanban with all candidates |
| `/admin/interviews` | `Entretiens.jsx` | Interview management |
| `/admin/parametres` | Admin Settings | User management (LigneUtilisateur) |
| Dashboard | `ProchainsEntretiens.jsx` | Widget: upcoming interviews |

### Candidate Routes
| Route | Page File | What's Shown |
|-------|-----------|-------------|
| `/candidat/profil` | `ProfilCandidat.jsx` | Candidate's own profile |
| `/candidat/mes-candidatures` | `TableauDeBordCandidat.jsx` | Candidate's applications |
| `/candidat/entretiens` | `EntretiensCandidat.jsx` | Candidate's interviews |

---

## Data Source for Candidate Names

### Primary Sources (in order of priority)
1. `c.nom` - Backend French field
2. `c.candidat?.nom` - Nested candidate object
3. `c.email` or `candidate.email` - Fallback to email
4. `"Candidat"` - Default value

### Example from Recrutement.jsx (Line 71)
```javascript
name: c.nom || c.candidat?.nom || c.email || "Candidat"
```

---

## Detailed File Locations

### Components

```
frontend_pfe/src/components/
├── Recrutement/
│   ├── CarteCandidat.jsx ⭐ (initials: L24-30, avatar: L87-92, name: L99-101)
│   ├── ModalCandidat.jsx ⭐ (initials: L82-88, avatar: L161-177, name: L181)
│   ├── ColonnePipeline.jsx (uses CarteCandidat)
│   └── EntretienModal.jsx (name: L85)
├── TableauDeBord/
│   └── ProchainsEntretiens.jsx ⭐ (initials: L6-11 & L72, L125, name: L129)
├── Utilisateurs/
│   └── LigneUtilisateur.jsx ⭐ (initials: L18-26, avatar: L39-54, name: L59-66)
├── Candidat/
│   ├── CandidatureCard.jsx (company logo, not candidate avatar)
│   └── ModalDetailsCandidature.jsx (no avatar)
└── Entretiens/
    ├── ModalDetailsEntretien.jsx (candidate name: L40-49)
    └── EntretiensEnLigneTab.jsx (candidate name display)
```

### Pages

```
frontend_pfe/src/pages/
├── Recrutement.jsx ⭐
│   ├── mapCandidateCard(): L47-106
│   ├── candidate name: L71
│   ├── avatar: L89 (empty)
│   └── Modal display: L654, activity: L830
├── Candidat/
│   ├── ProfilCandidat.jsx ⭐
│   │   ├── initials: L13-35
│   │   ├── avatar: L137-145
│   │   └── name: L147-154
│   ├── TableauDeBordCandidat.jsx
│   │   └── "Bonjour, {candidat?.nom}" - L164
│   ├── EntretiensCandidat.jsx ⭐
│   │   └── Interview data extraction: L1-80
│   └── DetailOffreCandidat.jsx
└── Entretiens.jsx ⭐
    └── Helper functions: L40-89
```

---

## Key Code Snippets

### Avatar with Initials Fallback Pattern
```javascript
{candidate.avatar ? (
  <img
    alt={candidate.name}
    className="h-10 w-10 rounded-[var(--rounded-pill)]"
    src={candidate.avatar}
  />
) : (
  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--rounded-pill)]">
    {initials}
  </div>
)}
```

### Initials Calculation
```javascript
const initials = name
  .split(" ")
  .map(n => n[0])
  .join("")
  .toUpperCase();
```

### Name Extraction with Fallback
```javascript
const name = 
  c.nom || 
  c.candidat?.nom || 
  c.email || 
  "Candidat";
```

---

## IA Score Color Coding (CarteCandidat.jsx)

```javascript
Score ≤ 40  → Red (#ef4444)
Score 41-69 → Amber (#f59e0b)
Score ≥ 70  → Green (#10b981)
```

---

## Styling Reference

### Avatar Sizes
- **Small (List items):** `h-10 w-10`
- **Medium (Modals):** `h-14 w-14`
- **Large (Profile):** `h-16 w-16`

### Border Radius
- **Pill/Circular:** `rounded-[var(--rounded-pill)]`
- **Card:** `rounded-xl` or `rounded-[var(--rounded-lg)]`

### Background Colors for Initials
- **Light:** `var(--color-canvas-parchment)` or `bg-gradient-to-br`
- **Dark (Modal):** `rgba(255,255,255,0.18)`
- **Gradient:** Dynamic based on name hash

### Text Styling for Initials
- **Small:** `font-text text-xs font-semibold`
- **Medium:** `font-text text-sm font-semibold`
- **Large:** `font-display text-xl font-semibold`

---

## API Data Flow

```
Backend API
    ↓
c.nom (or c.candidat?.nom)
    ↓
Recrutement.jsx: mapCandidateCard()
    ↓
name field in candidate object
    ↓
CarteCandidat: calculateInitials(name)
    ↓
Display in UI with avatar or initials
```

---

## Summary Statistics

- **Total Components:** 10 with candidate display
- **Total Pages:** 5 showing candidate info
- **Initials Used:** 5 components/pages
- **Avatars Displayed:** 5 components/pages
- **Primary Pipeline:** Recrutement.jsx → CarteCandidat.jsx
- **Profile Display:** ProfilCandidat.jsx
- **Dashboard Widget:** ProchainsEntretiens.jsx

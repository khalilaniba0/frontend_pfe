# Candidate Information Display Locations

## Overview
This document maps all frontend locations where candidate information (name, profile, avatar, initials) is displayed throughout the PFE application.

---

## 1. COMPONENTS WITH CANDIDATE DISPLAY

### 1.1 CarteCandidat.jsx (Recruitment Pipeline Card)
**File:** [src/components/Recrutement/CarteCandidat.jsx](src/components/Recrutement/CarteCandidat.jsx)

**Key Lines:**
- **Line 24-30:** Initials calculation from candidate name
  ```javascript
  const initials = name
    .split(" ")
    .map(function (n) {
      return n[0];
    })
    .join("")
    .toUpperCase();
  ```

- **Line 87-92:** Avatar display with fallback to initials
  ```javascript
  {avatar ? (
    <img
      alt={name}
      className="avatar-image h-10 w-10 rounded-[var(--rounded-pill)]"
      src={avatar}
    />
  ) : (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)]">
      {initials}
    </div>
  )}
  ```

- **Line 99-101:** Candidate name and role display
  ```javascript
  <p className="truncate font-body text-sm font-semibold">
    {name}
  </p>
  ```

- **Line 116-130:** IA Score display with color coding
  - Used in recruitment pipeline kanban board

**Context:** This component is used in [ColonnePipeline.jsx](#141-colonnepipelinejsx-pipeline-column) to display candidate cards in each pipeline stage.

---

### 1.2 ModalCandidat.jsx (Candidate Details Modal)
**File:** [src/components/Recrutement/ModalCandidat.jsx](src/components/Recrutement/ModalCandidat.jsx)

**Key Lines:**
- **Line 82-88:** getInitials function definition
  ```javascript
  function getInitials(name) {
    return name
      .split(" ")
      .map(function (n) {
        return n[0];
      })
      .join("")
      .toUpperCase();
  }
  ```

- **Line 161-177:** Avatar display in modal header with initials fallback
  ```javascript
  {candidate.avatar ? (
    <img
      alt={candidate.name}
      className="avatar-image h-14 w-14 rounded-[var(--rounded-pill)]"
      src={candidate.avatar}
    />
  ) : (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)]">
      {getInitials(candidate.name)}
    </div>
  )}
  ```

- **Line 181:** Candidate name display in modal header

**Context:** Opened from recruitment pipeline when clicking on a candidate card. Shows detailed candidate info including IA report, CV extract, and scoring details.

---

### 1.3 ProchainsEntretiens.jsx (Upcoming Interviews Dashboard Widget)
**File:** [src/components/TableauDeBord/ProchainsEntretiens.jsx](src/components/TableauDeBord/ProchainsEntretiens.jsx)

**Key Lines:**
- **Line 6-11:** getInitials function
  ```javascript
  function getInitials(name) {
    if (!name) return "??";
    var parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  ```

- **Line 72:** Extract candidate name and calculate initials
  ```javascript
  var candidatName = e.candidature?.nom || e.candidature?.candidat?.nom || e.candidature?.email || "Candidat";
  ...
  initials: getInitials(candidatName),
  ```

- **Line 125:** Display initials in interview list
  ```javascript
  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)]">
    {interview.initials}
  </div>
  ```

- **Line 129:** Candidate name display
  ```javascript
  {interview.name}
  ```

**Context:** Shows upcoming interviews on the admin dashboard with candidate initials and role.

---

### 1.4 CandidatureCard.jsx (Application Card - Candidate View)
**File:** [src/components/Candidat/CandidatureCard.jsx](src/components/Candidat/CandidatureCard.jsx)

**Key Lines:**
- **Line 1-30:** Component props and state for displaying candidature info
  - Displays job posting information when candidate has applied
  - **Line 77-91:** Shows company logo or initials instead of candidate avatar

**Context:** Shows candidate's applications in their dashboard. Displays company information rather than candidate info directly.

---

### 1.5 ModalDetailsEntretien.jsx (Interview Details Modal)
**File:** [src/components/Entretiens/ModalDetailsEntretien.jsx](src/components/Entretiens/ModalDetailsEntretien.jsx)

**Key Lines:**
- **Line 40-49:** Candidate name extraction from interview data
  ```javascript
  var candidatName =
    interview.candidatName ||
    interview.candidatNom ||
    interview.candidat?.nom ||
    interview.candidatEmail ||
    interview.emailCandidat ||
    interview.email ||
    interview.candidature?.nom ||
    interview.candidature?.candidat?.nom ||
    "Candidat";
  ```

- **Line 50-57:** Candidate email extraction

**Context:** Shows interview details with candidate name displayed (no avatar shown in this modal).

---

### 1.6 EntretienModal.jsx (Schedule Interview Modal)
**File:** [src/components/Recrutement/EntretienModal.jsx](src/components/Recrutement/EntretienModal.jsx)

**Key Lines:**
- **Line 85:** Candidate name displayed in modal header
  ```javascript
  {candidate.name}
  ```

**Context:** Modal for scheduling a new interview. Shows candidate name as subtitle when confirming scheduling.

---

### 1.7 LigneUtilisateur.jsx (User/Admin Row Display)
**File:** [src/components/Utilisateurs/LigneUtilisateur.jsx](src/components/Utilisateurs/LigneUtilisateur.jsx)

**Key Lines:**
- **Line 18-26:** getInitials function
  ```javascript
  const getInitials = function (name) {
    return name
      .split(" ")
      .map(function (n) {
        return n[0];
      })
      .join("")
      .toUpperCase();
  };
  ```

- **Line 39-54:** Avatar/Initials display for users
  ```javascript
  {user.avatar ? (
    <img
      src={user.avatar}
      alt={userName}
      className="avatar-image h-10 w-10 rounded-[var(--rounded-pill)]"
    />
  ) : (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)]">
      {getInitials(userName)}
    </div>
  )}
  ```

- **Line 59-66:** User name and email display

**Context:** Displays users (admins/recruiters) in the users management table.

---

### 1.8 ColonnePipeline.jsx (Kanban Pipeline Column)
**File:** [src/components/Recrutement/ColonnePipeline.jsx](src/components/Recrutement/ColonnePipeline.jsx)

**Key Lines:**
- **Line 50-91:** Renders CandidateCard components
  ```javascript
  candidates.map(function (candidate) {
    return (
      <CandidateCard
        key={candidateId}
        name={candidate.name}
        role={candidate.role}
        appliedDate={candidate.appliedDate}
        avatar={candidate.avatar}
        score={candidate.score}
        scoreStatus={candidate.scoreStatus}
        hasIaReport={candidate.hasIaReport}
        draggable={true}
        onDragStart={...}
        onClick={...}
        isDragging={isDragging}
      />
    );
  })
  ```

**Context:** Container for displaying candidate cards in each stage of the recruitment pipeline (Candidature, Présélection, Entretien, Test technique, Offre).

---

### 1.9 EntretiensEnLigneTab.jsx (Online Interviews Tab)
**File:** [src/components/Entretiens/EntretiensEnLigneTab.jsx](src/components/Entretiens/EntretiensEnLigneTab.jsx)

**Key Lines:**
- **Line 43-63:** Displays candidate name and interview status
  - Shows upcoming/completed interview status with color coding
  - Extracts candidate name from candidature or interview data

**Context:** Tab in the interviews page showing online/visio interviews.

---

### 1.10 ModalDetailsCandidature.jsx (Application Details Modal)
**File:** [src/components/Candidat/ModalDetailsCandidature.jsx](src/components/Candidat/ModalDetailsCandidature.jsx)

**Key Lines:**
- **Line 1-26:** Component definition and data extraction
  - Shows candidature status and details
  - Does not display candidate avatar (shows job/company info instead)

**Context:** Details modal for a specific application/candidature.

---

## 2. PAGES DISPLAYING CANDIDATE INFORMATION

### 2.1 Recrutement.jsx (Recruitment Pipeline Page)
**File:** [src/pages/Recrutement.jsx](src/pages/Recrutement.jsx)

**Key Lines:**
- **Line 47-106:** mapCandidateCard function
  ```javascript
  function mapCandidateCard(c) {
    return {
      id: c._id,
      name: c.nom || c.candidat?.nom || c.email || "Candidat",  // Line 71
      role: c.offre?.poste || c.poste || "Poste",               // Line 72
      appliedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString(...),
      avatar: "",  // Line 89 - Empty by default
      score: normalizedScore,
      // ... other fields
    };
  }
  ```

- **Line 212-236:** Pipeline organization and candidate grouping
- **Line 240-250:** Drag and drop handlers for candidates between pipeline stages
- **Line 654:** Modal candidate display
- **Line 830:** Last move activity log showing candidate name

**Context:** Main recruitment pipeline page showing all candidates in kanban board layout with multiple stages.

---

### 2.2 ProfilCandidat.jsx (Candidate Profile Page)
**File:** [src/pages/Candidat/ProfilCandidat.jsx](src/pages/Candidat/ProfilCandidat.jsx)

**Key Lines:**
- **Line 13-35:** Calculate initials from candidate name
  ```javascript
  const initials = (candidat?.nom || "C")
    .split(" ")
    .map(function (w) {
      return w[0];
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();
  ```

- **Line 137-145:** Avatar/Initials display section
  ```javascript
  {photoUrl ? (
    <img
      src={photoUrl}
      alt={candidat?.nom || "Profil"}
      className="h-16 w-16 shrink-0 rounded-[var(--rounded-pill)]"
    />
  ) : (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--rounded-pill)]">
      {initials}
    </div>
  )}
  ```

- **Line 147-154:** Candidate name and email display
  ```javascript
  <h2 className="truncate font-display text-[21px] font-semibold">
    {candidat?.nom || "Candidat"}
  </h2>
  <p className="truncate font-body text-[14px]">
    {candidat?.email || ""}
  </p>
  ```

- **Line 192-250+:** Profile form with photo upload and CV upload sections

**Context:** Candidate's personal profile page where they can update their information, upload photo, and manage their CV.

---

### 2.3 EntretiensCandidat.jsx (Candidate Interviews Page)
**File:** [src/pages/Candidat/EntretiensCandidat.jsx](src/pages/Candidat/EntretiensCandidat.jsx)

**Key Lines:**
- **Line 1-80:** Interview data extraction and formatting
  - Shows scheduled interviews for candidate
  - Extracts candidate's applications (candidatures) to find interviews
  - Displays interview details (date, time, type, company, position)

**Context:** Candidate-facing page showing their scheduled interviews.

---

### 2.4 Entretiens.jsx (Interviews Management Page)
**File:** [src/pages/Entretiens.jsx](src/pages/Entretiens.jsx)

**Key Lines:**
- **Line 40-89:** Helper functions for candidate/interview data extraction
- **Line 48:** Candidate email extraction
  ```javascript
  candidature?.candidatEmail ||
  ```
- **Line 263:** More candidate email handling
- **Line 335:** Email extraction from payload

**Context:** Admin page for managing all interviews across all candidates and recruiters.

---

## 3. INITIALS GENERATION PATTERNS

### Pattern 1: Full Name Initials (Most Common)
Used in: CarteCandidat.jsx, ModalCandidat.jsx, ProchainsEntretiens.jsx, LigneUtilisateur.jsx, ProfilCandidat.jsx

```javascript
const initials = name
  .split(" ")
  .map(function (n) {
    return n[0];
  })
  .join("")
  .toUpperCase();
```

**Result:** "John Doe" → "JD", "Marie Claire" → "MC"

### Pattern 2: First & Last Name Initials
Used in: ProchainsEntretiens.jsx (Line 6-11)

```javascript
function getInitials(name) {
  if (!name) return "??";
  var parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
```

**Result:** "John Doe" → "JD", "Marie" → "MA"

### Pattern 3: Limited to 2 Characters
Used in: ProfilCandidat.jsx (Line 13-35)

```javascript
const initials = (candidat?.nom || "C")
  .split(" ")
  .map(function (w) {
    return w[0];
  })
  .join("")
  .slice(0, 2)  // Limit to 2 chars
  .toUpperCase();
```

**Result:** "Jean Michel Paul" → "JM"

---

## 4. AVATAR DISPLAY PATTERN

### Consistent Pattern Used Across Components:
1. **If avatar exists:** Display image with fallback styling
2. **If no avatar:** Display colored div with initials

Used in:
- [CarteCandidat.jsx](#11-cartecandiditajsx-recruitment-pipeline-card) (Line 87-92)
- [ModalCandidat.jsx](#12-modalcandidatjsx-candidate-details-modal) (Line 161-177)
- [LigneUtilisateur.jsx](#17-ligneutilisateurjsx-useradmin-row-display) (Line 39-54)
- [ProfilCandidat.jsx](#22-profilcandidatjsx-candidate-profile-page) (Line 137-145)

**Note:** `avatar` field is typically empty ("") in candidate cards but can be set from `candidat.photo_url` in profile pages.

---

## 5. DATA SOURCES FOR CANDIDATE NAMES

### Direct from API:
- `c.nom` - French field name for "name"
- `c.candidat?.nom` - Candidate name from nested candidat object
- `c.name` - English field name
- `candidat?.nom` - Candidate object name field
- `candidate.name` - Modal/component prop

### Fallbacks:
- `c.email` or `c.candidat?.email` - If name not available
- `"Candidat"` - Default value

### Examples in Code:
- [Recrutement.jsx Line 71](src/pages/Recrutement.jsx#L71): `name: c.nom || c.candidat?.nom || c.email || "Candidat"`
- [ProchainsEntretiens.jsx Line 59-64](src/components/TableauDeBord/ProchainsEntretiens.jsx#L59): `candidatName = e.candidature?.nom || e.candidature?.candidat?.nom || e.candidature?.email || "Candidat"`
- [ModalDetailsEntretien.jsx Line 40-49](src/components/Entretiens/ModalDetailsEntretien.jsx#L40)

---

## 6. CANDIDATE DISPLAY IN DIFFERENT CONTEXTS

### Recruitment Pipeline (Admin View)
- **Component:** [CarteCandidat.jsx](#11-cartecandiditajsx-recruitment-pipeline-card)
- **Page:** [Recrutement.jsx](#21-recrutementjsx-recruitment-pipeline-page)
- **Display:** Name + Initials/Avatar + Role + IA Score + Applied Date
- **Interactive:** Draggable between pipeline stages

### Candidate Profile (Candidate View)
- **Page:** [ProfilCandidat.jsx](#22-profilcandidatjsx-candidate-profile-page)
- **Display:** Name + Photo/Initials + Email + Form fields
- **Interactive:** Editable fields, can upload photo and CV

### Interviews Management
- **Page:** [Entretiens.jsx](#24-entretienspage-interviews-management-page)
- **Components:** [ModalDetailsEntretien.jsx](#15-modaldetailsentretienojsx-interview-details-modal), [EntretiensEnLigneTab.jsx](#19-entretiensenligneetabojsx-online-interviews-tab)
- **Display:** Candidate name + Interview status + Interview details

### Dashboard Widgets
- **Component:** [ProchainsEntretiens.jsx](#13-prochainsentiensojsx-upcoming-interviews-dashboard-widget)
- **Display:** Candidate initials + Name + Role + Interview type + Time

---

## 7. KEY FIELDS AND ATTRIBUTES

| Field | Type | Used In | Purpose |
|-------|------|---------|---------|
| `candidat.nom` / `c.nom` | String | All pages | Candidate name display |
| `candidat.email` / `c.email` | String | All components | Fallback name source, contact info |
| `candidat.photo_url` | String | ProfilCandidat.jsx | Profile photo display |
| `candidate.avatar` | String | CarteCandidat, ModalCandidat | Candidate avatar in cards/modals |
| `candidate.name` | String | Components (props) | Prop for candidate name |
| `candidate.role` | String | CarteCandidat, ColonnePipeline | Job position display |
| `candidat.cv_url` / `c.cv_url` | String | ProfilCandidat, ModalCandidat | CV file reference |
| `c.scoreIA` / `c.score_ia` | Number | CarteCandidat, ModalCandidat | IA matching score |

---

## 8. SUMMARY TABLE

| Component/Page | Initials Display | Avatar Display | Name Display | Context |
|---|---|---|---|---|
| [CarteCandidat](#11-cartecandiditajsx-recruitment-pipeline-card) | ✓ Yes (Line 24-30) | ✓ Yes (Line 87-92) | ✓ Yes (Line 99-101) | Pipeline card |
| [ModalCandidat](#12-modalcandidatjsx-candidate-details-modal) | ✓ Yes (Line 82-88) | ✓ Yes (Line 161-177) | ✓ Yes (Line 181) | Details modal |
| [ProchainsEntretiens](#13-prochainsentiensojsx-upcoming-interviews-dashboard-widget) | ✓ Yes (Line 72) | ✗ Only Initials (Line 125) | ✓ Yes (Line 129) | Dashboard widget |
| [CandidatureCard](#14-candidaturecardojsx-application-card--candidate-view) | ✗ No | ✗ No (company logo instead) | ✗ No | Application card |
| [ModalDetailsEntretien](#15-modaldetailsentretienojsx-interview-details-modal) | ✗ No | ✗ No | ✓ Yes (Line 40-49) | Interview details |
| [EntretienModal](#16-entretienmodalojsx-schedule-interview-modal) | ✗ No | ✗ No | ✓ Yes (Line 85) | Schedule interview |
| [LigneUtilisateur](#17-ligneutilisateurjsx-useradmin-row-display) | ✓ Yes (Line 18-26) | ✓ Yes (Line 39-54) | ✓ Yes (Line 59-66) | User management |
| [ColonnePipeline](#18-colonnepipelineojsx-kanban-pipeline-column) | ✓ (via CarteCandidat) | ✓ (via CarteCandidat) | ✓ (via CarteCandidat) | Pipeline column |
| [EntretiensEnLigneTab](#19-entretiensenligneetabojsx-online-interviews-tab) | ✗ No details | ✗ No details | ✓ Yes | Interviews tab |
| [ModalDetailsCandidature](#110-modaldetailscandidatureojsx-application-details-modal) | ✗ No | ✗ No | ✗ No | Candidature details |
| [Recrutement](#21-recrutementjsx-recruitment-pipeline-page) | ✓ (via CarteCandidat) | ✓ (via CarteCandidat) | ✓ (via CarteCandidat) | Pipeline page |
| [ProfilCandidat](#22-profilcandidatjsx-candidate-profile-page) | ✓ Yes (Line 13-35) | ✓ Yes (Line 137-145) | ✓ Yes (Line 147-154) | Profile page |
| [EntretiensCandidat](#23-entretienscanditatjsx-candidate-interviews-page) | ✗ No display | ✗ No display | ✓ (from data) | Candidate interviews |
| [Entretiens](#24-entretienspage-interviews-management-page) | ✗ No display | ✗ No display | ✓ (extracted) | Interviews mgmt |

---

## 9. GRADIENT COLORS FOR INITIALS

Used in: [CarteCandidat.jsx](src/components/Recrutement/CarteCandidat.jsx)

```javascript
const gradients = [
  "from-pink-400 to-rose-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
];

const gradientIndex = name
  .split("")
  .reduce(function (acc, char) {
    return acc + char.charCodeAt(0);
  }, 0) % gradients.length;
```

**Purpose:** Generate consistent, deterministic gradient colors for candidate cards based on their name.

---

## 10. STYLING CLASSES FOR AVATARS

### Border Radius (Rounded Pills):
- `rounded-[var(--rounded-pill)]` - Full circular avatar
- `rounded-xl` / `rounded-[var(--rounded-lg)]` - Slightly rounded avatar container

### Size Classes:
- `h-10 w-10` - Small avatar (used in list items)
- `h-14 w-14` - Medium avatar (used in modal headers)
- `h-16 w-16` - Large avatar (used in profile pages)

### Background for Initials:
- `bg-gradient-to-br from-{color1} to-{color2}` - Gradient background
- `var(--color-canvas-parchment)` - Default light background
- `rgba(255,255,255,0.18)` - Translucent white (in modal headers)

### Text Styling:
- `font-text text-xs font-semibold` - Small initials
- `font-text text-sm font-semibold` - Medium initials
- `font-display text-xl font-semibold` - Large initials

---

## 11. NOTES AND OBSERVATIONS

1. **Avatar Field:** The `avatar` field in candidate cards is typically empty in recruitment pipeline (`avatar: ""` in [Recrutement.jsx Line 89](src/pages/Recrutement.jsx#L89))

2. **Photo URL:** Candidate profile photos are stored at `candidat.photo_url` and accessed via `{apiUrl}/profile-photos/{candidat.photo_url}`

3. **Initials Fallback:** All components use initials as fallback when avatar is not available

4. **Consistent Patterns:** All avatar displays follow the same pattern: image or initials in rounded container

5. **Color Coding:** IA scores in recruitment pipeline are color-coded:
   - Red: ≤ 40 (Low)
   - Amber/Orange: 41-69 (Medium)
   - Green/Emerald: ≥ 70 (High)

6. **Data Structure:** Candidate data can come from multiple nested paths:
   - Direct fields: `c.nom`, `c.email`
   - Nested fields: `c.candidat?.nom`, `c.candidat?.email`
   - Combined: `c.nom || c.candidat?.nom || c.email`

7. **French/English Mix:** Some fields use French naming (`nom`, `poste`, `offre`) while others use English (`name`, `role`, `avatar`)

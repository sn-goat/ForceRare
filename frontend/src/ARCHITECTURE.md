# Frontend Architecture (v4)

## Goal
Mobile-first charity website for **Force Rare** — a student-athlete-led
nonprofit supporting families affected by rare diseases in Québec.
Partnerships with RQMO, Fonds Mille-Pattes, and CHUL.
All visible text is in **French** and centralised in `ContentService`.

---

## Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Angular 21 (standalone components, signals) |
| Styling | SCSS + CSS custom properties (design tokens) |
| HTTP | `HttpClient` via `provideHttpClient()` |
| Routing | Angular Router (8 routes + wildcard) |
| Build | Angular CLI / esbuild |
| Dev server | `ng serve` inside Docker (port 4200) |

---

## Design Tokens (theming)
All colours live in CSS custom properties so the theme can switch
(red now → blue later) by swapping one token file.

```scss
// src/styles.scss  (root tokens)
:root {
  --color-primary:       #D32F2F;
  --color-primary-dark:  #B71C1C;
  --color-primary-light: #EF5350;
  --color-accent:        #FFC107;
  --color-accent-dark:   #FFA000;
  --color-surface:       #FFFFFF;
  --color-surface-alt:   #F5F5F5;
  --color-surface-dark:  #1A1A2E;
  --color-text:          #212121;
  --color-text-light:    #757575;
  --color-text-muted:    #9E9E9E;
  --color-on-primary:    #FFFFFF;
  --color-on-dark:       #F5F5F5;

  --font-heading: 'Montserrat', sans-serif;
  --font-body:    'Open Sans', sans-serif;

  --section-padding:     5rem 1.5rem;
  --section-padding-sm:  3rem 1rem;
  --max-content-width:   1200px;
  --navbar-height:       70px;
  --border-radius:       8px;
  --border-radius-lg:    16px;
  --transition-speed:    0.3s;
}
```

---

## Site Map
```
/                 → HomePage    (7 sections)
/notre-histoire   → NotreHistoirePage
/notre-mission    → NotreMissionPage
/notre-equipe     → NotreEquipePage
/nos-partenaires  → NosPartenairesPage
/collaborer       → CollaborerPage
/nous-joindre     → NousJoindrePage
/faire-un-don     → FaireUnDonPage
**/*              → redirect to /
```

---

## Component Tree

```
AppComponent
├── NavbarComponent            (layout/)
├── <router-outlet>
│   ├── HomePage
│   │   ├── HeroComponent
│   │   ├── AboutPreviewComponent
│   │   ├── VideoShowcaseComponent
│   │   ├── ImpactStatsComponent
│   │   ├── MissionSectionComponent
│   │   ├── PartnersStripComponent
│   │   ├── FaqComponent
│   │   └── CtaBannerComponent
│   ├── NotreHistoirePage       (pages/notre-histoire/)
│   ├── NotreMissionPage        (pages/notre-mission/)
│   ├── NotreEquipePage         (pages/notre-equipe/)
│   ├── NosPartenairesPage      (pages/nos-partenaires/)
│   ├── CollaborerPage          (pages/collaborer/)
│   ├── NousJoindrePage         (pages/nous-joindre/)
│   └── FaireUnDonPage          (pages/faire-un-don/)
├── FooterComponent            (layout/)
└── DonateFabComponent         (layout/)
```

### Folder structure

| Folder | Purpose | Contents |
|--------|---------|---------|
| `layout/` | App-wide chrome, always visible | Navbar, Footer, DonateFab |
| `pages/` | Route-level page containers | 8 page components |
| `components/` | Reusable section blocks | Hero, AboutPreview, VideoShowcase, ImpactStats, MissionSection, TeamSection, PartnersStrip, CtaBanner, Faq, PageHero |
| `models/` | TypeScript interfaces | ImageAsset, VideoAsset |
| `services/` | Business logic + data | ContentService, ImageService, VideoService |

---

## Shared components

| Component | Used by | Props |
|-----------|---------|-------|
| `PageHeroComponent` | All 7 secondary pages | `title`, `subtitle`, `backgroundImage?` |
| `FaqComponent` | HomePage + all secondary pages | _(self-contained via ContentService)_ |
| `CtaBannerComponent` | HomePage + most secondary pages | _(self-contained via ContentService)_ |
| `TeamSectionComponent` | NotreEquipePage (homepage removed) | _(uses ContentService.getFounders())_ |
| `PartnersStripComponent` | HomePage | _(uses ContentService.getPartners())_ |

---

## Data Flow

### ContentService (single source of truth)
All French text lives in `ContentService`. Templates use data bindings
(`{{ page.hero.title }}`, `@for` loops) — no hardcoded French in HTML.

| Method | Returns | Consumers |
|--------|---------|-----------|
| `getNavLinks()` | `NavLink[]` | Navbar, Footer |
| `getFounders()` | `FounderInfo[]` | TeamSection, NotreEquipePage |
| `getPartners()` | `PartnerInfo[]` | PartnersStrip, NosPartenairesPage |
| `getHome()` | `HomeContent` | Hero, AboutPreview, ImpactStats, MissionSection |
| `getFooter()` | `FooterContent` | Footer, NousJoindrePage |
| `getFaq()` | `FaqItem[]` | Faq |
| `getNotreHistoire()` | `NotreHistoireContent` | NotreHistoirePage |
| `getNotreMission()` | `NotreMissionContent` | NotreMissionPage |
| `getNotreEquipe()` | `NotreEquipeContent` | NotreEquipePage |
| `getNosPartenaires()` | `NosPartenairesContent` | NosPartenairesPage |
| `getCollaborer()` | `CollaborerContent` | CollaborerPage |
| `getNousJoindre()` | `NousJoindreContent` | NousJoindrePage |
| `getFaireUnDon()` | `FaireUnDonContent` | FaireUnDonPage |

### API-driven data

| Service | Endpoint | Used by |
|---------|----------|---------|
| `ImageService` | `GET /api/images/?category=` | Hero, AboutPreview, TeamSection, NotreEquipePage, NotreHistoirePage, NotreMissionPage, NosPartenairesPage, CollaborerPage, NousJoindrePage, FaireUnDonPage, PageHero (bg) |
| `VideoService` | `GET /api/videos/` | VideoShowcaseComponent |

---

## SCSS Architecture

### Global styles (`styles.scss`)
- Design tokens (CSS custom properties)
- CSS reset
- Utility classes: `.section`, `.section__inner`, `.section-heading`, `.section-subtext`
- Buttons: `.btn-primary`, `.btn-outline`
- Shared content-page classes: `.content-narrow`, `.accent-bar`, `.content-section`, `.content-lead`, `.content-heading`, `.content-body`, `.check-list`
- Scroll-reveal animation: `.reveal`

### Component SCSS
Each component has its own `.scss` file with page-specific styles only.
Shared content-page classes are defined globally to avoid duplication.

---

## Backend API Contract
All endpoints are **read-only** (GET). 69 tests passing.

| Endpoint | Query params | Returns |
|----------|-------------|---------|
| `GET /api/images/` | `?category=hero\|founder\|partner\|about\|event\|general` | `ImageAsset[]` |
| `GET /api/images/:id/` | — | `ImageAsset` |
| `GET /api/videos/` | `?category=` | `VideoAsset[]` |
| `GET /api/videos/:id/` | — | `VideoAsset` |

Nginx proxies `/api/` → backend:8000 and `/media/` → backend:8000.

---

## Status

### Completed
- [x] Design tokens + global styles
- [x] Layout shell: Navbar, Footer, DonateFab (animated)
- [x] 8-route routing with wildcard redirect
- [x] Homepage: 7 sections (Hero, About, Video, Stats, Mission, Partners, FAQ, CTA)
- [x] 7 secondary pages fully data-driven from ContentService
- [x] ContentService: all French text centralised (~810 lines)
- [x] Backend API: ImageAsset + VideoAsset with category filtering (69 tests)
- [x] Image integration: founder photos on team page
- [x] Shared SCSS extracted to global styles
- [x] Footer nav links from ContentService
- [x] Impact card emojis replaced with numbered corporate icons
- [x] Image integration on all secondary pages (hero backgrounds + inline images)
- [x] Corporate visual refinement (refined shadows, decorative elements, hover effects, section separators)
- [x] Lazy-load images (`NgOptimizedImage` with `ngSrc` directive on all images)
- [x] PageHero enhanced with optional background image + overlay + wave separator
- [x] Use relevant images and videos
- [x] Backend email endpoint for contact form


### Planned
- [ ] Use relevant images, texts and videos

---

## Conventions
- **Standalone components** — no NgModules.
- **Signals** for reactive state (Angular 21 pattern).
- **SCSS** per component, shared content classes in `styles.scss`.
- **Mobile-first** — base styles target phones, `@media` widens.
- **BEM-ish** class naming inside component SCSS.
- **No third-party UI libs** — hand-rolled components for full control.
- **All French text in ContentService** — templates are data-driven with `@for` loops.
- **Single source of truth** — founders/partners data defined once, used by multiple components.

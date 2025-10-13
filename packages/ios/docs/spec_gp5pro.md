Here’s a solid spec for **Orbiting**—tight, testable, and ready to hand to eng/QA. I also dropped it as a Markdown doc: **[Download the spec](sandbox:/mnt/data/orbiting-spec.md)**.

---

# Orbiting — Product & Technical Specification (v1.0)

**One‑liner:** A cross‑platform, offline‑first “big text” messenger for showing short messages to people near you—fast, legible, and accessible—on web, iOS, and Android.

## Goals

* Fast, legible full‑screen text with minimal chrome.
* Gesture‑first controls; works one‑handed and in loud/quiet spaces.
* Runs everywhere (iOS/Android/PWA); offline by default.
* Private by default; no account or cloud storage.
* Accessible and multilingual.

**Non‑goals (v1):** Real‑time rooms/sync; accounts; rich text.

## Core Use Cases

* Quiet zones: “Back in 5,” “Row 12,” allergy notices, door signs.
* Loud zones: event signage, airport pickup, crowd messaging.
* Facilitation: quick prompts, room changes, timing cues.
* Accessibility: ultra‑legible static text, high contrast.

## User Stories

* Type → message auto‑fills the screen for maximum legibility.
* Clear instantly (swipe left or button).
* Open History (swipe right or up; or button), search, favorite, delete, clear all.
* Change UI language independent of device.
* Switch themes/contrast; set starting font size.
* Configure shake: clear | flash | none.
* On large web screens, see bottom bar actions.
* Screen readers get proper labels, roles, and hints.

---

## Feature Spec (v1)

### Home (Big Text Display)

* **FR‑1:** Auto‑size text to fit viewport (keyboard‑aware).
* **FR‑2:** Debounced input updates to avoid jank.
* **FR‑3:** Swipe left → clear text.
* **FR‑4:** Swipe up or right → open History.
* **FR‑5:** Shake action configurable: `clear` | `flash` | `none`.
* **FR‑6:** Persist non‑empty messages to local history.
* **FR‑7:** On web ≥768px, show BottomBar (Clear/History).
* **FR‑8:** Hide UI chrome while typing; keyboard friendly.

**Acceptance:** Typing “HELLO” fills ~90–100% of safe viewport without clipping. Swipe/Shake behave within 200ms. Clear leaves empty state.

### History

* **FR‑9:** Schema: `{ id, text, timestamp, isFavorite? }` (local only).
* **FR‑10:** Newest‑first, paged/infinite load; case‑insensitive search.
* **FR‑11:** Per‑row: redisplay to Home, favorite toggle, delete.
* **FR‑12:** Bulk Clear All (destructive confirm).
* **FR‑13:** Tabs: All / Favorites.
* **FR‑14:** Search matches substrings (diacritics tolerant if available).

**Acceptance:** Search “tax” hits “TAXI/Tax Free”. Favorites update instantly. Clear All empties list only after confirm.

### Settings

* **FR‑15:** Language selector persists. Supported: `en`, `de`, `pt`, `es`, `fr`, `hi`, `bn`, `id`, `zh`, `zh_TW`, `ko`, `ja`.
* **FR‑16:** Theme selector (mono, contrast, neon, candy, classic, sunset, forest, ocean, mint) with light/dark variants.
* **FR‑17:** Color scheme: light | dark | system.
* **FR‑18:** Starting font size preset (16–40; default 24).
* **FR‑19:** Shake: clear | flash | none (default none).
* **FR‑20:** Reset to defaults (confirm).

**Acceptance:** Theme/language switch live‑updates UI, persists via AsyncStorage.

### Help & About

* **FR‑21:** Help: gestures, platform tips, a11y aids.
* **FR‑22:** About: purpose, credits, version.

### PWA / Install

* **FR‑23:** Service worker caches shell & static assets for offline.
* **FR‑24:** Installable manifest; install hints when eligible.
* **FR‑25:** OG meta tags for rich link previews.

---

## Non‑Functional

### Performance

* **P‑1:** Web TTI ≤ 3.0s on 4G mid‑tier.
* **P‑2:** Keystroke‑to‑paint ≤ 16ms for short strings.
* **P‑3:** Auto‑resize compute ≤ 25ms for <100 chars.

### Accessibility

* **A‑1:** Roles/labels/hints on controls; sane focus mgmt.
* **A‑2:** Keyboard navigation order logical; visible focus on web.
* **A‑3:** UI chrome meets WCAG AA; big‑text canvas targets ≥7:1 when applicable.
* **A‑4:** Dynamic type respected in non‑canvas UI.

### Reliability

* **R‑1:** Local data persists across restarts.
* **R‑2:** No unhandled rejections; ErrorBoundary recovery UI.
* **R‑3:** PWA offline shell works for previously loaded assets.

### Privacy/Security

* **S‑1:** No analytics by default in the app shell.
* **S‑2:** No server storage in v1.
* **S‑3:** Clipboard only on explicit action (if added).

---

## System Design

**Stack:** Expo (React Native), expo‑router, react‑native‑paper, i18next, AsyncStorage, react‑native‑gesture‑handler, react‑native‑shake.
**PWA:** Workbox SW, web manifest, OG tags.

```
App(_layout)
 ├─ Providers: Theme / i18n / Text / Settings
 ├─ Home (BigTextDisplay)
 └─ Tabs: History / Settings / Help / About
Storage: AsyncStorage (messages, settings, language)
Web: Service Worker + Manifest for PWA
```

**Data Model**

```ts
type Message = {
  id: string;        // uuid
  text: string;      // user-entered
  timestamp: number; // ms since epoch
  isFavorite?: boolean;
};
```

**Storage**

* Key `@messages` holds array.
* Atomic writes for add/toggle/delete/clear.
* Pagination uses offset/limit (cursor encodable as index/timestamp).

**i18n**

* i18next/react‑i18next; persisted locale via AsyncStorage.
* SUPPORTED_LANGUAGES surfaced to UI.

**Theming**

* Theme catalog maps ThemeType → MD3 theme variants with contrast‑safe palettes.

---

## Detailed Behaviors

**Auto‑Sizing**

* Compute available viewport (minus keyboard).
* Fit via binary search or stepped descent; debounce ~100–150ms; cancel on unmount.

**Gestures**

* Swipe left → clear; right/up → history; shake → clear/flash/none.
* Haptics where available.

**History Ops**

* Dedup identical consecutive entries on add.
* Favorite toggles in place; Clear All is destructive.

**Web Bottom Bar**

* Only `Platform.OS === 'web' && width >= 768`; accessible labels/hints; visible focus.

---

## APIs / Integrations

* **None (v1).** Local only.
* **Future (v2):** Firebase Functions + Firestore/RTDB “Rooms” for ephemeral broadcast.

---

## Telemetry (Dev/Opt‑in)

* Events: `message_shown`, `message_cleared`, `favorite_toggled`, `history_cleared`, `language_changed`, `theme_changed`, `shake_fired`.
* Default sink disabled; redact message text unless explicit opt‑in.

---

## QA Plan

**Unit/Component**

* storageUtils (store/get/toggle/delete/clear).
* BigTextDisplay sizing + debounce.
* Home gestures routing.
* History search/paging/favorites.
* Settings persistence.
* ErrorBoundary fallback.

**A11y**

* Roles/labels/hints, focus order, contrast checks, keyboard nav.

**PWA**

* SW registration; offline shell; manifest validation; install prompts.

**Perf**

* Keystroke latency and resize time; 60fps under typical input.

---

## Release & Deployment

* **Build:** `expo export -p web` + `workbox-cli generateSW`; EAS for native.
* **Deploy:** Firebase Hosting for web; App Store / Play (bundle id `com.harperrules.orbiting`).
* **Versioning:** SemVer via `app.json` + CI tags.

---

## Risks & Mitigations

* OS gesture conflicts → thresholds, explicit buttons, allow disabling gestures (v1.1).
* Auto‑size jank on long strings → clamp min font, add manual nudge (v1.1).
* A11y regressions → CI a11y checks.
* Local store corruption → try/catch, optional last‑good snapshot (v1.1).

---

## Roadmap

* **v1.1:** Disable‑gestures toggle; manual font size nudge; export/import history (JSON); mirror mode.
* **v1.2:** Quick presets; color inversion; kiosk lock.
* **v2.0:** Rooms (Firebase), presence, moderator tools, session‑scoped history.

---

## Definition of Done

* All FRs implemented with tests.
* A11y pass; perf budgets met.
* Help/About updated.
* No console errors; ErrorBoundary unused in happy paths.
* i18n parity across supported languages.

---

## Open Questions

* Persist exact computed font size per message for perfect re‑display?
* “Pin message” mode to prevent accidental clears?
* Flash behavior adapt to theme brightness automatically?
* Export formats: TXT vs JSON with timestamps/favorites.


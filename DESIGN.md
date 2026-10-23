# THRIVE v3 (1.1.0) — Redesign Spec

Release: source **v3**, app version **1.1.0**, iOS build **5**. Submitted to App Review together
with the review notes in `APP_REVIEW_NOTES.md`, which describe all changes since **v2 (build 4)**.

---

## 1. Goals

| Goal | What it means in practice |
|---|---|
| Modern, current-iOS look | iOS 26 "Liquid Glass" language, system fonts, SF Symbols, grouped backgrounds |
| Better shop picker | Original illustrated tile per shop, no trademark risk, ordered by the person's own habits |
| Smaller app | No bundled font files; unused native code removed |
| Easy for teens | Two-tap logging, a skippable welcome, one-question-at-a-time check-in, plain copy |
| Multilingual | English, 简体中文, 繁體中文, Español, 日本語, 한국어 |
| Zero-rejection | Nothing hidden, nothing that only looks like it works, honest data labels |

---

## 2. Visual system

### 2.1 Layers and materials
- **Content** sits on solid cards (`card` token, 22 pt continuous corners, no heavy shadows;
  hairline border in dark mode).
- **Glass is only for the navigation layer**: the floating tab bar, the bottom search bar on Log,
  the Undo toast and the inline title bar that fades in when the large title scrolls away.
  This is how Apple's HIG uses Liquid Glass.
- `Glass` (`src/ui/chrome.tsx`):
  - iOS 26+: real Liquid Glass (`expo-glass-effect`, interactive on the tab bar);
  - older iOS / web: system material blur (`expo-blur`, `systemChromeMaterial`);
  - Android, or iOS with **Reduce Transparency** on: translucent / solid surface.
- A soft mint + indigo ambient light sits behind the top of each tab screen so the glass has
  something to refract.

### 2.2 Color tokens (`src/theme/tokens.ts`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | #F2F2F7 | #000000 | Grouped background |
| `card` | #FFFFFF | #1C1C1E | Content cards |
| `tint` | #008577 | #3DDCCB | Buttons, selected chips, active tab |
| `tintText` | #00796F | #3DDCCB | Links, tinted labels |
| `caffeine` / `caffeineText` | #FF8A00 / #B85A00 | #FF9F0A / #FFB340 | mg numbers, streak |
| `sleep` | #5E5CE6 | #7D7AFF | Sleep, XP, rank |
| `good` / `goodText` | #30B565 / #1B7F42 | #30D158 | On-track states |
| `danger` / `dangerText` | #FF3B30 / #D70015 | #FF453A / #FF6961 | Over goal, delete |

All text colors are ≥ 4.5:1 on their backgrounds (white on the light `tint` button is 4.54:1).
`alpha()` only tints `#RRGGBB` colors, so any color passed to `Pill` must be hex.

### 2.3 Typography
- System font only: SF Pro on iOS, Roboto on Android. CJK falls back to PingFang /
  Hiragino / Apple SD Gothic automatically, which bundled Latin fonts could not do.
- Apple text styles: largeTitle 34 · title1 28 · title2 22 · title3 20 · headline 17 semibold ·
  body 17 · callout 16 · subhead 15 · footnote 13 · caption 12 · caption2 11.
- Numbers (ring, stats, mg) use **SF Pro Rounded** (`ui-rounded`) with tabular figures.
- **No custom `letterSpacing`**: SF Pro already applies Apple's per-size tracking, so adding the
  HIG values again would make text too tight.
- Dynamic Type is on everywhere; only big display numbers and tab labels cap their scale
  (`maxFontSizeMultiplier` 1.15–1.4) so layouts don't break.

### 2.4 Icons
- iOS: **SF Symbols** through `expo-symbols` (`src/ui/Icon.ios.tsx`) — zero bundle size, native
  weights. Every symbol is SF Symbols ≤ 4.0, so all exist on the app's iOS 16.4 minimum.
- Soft icon tiles use the **hierarchical** (two-tone) rendering; tab bar and buttons use monochrome.
- Android / web: Feather (`src/ui/Icon.tsx`) imported directly (`@expo/vector-icons/Feather`).
- One semantic name list (`src/ui/icons.ts`) maps to both, type-checked against the SF catalogue.

### 2.5 Motion and haptics
- Press feedback: a small scale-down on every tappable; spring animations for the toast and the
  bottom search bar.
- Haptics (`src/lib/haptics.ts`): **selection** for chips, segments, tabs and sleep faces;
  **success** when a drink is logged or the check-in is finished; **warning** for delete / erase.

---

## 3. Components (`src/ui/`)

| File | Contents |
|---|---|
| `primitives.tsx` | `T` (text styles), `Touch`, `Card`, `SectionHeader`, `IconTile`, `SoftIcon`, `Button` (primary / secondary / plain / destructive), `RoundButton` 44 pt, `Segmented`, `Chip` 44 pt, `Pill`, `ProgressBar`, `Group` + `Row` (inset grouped list) |
| `chrome.tsx` | `Glass`, `Ambient`, `GlassTabBar`, `Screen` (large title + fading inline title), `SheetHeader` (grabber + close / back), `SheetScreen` (pinned footer for primary actions), `UndoToast` |
| `BrandBadge.tsx` | Original drink illustrations (section 5) |
| `DrinkPicker.tsx` | `BrandTile`, `BrandHeader` (with "estimate only" note), `DrinkGroupCard` (one button per size) |
| `visuals.tsx` | Gradient `Ring`, `WeekBars`, `BedtimeMeter`, `Owl` mascot |
| `BedtimePicker.tsx` | One-tap bedtime chips + system wheel for other times |

---

## 4. Screens

| Screen | Layout (top → bottom) |
|---|---|
| **Onboarding** (first launch only) | 3 steps: Sage + 3 benefits + language chips → optional name + bedtime chips → "You're all set". "Skip" top-right; primary buttons at the bottom. Upgraders from v2 skip it. |
| **Home** | Greeting + settings gear → today ring (mg of 100) with bedtime status → streak/XP → **Quick log** tiles (one tap logs) → sleep rating (emoji faces) → Check-In card |
| **Log** | Large title + today's mg → "Have it again?" row → **shop grid (3 columns)** ordered by your use → today's drinks list. Search + "+" (custom drink) are **pinned at the bottom** above the tab bar and move up with the keyboard. Shop page: back chip, big badge, section chips, a card per drink with one button per size. |
| **Tonight** | Caffeine at bedtime (big number, color-coded) + meter → verdict card → last-call times per common drink → today's timeline → your pattern → tips by time of day |
| **Progress** | Week bars with dashed goal line → 3 stats → 14-day streak calendar → rank with owl and tiers |
| **Tools** | 2-column colored tiles: Swaps, Breathe, Ride out a craving, Healthy habits, Journal, Why it matters, Data sources |
| **Settings** (sheet) | Profile (name) → bedtime → language → appearance + mascot color → privacy promises → privacy policy / sources / support → erase all data |
| **Check-In** (sheet) | One question per screen, big answers at the bottom, auto-advance, progress bar → result with ring, tier and a "not a diagnosis" note |
| **Sources, tool details, Journal, Breathe** | Pushed screens with back button + edge-swipe; primary action (Breathe start/stop) pinned at the bottom |

Sheets use the native iOS page sheet (swipe down to dismiss). Settings → Data sources opens as a
sheet too, so it never lands underneath the Settings sheet.

---

## 5. Shop tiles

### 5.1 Trademark rules (Guideline 5.2)
- Shop names appear as plain text only, to identify drinks (nominative use).
- Each tile is a **generic object** drawn by THRIVE, in a hue picked to **avoid that brand's own
  colors**. No logos, wordmarks, mascots or trade dress.
- The Sources screen says THRIVE is not affiliated with any brand and that the pictures are
  THRIVE's own illustrations.

### 5.2 Tile list

| Shop / category | Drawing | Hue | Avoids |
|---|---|---|---|
| Starbucks | Blended drink, dome lid, straw | Caramel #C77C3C | Green, siren |
| Peet's | Hot paper cup, steam | Indigo #5E5CE6 | Brown/red |
| Dutch Bros | Tall iced cup, ice cubes | Teal #00A99D | Blue, windmill |
| Dunkin' | Donut with sprinkles | Violet #8E5CF7 | Orange/pink |
| McDonald's | To-go cup with sleeve | Sky #2F9BD6 | Red/yellow, arches |
| Panera | Mug with tea tag | Coral #FF6B6B | Green |
| Blue Bottle | Gable-top carton | Green #30B565 | Blue, bottle |
| Coffee Bean & Tea Leaf | Coffee bean | Amber #E0A000 | Purple |
| Happy Lemon | Cup with a citrus wheel (no face) | Lime #7FB52A | Yellow, smiling lemon |
| Chicha San Chen | Tea cup with a leaf | Plum #C2547A | — |
| Tiger Sugar | Cup with cream-mousse cap and pearls | Blue #3E7BFA | Tiger, stripes, black/orange |
| Kung Fu Tea | Lidded tea bowl (gaiwan) | Jade #1FA37A | Red |
| Gong Cha | Cup with a milk-foam layer | Orchid #C86FB0 | Red/gold, crown |
| Boba / milk tea | Boba cup with pearls | Purple #AF52DE | — |
| Energy drinks | Can with bolt | Orange #FF8A00 | — |
| Soda & bottled | Can with fizz | Raspberry #E8336D | Bottle contours |
| Made at home | Mug with heart | Slate #64748B | — |

### 5.3 Order: by the person's own habits
`brandsByUse()` in `src/state/AppState.tsx` counts the person's stored logs per shop (up to
60 days), **most-logged first**; ties go to the most recently logged, then the default order.
A fresh install shows the default order; once anything is logged the grid shows
"Sorted by what you log most". Custom drinks have no shop and don't count. Everything is
computed on the phone from that person's own data.

---

## 6. Drink data

### 6.1 Labels
Every drink is tagged **Brand-published**, **Third-party report** or **Estimate**, linked to a
source on the Sources screen. Values were checked on `DATA_CHECKED` (2026-09-30); the tea-shop
menus were checked in October 2026.

### 6.2 Tea shops (Happy Lemon, Chicha San Chen, Tiger Sugar, Kung Fu Tea, Gong Cha)
None of them publish caffeine, so **every drink is an Estimate** and each shop page shows a note
saying so ("check with the shop if you can"). Menu names come from each chain's US online menu.
Cup sizes aren't published either, so they are shown as approximate (`~16 oz`, `~24 oz`, with
`~` ml in other languages).

| Drink type | Estimate per ~16 oz / ~24 oz | Basis |
|---|---|---|
| Milk tea (black, oolong, Earl Grey, Thai, brown-sugar) | 150 / 225 mg | Taiwanese-style milk tea, lab mean ≈ 320 mg/L (HK Centre for Food Safety) |
| Green-tea milk tea | 65 / 95 mg | Milk-tea value × 18/42 (green vs black brewed tea) |
| Black tea (plain / cheese foam) | 85 / 125 mg | 42 mg per 8 oz brewed black tea (Caffeine Informer) |
| Oolong (plain / fruit / cheese foam) | 75 / 110 mg | 37 mg per 8 oz (Caffeine Informer) |
| Green / fruit tea | 35 / 55 mg | 18 mg per 8 oz (Caffeine Informer) |
| Milk drinks listed with no tea or coffee (Tiger Sugar brown-sugar boba milk, Gong Cha taro milk) | 0 mg | The shop's own menu lists no tea or coffee |

Plain-tea figures are an upper bound (ice and fruit replace some tea), which errs on the side of
protecting sleep.

### 6.3 Generic boba, soda, energy, made at home
Unchanged from v2, except the green-tea source now points to the Caffeine Informer green tea page,
which actually states 18 mg (v2 linked the black-tea page).

---

## 7. Teen-friendly design
- Log in **two taps** (shop → size), or **one tap** from Home's Quick log or "Have it again?".
- Search works in your own language: 冰拿铁, 老虎堂, 貢茶, アイスラテ, 아아, café helado map to menu
  words on the phone.
- Emoji sleep faces; Check-In is one question per screen with big buttons.
- Short, friendly copy; health text always says "not a diagnosis" and suggests a parent, school
  counselor or doctor.
- Bedtime picked with chips (9:30 PM … 12:00 AM) instead of a time wheel.

## 8. Ergonomics (UI_UX_ERGONOMICS_GUIDE)
- **Top 25%**: large titles and passive numbers. The only top control is the low-frequency
  Settings gear on Home; the Settings sheet it opens closes with a swipe down.
- **Thumb zone**: tab bar, Log search + "+", quick-log tiles, sleep faces, Check-In answers,
  onboarding and sheet primary buttons.
- **Gestures**: sheets swipe down to dismiss; pushed screens swipe from the edge to go back.
- **Touch targets** ≥ 44 pt (buttons, chips, back chip, list rows, tab items, trash buttons).
- **Keyboard**: the Log search / custom-drink panel rides on top of the keyboard; scroll content
  grows so results stay reachable; Journal uses a keyboard-avoiding view and saves on exit.

## 9. Languages
- `src/i18n/en.ts` is the source of truth; `zh-Hans`, `zh-Hant` (Taiwan), `es` (Latin America),
  `ja`, `ko` are type-checked against it, so a missing key fails `npx tsc --noEmit`.
- Follows the phone's language list (`expo-localization`), iOS per-app language
  (`CFBundleLocalizations`), plus an override in Settings → Language.
- Times and weekdays use `Intl`; outside English, oz sizes also show ml.
- Shop and menu names stay as the brand writes them; categories, generic drinks and size words
  are translated.

## 10. Size

| | v2 (build 4) | v3 (build 5) |
|---|---|---|
| iOS JS bundle + assets (`expo export`) | 11 MB | 2.9 MB |
| Font files bundled on iOS | 8.1 MB (19 icon fonts + 10 Google font files) | 0 |
| Android JS bundle + assets | — | 4.2 MB (Feather 56 KB + a 963 KB Material Symbols font pulled in by expo-router) |

How: system fonts instead of Fraunces / Manrope / IBM Plex Mono; SF Symbols on iOS; the root
`@expo/vector-icons` import (which pulled every icon font) replaced by a direct Feather import;
unused `react-native-reanimated` + `react-native-worklets` removed; Android release builds use R8
minify, resource shrinking and PNG crunching (`expo-build-properties`).

## 11. App icon and splash
Mint → teal → indigo gradient with a white Sage owl. iOS ships **light, dark and tinted** icon
variants (`ios.icon` in `app.json`); Android has an adaptive icon with a monochrome layer; the
splash uses the owl on #F2F2F7 (light) / #000 (dark).

## 12. Compliance summary

| Guideline | Status |
|---|---|
| 2.1 Completeness | No placeholder text, every button works, custom not-found screen |
| 2.3.1 / 5.6 Hidden or misleading | No flags, remote config or date/region logic; onboarding is skippable and unlocks nothing; all numbers labeled with their source type |
| 1.4.1 Medical | Reflection tool, "not a diagnosis" in all languages, 100 mg described as guidance |
| 4.0 Design | Dark Mode, Dynamic Type, 44 pt targets, native sheets and back gestures, Reduce Transparency respected |
| 5.1.1 Privacy | No data collected, no permissions, privacy manifest matches AsyncStorage use, erase-all-data with confirmation |
| 5.2 Intellectual property | Original drawings, non-brand colors, disclaimer, no brand names in app name / subtitle / keywords |

## 13. QA done for v3
- `npx tsc --noEmit` clean; `expo export` succeeds for iOS, Android and web.
- Screens checked on web at iPhone size in light/dark and all six languages (onboarding, every
  tab, shop pages, search in zh/ko/es, check-in to result, settings).
- Independent code review (runtime/iOS pitfalls) and App Store compliance review; all findings
  fixed (safe areas on pushed screens, sheet stacking, Android keyboard, duplicate "again" items,
  Tonight label vs verdict mismatch, journal save on exit, localized link errors, 44 pt targets,
  Estimate pill contrast).
- Not verifiable without a device: Liquid Glass rendering, SF Symbols and SF Pro Rounded — check
  in Expo Go / TestFlight before submitting.

## 14. Before submitting
1. Retake every App Store screenshot from this build (UI and icon changed).
2. Update the live privacy policy to match `legal/privacy-policy.html`.
3. Paste section 1 of `APP_REVIEW_NOTES.md` into App Review notes; keep brand names and "AI" out
   of the subtitle and keywords.
4. Don't send `REVIEW-CONTEXT.md` to Apple (internal, outdated).

# THRIVE (native)

A real, buildable Expo / React Native app for THRIVE — the teen caffeine-and-sleep
companion from the deck. This is a from-scratch rewrite of the interactive web
prototype, using the same design tokens, copy, and logic (caffeine half-life decay,
XP/streaks, CUDQ check-in), but as an actual iOS/Android app you can submit to the
App Store and Google Play.

Built with: Expo SDK 57 · Expo Router (file-based navigation) · TypeScript ·
react-native-svg · AsyncStorage for on-device persistence · system fonts (SF Pro /
SF Pro Rounded on iOS) · SF Symbols via expo-symbols · expo-glass-effect (Liquid Glass) ·
expo-haptics · expo-localization. See `DESIGN.md` for the 1.1 redesign.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (fastest way to try it),
or press `i` / `a` in the terminal to open an iOS Simulator / Android Emulator if
you have Xcode / Android Studio installed. `npm run web` also works, for a quick
browser preview.

No backend, no API keys — everything (logged drinks, streak, XP, journal, survey
result) is stored locally with `@react-native-async-storage/async-storage`.

## What's here vs. what's simplified

Screens: Home (today's total, bedtime estimate, quick log, sleep rating, check-in),
Log (shop tiles → sizes, on-device keyword search, custom drink), Tonight (bedtime
estimate, last-call times, timeline, time-of-day pattern from your own logs), Progress
(weekly chart, streak calendar, personal rank), Tools (swaps, breathing exercise,
distractions, habits, journal, article, data sources), the CUDQ check-in survey, and
Settings (name, bedtime, language, appearance, mascot color, privacy policy, erase data).

There is no leaderboard and no other multi-user "social" feature. The app has
no backend and no accounts, so there's no honest way to compare one person's
data to anyone else's — an earlier draft of this screen showed a leaderboard
seeded with fake usernames, which is exactly the kind of fabricated-data
pattern app stores reject. Progress is shown against your own history only.

Not implemented (same as the web prototype): the Phase 2 wearable — HRV/skin-
conductance-based automatic caffeine detection is hardware that doesn't exist yet,
so logging stays manual, matching Phase 1 of the deck. Drink search is a small
on-device keyword matcher (`matchDrinks` / `searchDrinks` in `src/data/drinks.ts`), not an LLM.

A fresh install starts completely empty — no seeded drinks, no fake history,
no starter streak, no placeholder display name. Everything you see building up
(streaks, XP, the weekly chart) reflects only what was actually logged on that
device. `resetAllData()` in `src/state/AppState.tsx` (Settings → "Erase all data on
this phone") wipes back to that same empty state.

## Project structure

```
app/                      expo-router screens (file path = URL path)
  (tabs)/                 the 5 bottom-tab screens (Home, Log, Tonight, Progress, Tools)
  tool/                   tool detail screens (breathe, journal, [id])
  onboarding.tsx          skippable 3-step first-launch welcome
  survey.tsx, survey-result.tsx, settings.tsx, sources.tsx
src/
  ui/                     design system: primitives, chrome (glass tab bar, screens,
                          toast), BrandBadge (original drink art), visuals, Icon
  i18n/                   en.ts (source of truth) + zh-Hans, zh-Hant, es, ja, ko
  state/AppState.tsx      app state + AsyncStorage persistence + business logic
  theme/                  color tokens, type scale, light/dark ThemeProvider
  data/                   drinks + drinkText (localized labels/search), CUDQ scoring, ranks
  lib/                    caffeine half-life math, haptics, links
```

## Getting it into the App Store / Google Play

This app builds with **EAS Build**, Expo's cloud build service — you don't need a
Mac to build the iOS binary.

1. **Create accounts**: an [Apple Developer Program](https://developer.apple.com/programs/)
   membership ($99/year) and a [Google Play Console](https://play.google.com/console/)
   account ($25 one-time).
2. **Install the EAS CLI** and log in:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```
3. **Build**:
   ```bash
   eas build --platform ios
   eas build --platform android
   ```
   EAS builds in the cloud and gives you an `.ipa` / `.aab` file.
4. **Submit**:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```
5. **Store listing**: you'll need the app icon (real THRIVE branding is already
   in `assets/` — see "App icon & branding" below), a few screenshots (run the
   app and capture the 5 tabs), a short description, and — since this app
   touches teen health data (CUDQ answers, sleep, caffeine logs) — a
   **privacy policy URL**: use `https://www.braincarefund.org/thrive-app-privacy` — the
   same URL the app opens in Settings (`PRIVACY_POLICY_URL` in `app/settings.tsx`). The content
   (`legal/privacy-policy.html` in this repo) is
   yours to redeploy anywhere. Because there's no account system and no social
   feature, there's nothing left that needs a parental-consent gate — the
   privacy policy states the 13+ target audience instead.

Full guide: <https://docs.expo.dev/deploy/submit-to-app-stores/>

## Apple App Store review notes (Guideline 5.6)

See `APP_REVIEW_NOTES.md` for the current resubmission kit (review notes, Resolution Center
reply, metadata checklist). History:

This build was rejected once already under **Guideline 5.6** ("features that
appear to have been intentionally hidden during the review process" /
manipulative or misleading behavior). Two concrete things in the earlier build
caused that, and both are fixed now:

- **A fake leaderboard.** The Progress screen used to show a "Rank &
  leaderboard" card with three hardcoded other users (`NightOwl_17`,
  `SleepySage`, `QuietBrew`) and invented XP scores, gated behind a
  "Leaderboards" toggle in Settings — a reviewer who didn't flip that toggle
  would never see it, and one who did would see fabricated people. That's
  removed entirely; Progress now shows only this device's own rank
  and XP, with no comparison to anyone else, and there's no toggle hiding
  anything.
- **Demo data on first launch.** A fresh install used to open with a
  pre-filled name ("Jordan"), two pre-logged drinks, a fabricated week of
  chart history, and a streak calendar that showed the past 13 days as
  "tracked" no matter what — none of it reflecting anything the person
  actually did. A brand-new install now starts genuinely at zero, and the
  display name is a real, user-editable field (Settings → Your name) instead
  of a hardcoded persona.

Also fixed while addressing this: the app icon, adaptive icon, and splash
screen were still the unmodified Expo template placeholder (a blue arrow with
visible construction guides baked into the PNG) — a strong "unfinished app"
signal on its own. `assets/` now has a real THRIVE mark (the Sage owl glyph
on the app's navy/amber brand colors) for iOS, Android adaptive icon
(foreground/background/monochrome), web favicon, and splash screen.

Before resubmitting: take fresh screenshots (the leaderboard and demo data no
longer appear, and the icon is different), and set the app's age rating in
App Store Connect / Play Console to reflect the 13+ audience stated in the
privacy policy.

## Customizing

- **Colors / type scale**: `src/theme/tokens.ts` (system fonts, nothing bundled).
- **Text / translations**: `src/i18n/en.ts` is the source of truth; the other five
  files are type-checked against it, so a missing key fails `npx tsc --noEmit`.
- **Drink database & caffeine values**: `src/data/drinks.ts` — drinks from Starbucks, Peet's,
  Dutch Bros, Dunkin', McDonald's, Panera, Blue Bottle, Coffee Bean, Happy Lemon, Chicha San Chen,
  Tiger Sugar, Kung Fu Tea, Gong Cha, boba, energy drinks and sodas (tea-shop values are estimates;
  see `DESIGN.md` §6).
  Each has a `kind` (official / secondary / estimate) and a `src` pointing to `SOURCES`; the app
  shows these under Tools → Data sources. Re-verify and bump `DATA_CHECKED` each release.
- **Recommended daily limit**: `DAILY_LIMIT_MG` in `src/data/drinks.ts` (currently
  100mg, the AAP-aligned teen guidance used in the deck).
- **App icon / splash**: `assets/icon.png` (iOS + general), `assets/android-icon-*.png`
  (Android adaptive icon layers), `assets/favicon.png` (web), `assets/splash-icon.png`
  (splash, configured via the `expo-splash-screen` plugin in `app.json`). All are the
  real THRIVE owl mark now, not the Expo template default — replace them the same way
  if you want different branding.
- **Privacy policy**: `legal/privacy-policy.html` — edit and republish wherever you
  host it, then update the URL in `app/settings.tsx` (`PRIVACY_POLICY_URL`).
- **Bundle identifiers**: `app.json` → `ios.bundleIdentifier` / `android.package`
  are set to `org.braincarefund.thrive` — confirm that matches the identifier
  registered in your Apple Developer / Google Play accounts before building.

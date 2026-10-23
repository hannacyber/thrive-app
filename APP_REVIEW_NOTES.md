# THRIVE — App Review resubmission kit (Guideline 5.6)

## 1. Paste into App Store Connect → App Review Information → Notes

```
THRIVE is a caffeine & sleep tracker for people 13+, published by BrainCare Foundation
(a nonprofit). There is no account, login, server, purchase, ad, analytics SDK or social
feature. Every screen is reachable from the 5 bottom tabs; there are no hidden screens,
feature flags, remote config, or behavior that changes by date, region or device.

A fresh install is empty. The first launch shows a 3-step welcome (welcome + language,
optional name and bedtime, "You're all set") that can be skipped with "Skip" (top right) or
"Look around first" on the last step; nothing is unlocked by it.
The app follows the phone's language (English, 简体中文, 繁體中文, Español, 日本語, 한국어)
and can be switched in Settings → Language. To see all features in ~1 minute:
1. Log tab → pick where the drink is from (e.g. Starbucks), then tap the size you had
   (e.g. Caffè Latte → Grande). "Undo" appears for a few seconds. You can also search
   all drinks (search bar at the bottom) or tap "+" to add a drink with your own mg.
   Once drinks are logged, the shop tiles are ordered by how often you log each shop
   ("Sorted by what you log most"), counted on device from your own logs.
2. Home → rate last night's sleep; open "Caffeine Check-In" and answer 9 questions.
3. Tonight tab (moon icon) → bedtime caffeine estimate and cutoff times
   (5-hour half-life math on device).
   "Your pattern" shows a time-of-day summary once 5 drinks are logged in the past 14 days
   (before that it says so); it is counted on device from those logs only.
4. Progress tab → last 7 days of logged caffeine, streak, and XP rank (your own data only).
5. Tools tab → Swaps, Breathe, Ride out a craving, Healthy habits, Journal,
   Why it matters, and "Data sources".
6. Settings (gear on Home) → name, target bedtime, language, appearance, mascot color,
   privacy policy, data sources, support email, "Erase all data on this phone".

There is no chatbot or AI of any kind; drink search is an on-device keyword filter.
"Sage" is the app's owl mascot (a static illustration), not an assistant.
Drink pictures on the shop tiles are THRIVE's own generic illustrations (cups, a can,
a donut, a coffee bean, a tea bowl) in THRIVE's colors — no logos, wordmarks or brand colors.
Caffeine values come from each brand's published data where available and each drink is
labeled "Brand-published", "Third-party report" or "Estimate", with links to the sources
(Tools → Data sources, or Settings → Caffeine data sources). Tea shops that publish no
caffeine numbers (Happy Lemon, Chicha San Chen, Tiger Sugar, Kung Fu Tea, Gong Cha, generic
boba) are all marked "Estimate", with a note on each shop's page.
THRIVE is not affiliated with any brand listed.

Changes since the previous submission (v2, build 4):
- Redesigned interface in the current iOS style (system fonts, SF Symbols, Liquid Glass
  tab bar on iOS 26), new app icon (light / dark / tinted), Dark Mode and Dynamic Type.
- Six languages, following the phone's language, with a switch in Settings.
- A skippable 3-step first-launch welcome. It only sets the optional name, bedtime and
  language, which can all be changed later in Settings.
- Original drink illustrations for each shop; five tea shops added (all values "Estimate").
- Shop tiles are ordered by the person's own logging frequency (on device).
- Check-In shows one question at a time; Log search moved to the bottom of the screen.
- Smaller app (no bundled font files) and bug fixes.
No new data collection, permissions, network calls, accounts, purchases, or features
behind settings, flags or dates. Everything listed in our previous notes still applies:
no leaderboard, no demo data, no AI wording.
```

## 2. Reply in Resolution Center (before or with the new build)

```
Hello App Review,

Thank you for the review. We have audited the app for anything that could appear hidden
or misleading and submitted a new build (details in the Review Notes). The app has no
server, no remote configuration and no feature flags, so what you see on a fresh install
is the complete app. The earlier build contained a leaderboard behind a Settings toggle
with sample users; it was removed entirely.

If a specific screen or behavior still concerns you, could you please tell us which one?
We will fix it right away.

BrainCare Foundation
```

## 3. Metadata checklist (5.6 is often triggered by metadata, not code)

- [ ] **This build (v3 / 1.1.0):** the UI, colors and app icon all changed, so every screenshot must be
      retaken. If you add localized App Store listings (zh-Hans, zh-Hant, es, ja, ko), translate the
      description from the same English text; don't add claims the app doesn't make.
- [ ] **What's New text (1.1.0):** "New look, six languages, more tea shops, and a smaller download."
- [ ] **Screenshots:** retake all of them from this build. Any screenshot still showing the old
      leaderboard, "Jordan", pre-filled drinks, "AI Companion" or "Personalized alerts" does not
      match the binary. That mismatch reads as "hidden features".
- [ ] **Description / subtitle / keywords:** no "AI", "chatbot", "wearable", "HRV", "leaderboard",
      "compete with friends", or anything the build doesn't do. Don't put brand names
      (Starbucks, Red Bull…) in the **keywords** or **subtitle**. That is keyword spam, and 5.2.5 / 2.3.7
      also apply.
- [ ] **Privacy Policy URL** = `https://www.braincarefund.org/thrive-app-privacy`, the same one the
      app opens. Make sure the page is live and matches `legal/privacy-policy.html`.
- [ ] **App Privacy ("nutrition label"):** "Data Not Collected".
- [ ] **Age rating:** 13+ questionnaire answered honestly (Medical/Treatment Information:
      "Infrequent/Mild").
- [ ] **Support URL** loads and shows a real contact.
- [ ] **Category:** Health & Fitness.
- [ ] **Account-level checks:** the developer account name matches BrainCare Foundation (D-U-N-S). Only one
      developer account submits this app. Nobody signs in to App Store Connect through VPNs or shared or
      automated logins. The "pattern of unusual behavior" wording is also used for account-level signals.
      If the next rejection still names no feature, appeal to the App Review Board:
      https://developer.apple.com/contact/app-store/?topic=appeal

Thrive - source snapshot for external code review
==================================================

Context
-------
Thrive is an Expo (SDK 57) React Native caffeine + sleep companion for teens.
No backend, no accounts, no in-app purchases. All data lives in AsyncStorage
under the key `thrive-native-v1`.

Apple has rejected iOS submission twice under Guideline 5.6 - Developer Code of
Conduct, both times with the same template:

  "We've identified a pattern of unusual behavior with the app that is commonly
   associated with fraudulent activity. Specifically, the app contains features
   that appear to have been intentionally hidden during the review process.
   Manipulative and misleading behavior is not consistent with guideline 5.6."

No specific screen or feature was named in either rejection.

The App Store submission metadata declares:
- No account, login, purchase, or social feature.
- A fresh install is empty.
- "Tell Sage" is an on-device keyword guess, not a cloud AI.
- All data stays on the device.
- Privacy policy: https://www.braincarefund.org/thrive-app-privacy
  (the app's Settings screen links to this same URL - see PRIVACY_POLICY_URL in settings.tsx).

Please audit this source tree for anything that:
- Contradicts the "no account / no cloud AI / on-device only" claims.
- Might look "intentionally hidden" to a reviewer.
- Advertises a feature that does not actually work as shipped.
- Might trigger 1.4.1 (medical), 2.3.1 (misleading metadata), 4.2 (minimum
  functionality), 5.2.5 (trademark) alongside 5.6.

Entry points
------------
- app/_layout.tsx           Root Stack + fonts + AppState/Theme providers
- app/(tabs)/_layout.tsx    Bottom tabs: Home, Log, Companion, Progress, Tools
- app/(tabs)/index.tsx      Home
- app/(tabs)/log.tsx        Log a drink
- app/(tabs)/companion.tsx  Companion (evening plan)
- app/(tabs)/progress.tsx   Progress (week chart, streak, rank)
- app/(tabs)/tools.tsx      Tools list
- app/settings.tsx          Settings + in-app privacy link
- app/survey.tsx            9-question CUDQ survey
- app/survey-result.tsx     Survey result
- app/tool/*.tsx            Tool details
- src/state/AppState.tsx    Global state + AsyncStorage persistence
- src/data/*.ts             Presets, CUDQ questions, tips, ranks
- src/lib/caffeine.ts       Half-life math

Version
-------
- version: 1.0.0
- iOS buildNumber: 4  (see app.json)
- Android package: org.braincarefoundation.thrive
- iOS bundleId:    org.braincarefund.thrive   (note: different from Android)

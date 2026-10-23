THRIVE (Native)
THRIVE is an open-source teen caffeine-and-sleep companion built with React Native and Expo. It helps young adults understand caffeine half-life decay, monitor intake against pediatric guidelines, and cultivate healthier sleep habits.

100% client-side: no backend, no accounts, and zero tracking. All logs, streaks, and personal metrics stay strictly on the device.

Features
Decay & Sleep Math: Real-time caffeine half-life decay calculations to predict bedtime sleep impact and "last call" cutoff times.

Local Logging: Fast drink search across common coffee chains, boba shops, sodas, and energy drinks with verified caffeine values and customizable sizes.

Sleep & Streak Insights: Personal weekly charts and streaks tracking your own history without fake leaderboards or social comparisons.

CUDQ Check-in: Caffeine Use Disorder Questionnaire screener to evaluate personal habits.

Wellness Tools: Breathwork pacing, habit swaps, distraction timers, and local journaling.

Privacy First: Stored strictly using @react-native-async-storage/async-storage. No remote database, no analytics, completely functional offline.

Multi-language: Built-in localization support (en, zh-Hans, zh-Hant, es, ja, ko).

Tech Stack
Framework: Expo SDK 57 with Expo Router (file-based routing)

Runtime: React Native / TypeScript

Storage: @react-native-async-storage/async-storage

UI & Graphics: react-native-svg, expo-symbols, expo-haptics, system typography

Quick Start
Prerequisites
Node.js (v18+)

Expo Go app installed on your phone (iOS / Android)

Installation
Bash
# Clone the repository
git clone https://github.com/your-username/thrive-app.git
cd thrive-app

# Install dependencies
npm install

# Start the Expo development server
npx expo start
Scan the terminal QR code with the Expo Go app (or Camera on iOS).

Press i to launch in the iOS Simulator or a for the Android Emulator.

Run npm run web for an instant browser preview.

Project Structure
Plaintext
app/                 # Expo Router screens (Tabs, Onboarding, Survey, Settings)
src/
  data/              # Drink database, caffeine values, and CUDQ scoring logic
  lib/               # Caffeine half-life math, haptic feedback utilities
  state/             # AppState provider & AsyncStorage persistence
  theme/             # Color tokens, type scale, dark/light theme
  ui/                # Reusable UI primitives, icons, and components
  i18n/              # Translation files (en.ts is the source of truth)
Configuration & Customization
Caffeine Limit: Modify DAILY_LIMIT_MG in src/data/drinks.ts (defaults to 100 mg teen guidance).

Drink Database: Add brands or update values in src/data/drinks.ts.

Bundle ID: Update ios.bundleIdentifier and android.package in app.json before building for app stores.

License
This project is open-source under the MIT License.

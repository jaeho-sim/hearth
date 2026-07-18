# Hearth

A simple, clean house-management app: shared inventory, shopping list, and chores for your household. Built with React Native (Expo) + Firebase.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- Google sign-in (Firebase Auth)
- Households ("groups"): create one, invite others by email, they get an email invite and can join after signing in
- Inventory with custom categories shown as tabs (Fridge, Freezer, Pantry, etc.) — each item has name, quantity, optional unit, optional expiration date, optional low-stock threshold, and notes
- Shopping list with check-off
- Chores with due dates, assignment to a household member, and recurrence (daily/weekly/monthly)
- Simple, warm, modern design system (see `src/theme`)

## Project structure

```
App.tsx                     entry point
src/
  config/                   firebase + google auth config
  theme/                    colors, spacing, typography
  types/                    shared TypeScript models
  components/               reusable UI (Button, Card, TextField, Chip, FAB, ...)
  context/                  AuthContext, HouseholdContext
  hooks/                    Firestore-backed hooks (useInventory, useChores, ...)
  services/                 Firestore read/write functions per feature
  navigation/                React Navigation setup (bottom tabs + stacks + inventory top tabs)
  screens/                  one folder per feature
  utils/                    date formatting, recurrence math
functions/                  Firebase Cloud Functions (invite emails, accept-invite)
firestore.rules             security rules
firestore.indexes.json      composite indexes
```

## 1. Create the Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com), create a project.
2. Add an app for each platform you'll test on (iOS, Android, and/or Web) and copy the config values.
3. Enable **Authentication → Sign-in method → Google**.
4. Enable **Firestore Database** (start in production mode; the included rules will lock it down).
5. Enable **Cloud Functions** (requires the Blaze pay-as-you-go plan — the free tier covers typical household usage).
6. Install the **Trigger Email** extension (Extensions → search "Trigger Email") and point it at the `mail` collection with your SMTP/SendGrid credentials. This is what actually delivers invite emails; `functions/src/index.ts` just writes documents to `mail`.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the `EXPO_PUBLIC_FIREBASE_*` values from Firebase project settings, and the `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID` values from Google Cloud Console → APIs & Services → Credentials (create an OAuth client per platform: Web, iOS, Android). These power `expo-auth-session`'s Google sign-in flow, which exchanges a Google ID token for a Firebase session (`src/services/authService.ts`).

## 3. Install & run the app

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator.

## 4. Deploy Firestore rules & indexes

```bash
npm install -g firebase-tools   # if you don't have it
firebase login
firebase use --add               # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

## 5. Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

This deploys:
- `onInviteCreated` — Firestore trigger that queues an invite email whenever a household owner invites someone (`src/services/inviteService.ts` on the client creates the `invites` doc).
- `acceptInvite` — callable function the app invokes once a signed-in user taps "Join" on a pending invite; it verifies the invite matches their email and atomically adds them to the household.

## How the invite flow works

1. A household owner enters an email on the Members screen → creates a doc in `invites/`.
2. `onInviteCreated` writes to `mail/`, which the Trigger Email extension turns into an actual email.
3. The invitee opens Hearth and signs in with Google using that same email address.
4. On the "create or join" screen, the app looks up any pending invites for their email and shows a **Join** button.
5. Tapping Join calls the `acceptInvite` Cloud Function, which adds them to the household.

## Design system

Defined in `src/theme/index.ts`: a warm off-white background, a single sage-green primary color, a terracotta accent used sparingly for expiring/low-stock badges, generous spacing, and soft rounded cards. All reusable components live in `src/components/`.

## Notes & next steps

This is a complete, working scaffold covering every feature requested — it isn't pre-loaded with automated tests or push notifications. Natural next additions: push notifications for chores due today / items expiring soon, photo uploads for inventory items (Firebase Storage), and a "restock from shopping list" shortcut that removes an item from the list and bumps inventory quantity.

## License

MIT — see [LICENSE](LICENSE). Note that your own `.env` (Firebase config, OAuth client IDs) is gitignored and never committed; anyone cloning this repo needs to supply their own Firebase project.

# YooBees — Setup Guide

## 1. Firebase project setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (free Spark plan is fine)
3. Enable **Authentication** → Email/Password sign-in
4. Enable **Cloud Firestore** → start in production mode
5. Go to **Project Settings → Your apps → Add web app**
6. Copy the config values

## 2. Local development

```bash
cp .env.example .env
# Fill in your Firebase values in .env
npm install
npm run dev
```

## 3. Firestore security rules

Copy the contents of `firestore.rules` into your Firebase Console:
**Firestore → Rules** and publish.

## 4. GitHub Pages deployment

### a. Set GitHub Secrets

In your repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|-------|
| `VITE_FIREBASE_API_KEY` | from Firebase config |
| `VITE_FIREBASE_AUTH_DOMAIN` | from Firebase config |
| `VITE_FIREBASE_PROJECT_ID` | from Firebase config |
| `VITE_FIREBASE_STORAGE_BUCKET` | from Firebase config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | from Firebase config |
| `VITE_FIREBASE_APP_ID` | from Firebase config |
| `VITE_LECTURER_CODE` | your secret lecturer registration code |

### b. Enable GitHub Pages

**Repo Settings → Pages → Source → Deploy from a branch → gh-pages**

### c. Update Firebase auth domain

In Firebase Console → **Authentication → Settings → Authorised domains**,
add your GitHub Pages domain: `yourusername.github.io`

### d. Push to main

The GitHub Action will build and deploy automatically on every push to `main`.

## 5. Firestore indexes

Firestore may prompt you to create composite indexes the first time you run certain queries. Follow the link in the browser console error to create them. Required indexes:

- Collection: `attendanceRecords` — fields: `sessionId ASC`, `submittedAt ASC`
- Collection: `attendanceRecords` — fields: `studentUid ASC`, `submittedAt DESC`
- Collection: `attendanceSessions` — fields: `status ASC`, *(any)*

## 6. Lecturer registration code

The default code is `PROF2024`. Change `VITE_LECTURER_CODE` in your `.env`
(or GitHub Secret) to something private. Only share it with yourself.

## 7. How attendance works

1. **Lecturer** clicks **New session** → fills in title and course
2. During class, clicks **Launch Opening** → a 6-character code appears on screen
3. **Students** open the app on their phones, go to **Submit Attendance**, type the code
4. ~45 minutes later, lecturer clicks **Launch Mid-session** → new code, new window
5. Each submission is timestamped. Students who miss either checkpoint are marked absent.
6. Click **Results** to see who submitted at each checkpoint; export CSV anytime.

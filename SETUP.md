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
| `VITE_TA_CODE` | your secret teaching assistant registration code |
| `VITE_EMAILJS_SERVICE_ID` | from EmailJS dashboard (optional — see §9) |
| `VITE_EMAILJS_TEMPLATE_ID` | from EmailJS dashboard (optional — see §9) |
| `VITE_EMAILJS_PUBLIC_KEY` | from EmailJS dashboard (optional — see §9) |

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

## 7. Teaching Assistant registration code

The default TA code is `YOOBEETA`. Change `VITE_TA_CODE` in your `.env`
(or GitHub Secret) to something private before sharing with TAs.

## 9. Email alerts for new notices (free, optional)

When a new notice is posted, the app can automatically email relevant students for free using **EmailJS** (200 emails/month on the free tier — one email per notice, regardless of class size).

### a. Create a free EmailJS account

1. Go to [emailjs.com](https://www.emailjs.com) → **Sign Up** (free)
2. **Email Services → Add New Service** → choose Gmail → follow the OAuth flow
3. Copy the **Service ID** (looks like `service_xxxxxxx`)

### b. Create an email template

**Email Templates → Create New Template**. Paste this as the template body:

```
Subject: [YooBees Notice] {{notice_title}}

A new {{notice_category}} notice has been posted on the YooBees notice board.

──────────────────────────────
{{notice_title}}
──────────────────────────────

{{notice_body}}

──────────────────────────────
Posted by {{author_name}}

View on the notice board → {{app_url}}
```

Set the template fields:

| Field | Value |
|-------|-------|
| **To Email** | `{{to_email}}` |
| **BCC** | `{{bcc_email}}` |
| **Subject** | `[YooBees Notice] {{notice_title}}` |

Save and copy the **Template ID** (looks like `template_xxxxxxx`).

### c. Get your Public Key

**Account → General** → copy the **Public Key**.

### d. Add the three values to `.env` (local) and GitHub Secrets (deployed)

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
```

That's it — the next time a lecturer posts a notice the relevant students will receive an email automatically. Campus-specific notices (Auckland / Christchurch) are only sent to students on that campus.

> Leaving these three variables unset simply disables email alerts — the rest of the app works normally.

## 10. How attendance works

1. **Lecturer** clicks **New session** → fills in title and course
2. During class, clicks **Launch Opening** → a 6-character code appears on screen
3. **Students** open the app on their phones, go to **Submit Attendance**, type the code
4. ~45 minutes later, lecturer clicks **Launch Mid-session** → new code, new window
5. Each submission is timestamped. Students who miss either checkpoint are marked absent.
6. Click **Results** to see who submitted at each checkpoint; export CSV anytime.

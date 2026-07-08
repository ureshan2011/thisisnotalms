# Protecting the Study Packs — Options Compared

**Author:** prepared for Dr. Yasas Sri Wickramasinghe.
**Scope:** distribution of student-facing study guides (PDF), across every course this
generator produces, for enrolled students only.

## 1. Threat model — what we are actually defending against

The realistic risk is **casual redistribution**: an enrolled student forwarding files to friends at another institution, uploading to note-sharing sites (Studocu, Course Hero), or another educator reusing the material in their own course. The adversary is *not* a determined attacker with forensic tools — and no consumer document technology stops one of those. Any protection scheme should therefore be judged on: does it deter the casual case, keep evidence of ownership, and stay friction-free for legitimate students?

## 2. The options, compared

| # | Option | Protection | Student experience | Distribution | Offline | Cost |
|---|--------|-----------|--------------------|--------------|---------|------|
| 1 | Flattened PDF (text → vector outlines) | Low–medium | Poor (no search, no screen readers, huge files) | Easy | ✅ | Free |
| 2 | Password-protected PDF (open password) | Medium | Small friction (type password once) | Easy | ✅ | Free |
| 3 | PDF with copy/edit restrictions (owner password) | Low–medium | Excellent (invisible) | Easy | ✅ | Free |
| 4 | Digitally signed PDF | None (integrity only) | Excellent | Easy | ✅ | Free–low |
| 5 | Image-based PDF (rasterised pages) | Low–medium | Poor (blurry zoom, no search, no accessibility) | Easy | ✅ | Free |
| 6 | Secure online viewer (auth-gated web app) | Medium–high | Good online, useless offline | Needs hosting + accounts | ❌ | Low–medium |
| 7 | Commercial DRM platforms (LockLizard, Vitrium, Adobe DC DRM) | High | Poor–medium (special reader apps, licence activation) | Complex | Partially | US$1,000+/yr |
| 8 | Watermarked documents (visible, every page) | Medium (deterrence + attribution) | Excellent | Easy | ✅ | Free |
| 9 | Time-limited access (expiring links/portal) | Medium while active | Medium (re-download friction) | Needs infrastructure | ❌ after expiry | Low |
| 10 | LMS delivery (Moodle/Canvas/Teams, enrolled-only) | Medium (access control at the gate) | Good | Easy if LMS exists | ✅ once downloaded | Usually already paid |
| 11 | Per-student forensic watermarking (name/email stamped per copy) | High deterrence | Excellent | Needs per-student generation step | ✅ | Free (scripted) |

### Option notes and limitations

1. **Flattened/outlined PDF** — converting text to vector outlines defeats copy-paste and text extraction, but OCR reverses it in minutes, file size balloons ~5–10×, and you destroy search and screen-reader accessibility. Not recommended for study material students must *revise from*.
2. **Open-password PDF** — real AES encryption; the file is unreadable without the password. Limitation: students share the password as easily as the file. Still a genuine gate against note-sharing sites (uploads without the password are useless) and it signals "this is controlled material".
3. **Permissions-only PDF** — copy/edit/print flags are enforced by *compliant* readers (Acrobat, Preview, Edge) but are advisory: non-compliant tools ignore them, and anyone with the owner password (or password-removal tools) can strip them. Zero student friction, so they cost nothing to include.
4. **Digital signature** — proves the document came from you and was not altered. It does *not* restrict copying at all; it complements other options as authorship evidence.
5. **Image-based PDF** — every page a bitmap. Kills copy-paste and casual editing, but also kills zoom sharpness, text search, accessibility and printing quality; OCR defeats it anyway. Only sensible for exam papers, not revision material.
6. **Secure online viewer** — e.g. a route in the existing YooBees React app rendering pages behind Firebase Auth, with download disabled. Strong control (revocable, per-user, loggable) but requires connectivity, and screenshots remain trivially possible. A good *complement* for high-value content; poor as the only channel because students revise offline.
7. **Commercial DRM** — encrypted containers opened only in a licensed viewer, with revocation, expiry, per-user tracking. The strongest technical control and the worst experience: proprietary apps, activation problems, no printing or restricted printing, and annual per-document or per-user fees. Disproportionate for course notes.
8. **Visible watermarking** — name, institution, ©, course code, year and "For enrolled students only" on every page. Cannot be cropped out when placed diagonally across the content area. It does not *prevent* anything, but it removes deniability, makes uploads identifiable and takedown-able, and deters educators from re-using the material as their own.
9. **Time-limited access** — expiring links (e.g. GitHub release links rotated per semester, or Firebase Storage signed URLs). Limits *future* leakage but a downloaded file lives forever; adds re-download friction during exam revision, exactly when students need the files most.
10. **LMS delivery** — access control at the point of download: only enrolled students see the files. Combines naturally with every per-file protection here. The YooBees platform itself already plays this role via Firebase Auth.
11. **Per-student watermarking** — each student's copy carries their own name/email on every page. The single strongest *deterrent* against sharing (a leaked file identifies its leaker), at zero licence cost. Requires generating N variants per release — easily scripted from this pipeline.

## 3. Recommendation — the layered approach (implemented)

No single option both protects and stays usable. The implemented solution layers the cheap, high-value options:

1. **Visible watermark on every page** (option 8) — author, institution, copyright, "For enrolled students only", MBI802, academic year, as a diagonal tint plus a footer line. *Attribution + deterrence.*
2. **AES-256 encryption with an open password** (option 2) — distributed only to enrolled students (e.g. announced in class / posted inside the LMS). *A real gate: the file is useless without it.*
3. **Owner-password restrictions** (option 3) — copying, editing, annotation and assembly disabled; high-resolution printing allowed; accessibility text-access kept **on** so screen readers still work. *Free friction against copy-paste reuse.*
4. **Legal notice** (supporting layer) — every page carries the © line. Under the **Copyright Act 1994 (NZ)** the materials are protected literary works; the notice preserves easy takedown requests to note-sharing sites, which honour them routinely.
5. **Controlled distribution** (option 10) — deliver through the existing authenticated YooBees platform or institutional LMS rather than a public URL.

### Honest limitations

- Permission flags are advisory in non-compliant readers; a determined user with the open password can strip them.
- The open password can be shared alongside the file. It stops note-sharing-site uploads from being *readable*, not a motivated friend-to-friend copy.
- Nothing here (including US$10k DRM) prevents re-typing or photographing pages. The durable protections are the **watermark** and **copyright law**, not the cryptography.

### Upgrade path

If leakage is observed, switch on **per-student watermarking** (option 11): a small extension of `scripts/encrypt.mjs` can stamp "Licensed to *student name / email*" on every page from a roster CSV in seconds per student, without re-rendering. That converts anonymous leaks into attributable ones — historically the most effective single deterrent for course materials.

## 4. Decision log

- **Not DRM (7):** cost and student friction disproportionate to course notes; breaks offline revision.
- **Not viewer-only (6):** students need offline/printable A4 material; kept as a possible complement inside YooBees.
- **Not flattening/rasterising (1, 5):** destroys search and accessibility for the users we *want* to serve; trivially OCR-reversed anyway.
- **Generic edition rather than per-student (11)** at the owner's request — documented above as the first upgrade step.

# TodayMagazine — Article Website

A Next.js + MongoDB + Cloudinary powered magazine/news website. Users can
create an account and submit articles for review; an admin reviews,
approves, edits or deletes them from a dedicated admin dashboard.

## What's included

- Homepage with a featured article, category grid, and a Business sidebar
- Categories: Business, Tech, Consumer, Finance, Environment, Property, Ecommerce
- Hover mega-menu on desktop: hovering a category in the navbar shows a
  preview of its latest 4 articles
- User signup/login (hashed passwords + secure JWT session cookie)
- Logged-in users can submit an article with a cover image — it goes into
  "pending" until an admin approves it
- Admin dashboard (`/admin`) to add articles directly, and to review,
  approve, unpublish, edit, or delete any submitted article
- Article detail page with a view counter
- Search (via the search icon in the navbar)
- About + Contact pages (email/WhatsApp)
- Light color theme, fully responsive
- All UI text and code comments are in English

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Copy `.env.local.example` to `.env.local` and fill in your own values:

```bash
cp .env.local.example .env.local
```

- **MONGODB_URI** — create a free (M0) cluster at mongodb.com/cloud/atlas,
  create a database user under "Database Access", allow `0.0.0.0/0` under
  "Network Access", then copy the connection string from "Connect".
- **JWT_SECRET** — any long random string (used to sign login sessions).
- **CLOUDINARY_*** — create a free account at cloudinary.com; the Cloud
  Name, API Key and API Secret are shown on your dashboard.
- **ADMIN_EMAILS** — comma-separated list of email addresses that should
  become admins (e.g. `you@example.com,partner@example.com`). Any account
  that signs in with one of these emails is automatically promoted to
  admin the next time it logs in.

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Deploy to Vercel

1. Push this project to a GitHub repository.
2. On vercel.com, sign in with GitHub, choose "Add New Project", and
   import the repository.
3. Before deploying, add the same 4-5 environment variables from
   `.env.local` under Vercel's "Environment Variables" settings.
4. Click "Deploy". The site will be live in 1-2 minutes.
5. Buy a domain and add it under the Vercel project's "Domains" settings,
   then add the DNS records Vercel gives you at your domain registrar.

## Becoming an admin

1. Register a normal account on the site with the email you listed in
   `ADMIN_EMAILS`.
2. Log out and log back in — this triggers the promotion check.
3. You'll now see an "Admin" link in the top bar, and `/admin` will be
   accessible.

## How article approval works

- When a **regular user** submits an article, it is saved with
  `status: "pending"` and does **not** appear on the site yet.
- When an **admin** submits an article (from `/admin/articles/new`), it is
  published immediately.
- Admins can approve, unpublish, edit, or delete any article from
  `/admin/articles`.

## Customizing

- **Colors**: edit `src/app/globals.css` — `--accent` is the brand color
  used for buttons/links, `--background`/`--surface` control the light
  theme shades.
- **Categories**: edit `CATEGORIES` in `src/lib/categories.ts`.
- **Site name**: replace "TodayMagazine" in `src/components/Navbar.tsx`,
  `src/components/Footer.tsx`, and `src/app/layout.tsx`.
- **Contact info**: update `src/app/contact/page.tsx`.

## Google Sign-In setup

1. Go to console.cloud.google.com, create a project (or use an existing one).
2. Under "APIs & Services" > "Credentials", click "Create Credentials" >
   "OAuth client ID" > choose "Web application".
3. Under "Authorized JavaScript origins", add your site URL (e.g.
   `http://localhost:3000` for local testing, and your real domain after
   deploying).
4. Copy the generated Client ID into both `GOOGLE_CLIENT_ID` and
   `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`.

## Email OTP setup

The app sends a 6-digit verification code by email when someone signs up
with email/password (Google sign-in skips this — Google already verifies
the email).

For Gmail:
1. Turn on 2-Step Verification on the Gmail account you want to send from.
2. Go to myaccount.google.com/apppasswords and create an "App Password".
3. Use that 16-character password as `SMTP_PASS` (not your real Gmail
   password), and your Gmail address as `SMTP_USER` and `SMTP_FROM`.

You can also use any other SMTP provider (Resend, Mailgun, Zoho, etc.) by
changing `SMTP_HOST`/`SMTP_PORT` accordingly.

## Auth flow summary

- **Email/password signup** → account created (unverified) → OTP emailed →
  user enters code on `/verify` → account marked verified → logged in.
- **Google sign-in** → verified and logged in immediately, no OTP needed.
- **Login with unverified email account** → automatically redirected to
  `/verify` to finish the OTP step.

# 🥊 Vavuniya Boxing Association — PWA Setup & Deploy Guide

## What you have
A complete **Next.js 14 PWA** with:
- ✅ Public site (Home, News, Events, Achievements, Rankings, Gallery, Members, Sponsors, Contact)
- ✅ Admin panel (Members, Events, News, Achievements, Gallery, Contacts, Rankings)
- ✅ Supabase integration (Auth, Database, Storage)
- ✅ PWA manifest + service worker (offline support, installable)
- ✅ Full database schema with Row Level Security

---

## Step 1 — Install Node.js & tools
Make sure you have Node.js 18+ installed:
```bash
node --version   # should be 18+
npm --version
```

---

## Step 2 — Install dependencies
```bash
cd vba-app
npm install
```

---

## Step 3 — Create Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `vba-app`, choose a region close to Sri Lanka (Singapore is best)
3. Wait for it to spin up (~2 minutes)

### Get your keys:
- Go to **Settings → API**
- Copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role / secret** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 4 — Set up your environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and fill in your 3 Supabase keys.

---

## Step 5 — Run the database migration

1. In Supabase Dashboard → **SQL Editor**
2. Open the file: `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents and paste into the SQL Editor
4. Click **Run**

This creates all tables, indexes, RLS policies, and sample data.

---

## Step 6 — Create your admin user

1. In Supabase Dashboard → **Authentication → Users**
2. Click **Add user** → **Create new user**
3. Enter your email and a strong password (12+ characters)
4. This will be your login for the admin panel at `/login`

---

## Step 7 — Test locally
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) — public site
- Open [http://localhost:3000/login](http://localhost:3000/login) — admin login
- Open [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) — admin panel

---

## Step 8 — Deploy to Vercel

### Option A: Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
Follow the prompts:
- Link to your Vercel account
- Create new project
- Framework: Next.js (auto-detected)

Then add environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

Deploy to production:
```bash
vercel --prod
```

### Option B: GitHub + Vercel (recommended for ongoing updates)
1. Push code to a GitHub repo:
```bash
git init
git add .
git commit -m "Initial VBA app"
git remote add origin https://github.com/YOUR_USERNAME/vba-app.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Add your 3 environment variables in the Vercel dashboard
4. Click **Deploy**

---

## Step 9 — Update NEXT_PUBLIC_SITE_URL
After deployment, go to Vercel → Project Settings → Environment Variables
Add: `NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app`

Redeploy to apply.

---

## Step 10 — Set up Supabase Storage buckets

In Supabase Dashboard → **Storage** → **New bucket**:

| Bucket name      | Public? |
|-----------------|---------|
| `members-photos` | No      |
| `news-covers`    | Yes     |
| `event-covers`   | Yes     |
| `gallery`        | Yes     |
| `sponsor-logos`  | Yes     |

---

## Admin Panel Quick Start

| Task | Where |
|------|-------|
| Add athletes | `/admin/members` |
| Create events | `/admin/events` |
| Write news | `/admin/news` |
| Add achievements | `/admin/achievements` |
| View contact messages | `/admin/contacts` |

---

## Custom Domain (optional)
1. Buy `vavuniyaboxing.lk` from a Sri Lankan registrar (e.g., domains.lk)
2. In Vercel → Project → Settings → Domains → Add your domain
3. Follow DNS configuration instructions

---

## Troubleshooting

**Build fails with "Cannot find module"**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Supabase auth not working**
- Make sure your `.env.local` has correct values
- Check Supabase Dashboard → Auth → Settings → Site URL = your Vercel URL

**Admin page shows login redirect**
- Log in at `/login` first
- Check that your user was created in Supabase Auth

---

## Support
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- PWA info: https://web.dev/progressive-web-apps/

# 🥊 VBA App — Quick Deploy (Your credentials are pre-configured!)

Your Supabase URL and keys are already baked into this project.
You just need to run 3 things:

---

## ▶ STEP 1 — Install & Deploy (run in Terminal)

```bash
cd vba-app
npm install
bash deploy.sh
```

That's it. Vercel will print your live URL when done.

---

## ▶ STEP 2 — Set up the Database

1. Open this link in your browser:
   https://supabase.com/dashboard/project/leyonejvypwkmjzansly/sql/new

2. Open the file `supabase/migrations/001_initial_schema.sql` from this folder

3. Copy ALL the contents → Paste into the SQL editor → Click **Run**

This creates all your tables (members, events, news, achievements, rankings, gallery, sponsors, contact forms).

---

## ▶ STEP 3 — Create your Admin account

1. Open:
   https://supabase.com/dashboard/project/leyonejvypwkmjzansly/auth/users

2. Click **Add user** → **Create new user**

3. Enter your email + a strong password

4. Go to your Vercel URL → `/login` → sign in with those credentials

---

## ✅ You're live!

| Page | URL |
|------|-----|
| Public site | `https://your-app.vercel.app/` |
| Admin login | `https://your-app.vercel.app/login` |
| Admin panel | `https://your-app.vercel.app/admin/dashboard` |

---

## What to do first in the Admin panel

1. **Members** → Add your registered athletes
2. **Events** → Create upcoming tournaments
3. **News** → Write your first announcement
4. **Achievements** → Add past international medals
5. **Sponsors** → Add supporting organizations

---

## Need to update the Vercel URL in settings?

After deployment, if your URL is different from `vba-app.vercel.app`,
update it in Vercel Dashboard → Project → Settings → Environment Variables:
Change `NEXT_PUBLIC_SITE_URL` to your actual URL and redeploy.

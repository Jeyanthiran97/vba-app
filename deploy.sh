#!/bin/bash
# ============================================================
# VBA App — One-command deploy script
# Run this from inside the vba-app/ directory
# ============================================================

set -e

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
  export $(cat .env.local | xargs)
fi

# Validate required environment variables
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ Error: VERCEL_TOKEN is not set"
  echo "   Set it in .env.local or export it: export VERCEL_TOKEN='your_token'"
  exit 1
fi

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Error: SUPABASE_URL is not set"
  echo "   Set it in .env.local or export it: export SUPABASE_URL='your_url'"
  exit 1
fi

if [ -z "$SUPABASE_KEY" ]; then
  echo "❌ Error: SUPABASE_KEY is not set"
  echo "   Set it in .env.local or export it: export SUPABASE_KEY='your_key'"
  exit 1
fi

echo ""
echo "🥊 VBA App — Deploying to Vercel"
echo "================================="
echo ""

# Step 1 — Install dependencies
echo "📦 Step 1/4 — Installing dependencies..."
npm install

# Step 2 — Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
  echo "⬇️  Step 2/4 — Installing Vercel CLI..."
  npm install -g vercel
else
  echo "✅ Step 2/4 — Vercel CLI already installed"
fi

# Step 3 — Deploy to Vercel
echo ""
echo "🚀 Step 3/4 — Deploying to Vercel..."
echo ""

vercel deploy --prod \
  --token "$VERCEL_TOKEN" \
  --yes \
  --env NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_KEY" \
  --env NEXT_PUBLIC_SITE_URL="https://vba-app.vercel.app" \
  --build-env NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
  --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_KEY" \
  --build-env NEXT_PUBLIC_SITE_URL="https://vba-app.vercel.app"

echo ""
echo "✅ Step 4/4 — Done!"
echo ""
echo "🌐 Your app is live on Vercel!"
echo "📋 Next: Run the database migration in Supabase:"
echo "   → https://supabase.com/dashboard/project/leyonejvypwkmjzansly/sql/new"
echo "   → Open: supabase/migrations/001_initial_schema.sql"
echo "   → Paste the full contents and click Run"
echo ""
echo "👤 Then create your admin user:"
echo "   → https://supabase.com/dashboard/project/leyonejvypwkmjzansly/auth/users"
echo "   → Add user → email + password"
echo ""

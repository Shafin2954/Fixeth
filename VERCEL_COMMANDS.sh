#!/usr/bin/env bash
# 🚀 FIXETH VERCEL QUICK REFERENCE
# Copy-paste commands for deployment

# ═════════════════════════════════════════════════════════
# 1. LOCAL SETUP
# ═════════════════════════════════════════════════════════

# Generate NextAuth secret
openssl rand -base64 32

# Install dependencies
npm install

# Create .env.local from template
cp .env.example .env.local

# Start dev server
npm run dev

# Build locally to test
npm run build
npm start

# ═════════════════════════════════════════════════════════
# 2. GIT & GITHUB
# ═════════════════════════════════════════════════════════

# Initialize git (first time)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fixeth.git
git push -u origin main

# Regular commits
git add .
git commit -m "Your message"
git push origin main

# Create feature branch
git checkout -b feature/my-feature
git push origin feature/my-feature

# ═════════════════════════════════════════════════════════
# 3. VERCEL CLI
# ═════════════════════════════════════════════════════════

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview (branch)
vercel

# Deploy to production
vercel --prod

# View deployment status
vercel status

# Stream production logs
vercel logs --tail

# Stream error logs only
vercel logs --error

# See last 100 logs
vercel logs --limit 100

# Rebuild & redeploy
vercel --prod --yes

# ═════════════════════════════════════════════════════════
# 4. ENVIRONMENT VARIABLES (Vercel CLI)
# ═════════════════════════════════════════════════════════

# List all env vars
vercel env ls

# Add env variable
vercel env add VARIABLE_NAME
# (interactive prompt)

# Remove env variable
vercel env remove VARIABLE_NAME

# ═════════════════════════════════════════════════════════
# 5. DEBUGGING
# ═════════════════════════════════════════════════════════

# Check health endpoint
curl https://YOUR_DEPLOYMENT.vercel.app/api/health

# Test locally
npm run build && npm start

# Check Next.js build
npx tsc --noEmit

# Lint code
npm run lint

# ═════════════════════════════════════════════════════════
# 6. DATABASE (Supabase CLI)
# ═════════════════════════════════════════════════════════

# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Run migrations locally
supabase migration up

# Create new migration
supabase migration new create_users_table

# Push migrations to Supabase
supabase db push

# ═════════════════════════════════════════════════════════
# COMPLETE FIRST-TIME DEPLOYMENT FLOW
# ═════════════════════════════════════════════════════════

# 1. Create project locally
npm install
cp .env.example .env.local
# → Edit .env.local with your actual credentials

# 2. Verify it works
npm run dev
# → Visit http://localhost:3000

# 3. Push to GitHub
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fixeth.git
git push -u origin main

# 4. Deploy to Vercel
npm install -g vercel
vercel login
vercel

# 5. Add environment variables via Vercel dashboard
# → Settings → Environment Variables
# → Paste all 13 variables from .env.local

# 6. Trigger rebuild
git add .
git commit -m "Add env vars"
git push origin main
# → Vercel auto-deploys

# 7. Verify
curl https://YOUR_DEPLOYMENT.vercel.app/api/health

# ═════════════════════════════════════════════════════════
# CONTINUOUS DEPLOYMENT WORKFLOW
# ═════════════════════════════════════════════════════════

# Feature branch (creates preview)
git checkout -b feature/my-feature
# → Edit code
git add .
git commit -m "Implement feature"
git push origin feature/my-feature

# Vercel auto-creates preview URL
# → Share with team for testing
# → Review in preview deployment

# When ready, merge to main (auto-deploys to production)
git pull origin main
git merge feature/my-feature
git push origin main

# ═════════════════════════════════════════════════════════
# EMERGENCY: ROLLBACK
# ═════════════════════════════════════════════════════════

# In Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"
# 4. Done!

# Or via CLI:
vercel rollback  # Interactive rollback selector

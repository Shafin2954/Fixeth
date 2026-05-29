# Supabase Auth Setup Guide

## OAuth Provider Configuration

### Prerequisites
- Supabase project created: https://oxfynuytsnifqqhbmpcv.supabase.co
- Admin access to Supabase dashboard

---

## 1. GitHub OAuth

### Step 1: Create GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Fixeth
   - **Homepage URL:** http://localhost:3000 (dev) or https://fixeth.vercel.app (prod)
   - **Authorization callback URL:** `https://oxfynuytsnifqqhbmpcv.supabase.co/auth/v1/callback`
   - **Authorization callback URL:** `http://localhost:3000/auth/callback` (for local dev)
4. Click **Create OAuth App**
5. Copy:
   - **Client ID**
   - **Client Secret** (click "Generate a new client secret")

### Step 2: Add to Supabase
1. Go to your Supabase dashboard
2. Navigate: **Project Settings → Authentication → Providers**
3. Find **GitHub** and toggle ON
4. Paste:
   - **Client ID:** (from Step 1)
   - **Client Secret:** (from Step 1)
5. Click **Save**

---

## 2. Google OAuth

### Step 1: Create Google OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create a **New Project** (or select existing)
3. Search for **OAuth consent screen** → Configure
4. Fill in consent screen info
5. Go to **Credentials** → **Create OAuth 2.0 Client IDs**
6. Choose **Web application**
7. Add **Authorized redirect URIs:**
   - `https://oxfynuytsnifqqhbmpcv.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local dev)
8. Click **Create**
9. Copy:
   - **Client ID**
   - **Client Secret**

### Step 2: Add to Supabase
1. Go to your Supabase dashboard
2. Navigate: **Project Settings → Authentication → Providers**
3. Find **Google** and toggle ON
4. Paste:
   - **Client ID:** (from Step 1)
   - **Client Secret:** (from Step 1)
5. Click **Save**

---

## 3. Email/Password (Built-in)

Already enabled by default. No setup needed.

### Optional: Enable Magic Links
1. Go to **Project Settings → Authentication → Providers**
2. Find **Email** → Click the settings icon
3. Toggle **Enable email confirmations** and/or **Enable magic link signin**

---

## 4. Test Locally

### Run dev server
```bash
npm run dev
```

### Visit pages
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup

Click OAuth buttons → Should redirect to provider → Redirect back to app

---

## 5. Environment Variables

Your `.env.local` is already set:
```env
NEXT_PUBLIC_SUPABASE_URL=https://oxfynuytsnifqqhbmpcv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ATVf_la2Z6kuYO3rp1MIyg_SnBm0Snd
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Callback URL Routing

After OAuth login, users are redirected to:
- **Login page:** Redirects to `/dashboard` on success
- **Signup page:** Redirects to `/onboarding` on success

This is handled in `app/login/page.tsx` and `app/signup/page.tsx` via the `redirectTo` option.

---

## Quick Checklist

- [ ] GitHub OAuth App created & credentials saved
- [ ] GitHub added to Supabase (Provider Settings)
- [ ] Google OAuth credentials created & saved
- [ ] Google added to Supabase (Provider Settings)
- [ ] Run `npm run dev`
- [ ] Test login with GitHub
- [ ] Test login with Google
- [ ] Verify user appears in Supabase Auth users list

---

## Next: Session Access

Once auth is working, access sessions in components:

**Server Component (RSC):**
```typescript
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  console.log(session?.user)
}
```

**Client Component:**
```typescript
'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function Component() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
    })
  }, [])

  return <div>{user?.email}</div>
}
```

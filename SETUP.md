# 🚀 INFINITE RIG SERVICES - SETUP GUIDE

Complete step-by-step instructions to get your application running locally and deployed to production.

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Setup](#supabase-setup)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Database Schema Setup](#database-schema-setup)
7. [Deployment to Vercel](#deployment-to-vercel)
8. [Post-Deployment Configuration](#post-deployment-configuration)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 PREREQUISITES

Before starting, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)
- **Git** installed ([Download](https://git-scm.com/))
- A **Supabase account** ([Sign up](https://supabase.com/))
- A **Vercel account** ([Sign up](https://vercel.com/))
- An **OpenAI account** ([Sign up](https://platform.openai.com/))
- A **Resend account** ([Sign up](https://resend.com/))

---

## 💻 LOCAL DEVELOPMENT SETUP

### Step 1: Install Dependencies

```bash
cd infinite-rig-services
npm install
```

This will install all required packages including:
- Next.js, React
- Supabase client
- Tailwind CSS
- OpenAI SDK
- Resend SDK
- And more...

### Step 2: Verify Installation

```bash
npm run type-check
```

If successful, you should see no TypeScript errors.

---

## 🗄️ SUPABASE SETUP

### Step 1: Create a New Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** infinite-rig-services
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to Liberia (e.g., eu-west-1)
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 2: Get Your API Keys

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (bottom right)
6. Wait for completion (should take 10-20 seconds)
7. Verify tables were created in **Table Editor**

### Step 4: Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure **Magic Link** settings
4. Go to **URL Configuration** and add:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: `http://localhost:3000/**`

### Step 5: Set Up Storage Buckets

1. Go to **Storage**
2. Create these buckets:
   - `resumes` (for job applications)
   - `documents` (for client documents)
   - `avatars` (for profile pictures)
   - `company-media` (for website images)

3. For each bucket, configure policies:
   - Click bucket name
   - Go to **Policies**
   - Add policy for authenticated users to upload
   - Add policy for role-based access

---

## 🔐 ENVIRONMENT VARIABLES

### Step 1: Create .env.local File

Copy the example file:

```bash
cp .env.example .env.local
```

### Step 2: Fill in Your Values

Edit `.env.local` with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key-here

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...your-key-here

# Resend Email Configuration
RESEND_API_KEY=re_...your-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Click **API keys** in sidebar
3. Click **"Create new secret key"**
4. Copy and save the key (you won't see it again!)
5. Add credits to your account

### Step 4: Get Resend API Key

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it "Infinite Rig Services"
4. Copy the key

---

## ▶️ RUNNING THE APPLICATION

### Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Verify Everything Works

1. Open http://localhost:3000
2. You should see the homepage with:
   - Navigation bar
   - Hero section
   - Services overview
   - Footer

### Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 🗃️ DATABASE SCHEMA SETUP

The schema is already created if you followed Supabase setup, but here's what was created:

### Core Tables
- ✅ `profiles` - User profiles with roles
- ✅ `job_postings` - Job listings
- ✅ `applications` - Job applications
- ✅ `clients` - Client companies
- ✅ `projects` - Client projects
- ✅ `documents` - Document storage
- ✅ `chat_conversations` - Chatbot conversations
- ✅ `chat_messages` - Chat messages
- ✅ `support_tickets` - Support tickets
- ✅ `news_posts` - Blog posts
- ✅ `departments` - Company departments

### Security Features
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Role-based access policies
- ✅ Audit logging
- ✅ Automated triggers for timestamps

### Test the Database

```bash
# In Supabase SQL Editor, run:
SELECT * FROM departments;
# Should return 9 departments
```

---

## 🚀 DEPLOYMENT TO VERCEL

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Infinite Rig Services"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/infinite-rig-services.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** > **"Project"**
3. **Import Git Repository**
4. Select your `infinite-rig-services` repository
5. Click **"Import"**

### Step 3: Configure Environment Variables

In Vercel project settings:

1. Go to **Settings** > **Environment Variables**
2. Add ALL variables from your `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
   - RESEND_API_KEY
3. Set **NEXT_PUBLIC_APP_URL** to your production domain
4. Click **"Save"**

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. Your site will be live at `https://your-project.vercel.app`

### Step 5: Add Custom Domain

1. In Vercel project, go to **Settings** > **Domains**
2. Add `infiniterigservices.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

---

## ⚙️ POST-DEPLOYMENT CONFIGURATION

### Update Supabase Settings

1. In Supabase, go to **Authentication** > **URL Configuration**
2. Update **Site URL** to: `https://infiniterigservices.com`
3. Add **Redirect URLs**:
   - `https://infiniterigservices.com/**`
   - `https://www.infiniterigservices.com/**`

### Configure Email Templates

1. In Supabase, go to **Authentication** > **Email Templates**
2. Customize templates for:
   - Confirmation email
   - Password reset
   - Magic link

### Set Up Monitoring

1. In Vercel, go to **Analytics** (enable if needed)
2. Check **Logs** regularly for errors
3. Set up error notifications

---

## 🔍 TROUBLESHOOTING

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Supabase connection fails

**Check:**
- Environment variables are correct
- Supabase project is running
- RLS policies are set up correctly

**Test connection:**
```typescript
// Create a test page at app/test/page.tsx
import { createClient } from '@/lib/supabase/client'

export default async function TestPage() {
  const supabase = createClient()
  const { data } = await supabase.from('departments').select('*')
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

### Issue: Build fails on Vercel

**Common causes:**
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Solution:**
```bash
# Test build locally first
npm run build

# Check for errors
npm run type-check
```

### Issue: API routes not working

**Check:**
- Route files are in correct location (`app/api/...`)
- Export Route handlers correctly
- Environment variables are set

### Getting Help

- Check Next.js docs: https://nextjs.org/docs
- Check Supabase docs: https://supabase.com/docs
- GitHub Issues: [Create an issue]
- Email: dev@infiniterigservices.com

---

## ✅ VERIFICATION CHECKLIST

Before going live, verify:

- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] User can create account
- [ ] User can login
- [ ] Job listings display
- [ ] Application form works
- [ ] File uploads work
- [ ] Mobile responsive design
- [ ] All links work
- [ ] No console errors
- [ ] SSL certificate active
- [ ] Custom domain works
- [ ] Email sending works

---

## 🎉 CONGRATULATIONS!

Your Infinite Rig Services web application is now live!

**Next Steps:**
1. Add company content (images, text)
2. Create first job postings
3. Configure chatbot with company data
4. Set up user accounts for staff
5. Train team on admin features

---

## 📞 SUPPORT

For technical support:
- Email: dev@infiniterigservices.com
- Documentation: [Link to docs]

---

**© 2025 Infinite Rig Services, Inc.**

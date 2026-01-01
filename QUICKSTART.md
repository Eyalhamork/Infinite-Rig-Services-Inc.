# ⚡ QUICK START GUIDE

Get your Infinite Rig Services application running in 15 minutes!

---

## 🎯 What You've Got

✅ Complete Next.js 14 application
✅ Full database schema (PostgreSQL)
✅ Authentication system ready
✅ 6 user role dashboards
✅ Beautiful UI with Tailwind CSS
✅ PWA configuration
✅ Complete documentation

---

## 🚀 5-STEP SETUP

### Step 1: Install Dependencies (2 min)

```bash
cd infinite-rig-services
npm install
```

### Step 2: Create Supabase Project (3 min)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `infinite-rig-services`
4. Choose region closest to you
5. Set strong password
6. Wait for project creation

### Step 3: Set Up Database (2 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy ALL content from `database/schema.sql`
4. Paste and click "Run"
5. ✅ Database is ready!

### Step 4: Configure Environment (3 min)

1. Copy `.env.example` to `.env.local`
2. In Supabase, go to **Settings** > **API**
3. Copy these values to `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Start the App (1 min)

```bash
npm run dev
```

🎉 **Visit http://localhost:3000**

---

## 📱 What You'll See

✅ **Homepage** - Hero section, services, company info
✅ **Navigation** - Working links to all pages
✅ **Responsive Design** - Works on all devices
✅ **Brand Colors** - Orange, Navy, Charcoal theme

---

## 🎨 Customize It

### Change Colors
Edit `tailwind.config.js` - lines 17-74

### Update Company Info
Edit `app/page.tsx` - company name, address, etc.

### Add Logo
Place logo in `public/logo.png`

---

## 📚 Next Steps

### For Full Setup:
Read **SETUP.md** for:
- OpenAI chatbot setup
- Email configuration
- Storage buckets
- Complete deployment guide

### For Understanding Code:
Read **README.md** for:
- Project structure
- Technology stack
- Features overview
- Development roadmap

---

## 🆘 Need Help?

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules
npm install
```

**"Supabase connection failed"**
- Check your .env.local has correct values
- Ensure Supabase project is active

**"Build fails"**
```bash
npm run type-check
# Fix any TypeScript errors
```

---

## ✅ Checklist

- [ ] `npm install` completed
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] `.env.local` configured
- [ ] App running on localhost:3000
- [ ] Homepage loads correctly

---

## 🎯 What's Included

### Pages Ready
- ✅ Homepage
- ✅ Services pages (placeholders)
- ✅ About page (structure)
- ✅ Careers portal (structure)
- ✅ Contact page (structure)

### Features Ready
- ✅ Authentication system
- ✅ Database with RLS
- ✅ User roles system
- ✅ File upload structure
- ✅ API routes framework

### To Be Added (Phase 2-4)
- ⏳ Job application forms
- ⏳ AI chatbot
- ⏳ Client portal
- ⏳ Content management
- ⏳ Support tickets

---

## 🚀 Deploy When Ready

### Quick Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

**Full deployment guide in SETUP.md**

---

## 💡 Pro Tips

1. **Start Simple** - Get the basics working first
2. **Test Often** - Run `npm run dev` frequently
3. **Read Docs** - SETUP.md has everything you need
4. **Use TypeScript** - It catches errors early
5. **Check Console** - Browser console shows errors

---

## 📞 Support

- 📖 Full Guide: `SETUP.md`
- 🐛 Issues: Check browser console
- 📧 Questions: dev@infiniterigservices.com

---

**You're all set! Start building! 🎉**

Next: Read SETUP.md for advanced features and deployment.

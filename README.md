# 🌊 Infinite Rig Services - Enterprise Web Platform

> Liberia's premier offshore support, supply, and manning services company

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 Project Overview

A comprehensive enterprise web application built for Infinite Rig Services, featuring:

- **🔐 Multi-role authentication system** (6 user types)
- **💼 Applicant Tracking System (ATS)** for recruitment
- **🤖 AI-powered chatbot** for 24/7 support
- **📊 Client portal** with project management
- **📱 Progressive Web App (PWA)** for mobile installation
- **🎨 Modern, responsive UI** with Tailwind CSS
- **⚡ Server-side rendering** with Next.js 14

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/infinite-rig-services.git

# Navigate to directory
cd infinite-rig-services

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit **http://localhost:3000** to see the application.

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

---

## 📁 Project Structure

```
infinite-rig-services/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # Role-based dashboards
│   │   ├── super-admin/
│   │   ├── management/
│   │   ├── editor/
│   │   ├── support/
│   │   ├── client/
│   │   └── applicant/
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # Reusable components
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript definitions
│   └── database.ts         # Database types
├── database/                # Database schemas
│   └── schema.sql          # PostgreSQL schema
├── public/                  # Static assets
│   └── manifest.json       # PWA manifest
├── config/                  # Configuration files
├── SETUP.md                 # Detailed setup guide
└── README.md               # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14+ (React 18)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **API:** Next.js API Routes

### AI & Services
- **Chatbot:** OpenAI GPT-4
- **Email:** Resend
- **Hosting:** Vercel

### Development
- **Language:** TypeScript
- **Testing:** Playwright (E2E)
- **Linting:** ESLint
- **Version Control:** Git

---

## 👥 User Roles

The platform supports **6 distinct user roles**:

| Role | Access Level | Key Features |
|------|-------------|--------------|
| **Super Admin** | Full system access | User management, configuration, all data |
| **Management** | Department oversight | Reporting, approvals, team management |
| **Editor** | Content management | Job postings, news, media uploads |
| **Support** | Customer service | Live chat, tickets, visitor assistance |
| **Client** | Portal access | Projects, documents, service requests |
| **Applicant** | Job applications | Apply for jobs, track application status |

---

## ✨ Key Features

### 🛠️ Core Services
Infinite Rig Services provides a full spectrum of offshore solutions:

- **🏗️ Offshore Operations:** Expert technical support for drilling rigs and platforms.
- **📦 Supply Chain & Logistics:** End-to-end procurement and delivery for remote operations.
- **👥 Manning Services:** Specialized recruitment, training, and crew management.
- **🛡️ HSE Consulting:** Building world-class safety cultures (ISO standards).
- **♻️ Waste Management:** Integrated hazardous and non-hazardous waste solutions.
- **🔍 Asset Integrity & Inspection:** Advanced NDT and structural assessments.
- **⚓ Rig Move & Marine Towage:** Safe rig relocation and station-keeping.
- **🔒 Maritime Security:** Armed protection and anti-piracy services.

- 🏠 Homepage with hero video and company stats
- 📋 Detailed service pages for all 8 core sectors
- 👥 About Us with team profiles
- 🛡️ HSSE (Health, Safety, Security, Environment) section
- 💼 Careers portal with live job board
- 📧 Contact page with form and location map

### Authentication System
- ✉️ Email/password and magic link login
- 🔄 Role-based dashboard routing
- 🔒 Two-factor authentication (2FA) for management
- 🔑 Password reset functionality
- 📱 Session management

### Applicant Tracking System (ATS)
- 📝 Multi-step application forms
- 📎 Resume and certificate uploads
- 📊 Kanban board for hiring team
- 📈 Application status tracking
- 📧 Automated email notifications

### AI Chatbot
- 🤖 24/7 automated support
- 🧠 RAG-based responses from company docs
- 👤 Handoff to human support staff
- 📊 Conversation history and analytics

### Client Portal
- 📊 Project dashboards and timelines
- 📁 Secure document repository
- 📝 Service request forms
- 💬 Communication with account managers

### Progressive Web App (PWA)
- 📱 Installable on desktop and mobile
- 🎨 Custom app icon and splash screen
- 📴 Offline mode for critical pages
- 🔔 Push notifications
- ⚡ Fast loading with service worker caching

---

## 🗄️ Database Schema

Complete PostgreSQL schema with:

- ✅ **15+ core tables** for all functionality
- ✅ **Row Level Security (RLS)** on all tables
- ✅ **Role-based access control** (RBAC)
- ✅ **Audit logging** for sensitive operations
- ✅ **Automated triggers** for timestamps
- ✅ **Foreign key relationships** for data integrity

See `database/schema.sql` for complete schema definition.

---

## 🎨 Design System

### Brand Colors
- **Primary Orange:** `#FF6B35` - CTA buttons, links, accents
- **Navy Blue:** `#004E89` - Headers, important text
- **Charcoal:** `#1A1A2E` - Body text, dark backgrounds
- **Light Gray:** `#F4F4F4` - Backgrounds, cards
- **Dark Gold:** `#B8860B` - Premium accents

### Typography
- **Font Family:** Inter (with system fallbacks)
- **Sizes:** H1 (48-64px), H2 (36-48px), Body (16px)

### Component Styles
- **Buttons:** Rounded corners (8px), hover lift effects
- **Cards:** White background, subtle shadows, 12px radius
- **Forms:** 40px input height, orange focus borders

---

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (tests if it builds)
npm run build

# Run E2E tests (when implemented)
npm run test:e2e
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# In Vercel:
# 1. Import repository
# 2. Add environment variables
# 3. Deploy
```

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

**See [SETUP.md](./SETUP.md) for detailed deployment instructions.**

---

## 📊 Performance Goals

- ⚡ **Page Load:** < 3 seconds
- 🎯 **Lighthouse Score:** > 90
- 📱 **Mobile Responsive:** 375px minimum
- ⏱️ **Time to Interactive:** < 5 seconds
- 🔄 **Uptime:** 99.5%+

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Foundation (Weeks 1-3)
- [x] Project setup and design system
- [x] Database schema and authentication
- [x] Core layouts and navigation

### 🚧 Phase 2: Core Features (Weeks 4-7)
- [ ] Public website pages
- [ ] Careers portal and job board
- [ ] Applicant Tracking System (ATS)
- [ ] Content management system

### 📋 Phase 3: Advanced Features (Weeks 8-10)
- [ ] AI chatbot implementation
- [ ] Client portal and projects
- [ ] Management dashboards
- [ ] Support ticket system

### 🎨 Phase 4: Polish & Launch (Weeks 11-12)
- [ ] PWA implementation
- [ ] Comprehensive testing
- [ ] Content population
- [ ] Production deployment

---

## 🤝 Contributing

This is a private enterprise project. For internal team members:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for review and approval

---

## 📝 License

© 2025 Infinite Rig Services, Inc. All Rights Reserved.

This is proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Contact

**Infinite Rig Services, Inc.**
- 📍 Crown Prince Plaza, Congo Town, Monrovia, Liberia
- 🌐 https://infiniterigservices.com
- 📧 info@infiniterigservices.com

---

## 🙏 Acknowledgments

Built with modern web technologies:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
- [Vercel](https://vercel.com/)

---

**Ready to transform offshore services in Liberia! 🇱🇷 ⚡**

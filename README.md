# Quickupp AI Studio USA — AI Video Production & Lead Generation Platform

[![Live Website](https://img.shields.io/badge/Website-quickuppaistudio.us-blue?style=for-the-badge&logo=google-chrome)](https://quickuppaistudio.us)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/QSPL8080/AI-STUDIO-USA.git)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?style=for-the-badge&logo=tanstack)](https://tanstack.com/start)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20%2F%20Postgres-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![PayPal](https://img.shields.io/badge/Payments-PayPal-003087?style=for-the-badge&logo=paypal)](https://paypal.com)
[![Calendly](https://img.shields.io/badge/Scheduler-Calendly-006BFF?style=for-the-badge&logo=calendly)](https://calendly.com/qsaistudio/strategy-call)

A premier, high-conversion marketing platform and built-in CRM Admin Lead Management Portal for **Quickupp AI Studio (USA & Global)** — an agency producing AI UGC videos, AI avatars, cartoon animations, hyper-realistic cinematic reels, and digital twin clones for high-growth businesses, brands, and creators.

---

## 📑 Table of Contents

1. [Architecture & Tech Stack](#-architecture--tech-stack)
2. [Advanced Hero Cinema Scroll Engine](#-advanced-hero-cinema-scroll-engine)
3. [Key Website Features & Conversion Funnel](#-key-website-features--conversion-funnel)
4. [Calendly Integration & Strategy Call Booking](#-calendly-integration--strategy-call-booking)
5. [Lead Capture & Instant Email Notification Engine](#-lead-capture--instant-email-notification-engine)
6. [PayPal Payment Gateway & Checkout](#-paypal-payment-gateway--checkout)
7. [PDF Receipt Generation](#-pdf-receipt-generation)
8. [Dual Database Architecture (Supabase & PostgreSQL)](#-dual-database-architecture-supabase--postgresql)
9. [Admin CRM Portal (`/admin`)](#-admin-crm-portal-admin)
10. [Project Directory Tree](#-project-directory-tree)
11. [Environment Variables Setup](#-environment-variables-setup)
12. [Database Schema](#-database-schema)
13. [Local Development Guide](#-local-development-guide)
14. [Deployment on Hostinger & Auto-Deploy CI/CD](#-deployment-on-hostinger--auto-deploy-cicd)
15. [Security, Performance & SEO Optimizations](#-security-performance--seo-optimizations)
16. [Authors & Credits](#-authors--credits)

---

## 🛠 Architecture & Tech Stack

| Layer                    | Technology                                              | Description                                                                                        |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Frontend Framework**   | [TanStack Start](https://tanstack.com/start) + React 19 | Fullstack Server-Side Rendering (SSR), instant hydration, and complete SEO metadata control.       |
| **Routing**              | TanStack Router                                         | File-based, 100% type-safe routing with automatic route tree generation and caching.               |
| **Styling & CSS Engine** | Tailwind CSS v4                                         | OKLCH modern color tokens, neon glow drops, backdrop blurs, and mobile-first responsive utilities. |
| **Email Notification**   | Direct SMTP (Nodemailer) + Fallbacks                    | Real-time lead email dispatch directly to agency inbox via Google App Password.                   |
| **Payment Gateway**      | [PayPal](https://paypal.com) (`@paypal/react-paypal-js`) | Secure PayPal Checkout integration for direct service package purchases with PDF receipts.       |
| **PDF Generation**       | PDFKit                                                  | Server-side branded PDF receipt generation delivered to clients on order confirmation.             |
| **Production Database**  | [Supabase](https://supabase.com) (PostgreSQL)           | Managed cloud PostgreSQL accessed via reliable HTTPS REST API to bypass cloud firewall/TCP blocks. |
| **Local Database**       | PostgreSQL (`pg` pool)                                  | Direct connection pool for offline local development and quick testing.                            |
| **Hosting & Web Server** | Hostinger Cloud Hosting + Nitro                         | High-performance `node-server` engine managed automatically.                                       |
| **Icons & Media**        | Lucide React                                            | Clean, scalable feather-style icons with animated states.                                          |
| **Language & Tooling**   | TypeScript + Vite 8                                     | End-to-end type safety, modern asset bundling, and ultra-fast build times.                         |

---

## 🎬 Advanced Hero Cinema Scroll Engine

The landing page features a custom-engineered, GPU-accelerated **Cinema Scroll Showcase** inspired by world-class creative agencies:

### 1. Dynamic Navigation Height Tracking
- Integrated a `ResizeObserver` listener on the top navigation container (`#site-nav-container`).
- Dynamically measures navbar pixel height whether the announcement promo banner is open (~116px) or dismissed (~72px).
- Anchors the video showcase container precisely below the header (`style={{ top: `${headerHeight}px` }}`), preventing top clipping on any screen resolution.

### 2. High-Impact Layered Composition
- **Screen-Spanning Brand Header:** Giant "AI Studio" banner image spanning `98vw` with neon violet drop-shadows.
- **Natural Cutting Overlap:** The compact video showcase card sits at `z-20` in front of the logo (`z-10`). Its top edge overlaps and cuts cleanly across the bottom ~70px–80px of the letters "S t u d i o", creating depth and a modern editorial aesthetic.
- **Pixel-Perfect Left Alignment:** The primary headline is indented (`pl-2 sm:pl-[4vw] md:pl-[4.8vw] lg:pl-[5vw]`) so its left edge aligns with the letter "A" in the "AI Studio" logo.

### 3. Smooth Full-Screen Expansion & Cinema Hold
- **Extended Track:** Operates within a `280vh` track using a 3-phase absolute/fixed pinning engine immune to scroll-chain glitches.
- **Expansion Phase (`0% -> 65% scroll`):** The video card expands from compact resting dimensions (`width: 36%, height: 42%, borderRadius: 20px`) into **100% edge-to-edge full screen** with zero gaps and `borderRadius: 0px`.
- **Locked Cinema Hold (`65% -> 100% scroll`):** The video remains **100% locked at full screen** while the user continues scrolling, preventing the next section from cutting the viewing experience short prematurely.

### 4. Interactive Audio & Voice Controls
- Features `/videos/Hero Video.mp4` with full-fidelity AAC audio and faststart metadata.
- **Audio Enabled by Default:** Configured with audio enabled (`muted={false}`) by default.
- **Intelligent Autoplay Fallback:** If browser security blocks unmuted autoplay before user engagement, it seamlessly unmutes audio upon first user interaction (touch, click, or scroll).
- **Interactive Audio Controls:** Includes a floating glassmorphic **"Voice Active" / "Unmute Voice"** button (`Volume2` / `VolumeX`) and click-to-toggle interaction directly on the video card.

---

## 🎯 Key Website Features & Conversion Funnel

- **Hero & Value Proposition:** High-impact dark mode aesthetics with animated neon borders, sample badges, and clear call-to-actions.
- **Service Showcase:** Detailed cards for AI UGC Reels, Avatar Videos, Cartoon Animations, Hyper-Realistic Videos, and Digital Twin Clones.
- **Portfolio Video Showcase:** Interactive, faststart-optimized video showcases (`/videos/UGC Porfolio.mp4?v=3`, `/videos/Avtar Portfolio.mp4?v=3`) with a direct link to the [Official YouTube Channel](https://youtube.com/@quickuppaistudio1).
- **Workflow & Process:** 4-step client delivery pipeline (Scripting → AI Generation → Voice & Audio → 48-Hour Delivery).
- **Transparent Pricing Tiers:** Flexible starter, growth, and agency bulk packages with feature comparisons and direct **PayPal checkout** on every plan.
- **FAQ Accordion:** Interactive, searchable questions answering delivery times, revisions, commercial licensing, and script ownership.
- **Floating WhatsApp Action:** Direct instant WhatsApp contact button present on all mobile and desktop screens.
- **Legal Pages:** Full [Cookie Policy](/cookie-policy), [Privacy Policy](/privacy-policy), and [Terms & Conditions](/terms) pages.

---

## 📅 Calendly Integration & Strategy Call Booking

The landing page features a direct Calendly scheduling integration (`src/components/site/sections.tsx` & `src/components/site/data.ts`):

- **Calendly Endpoint:** [`https://calendly.com/qsaistudio/strategy-call`](https://calendly.com/qsaistudio/strategy-call)
- **Inline Embedded Scheduling Widget:** Clients can browse available dates, select time slots, and schedule 30-minute discovery calls directly inside the website without leaving the page.
- **Group / Multi-Invitee Support:** Configured for multi-attendee and group scheduling so multiple team members or clients can participate in the strategy meeting.
- **Automated Host Notification & Calendar Sync:** Automatically notifies `qsaistudio@gmail.com`, creates Google Meet / Zoom links, and syncs directly with Google Calendar.

---

## 📬 Lead Capture & Instant Email Notification Engine

The application captures inquiries from two primary sources and syncs them automatically:

1. **Main Contact Section Form (`#contact`):** Full inquiry form capturing Name, Phone, Email, Business, Video Type, Location, Requirement, and Additional Message.
2. **Interactive Timed Quote Modal:**
   - Automatically opens after **1.2 seconds** on visit.
   - Recurs automatically every **5 minutes (300,000 ms)** for active sessions.
   - Form validation with instant lead capture and notification trigger.

### Branded Email Notification Template (`src/lib/email.ts`)
Whenever a lead is submitted:
- A clean, modern **pure white email notification with official Quickupp AI Studio branding and logo** is instantly dispatched to **`qsaistudio@gmail.com`** (with backup delivery to `quickuppaistudio1@gmail.com`).
- **Instant Response Buttons Included:**
  - 🟢 **💬 WhatsApp Chat:** Opens WhatsApp chat directly with the client's phone number.
  - 🔵 **📞 Call Client:** Dials the client's phone number directly with 1 tap.
- **Zero Spam Risk:** Sent securely via Gmail SMTP SSL port 465 using Google App Passwords with multi-tier fallback delivery.

---

## 💳 PayPal Payment Gateway & Checkout

The platform includes a fully integrated **PayPal Checkout** system for direct service package purchases:

- **Component:** `src/components/site/checkout-modal.tsx` — A sleek glassmorphic checkout modal launched directly from pricing cards.
- **Server Actions:** `src/lib/paypal-actions.ts` — TanStack Start server functions for creating, capturing, and verifying PayPal orders via the PayPal Orders v2 REST API.
- **PayPal Client:** `src/lib/paypal.ts` — Configures the PayPal SDK with environment-aware credentials (sandbox / production).
- **Pricing Engine:** `src/lib/pricing.ts` — Centralized pricing definitions and package configurations used across the checkout and pricing sections.
- **Supported Environments:** Configurable between `sandbox` (for testing) and `live` (production) via `PAYPAL_ENVIRONMENT` env variable.
- **Order Confirmation Page:** `src/routes/order-confirmation.tsx` — Post-payment confirmation page displaying order details, summary, and a downloadable PDF receipt.

---

## 🧾 PDF Receipt Generation

Upon successful payment, the platform auto-generates a **branded PDF receipt** server-side:

- **Generator:** `src/lib/pdf-receipt.ts` — Uses PDFKit to produce a professional PDF with Quickupp AI Studio branding, order details, package summary, and payment confirmation.
- **Brand Assets:** `src/lib/receipt-assets.ts` — Inlines brand logos and assets as base64 for zero-dependency PDF embedding.
- **Delivery:** Receipt is downloadable directly from the Order Confirmation page (`/order-confirmation`).

---

## 🗄 Dual Database Architecture (Supabase & PostgreSQL)

The database engine (`src/lib/db.ts`) provides full fault-tolerance:

- **In Production (Hostinger Cloud / Web Host):** Communicates with Supabase via HTTPS REST API (`SUPABASE_URL` + `SUPABASE_API_KEY`). This completely circumvents cloud firewall TCP port 5432 / 6543 blocking.
- **In Local Development:** Direct connection pool to local PostgreSQL (`DATABASE_URL=postgres://postgres:8080@localhost:5432/ai_studio`).

---

## 📊 Admin CRM Portal (`/admin`)

An authenticated, mobile-responsive dashboard designed for real-time lead tracking and client management:

- **Portal URL:** `https://quickuppaistudio.us/admin` (or `http://localhost:3000/admin`)
- **Authorized Admin Logins:**
  - `qsaistudio@gmail.com` (Password: `Anay@0079`)
  - `admin@aistudio.com` (Password: `Admin@123`)

### Features:
- 📈 **Real-Time KPI Counters:** Total Leads, Contact Form count, Popup Modal count, and New Leads Today.
- 🔔 **Audio Alerts & Live 10s Sync:** Instant audio chime and visual highlight when a new lead is received in real-time.
- 🔍 **Instant Search & Multi-Filters:** Search by client name, business, phone, or email; filter by source category or lead status.
- 🔄 **Lead Status Toggling:** Update leads to `New`, `Contacted`, `In Progress`, or `Closed` with real-time database sync.
- 💬 **1-Click WhatsApp Client Reply:** Pre-fills client name and opens WhatsApp Web/App ready to send.
- 📥 **CSV Export:** Download all filtered leads in CSV format for Excel, Google Sheets, or CRM imports.
- 🔒 **Security Auto-Logout:** Continuously monitors admin activity. Automatically logs out after **10 minutes** of inactivity.

---

## 📂 Project Directory Tree

```
AI STUDIO/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD deployment workflow
├── public/
│   ├── videos/                     # Faststart-optimized showcase videos
│   │   ├── Hero Video.mp4          # Hero showcase video with AAC audio
│   │   ├── UGC Porfolio.mp4        # UGC video showcase reel
│   │   ├── Avtar Portfolio.mp4     # Avatar video showcase reel
│   │   └── Jwellery Portfolio.mp4  # Jewellery & luxury cinematic showcase reel
│   ├── images/                     # Hero banners and brand graphics
│   │   ├── LOGO 1.png              # Header brand logo (optimized for light header background)
│   │   ├── logo.png                # Footer brand logo (vibrant gradient + crisp white typography)
│   │   ├── footer logo.png         # Large footer brand showcase emblem
│   │   └── ai studio logo hero.png      # High-resolution hero title logo
│   ├── favicon.png                      # Browser favicon
│   └── robots.txt                       # Search engine crawl rules
├── src/
│   ├── routes/
│   │   ├── __root.tsx                   # Root HTML shell, fonts, meta tags & providers
│   │   ├── index.tsx                    # Main landing page assembling all sections
│   │   ├── admin.tsx                    # CRM Admin Portal with auth & auto-logout
│   │   ├── order-confirmation.tsx       # Post-payment order confirmation & PDF receipt download
│   │   ├── cookie-policy.tsx            # Cookie Policy page
│   │   ├── privacy-policy.tsx           # Privacy Policy page
│   │   └── terms.tsx                    # Terms and Conditions page
│   ├── components/
│   │   └── site/
│   │       ├── data.ts                  # Static content (pricing, services, FAQs, reviews)
│   │       ├── sections.tsx             # UI components (Hero, Portfolio, Pricing, Form, Modal, FAQ)
│   │       ├── checkout-modal.tsx       # PayPal checkout modal for direct package purchases
│   │       ├── custom-cursor.tsx        # Atmospheric glow cursor follower
│   │       └── ui.tsx                   # Base design components (NeonButton, Section, Cards)
│   ├── lib/
│   │   ├── db.ts                        # Supabase REST + PostgreSQL dual database engine
│   │   ├── email.ts                     # Direct Gmail SMTP lead notification engine
│   │   ├── lead-actions.ts              # TanStack Start server functions (create, fetch, update, delete)
│   │   ├── paypal.ts                    # PayPal SDK client configuration (sandbox/live)
│   │   ├── paypal-actions.ts            # PayPal Orders v2 server functions (create, capture, verify)
│   │   ├── pdf-receipt.ts               # PDFKit branded PDF receipt generator
│   │   ├── receipt-assets.ts            # Base64 brand assets for PDF embedding
│   │   ├── pricing.ts                   # Centralized pricing & package definitions
│   │   ├── error-capture.ts             # SSR error capture utility
│   │   ├── error-page.ts                # Fallback error diagnostics page
│   │   ├── lovable-error-reporting.ts   # Lovable platform error reporting integration
│   │   └── utils.ts                     # Tailwind class utility (clsx + twMerge)
│   ├── styles.css                       # Global Tailwind CSS tokens, glows, and animations
│   ├── routeTree.gen.ts                 # Auto-generated TanStack route tree
│   ├── router.tsx                       # QueryClient and TanStack router configuration
│   ├── server.ts                        # Nitro / Node SSR server entry wrapper
│   └── start.ts                         # Client hydration entrypoint
├── .env.example                         # Environment variable template
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
└── vite.config.ts                       # Vite + Nitro node-server configuration
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in the project root (use `.env.example` as a template):

```env
# Local PostgreSQL Connection
DATABASE_URL=postgres://postgres:8080@localhost:5432/ai_studio

# Production Supabase Credentials (Configured in Hostinger)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-supabase-service-role-key

# Gmail SMTP Email Dispatch (Direct Google Delivery)
SMTP_USER=quickuppaistudio1@gmail.com
SMTP_PASS=your-google-app-password
LEAD_NOTIFICATION_EMAIL=quickuppaistudio1@gmail.com

# PayPal Payment Gateway Integration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_ENVIRONMENT=sandbox   # Change to 'live' for production

# Application Server Port
PORT=3000
```

> [!NOTE]
> `.env` is listed in `.gitignore` and is never committed to GitHub. Never commit real credentials.

> [!IMPORTANT]
> Change `PAYPAL_ENVIRONMENT` from `sandbox` to `live` and update PayPal credentials before going live.

---

## 🗃 Database Schema

Table name: `public.leads`

```sql
CREATE TABLE IF NOT EXISTS public.leads (
    id VARCHAR(64) PRIMARY KEY,
    source VARCHAR(32) NOT NULL,        -- 'Contact Form' | 'Popup Modal'
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(255),
    video_type VARCHAR(128) NOT NULL,
    business VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    industry VARCHAR(128),
    requirement TEXT,
    additional TEXT,
    status VARCHAR(32) DEFAULT 'New',   -- 'New' | 'Contacted' | 'In Progress' | 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 💻 Local Development Guide

### Prerequisites

- Node.js 20+ or Bun installed
- PostgreSQL installed and running on port `5432`

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production (Node-server preset)
npm run build

# 4. Run production build locally
npm start

# 5. Lint & format
npm run lint
npm run format
```

---

## 🚀 Deployment on Hostinger & Auto-Deploy CI/CD

1. **Connect GitHub Repository:**
   - Link `https://github.com/QSPL8080/AI-STUDIO-USA.git` to your Hostinger Cloud/Web Hosting project.
   - Branch: `main`
2. **Configure Environment Variables in Hostinger Dashboard:**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_API_KEY`: Your Supabase service role / API key
   - `SMTP_USER`: `quickuppaistudio1@gmail.com`
   - `SMTP_PASS`: Your Google App Password
   - `LEAD_NOTIFICATION_EMAIL`: `quickuppaistudio1@gmail.com`
   - `PAYPAL_CLIENT_ID`: Your live PayPal client ID
   - `PAYPAL_CLIENT_SECRET`: Your live PayPal client secret
   - `PAYPAL_ENVIRONMENT`: `live`
   - `PORT`: `3000`
3. **Build & Start Settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. **Auto-Deployment:**
   Every time you push code to GitHub (`git push origin main`), Hostinger automatically rebuilds and deploys the latest version to **`https://quickuppaistudio.us`**.

---

## 🛡 Security, Performance & SEO Optimizations

- **Zero Hardcoded Secrets:** All database credentials, tokens, API keys, and payment credentials are isolated in environment variables.
- **Session Auto-Timeout:** Inactivity listener logs out admin sessions automatically after 10 minutes.
- **Faststart Media Streaming:** All hero and showcase MP4 videos have their `moov` atom located at the beginning of the file for instant buffering.
- **Semantic SEO Structure:** Complete semantic `<h1>`, descriptive `alt` tags, and OpenGraph/Twitter card metadata.
- **Core Web Vitals Optimized:** Hero brand assets use `fetchPriority="high"` and `loading="eager"` for sub-second Largest Contentful Paint (LCP).
- **Firewall Bypass:** Supabase HTTPS REST interface guarantees zero connection drops from cloud TCP port blocks.
- **PayPal Order Verification:** All PayPal order captures are verified server-side before fulfillment to prevent payment spoofing.
- **Legal Compliance:** Cookie Policy, Privacy Policy, and Terms & Conditions pages fully implemented.

---

## 👥 Authors & Credits

- **Quickupp AI Studio** — Enterprise AI UGC & Avatar Video Production Platform
- **Lead Architect & Developer:** Quickupp Development Team
- **Official Links:**
  - Website: [quickuppaistudio.us](https://quickuppaistudio.us)
  - YouTube: [Quickupp AI Studio YouTube Channel](https://youtube.com/@quickuppaistudio1)
  - Support / Inquiries: [quickuppsoftech1@gmail.com](mailto:quickuppsoftech1@gmail.com)


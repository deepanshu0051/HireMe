# HireMe 🚀

> **A personal, self-hosted job application automation platform** — manage companies, auto-generate AI emails, and track your entire job hunt from one dashboard.

![HireMe Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&style=flat-square)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Dual Auth** | Admin (full control) + Guest (read-only demo) via JWT |
| 🤖 **AI Email Generation** | Gemini-powered, personalized job application emails |
| 🛡️ **Privacy Safe** | AI prompt explicitly excludes LinkedIn/GitHub links; regex redaction as a second layer |
| 📎 **Resume Attachment** | Cloudinary PDF attached to every automated email |
| ⏰ **Cron Automation** | Hourly job (10 AM–5 PM IST), configurable daily email cap (1–5) |
| 📊 **Dashboard** | Live stats: companies queued, weekly emails sent, progress to daily goal |
| 💼 **Company Queue** | Add/edit/remove companies; track status (Pending → Sent / Failed) |
| 📬 **Email Logs** | Full history of every sent email per company |
| 🔍 **Job Search** | JSearch API integration with skill matching and AI email drafts |
| ☁️ **Cloud Resume** | PDF upload via Cloudinary; in-browser preview modal |
| ⚙️ **Settings** | Auto-send toggle, cron schedule, emails-per-day cap (persisted in DB) |

---

## 🏗️ Tech Stack

### Backend
- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — Database
- **Nodemailer** — SMTP email dispatch
- **Google Gemini API** — AI email generation
- **Cloudinary** — Resume PDF storage
- **node-cron** — Scheduled automation
- **JWT** — Authentication

### Frontend
- **React 18 + Vite** — UI framework
- **Tailwind CSS** — Styling (Light mode only)
- **Lucide React** — Icons
- **React Router v6** — Client-side routing

---

## 📁 Project Structure

```
HireMe/
├── backend/
│   ├── config/          # DB, mailer, Cloudinary, Gemini, cron
│   ├── controllers/     # Auth, company, email, cron, settings, AI, resume
│   ├── middleware/      # authMiddleware (requireAuth, requireAdmin)
│   ├── models/          # Company, EmailLog, Profile, Resume, AppSetting
│   ├── routes/          # All API route definitions
│   ├── services/        # aiService.js (centralized AI email logic)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── layouts/     # DashboardLayout (sidebar + mobile nav)
    │   ├── pages/       # All page components
    │   ├── components/  # Shared UI components
    │   ├── utils/       # auth.js, cn.js, guestData.js
    │   └── services/    # API service wrappers
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account with App Password (for SMTP)
- Cloudinary account
- Google Gemini API key
- JSearch API key (RapidAPI)

### 1. Clone the repo
```bash
git clone https://github.com/deepanshu0051/HireMe.git
cd HireMe
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hireme

# Auth
JWT_SECRET=your_super_secret_key
ADMIN_ACCESS_PASSWORD=your_admin_password
ADMIN_SECRET_KEY=your_admin_secret_key

# Email (SMTP)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# JSearch API (RapidAPI)
JSEARCH_API_KEY=your_jsearch_api_key

# Cron control
CRON_ENABLED=true
```

```bash
node server.js
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Authentication

| Role | How to Login | Access |
|---|---|---|
| **Admin** | Access Password + Secret Key | Full control: companies, emails, settings, resume, cron |
| **Guest** | "Continue as Guest" button | Read-only demo mode; no DB writes |

> Admin tokens are stored in `localStorage` (persistent). Guest tokens use `sessionStorage` (tab-scoped, auto-clears on close).

---

## ⚙️ How Automation Works

1. **Cron** fires hourly between 10 AM – 5 PM IST (configurable)
2. Checks `autoSendEnabled` flag in DB → skips if disabled
3. Reads `emailsPerDay` cap from DB (1–5, default 5)
4. Counts emails already sent today → stops if cap reached
5. Fetches the oldest `Pending` companies (up to remaining cap)
6. For each company:
   - Generates personalized email via **Gemini AI** using admin Profile data
   - Safety-redacts any social links that slip through
   - Attaches Cloudinary resume PDF (or injects link in body as fallback)
   - Sends via Nodemailer SMTP
   - Logs to `EmailLog` collection; updates company status to `Sent`

---

## 🛡️ Security

- **NoSQL Injection**: `sanitizePayload()` strips `$` and `.` from all `req.body`, `req.query`, `req.params`
- **XSS**: Input stripped via `sanitizePayload` before DB writes
- **Constant-time Comparison**: Admin credentials compared with `crypto.timingSafeEqual`
- **JWT**: All protected routes require `Authorization: Bearer <token>`
- **Social Link Redaction**: AI prompt + regex post-processing ensures no LinkedIn/GitHub in outgoing emails

---

## 📷 Screenshots

> Login to the Admin dashboard and add companies to start automating your job applications.

| Login / Access Gate | Dashboard | Settings |
|---|---|---|
| Premium auth screen with 3D cube animation | Live stats, company queue, daily progress | Auto-send, cron schedule, emails-per-day |

---

## 📦 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/guest` | Guest token |
| `GET` | `/api/companies` | List all companies |
| `POST` | `/api/companies` | Add company |
| `PUT` | `/api/companies/:id` | Update company |
| `DELETE` | `/api/companies/:id` | Remove company |
| `POST` | `/api/emails/send-manual` | Manual email trigger |
| `POST` | `/api/cron/run` | Trigger cron manually |
| `GET` | `/api/emails/company/:id` | Email logs for a company |
| `GET/PUT` | `/api/profile` | Admin profile |
| `POST` | `/api/resume/upload` | Upload resume to Cloudinary |
| `GET` | `/api/settings` | Get all settings |
| `PUT` | `/api/settings/auto-send` | Toggle auto-send |
| `PUT` | `/api/settings/schedule` | Set cron hours |
| `PUT` | `/api/settings/emails-per-day` | Set daily cap (1–5) |
| `GET` | `/api/jobs/fetch-with-email` | JSearch + AI email |

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Set all environment variables from the `.env` template above
2. Set `CRON_ENABLED=true`
3. Deploy from the `backend/` directory, start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_BASE_URL=https://your-backend-url.com`
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 👤 Author

**Deepanshu Bhati**  
Full Stack Developer  
📞 +91 9560287251

---

## 📄 License

This project is for **personal use only**. Not licensed for redistribution.

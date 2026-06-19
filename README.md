# HireMe

> A personal, self-hosted job application automation platform that helps you manage companies, generate AI-powered job application emails, and track your entire job hunt from a single dashboard.

---

## 🚀 Overview

HireMe automates the repetitive parts of job hunting by combining:

* Company management
* AI-powered email generation
* Resume attachment automation
* Scheduled email sending
* Job search integration
* Analytics dashboard

Built with **Node.js, React, MongoDB, Gemini AI, Cloudinary, and Nodemailer**.

---

## ✨ Features

### Authentication

* Admin Login (Full Access)
* Guest Login (Read-Only Demo)
* JWT-Based Authentication

### AI Email Generation

* Personalized job application emails using Google Gemini
* Automatic company-specific email drafting
* Social profile redaction for privacy

### Resume Management

* Resume upload via Cloudinary
* PDF preview support
* Automatic attachment in outgoing emails

### Automation

* Hourly cron-based email automation
* Configurable daily email limits
* Auto-send toggle from dashboard

### Company Management

* Add, edit, and delete companies
* Track application status
* Queue-based email processing

### Job Search

* JSearch API integration
* Skill-based job matching
* AI-generated email drafts

### Dashboard Analytics

* Weekly email statistics
* Daily progress tracking
* Queue monitoring
* Automation insights

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Nodemailer
* Google Gemini API
* Cloudinary
* Node Cron
* JWT Authentication

### Frontend

* React 18
* Vite
* Tailwind CSS
* React Router v6
* Lucide React

---

## 📂 Project Structure

```text
HireMe
│
├── backend
│   ├── config
│   │   ├── db.js
│   │   ├── mailer.js
│   │   ├── cloudinary.js
│   │   ├── gemini.js
│   │   └── cron.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── emailController.js
│   │   ├── profileController.js
│   │   ├── resumeController.js
│   │   └── settingsController.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── models
│   │   ├── Company.js
│   │   ├── EmailLog.js
│   │   ├── Profile.js
│   │   ├── Resume.js
│   │   └── AppSetting.js
│   │
│   ├── routes
│   ├── services
│   │   └── aiService.js
│   │
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── layouts
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   └── utils
│   │
│   └── index.html
│
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

* Node.js 18+
* MongoDB Atlas Account
* Gmail Account (App Password Enabled)
* Cloudinary Account
* Google Gemini API Key
* JSearch API Key

---

## 📥 Installation

### Clone Repository

```bash
git clone https://github.com/deepanshu0051/HireMe.git

cd HireMe
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret
ADMIN_ACCESS_PASSWORD=your_admin_password
ADMIN_SECRET_KEY=your_admin_secret_key

EMAIL_USER=your_email
EMAIL_PASS=your_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

JSEARCH_API_KEY=your_jsearch_api_key

CRON_ENABLED=true
```

Start Backend:

```bash
node server.js
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start Frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔐 Authentication

| Role  | Access                |
| ----- | --------------------- |
| Admin | Full Platform Control |
| Guest | Read-Only Demo Mode   |

### Admin Permissions

* Manage Companies
* Send Emails
* Configure Automation
* Upload Resume
* Manage Profile
* View Logs

### Guest Permissions

* Dashboard Preview
* Demo Data Access
* No Database Writes

---

## 🤖 Automation Workflow

1. Cron runs every hour.
2. Checks if Auto-Send is enabled.
3. Reads daily email limit.
4. Counts emails sent today.
5. Selects pending companies.
6. Generates personalized email using Gemini AI.
7. Attaches resume from Cloudinary.
8. Sends email using SMTP.
9. Saves logs and updates company status.

---

## 🔒 Security Features

### Input Protection

* NoSQL Injection Prevention
* Request Sanitization
* XSS Protection

### Authentication

* JWT Authorization
* Protected Routes
* Constant-Time Credential Validation

### Privacy

* LinkedIn Redaction
* GitHub Redaction
* Prompt-Level Privacy Controls

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /api/auth/login |
| POST   | /api/auth/guest |

### Companies

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /api/companies     |
| POST   | /api/companies     |
| PUT    | /api/companies/:id |
| DELETE | /api/companies/:id |

### Emails

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/emails/send-manual |
| GET    | /api/emails/company/:id |

### Automation

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /api/cron/run |

### Profile

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /api/profile |
| PUT    | /api/profile |

### Resume

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/resume/upload |

### Settings

| Method | Endpoint                     |
| ------ | ---------------------------- |
| GET    | /api/settings                |
| PUT    | /api/settings/auto-send      |
| PUT    | /api/settings/schedule       |
| PUT    | /api/settings/emails-per-day |

### Jobs

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/jobs/fetch-with-email |

---

## 🚀 Deployment

### Backend (Render / Railway)

```bash
node server.js
```

Environment Variables:

* Mongo URI
* JWT Secret
* Gmail SMTP Credentials
* Cloudinary Credentials
* Gemini API Key
* JSearch API Key

### Frontend (Netlify / Vercel)

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

Build Command:

```bash
npm run build
```

---

## 📄 License

This project is for educational and personal job automation purposes.

---

## 👨‍💻 Author

Deepanshu Bhati

GitHub:
https://github.com/deepanshu0051

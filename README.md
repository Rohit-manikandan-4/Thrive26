# UpliftAI

**"Opportunities in your language. A better future within reach."**

UpliftAI is an inclusive, AI-powered opportunity-discovery platform built for low-income
communities, underprivileged youth, and users who are more comfortable in Indian regional
languages. It helps people discover scholarships, government schemes, free courses,
skill-development programs, jobs, internships, and financial assistance — explained simply,
in their own language.

Built by **Team Axino**.

## Project structure

```
upliftai/
├── frontend/   React + Vite + Tailwind + Framer Motion + React Three Fiber
└── backend/    Node.js + Express + Google Gemini API
```

## Running locally

### 1. Backend

```bash
cd backend
cp .env.example .env   # add your GEMINI_API_KEY
npm install
npm run dev             # http://localhost:5050
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The frontend proxies `/api/*` requests to the backend during development (see
`frontend/vite.config.js`).

## Environment variables

Backend `.env`:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5050
```

The Gemini API key is **never** exposed to the browser — all AI calls happen server-side
through `POST /api/chat`.

## Notes

- All opportunity data is **mock/demo data** for prototype purposes (`isDemo: true`) and is
  clearly labeled as such throughout the UI.
- This is a hackathon prototype — no authentication, payments, or production database are
  included by design.

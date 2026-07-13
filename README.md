# ResumeAI — AI-Powered Resume Reviewer

> An intelligent, privacy-first resume analysis tool powered by **Google Gemini 2.5 Flash**. Upload your resume, paste a job description, and get a structured audit with scores, keyword gaps, rewritten bullet points, and a downloadable PDF report — all in seconds.

**[Live Demo →](#)** &nbsp;|&nbsp; **[Get a Free Gemini API Key →](https://aistudio.google.com/app/apikey)**

---

## What It Does

Most resume tools give you vague tips. ResumeAI gives you:

- An **overall score out of 100** with a strict, rubric-based breakdown
- **Section-by-section ratings** (Experience, Skills, Education, Formatting, Impact)
- **ATS compatibility check** — whether your resume passes Applicant Tracking Systems
- **Job Description matching** — exact keyword gaps between your resume and the JD
- **Rewritten bullet points** — your weak task descriptions converted to outcome-focused, metric-driven statements
- **Career strategy suggestions** — project ideas and skills tailored to your target role
- **Downloadable audit report** — a clean, print-friendly PDF formatted for recruiters

---

## Features

| Feature | Description |
|---|---|
| 🧠 **AI Resume Scoring** | Gemini 2.5 Flash evaluates experience, impact, formatting, and skills using a strict rubric |
| 🎯 **JD Match Analysis** | Paste a job description to get a % match score and list of missing keywords |
| 📄 **Client-Side PDF Parsing** | PDFs are extracted in-browser via `pdf.js` — your file never leaves your device |
| ✍️ **Bullet Point Optimizer** | Rewrites weak task-based bullets into quantified, action-oriented outcomes |
| 📊 **Score History** | Tracks your past audit scores locally via `localStorage` |
| 📥 **PDF Export** | Download a professional, recruiter-ready audit report (light-mode, ATS-safe layout) |
| 🔒 **API Key Security** | Gemini key lives in a Next.js server-side API route — never exposed to the browser |
| ⚡ **Rate Limiting** | Server-side IP-based rate limiter protects your free Gemini quota from spam |
| 🌗 **Dark / Light Mode** | Glassmorphism dark UI with a full light-mode toggle via `next-themes` |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Server-side API routes keep the Gemini key secure |
| UI | **React 19** + **TailwindCSS v4** | Component-based UI with utility-first styling |
| AI | **Google Gemini 2.5 Flash** | Fast, structured JSON output via `responseMimeType` schema |
| PDF Parsing | **pdfjs-dist** | Client-side extraction — no file uploads to any server |
| PDF Export | **jsPDF** | Programmatic report generation with full layout control |
| Theming | **next-themes** | Zero-flash dark/light mode with system preference detection |

---

## Architecture Note

The API key is handled entirely server-side in `app/api/review/route.js`. The client sends only the extracted resume text — never the raw PDF binary or any credentials. This keeps the app safe to deploy publicly without leaking quota.

```
Browser                         Next.js Server
──────                          ──────────────
PDF  ──► pdf.js extract ──►  resume text
                               + job role       ──►  Gemini API
                               + job desc              │
                                                       ▼
UI  ◄──────────── structured JSON score & feedback ◄──┘
```

---

## Local Setup

**1. Clone and install:**
```bash
git clone <your-repo-url>
cd ai-resume-reviewer
npm install
```

**2. Add your Gemini API key:**
```bash
# Windows
copy .env.example .env.local

# Mac / Linux
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey) — no credit card required.

**3. Run the dev server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

This app is built for zero-config Vercel deployment.

1. Push to a GitHub repository
2. Import the repo at [vercel.com](https://vercel.com)
3. Under **Environment Variables**, add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: your API key
4. Click **Deploy**

The server-side rate limiter automatically blocks IPs exceeding 5 reviews per hour to protect your Gemini quota.

---

## Project Structure

```
app/
├── page.js              # Landing page with interactive sandbox demo
├── layout.js            # Root layout, fonts, theme provider
├── globals.css          # Global styles, animations, CSS variables
├── review/
│   └── page.js          # Main audit console (upload, analyze, results)
└── api/
    └── review/
        └── route.js     # Server-side Gemini API handler + rate limiter

components/
├── DownloadPDFButton.js # jsPDF report generator
├── ScoreRing.js         # Animated SVG score ring
├── SectionScores.js     # Section breakdown bars
├── JobMatchAnalysis.js  # JD match percentage + keyword matrix
├── AnalysisCards.js     # Skill tags + score history
├── Checklist.js         # Resume fundamentals audit
├── FeedbackCard.js      # Strengths / weaknesses cards
└── ConfettiEffect.js    # Celebration on high scores
```

---

*Built with Next.js App Router, React 19, and the Gemini 2.5 Flash structured output API.*

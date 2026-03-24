# ✨ ResumeAI - Advanced Resume Reviewer

ResumeAI is an exceptionally fast, totally private, beautifully designed web app that uses the new Gemini 2.5 Flash AI to give you instant, professional resume reviews and tailored ATS optimizations.

It runs locally on your machine or deployed via Vercel, bypassing the need for expensive SAAS products.

## 🔥 Key Features
*   🚀 **Instant AI Analysis**: Uses the Gemini API for sub-second, multi-point resume parsing.
*   🎯 **Job Description Matcher**: Paste a job description to get a specific Match Percentage (%) and exact keyword suggestions.
*   📊 **Deep Scoring System**: Gives you an overall score (/100) and section-by-section breakdown (Experience, Skills, Education, Formatting, Impact).
*   📄 **Client-Side PDF Extraction**: Your PDFs are completely parsed inside your local browser. The raw text is extracted automatically via `pdf.js` before being sent—preserving privacy and format.
*   🌗 **Dark / Light Mode Theme**: Automatically respects your System preference and features an elegant glassmorphism theme engineered natively in TailwindCSS v4.
*   📥 **PDF Report Generation**: Download your results in a sleek, dark-themed presentation PDF.
*   ✅ **Security Checked**: Built-in Vercel rate-limiting and completely `.env` protected structure ensures your API keys are never exposed.

---

## 💻 Tech Stack
*   **Next.js 15** (App Router)
*   **React 19**
*   **TailwindCSS v4** (With glassmorphism `bg-white/[0.03]` patterns)
*   **Gemini AI API** (`gemini-2.5-flash`)
*   **pdfjs-dist**, **jsPDF**, **html2canvas**, **next-themes**

---

## 🛠️ Local Setup

1. **Clone the repository** and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd ai-resume-reviewer
   npm install
   ```

2. **Set up your API Key:**
   Create a file inside the root directory named exactly `.env.local`.
   Open the file and add your Gemini API Developer Key:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   ```
   *You can get a completely free key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 🚀 Deploying to Vercel (For GitHub)

This app is natively built for Vercel and can be deployed entirely for free.

1. Create a repository on your **GitHub** account and push this folder.
2. Sign in to [Vercel](https://vercel.com).
3. Click **Add New Project** and select your GitHub repo.
4. **⚠️ CRITICAL: Environment Variables**
   Before clicking "Deploy", expand the `Environment Variables` section.
   Add the following Name & Value:
   *   **Name**: `GEMINI_API_KEY`
   *   **Value**: *Your actual API key*
5. Click **Deploy**. That's it! 

The built-in memory rate limiter will automatically block any IP addresses that spam the API more than 10 times an hour to protect your free Gemini quota.

---
*Built iteratively relying entirely on native Next.js features and structured Gemini API schemas.*

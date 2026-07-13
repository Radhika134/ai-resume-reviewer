// Basic in-memory rate limiter to prevent spam on Vercel deployments.
// Note: Vercel serverless functions restart cold, so this is primarily to block short bursts.
const rateLimitMap = new Map();

/** Merge security headers into a provided headers object */
function securityHeaders(extra = {}) {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...extra,
  };
}

/** Shorthand for JSON error responses with security headers */
function jsonErr(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: securityHeaders({ "Content-Type": "application/json" }),
  });
}

export async function POST(request) {
  try {
    /* ── 1. Parse JSON first ── */
    let body;
    try { body = await request.json(); }
    catch { return jsonErr("Invalid JSON in request body.", 400); }

    const isSingleBullet = body?.mode === "single-bullet";

    // IP Rate Limiting (5 full reviews or 30 single-bullets per hour per IP)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const isDev = process.env.NODE_ENV === "development";
    if (ip !== 'unknown' && !isDev) {
      const now = Date.now();
      const ipData = rateLimitMap.get(ip) || { count: 0, startTime: now };
      if (now - ipData.startTime > 3600000) { ipData.count = 1; ipData.startTime = now; }
      else { ipData.count++; }
      rateLimitMap.set(ip, ipData);
      
      const limit = isSingleBullet ? 30 : 5;
      if (ipData.count > limit) {
        return new Response(
          JSON.stringify({ error: `Rate limit exceeded (${limit} per hour). Please try again later.` }),
          { status: 429, headers: securityHeaders({ "Content-Type": "application/json" }) }
        );
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonErr("Server configuration error: API key is missing.", 500);
    }

    /* ── 2. Handle Single Bullet Mode ── */
    if (isSingleBullet) {
      const bulletText     = typeof body.bulletText     === "string" ? body.bulletText.slice(0, 1000) : "";
      const jobRole        = typeof body.jobRole        === "string" ? body.jobRole.slice(0, 200)     : "";
      const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.slice(0, 10000) : "";

      if (!bulletText.trim()) {
        return jsonErr("Please provide a valid bullet point to optimize.", 400);
      }

      let roleContext = jobRole.trim()
        ? `The candidate is targeting the role: "${jobRole.trim()}".`
        : `Optimize the bullet point for general professional impact.`;

      if (jobDescription.trim()) {
        roleContext += `\nJob Description:\n${jobDescription.trim()}\n\nSince a job description is provided, tailor it specifically to the job.`;
      }

      const prompt = `You are an expert resume reviewer and career coach.
Your task is to take a single bullet point from a candidate's resume and rewrite it to be highly professional, action-oriented, and outcome-focused.
Include logical industry metrics or placeholders for metrics if none are provided.

${roleContext}

Original Bullet Point:
"${bulletText.trim()}"

Provide the output in JSON matching this schema:
- original: the original bullet point
- improved: the optimized bullet point
- explanation: a short sentence explaining why this is better.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  original:    { type: "STRING" },
                  improved:    { type: "STRING" },
                  explanation: { type: "STRING" },
                },
                required: ["original", "improved", "explanation"],
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini Single Bullet API error:", response.status, errorBody);
        let errorMsg = `AI API error (${response.status})`;
        try {
          const parsedErr = JSON.parse(errorBody);
          if (parsedErr?.error?.code === 503) {
            errorMsg = "The AI model is currently experiencing high demand. Please wait a few seconds and try again.";
          } else if (parsedErr?.error?.message) {
            errorMsg = parsedErr.error.message;
          }
        } catch {}
        return jsonErr(errorMsg, 502);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return jsonErr("AI returned an empty response. Please try again.", 502);
      }

      let parsed;
      try {
        parsed = JSON.parse(rawText.trim());
      } catch {
        return jsonErr("Could not parse AI response. Please try again.", 502);
      }

      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: securityHeaders({ "Content-Type": "application/json" }),
      });
    }

    /* ── 3. Validate full resume inputs ── */
    const resumeText     = typeof body.resumeText     === "string" ? body.resumeText.slice(0, 30000) : "";
    const jobRole        = typeof body.jobRole        === "string" ? body.jobRole.slice(0, 200)     : "";
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.slice(0, 10000) : "";

    if (!resumeText.trim() || resumeText.trim().length < 20) {
      return jsonErr("Please provide a valid resume text (at least 20 characters).", 400);
    }
    if (resumeText.length >= 30000) {
      return jsonErr("Resume text is too long. Please constrain it to about 5-6 pages maximum.", 400);
    }

    /* ── 2. Build prompt ── */
    const hasJobDesc = !!jobDescription?.trim();

    let roleContext = jobRole?.trim()
      ? `The candidate is targeting the role: "${jobRole.trim()}". Tailor all feedback, suggestions, and scoring specifically for this role.`
      : `No specific role was provided. Give general resume advice.`;

    if (hasJobDesc) {
      roleContext += `\n\nJob Description:\n${jobDescription.trim()}\n\nSince a job description is provided, populate "missingKeywords" with 5 keywords from the JD missing in the resume, "projectSuggestions" with 3 specific project ideas to strengthen this resume for the role, and "rewrittenBullets" with 2 bullet point rewrites ({ original, improved }) tailored to the job. Set "matchPercentage" to the % match between resume and JD.`;
    }

    const prompt = `You are an expert resume reviewer and career coach. ${roleContext}

- score: number 0-100 (overall resume strength)

SCORING RUBRIC (BE STRICT):
1. EXPERIENCE (0-100): High score for quantifiable achievements (%, $, numbers) and clear impact. Low score for task-only descriptions.
2. SKILLS (0-100): High score for unique domain-relevant skills substantiated in job bullets.
3. IMPACT (0-100): High score for strong action verbs and outcome-focused writing.
4. FORMATTING (0-100): High score for consistency, white space, and logical flow.
5. EDUCATION (0-100): High for relevant degrees and certifications.

- atsReady: boolean
- keywords: "Strong" | "Average" | "Weak"
- formatting: "Clean" | "Average" | "Messy"
- matchPercentage: number 0-100 (% match to role/JD if provided, else 0)
- matchAnalysis: string (1-2 sentences on role fit; empty string "" if no role given)
- strengths: array of exactly 3 strings
- weaknesses: array of exactly 3 strings
- suggestions: array of exactly 3 strings
- sectionScores: object with keys experience, skills, education, formatting, impact — each 0-100
- skillTags: array of skill strings detected in resume
- checklist: object with boolean fields hasContactInfo, hasLinkedIn, hasMetrics, hasActionVerbs, hasSummary, hasCertifications
- missingKeywords: ${hasJobDesc ? "array of exactly 5 important keywords from the JD that are missing from the resume" : "empty array []"}
- projectSuggestions: ${hasJobDesc ? "array of exactly 3 specific project ideas tailored to strengthen this resume for this role" : "empty array []"}
- rewrittenBullets: ${hasJobDesc ? "array of exactly 2 objects, each with \"original\" (a bullet from the resume) and \"improved\" (a rewritten version tailored to the JD)" : "empty array []"}

Resume:
${resumeText.trim()}`;

    /* ── 3. Call Google Gemini API ── */
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                score:            { type: "NUMBER" },
                atsReady:         { type: "BOOLEAN" },
                keywords:         { type: "STRING" },
                formatting:       { type: "STRING" },
                matchPercentage:  { type: "NUMBER" },
                matchAnalysis:    { type: "STRING" },
                strengths:        { type: "ARRAY", items: { type: "STRING" } },
                weaknesses:       { type: "ARRAY", items: { type: "STRING" } },
                suggestions:      { type: "ARRAY", items: { type: "STRING" } },
                sectionScores: {
                  type: "OBJECT",
                  properties: {
                    experience: { type: "NUMBER" },
                    skills:     { type: "NUMBER" },
                    education:  { type: "NUMBER" },
                    formatting: { type: "NUMBER" },
                    impact:     { type: "NUMBER" },
                  },
                },
                skillTags: { type: "ARRAY", items: { type: "STRING" } },
                checklist: {
                  type: "OBJECT",
                  properties: {
                    hasContactInfo:    { type: "BOOLEAN" },
                    hasLinkedIn:       { type: "BOOLEAN" },
                    hasMetrics:        { type: "BOOLEAN" },
                    hasActionVerbs:    { type: "BOOLEAN" },
                    hasSummary:        { type: "BOOLEAN" },
                    hasCertifications: { type: "BOOLEAN" },
                  },
                },
                missingKeywords:    { type: "ARRAY", items: { type: "STRING" } },
                projectSuggestions: { type: "ARRAY", items: { type: "STRING" } },
                rewrittenBullets: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      original: { type: "STRING" },
                      improved: { type: "STRING" },
                    },
                  },
                },
              },
              required: [
                "score", "atsReady", "keywords", "formatting",
                "matchPercentage", "matchAnalysis",
                "strengths", "weaknesses", "suggestions",
                "sectionScores", "skillTags", "checklist",
                "missingKeywords", "projectSuggestions", "rewrittenBullets",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", response.status, errorBody);
      let errorMsg = `AI API error (${response.status})`;
      try {
        const parsedErr = JSON.parse(errorBody);
        if (parsedErr?.error?.code === 503) {
          errorMsg = "The AI model is currently experiencing high demand. Please wait a few seconds and try again.";
        } else if (parsedErr?.error?.message) {
          errorMsg = parsedErr.error.message;
        }
      } catch {}
      return jsonErr(errorMsg, 502);
    }

    /* ── 4. Extract the message content ── */
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("Unexpected Gemini response shape:", JSON.stringify(data));
      return jsonErr("AI returned an unexpected response. Please try again.", 502);
    }

    /* ── 5. Parse JSON ── */
    let parsed;
    try {
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); }
        catch {
          console.error("Failed to parse AI response as JSON:", rawText);
          return jsonErr("Could not parse AI response. Please try again.", 502);
        }
      } else {
        console.error("No JSON found in AI response:", rawText);
        return jsonErr("Could not parse AI response. Please try again.", 502);
      }
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: securityHeaders({ "Content-Type": "application/json" }),
    });

  } catch (err) {
    console.error("Unhandled error in /api/review:", err);
    return jsonErr("An unexpected server error occurred. Please try again.", 500);
  }
}

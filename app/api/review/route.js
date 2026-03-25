// Basic in-memory rate limiter to prevent spam on Vercel deployments.
// Note: Vercel serverless functions restart cold, so this is primarily to block short bursts.
const rateLimitMap = new Map();

export async function POST(request) {
  try {
    // Basic IP Rate Limiting (10 requests per hour per IP)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (ip !== 'unknown') {
      const now = Date.now();
      const ipData = rateLimitMap.get(ip) || { count: 0, startTime: now };
      if (now - ipData.startTime > 3600000) { ipData.count = 1; ipData.startTime = now; }
      else { ipData.count++; }
      
      rateLimitMap.set(ip, ipData);
      if (ipData.count > 10) {
        return Response.json({ error: "Rate limit exceeded (10 per hour). Please try again later." }, { status: 429 });
      }
    }

    /* ── 1. Validate input ── */
    const body = await request.json();
    const { resumeText, jobRole } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      return Response.json(
        { error: "Please provide a valid resume text (at least 20 characters)." },
        { status: 400 }
      );
    }
    if (resumeText.length > 30000) {
      return Response.json(
        { error: "Resume text is too long. Please constrain it to about 5-6 pages maximum." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not set in .env.local" },
        { status: 500 }
      );
    }

    /* ── 2. Build prompt ── */
    const roleContext = jobRole?.trim()
      ? `The candidate is targeting the role: "${jobRole.trim()}". Tailor all feedback, suggestions, and scoring specifically for this role.`
      : `No specific role was provided. Give general resume advice.`;

    const prompt = `You are an expert resume reviewer and career coach. ${roleContext}

Analyze the resume below and respond ONLY with a valid JSON object matching this exact schema (no markdown, no explanation, pure JSON):

{
  "score": <overall number 0-100>,
  "atsReady": <true or false>,
  "keywords": "<Strong or Average or Weak>",
  "formatting": "<Clean or Average or Messy>",
  "matchPercentage": <number 0-100, ONLY if role is provided, otherwise null>,
  "matchAnalysis": "<short thoughtful 1-2 sentence analysis of how well they fit the role, if role provided>",
  "strengths": ["<string>", "<string>", "<string>"],
  "weaknesses": ["<string>", "<string>", "<string>"],
  "suggestions": ["<string>", "<string>", "<string>"],
  "sectionScores": {
    "experience": <0-100>,
    "skills": <0-100>,
    "education": <0-100>,
    "formatting": <0-100>,
    "impact": <0-100>
  },
  "skillTags": ["<skill>", "<skill>", ...],
  "checklist": {
    "hasContactInfo": <true or false>,
    "hasLinkedIn": <true or false>,
    "hasMetrics": <true or false>,
    "hasActionVerbs": <true or false>,
    "hasSummary": <true or false>,
    "hasCertifications": <true or false>
  }
}

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
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                score: { type: "NUMBER" },
                atsReady: { type: "BOOLEAN" },
                keywords: { type: "STRING" },
                formatting: { type: "STRING" },
                matchPercentage: { type: "NUMBER", nullable: true },
                matchAnalysis: { type: "STRING", nullable: true },
                strengths: { type: "ARRAY", items: { type: "STRING" } },
                weaknesses: { type: "ARRAY", items: { type: "STRING" } },
                suggestions: { type: "ARRAY", items: { type: "STRING" } },
                sectionScores: {
                  type: "OBJECT",
                  properties: {
                    experience: { type: "NUMBER" },
                    skills: { type: "NUMBER" },
                    education: { type: "NUMBER" },
                    formatting: { type: "NUMBER" },
                    impact: { type: "NUMBER" },
                  },
                },
                skillTags: { type: "ARRAY", items: { type: "STRING" } },
                checklist: {
                  type: "OBJECT",
                  properties: {
                    hasContactInfo: { type: "BOOLEAN" },
                    hasLinkedIn: { type: "BOOLEAN" },
                    hasMetrics: { type: "BOOLEAN" },
                    hasActionVerbs: { type: "BOOLEAN" },
                    hasSummary: { type: "BOOLEAN" },
                    hasCertifications: { type: "BOOLEAN" },
                  },
                },
              },
              required: [
                "score", "atsReady", "keywords", "formatting",
                "strengths", "weaknesses", "suggestions",
                "sectionScores", "skillTags", "checklist",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", response.status, errorBody);
      let detail = "";
      try { detail = JSON.parse(errorBody)?.error?.message ?? ""; } catch {}
      return Response.json(
        { error: `AI API error (${response.status})${detail ? ": " + detail : ". Check your API key."}` },
        { status: 502 }
      );
    }

    /* ── 4. Extract the message content ── */
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("Unexpected Gemini response shape:", JSON.stringify(data));
      return Response.json(
        { error: "AI returned an unexpected response. Please try again." },
        { status: 502 }
      );
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
          return Response.json({ error: "Could not parse AI response. Please try again." }, { status: 502 });
        }
      } else {
        console.error("No JSON found in AI response:", rawText);
        return Response.json({ error: "Could not parse AI response. Please try again." }, { status: 502 });
      }
    }

    return Response.json(parsed, { status: 200 });

  } catch (err) {
    console.error("Unhandled error in /api/review:", err);
    return Response.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}

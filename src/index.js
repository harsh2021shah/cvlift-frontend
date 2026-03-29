/**
 * CVLift Tools API — Cloudflare Worker
 *
 * This Worker proxies tool requests from the frontend (cvlift.me/free-tools/)
 * to Gemini, Grok, or OpenRouter APIs, while keeping API keys secure.
 *
 * Rate limits: 5 requests per IP per hour (via Cloudflare KV)
 */

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== "POST") {
      return errorResponse(405, "Method not allowed");
    }

    const url = new URL(request.url);
    if (url.pathname !== "/tool") {
      return errorResponse(404, "Endpoint not found");
    }

    const origin = request.headers.get("Origin") || request.headers.get("Referer") || "";
    if (!origin.includes("cvlift.me")) {
      return errorResponse(403, "Request origin not allowed");
    }

    try {
      const payload = await request.json();
      const { tool, input } = payload;

      if (!tool || !input) {
        return errorResponse(400, "Missing 'tool' or 'input' in request");
      }

      const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
      const rateLimitKey = `ratelimit:${clientIp}`;
      const currentCount = await env.RATE_LIMITS.get(rateLimitKey);
      const count = parseInt(currentCount || "0", 10);

      if (count >= 5) {
        return errorResponse(
          429,
          "Rate limit exceeded (5 requests per hour per IP). Sign up for unlimited access."
        );
      }

      await env.RATE_LIMITS.put(rateLimitKey, String(count + 1), {
        expirationTtl: 3600,
      });

      const result = await routeToolToProvider(tool, input, env);
      return successResponse(result);
    } catch (error) {
      console.error("Worker error:", error.message);
      return errorResponse(500, `Server error: ${error.message}`);
    }
  },
};

async function routeToolToProvider(tool, input, env) {
  const providers = {
    "ats-checker": ["gemini", "openrouter"],
    "keyword-density": ["gemini", "openrouter"],
    "resume-length": ["gemini", "openrouter"],
    "salary-lookup": ["gemini", "openrouter"],
    "subject-line-generator": ["gemini", "openrouter"],
    "resume-scorecard": ["gemini", "openrouter"],
    "headline-generator": ["grok", "gemini", "openrouter"],
    "skills-gap": ["gemini", "openrouter"],
    "jd-decoder": ["gemini", "openrouter"],
    "career-quiz": ["gemini", "openrouter"],
    "bullet-rewriter": ["grok", "gemini", "openrouter"],
    "resume-tailor-preview": ["gemini", "openrouter"],
    "cold-email-generator": ["grok", "gemini", "openrouter"],
    "interview-question-generator": ["gemini", "openrouter"],
    "pdf-formatter-preview": ["gemini", "openrouter"],
  };

  const toolProviders = providers[tool] || ["gemini", "openrouter"];

  for (const provider of toolProviders) {
    try {
      if (provider === "gemini") {
        return await callGemini(tool, input, env);
      }
      if (provider === "grok") {
        return await callGrok(tool, input, env);
      }
      if (provider === "openrouter") {
        return await callOpenRouter(tool, input, env);
      }
    } catch (error) {
      console.warn(`Provider ${provider} failed for tool ${tool}:`, error.message);
    }
  }

  throw new Error("All AI providers failed. Check API keys and quotas.");
}

async function callGemini(tool, input, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = buildPromptForTool(tool, input);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return parseModelJson(text);
}

async function callGrok(tool, input, env) {
  const apiKey = env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error("GROK_API_KEY not configured");
  }

  const prompt = buildPromptForTool(tool, input);
  const response = await fetch("https://api.x.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Grok API error: ${error.error?.message || response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseModelJson(text);
}

async function callOpenRouter(tool, input, env) {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const prompt = buildPromptForTool(tool, input);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cvlift.me",
      "X-Title": "CVLift Tools API",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseModelJson(text);
}

function parseModelJson(text) {
  const raw = String(text || "").trim();

  if (!raw) {
    return { text: "" };
  }

  const withoutFence = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(withoutFence);
  } catch (error) {
    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");

    if (start !== -1 && end > start) {
      const candidate = withoutFence.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch (innerError) {
        return { text: raw };
      }
    }

    return { text: raw };
  }
}

function buildPromptForTool(tool, input) {
  const baseInstructions = "Always respond with valid JSON only, no markdown, no extra text.";
  const toolPrompts = {
    "ats-checker": `${baseInstructions} Analyze this resume against the job title for ATS compatibility.\n\nResume: ${input.resumeText}\nJob Title: ${input.jobTitle}\n\nReturn JSON:\n{\n  "score": "0-100 percentage",\n  "matched_keywords": ["keyword1", "keyword2"],\n  "missing_keywords": ["gap1", "gap2"],\n  "verdict": "brief 1-line assessment"\n}`,
    "resume-scorecard": `${baseInstructions} Grade this resume across 5 sections.\n\nResume: ${input.resumeText}\n\nReturn JSON:\n{\n  "summary": { "grade": "A-F", "feedback": "..." },\n  "experience": { "grade": "A-F", "feedback": "..." },\n  "skills": { "grade": "A-F", "feedback": "..." },\n  "education": { "grade": "A-F", "feedback": "..." },\n  "formatting": { "grade": "A-F", "feedback": "..." }\n}`,
    "bullet-rewriter": `${baseInstructions} Rewrite this weak resume bullet into 3 stronger variants with action verbs and impact.\n\nBullet: ${input.bulletText}\n\nReturn JSON:\n{\n  "rewrites": ["improved bullet 1", "improved bullet 2", "improved bullet 3"]\n}`,
    "headline-generator": `${baseInstructions} Generate 3 LinkedIn headline options in different tones.\n\nRole: ${input.role}\nIndustry: ${input.industry}\nSkills: ${input.skills}\n\nReturn JSON:\n{\n  "headlines": [\n    { "tone": "professional", "text": "..." },\n    { "tone": "bold", "text": "..." },\n    { "tone": "conversational", "text": "..." }\n  ]\n}`,
    "skills-gap": `${baseInstructions} Compare resume skills to job requirements.\n\nResume: ${input.resumeText}\nJob Description: ${input.jobDescription}\n\nReturn JSON:\n{\n  "matched_skills": ["skill1", "skill2"],\n  "missing_skills": ["gap1", "gap2"],\n  "priority_gaps": ["urgent1", "urgent2"],\n  "verdict": "brief assessment"\n}`,
    "jd-decoder": `${baseInstructions} Decode this job description into structured requirements.\n\nJob Description: ${input.jobDescription}\n\nReturn JSON:\n{\n  "must_haves": ["requirement1", "requirement2"],\n  "nice_to_haves": ["bonus1", "bonus2"],\n  "hidden_requirements": ["implicit1"],\n  "culture_signals": ["signal1"],\n  "red_flags": ["flag1"]\n}`,
    "salary-lookup": `${baseInstructions} Estimate salary range for this role.\n\nJob Title: ${input.jobTitle}\nLocation: ${input.location}\nExperience Level: ${input.experienceLevel}\n\nReturn JSON:\n{\n  "min": "salary in local currency",\n  "median": "salary in local currency",\n  "max": "salary in local currency",\n  "context": "brief market note"\n}`,
    "subject-line-generator": `${baseInstructions} Generate 5 email subject lines for a job application.\n\nRole: ${input.role}\nCompany: ${input.company}\nTone: ${input.tone}\n\nReturn JSON:\n{\n  "subject_lines": ["subject1", "subject2", "subject3", "subject4", "subject5"]\n}`,
    "resume-tailor-preview": `${baseInstructions} Suggest 3 targeted resume edits.\n\nResume: ${input.resumeText}\nJob Description: ${input.jobDescription}\n\nReturn JSON:\n{\n  "edits": [\n    { "before": "current text", "after": "improved text" },\n    { "before": "current text", "after": "improved text" },\n    { "before": "current text", "after": "improved text" }\n  ]\n}`,
    "cold-email-generator": `${baseInstructions} Generate a recruiter outreach email.\n\nCompany: ${input.company}\nRole: ${input.role}\nAbout You: ${input.about}\n\nReturn JSON:\n{\n  "subject": "email subject line",\n  "body": "email body (multiline okay)"\n}`,
    "interview-question-generator": `${baseInstructions} Generate 10 likely interview questions with tips.\n\nRole: ${input.role}\nIndustry: ${input.industry}\nSeniority: ${input.seniority}\n\nReturn JSON:\n{\n  "questions": [\n    { "question": "q1?", "answer_tip": "tip for answering" },\n    { "question": "q2?", "answer_tip": "tip for answering" }\n  ]\n}`,
  };

  return toolPrompts[tool] || `${baseInstructions} Please respond with useful structured JSON data for this tool request: ${tool}`;
}

function successResponse(data) {
  return new Response(JSON.stringify({ result: data }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

function errorResponse(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://cvlift.me",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}
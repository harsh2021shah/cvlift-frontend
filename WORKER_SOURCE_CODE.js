/**
 * CVLift Tools API — Cloudflare Worker
 * 
 * This Worker proxies tool requests from the frontend (cvlift.me/free-tools/)
 * to Gemini, Grok, or OpenRouter APIs, while keeping API keys secure.
 * 
 * Rate limits: 5 requests per IP per hour (via Cloudflare KV)
 */

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return errorResponse(405, "Method not allowed");
    }

    // Route to /tool endpoint only
    const url = new URL(request.url);
    if (url.pathname !== "/tool") {
      return errorResponse(404, "Endpoint not found");
    }

    // Validate Origin header (only cvlift.me)
    const origin = request.headers.get("Origin") || request.headers.get("Referer") || "";
    if (!origin.includes("cvlift.me")) {
      return errorResponse(403, "Request origin not allowed");
    }

    try {
      // Parse request body
      const payload = await request.json();
      const { tool, input } = payload;

      if (!tool || !input) {
        return errorResponse(400, "Missing 'tool' or 'input' in request");
      }

      // Check rate limit (5 requests per IP per hour)
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

      // Increment rate limit counter (expires after 1 hour = 3600 seconds)
      await env.RATE_LIMITS.put(rateLimitKey, String(count + 1), {
        expirationTtl: 3600,
      });

      // Route to AI provider based on tool type
      const result = await routeToolToProvider(tool, input, env);

      return successResponse(result);
    } catch (error) {
      console.error("Worker error:", error.message);
      return errorResponse(
        500,
        `Server error: ${error.message}`
      );
    }
  },
};

/**
 * Route each tool to the best-fit AI provider
 */
async function routeToolToProvider(tool, input, env) {
  // AI provider preferences per tool
  const providers = {
    // Tier 1 - Awareness tools (Gemini Flash primarily)
    "ats-checker": ["gemini"],
    "keyword-density": ["gemini"],
    "resume-length": ["gemini"], // Local JS, but could use AI for advice
    "salary-lookup": ["gemini"],
    "subject-line-generator": ["gemini"],

    // Tier 2 - Engagement tools (Gemini for structured, Grok for creative)
    "resume-scorecard": ["gemini"],
    "headline-generator": ["grok", "gemini"],
    "skills-gap": ["gemini"],
    "jd-decoder": ["gemini"],
    "career-quiz": ["gemini"],

    // Tier 3 - Conversion tools (Grok for creative, Gemini fallback)
    "bullet-rewriter": ["grok", "gemini"],
    "resume-tailor-preview": ["gemini"],
    "cold-email-generator": ["grok", "gemini"],
    "interview-question-generator": ["gemini"],
    "pdf-formatter-preview": ["gemini"],
  };

  const toolProviders = providers[tool] || ["gemini"];

  // Try each provider in order until one succeeds
  for (const provider of toolProviders) {
    try {
      if (provider === "gemini") {
        return await callGemini(tool, input, env);
      } else if (provider === "grok") {
        return await callGrok(tool, input, env);
      } else if (provider === "openrouter") {
        return await callOpenRouter(tool, input, env);
      }
    } catch (error) {
      console.warn(`Provider ${provider} failed for tool ${tool}:`, error.message);
      // Continue to next provider
      continue;
    }
  }

  // All providers failed
  throw new Error("All AI providers failed. Check API keys and quotas.");
}

/**
 * Google Gemini Flash API call
 */
async function callGemini(tool, input, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const prompt = buildPromptForTool(tool, input);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
  const text = data.candidates[0]?.content?.parts[0]?.text || "";

  // Parse JSON response from Gemini
  try {
    return JSON.parse(text);
  } catch {
    // If not valid JSON, return as text
    return { text: text };
  }
}

/**
 * Grok API call (via X/Twitter API or xAI endpoint)
 */
async function callGrok(tool, input, env) {
  const apiKey = env.GROK_API_KEY;
  if (!apiKey) throw new Error("GROK_API_KEY not configured");

  const prompt = buildPromptForTool(tool, input);

  // Grok API endpoint (placeholder — adjust based on actual Grok API)
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
  const text = data.choices[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch {
    return { text: text };
  }
}

/**
 * OpenRouter API call (fallback for free models)
 */
async function callOpenRouter(tool, input, env) {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const prompt = buildPromptForTool(tool, input);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-2-7b-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch {
    return { text: text };
  }
}

/**
 * Build tool-specific prompts optimized for JSON output
 */
function buildPromptForTool(tool, input) {
  const baseInstructions =
    "Always respond with valid JSON only, no markdown, no extra text.";

  const toolPrompts = {
    "ats-checker": `${baseInstructions} Analyze this resume against the job title for ATS compatibility.
    
Resume: ${input.resumeText}
Job Title: ${input.jobTitle}

Return JSON:
{
  "score": "0-100 percentage",
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["gap1", "gap2"],
  "verdict": "brief 1-line assessment"
}`,

    "resume-scorecard": `${baseInstructions} Grade this resume across 5 sections.

Resume: ${input.resumeText}

Return JSON:
{
  "summary": { "grade": "A-F", "feedback": "..." },
  "experience": { "grade": "A-F", "feedback": "..." },
  "skills": { "grade": "A-F", "feedback": "..." },
  "education": { "grade": "A-F", "feedback": "..." },
  "formatting": { "grade": "A-F", "feedback": "..." }
}`,

    "bullet-rewriter": `${baseInstructions} Rewrite this weak resume bullet into 3 stronger variants with action verbs and impact.

Bullet: ${input.bulletText}

Return JSON:
{
  "rewrites": ["improved bullet 1", "improved bullet 2", "improved bullet 3"]
}`,

    "headline-generator": `${baseInstructions} Generate 3 LinkedIn headline options in different tones.

Role: ${input.role}
Industry: ${input.industry}
Skills: ${input.skills}

Return JSON:
{
  "headlines": [
    { "tone": "professional", "text": "..." },
    { "tone": "bold", "text": "..." },
    { "tone": "conversational", "text": "..." }
  ]
}`,

    "skills-gap": `${baseInstructions} Compare resume skills to job requirements.

Resume: ${input.resumeText}
Job Description: ${input.jobDescription}

Return JSON:
{
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["gap1", "gap2"],
  "priority_gaps": ["urgent1", "urgent2"],
  "verdict": "brief assessment"
}`,

    "jd-decoder": `${baseInstructions} Decode this job description into structured requirements.

Job Description: ${input.jobDescription}

Return JSON:
{
  "must_haves": ["requirement1", "requirement2"],
  "nice_to_haves": ["bonus1", "bonus2"],
  "hidden_requirements": ["implicit1"],
  "culture_signals": ["signal1"],
  "red_flags": ["flag1"]
}`,

    "salary-lookup": `${baseInstructions} Estimate salary range for this role.

Job Title: ${input.jobTitle}
Location: ${input.location}
Experience Level: ${input.experienceLevel}

Return JSON:
{
  "min": "salary in local currency",
  "median": "salary in local currency",
  "max": "salary in local currency",
  "context": "brief market note"
}`,

    "subject-line-generator": `${baseInstructions} Generate 5 email subject lines for a job application.

Role: ${input.role}
Company: ${input.company}
Tone: ${input.tone}

Return JSON:
{
  "subject_lines": ["subject1", "subject2", "subject3", "subject4", "subject5"]
}`,

    "resume-tailor-preview": `${baseInstructions} Suggest 3 targeted resume edits.

Resume: ${input.resumeText}
Job Description: ${input.jobDescription}

Return JSON:
{
  "edits": [
    { "before": "current text", "after": "improved text" },
    { "before": "current text", "after": "improved text" },
    { "before": "current text", "after": "improved text" }
  ]
}`,

    "cold-email-generator": `${baseInstructions} Generate a recruiter outreach email.

Company: ${input.company}
Role: ${input.role}
About You: ${input.about}

Return JSON:
{
  "subject": "email subject line",
  "body": "email body (multiline okay)"
}`,

    "interview-question-generator": `${baseInstructions} Generate 10 likely interview questions with tips.

Role: ${input.role}
Industry: ${input.industry}
Seniority: ${input.seniority}

Return JSON:
{
  "questions": [
    { "question": "q1?", "answer_tip": "tip for answering" },
    { "question": "q2?", "answer_tip": "tip for answering" }
  ]
}`,
  };

  return (
    toolPrompts[tool] ||
    `${baseInstructions} Please respond with useful structured JSON data for this tool request: ${tool}`
  );
}

/**
 * Helper functions
 */
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

# CVLift Free Tools — Full Project Plan

> **Goal:** Add a suite of 15 free AI-powered resume tools to `cvlift.me` to drive organic
> traffic and funnel users into the core product. Zero backend infrastructure — stays fully
> static on GitHub Pages.
>
> **Total tools:** 15 across 3 funnel tiers, shipped across 3 release phases.

---

## Architecture Overview

### The core constraint

GitHub Pages is a pure static host. It cannot store secrets or run server-side code. Calling
AI APIs directly from the browser would expose your API keys publicly — they would be scraped
within days.

**GitHub Actions is not the right tool here.** Actions are for CI/CD build pipelines — they
cannot serve real-time HTTP requests from users.

### The solution: Cloudflare Workers as a thin proxy

Deploy a **Cloudflare Worker** at `api.cvlift.me` that:

- Holds your API keys in environment variables (never in code or the browser)
- Receives tool requests from the browser
- Forwards them to Gemini / Grok / OpenRouter
- Returns the response to the frontend
- Enforces rate limiting by IP using Cloudflare KV

**Why Cloudflare Workers:**
- Free tier: 100,000 requests/day
- Supports custom domains (you likely already use Cloudflare for `cvlift.me`)
- KV store (free tier) for IP-based rate limiting
- ~10 min setup once your domain is on Cloudflare
- No Docker, no Node server, no hosting bill

```
User browser  →  cvlift.me/tools.html  (GitHub Pages, static)
     ↓
User submits tool input
     ↓
fetch('https://api.cvlift.me/tool')  →  Cloudflare Worker
                                              ↓
                                    Gemini Flash / Grok / OpenRouter
                                              ↓
                                    JSON response back to browser
```

### AI provider routing strategy

| Tool category | Provider | Reason |
|---|---|---|
| Scoring, grading, analysis | Gemini Flash | Fast, generous free tier, strong structured JSON output |
| Creative rewriting, generation | Grok or OpenRouter free models | Better creative output for rewrites and copy |
| Fallback (quota exceeded) | OpenRouter free tier | Routes to best available free model |

---

## All 15 Tools — By Funnel Tier

### Tier 1 — Awareness tools (SEO traffic magnets)

These get organic search hits from people Googling cold. No prior knowledge of CVLift needed.

| # | Tool | Core user action | Target search query |
|---|---|---|---|
| 1 | ATS score checker | Paste resume + job title → keyword match % | `free ats resume checker` |
| 2 | Keyword density tool | Paste resume → keyword frequency + job fit analysis | `resume keyword checker free` |
| 3 | Resume length checker | Paste resume → word count, page estimate, verdict | `is my resume too long` |
| 4 | Salary lookup widget | Enter job title + location → salary range | `software engineer salary india` |
| 5 | Cover letter subject line generator | Enter role + company → 5 email subject line options | `cover letter email subject line` |

### Tier 2 — Engagement tools (create the "aha moment")

These require more interaction and surface exactly why the user needs CVLift.

| # | Tool | Core user action | Target search query |
|---|---|---|---|
| 6 | Resume scorecard | Paste resume → A–F grade for 5 sections | `how to grade my resume` |
| 7 | Skills gap analyser | Paste resume + job description → missing skills list | `resume skills gap checker` |
| 8 | LinkedIn headline generator | Enter role + industry + 2–3 skills → 3 headline options | `linkedin headline generator free` |
| 9 | Job description decoder | Paste JD → must-haves, nice-to-haves, red flags | `how to read a job description` |
| 10 | Career path quiz | Answer 5 questions → personalised role suggestions | `what career is right for me` |

### Tier 3 — Conversion tools (preview of the actual product)

These are intentionally limited — they show what CVLift does, then prompt signup for the full version.

| # | Tool | Core user action | Gate mechanic |
|---|---|---|---|
| 11 | Before/after bullet rewriter | Paste 1 weak bullet → 3 improved versions | Free for 1 bullet; signup to do full resume |
| 12 | Resume tailor preview | Paste resume + JD → 3 targeted edits shown | Free for 3 edits; signup to apply all |
| 13 | Cold email generator | Enter target company + role → recruiter outreach draft | Free for 1 email; signup for unlimited |
| 14 | Interview question generator | Enter role + industry → 10 likely questions | Free for 10 questions; signup for model answers |
| 15 | PDF formatter preview | Paste resume text → formatted preview, watermarked | Remove watermark + export by signing up |

---

## Phase 0 — Cloudflare Worker Setup

**Duration:** 1 day
**Blocker for:** All phases

### Tasks

- [ ] Confirm `cvlift.me` DNS is managed through Cloudflare
- [ ] Create a new Worker project: `wrangler init cvlift-tools-api`
- [ ] Add API keys as Worker environment secrets:
  - `GEMINI_API_KEY`
  - `GROK_API_KEY`
  - `OPENROUTER_API_KEY`
- [ ] Configure KV namespace for rate limiting: `wrangler kv:namespace create RATE_LIMITS`
- [ ] Set up custom domain routing: `api.cvlift.me → cvlift-tools-api.workers.dev`
- [ ] Deploy and smoke test with a curl request

### Worker request structure

```
POST https://api.cvlift.me/tool
Content-Type: application/json

Body:     { "tool": "ats-checker", "input": { ... } }
Response: { "result": { ... } }
Error:    { "error": "rate_limit_exceeded" }  →  HTTP 429
```

### Worker responsibilities

- Validate `Origin` header — only accept requests from `cvlift.me`
- Check IP-based rate limit via KV (5 requests/hour per IP)
- Route to correct AI provider based on `tool` field
- Parse and forward AI response as clean JSON
- Set CORS headers on all responses

---

## Phase 1 — `tools.html` Page Shell

**Duration:** 1–2 days
**Depends on:** Phase 0

### Tasks

- [ ] Create `tools.html` in the repo root — matches the existing dark SaaS Bootstrap 5 theme
- [ ] Build a **tool selector grid**: cards for all 15 tools, grouped by tier with tier labels
- [ ] Build a single **tool panel** that swaps content on card click (no page reloads)
- [ ] Each tool panel contains:
  - Input area (textarea or structured fields specific to that tool)
  - Run button
  - Results display area with copy buttons where relevant
  - Subtle CTA at the bottom: *"Want your full resume done in 60 seconds? →"*
- [ ] Add deep-linkable URL hashes per tool (e.g. `/tools.html#ats-checker`)
- [ ] Add `tools.html` link to the nav in `index.html` and the footer
- [ ] Add a "Free Tools" section to `index.html` showcasing the tool hub
- [ ] Add `<meta>` SEO tags targeting the exact search queries listed in the tool table above

---

## Phase 2 — V1: 5 Tools Live

**Duration:** 4–5 days
**Depends on:** Phase 1

Ship one tool from each tier to validate the full pipeline end-to-end before building out the rest.

---

### Tool 1 — ATS Score Checker *(Tier 1)*

**Input:** Resume text + target job title
**Output:** Match score (0–100%), matched keywords, missing keywords, verdict

**Prompt strategy:** Ask Gemini Flash to return structured JSON:
`{ score, matched_keywords, missing_keywords, verdict }`

**Render:** Visual score ring, green/red keyword chips.

---

### Tool 2 — Resume Length Checker *(Tier 1)*

**Input:** Resume text
**Output:** Word count, estimated page count, verdict (too short / ideal / too long), personalised advice

**Implementation note:** Word count and page estimate are computed in JavaScript — no AI call
needed for the numbers. Only the personalised advice line uses the Worker. This makes it the
fastest tool to ship and a good zero-cost fallback if API quotas are hit.

---

### Tool 3 — Resume Scorecard *(Tier 2)*

**Input:** Resume text
**Output:** A–F grade + one-line feedback for: Summary, Work Experience, Skills, Education, Formatting

**Prompt strategy:** Ask Gemini to return:
`{ summary: { grade, feedback }, experience: { grade, feedback }, skills: { grade, feedback }, education: { grade, feedback }, formatting: { grade, feedback } }`

**Render:** 5 graded cards in a grid. Failing grades make the problem visceral — this is the
strongest "aha moment" tool in the whole suite.

---

### Tool 4 — Before/After Bullet Rewriter *(Tier 3)*

**Input:** One weak resume bullet point
**Output:** 3 improved versions with action verbs and quantified impact

**Prompt strategy:** Ask Grok or OpenRouter to return a JSON array of 3 rewrites.

**Render:** Before/after comparison with copy buttons.

**Gate:** Free for 1 bullet. After 1 use, prompt signup to rewrite the full resume.

---

### Tool 5 — LinkedIn Headline Generator *(Tier 2)*

**Input:** Job title + industry + 2–3 key skills
**Output:** 3 headline options in different tones (professional, bold, conversational)

**Prompt strategy:** Ask Grok to return `{ headlines: [{ tone, text }] }`.

**Render:** 3 headline cards with copy buttons.

---

## Phase 3 — V2: 5 More Tools

**Duration:** 5–6 days
**Depends on:** Phase 2 deployed and stable

---

### Tool 6 — Keyword Density Tool *(Tier 1)*

**Input:** Resume text + optional job description
**Output:** Keyword frequency table, over-used words, under-used important terms

**Implementation note:** Base keyword counting happens in JavaScript. The AI layer adds the
"important missing terms" recommendation by comparing resume keywords against the job description.

---

### Tool 7 — Skills Gap Analyser *(Tier 2)*

**Input:** Resume text + job description (paste both)
**Output:** Skills you have (matched), skills you're missing (gap), priority order to close gaps

**Prompt strategy:** Ask Gemini to return:
`{ matched: [...], missing: [...], priority_gaps: [...] }`

**Render:** Two-column matched vs. missing layout, with a prioritised action list below.

---

### Tool 8 — Job Description Decoder *(Tier 2)*

**Input:** Job description (paste)
**Output:** Must-have skills, nice-to-have skills, hidden requirements, culture signals, red flags

**Prompt strategy:** Ask Gemini to decode the JD and return 5 categorised sections as JSON.

**Render:** 5 labelled sections with colour-coded chips.

---

### Tool 9 — Resume Tailor Preview *(Tier 3)*

**Input:** Resume text + job description
**Output:** 3 specific edits suggested (reworded bullets, skills to add, summary tweak)

**Render:** Diff-style before/after for each suggested edit.

**Gate:** Shows 3 edits free. A blurred "View 12 more suggestions" section prompts signup.

---

### Tool 10 — Cold Email Generator *(Tier 3)*

**Input:** Target company + role + one sentence about yourself
**Output:** A recruiter outreach email draft with subject line

**Render:** Email preview card with subject line, body, and copy button.

**Gate:** One email free. Signup for unlimited + saved templates.

---

## Phase 4 — V3: Final 5 Tools

**Duration:** 5–7 days
**Depends on:** Phase 3 deployed and stable

---

### Tool 11 — Salary Lookup Widget *(Tier 1)*

**Input:** Job title + location (city or country)
**Output:** Salary range (min / median / max), experience level breakdown, market context

**Implementation note:** Gemini or OpenRouter can give reasonable estimates from training data.
Frame output clearly as an estimate, not live market data. Consider caching common queries in
Cloudflare KV to reduce API quota usage.

---

### Tool 12 — Cover Letter Subject Line Generator *(Tier 1)*

**Input:** Role title + company name + tone preference (formal / friendly / bold)
**Output:** 5 subject line options

**Prompt strategy:** Lightweight — Grok is ideal. Returns a simple string array.

**Render:** 5 pill chips with individual copy buttons. Fastest tool to build in this batch.

---

### Tool 13 — Career Path Quiz *(Tier 2)*

**Input:** 5 multiple-choice questions (work style, values, strengths, experience level, interest area)
**Output:** Top 3 role suggestions with fit score and a one-line reasoning per role

**Implementation note:** This is the only tool with multi-step state. Build the quiz UI in vanilla
JavaScript — no framework needed. Send all 5 answers in a single Worker call at the end.

**Render:** Role suggestion cards with fit percentage bar and "How to get there" action line.

---

### Tool 14 — Interview Question Generator *(Tier 3)*

**Input:** Job title + industry + seniority level
**Output:** 10 likely interview questions with answer tips

**Render:** Accordion list — question visible, answer tip revealed on expand.

**Gate:** 10 questions free. Signup to unlock role-specific follow-ups and model answers.

---

### Tool 15 — PDF Formatter Preview *(Tier 3)*

**Input:** Resume text (plain paste)
**Output:** Formatted resume rendered in a clean single-column template, with a CVLift watermark

**Implementation note:** This is the most complex tool. Use a client-side JS PDF library
(`jsPDF` or `pdf-lib` loaded from CDN) to render the formatted output in the browser. The
Worker only handles the text structuring/cleanup step — the PDF render itself happens
client-side, consuming no API quota for the render pass.

**Gate:** Preview is watermarked. "Download PDF" and "Remove watermark" require signup.

---

## Soft Gating — No Account Required

Use a two-layer gate across all tools. No user accounts needed at this stage.

### Layer 1: `localStorage` usage counter (UX layer)

Track cumulative tool uses in `localStorage`. After **3 total uses**, show a modal:

> *"You've used 3 free checks today. Sign up for CVLift to get unlimited access — plus build
> your full AI-optimised resume in 60 seconds."*
>
> `[Get started free →]`     `[Maybe later]`

Each Tier 3 tool also has its own individual gate (described in each tool spec above).

### Layer 2: Cloudflare Worker IP rate limit (enforcement layer)

Hard limit of **5 requests per IP per hour** via KV. Returns HTTP 429 with a message prompting
signup. This is the real backstop — the `localStorage` layer is UX only.

### CTA placement

- Bottom of every tool result panel (always visible after a result loads)
- The rate-limit modal (triggered on HTTP 429)
- A sticky banner shown after the user's first completed tool use
- `index.html` — a dedicated "Free Tools" section with a link to `tools.html`

---

## Phase 5 — SEO + Polish

**Duration:** 2 days
**Depends on:** Phase 4 deployed

- [ ] Add `sitemap.xml` including `tools.html` and all 15 hash URLs
- [ ] Confirm `robots.txt` allows crawling of the tools page
- [ ] Add `application/ld+json` structured data markup for each tool
- [ ] Ensure the tool selector grid text is in the static HTML (not JS-rendered only) so crawlers index it
- [ ] Write a short descriptive paragraph per tool section for on-page SEO body copy
- [ ] Submit updated sitemap to Google Search Console

---

## Full Build Timeline

| Phase | What | Duration | Cumulative total |
|---|---|---|---|
| 0 | Cloudflare Worker setup | 1 day | Day 1 |
| 1 | `tools.html` shell + nav updates | 1–2 days | Day 3 |
| 2 | V1: 5 tools live (Tools 1–5) | 4–5 days | Day 8 |
| 3 | V2: 5 more tools (Tools 6–10) | 5–6 days | Day 14 |
| 4 | V3: Final 5 tools (Tools 11–15) | 5–7 days | Day 21 |
| 5 | SEO polish + sitemap | 2 days | Day 23 |

**Total: ~23 working days to all 15 tools live.**

---

## File Changes Summary

### Frontend repo (`cvlift-frontend`)

| File | Change |
|---|---|
| `tools.html` | New — full tool hub page |
| `index.html` | Add nav link + "Free Tools" section |
| `js/tools.js` | New — tool UI logic, Worker calls, localStorage gate |
| `css/tools.css` | New — tool-specific styles (or extend `style.css`) |
| `sitemap.xml` | New — includes tools page + all 15 hash URLs |
| `robots.txt` | New or update — ensure tools page is crawlable |
| `CNAME` | No change |
| `.github/workflows/static.yml` | No change |

### New Worker repo (`cvlift-tools-api`) — separate repository

```
cvlift-tools-api/
├── src/
│   └── index.js        # Worker entry — routing, rate limiting, AI calls
├── wrangler.toml       # CF config, KV bindings, env var references
└── package.json
```

---

## Open Questions Before Starting

1. Is `cvlift.me` DNS currently managed through Cloudflare? (Determines Worker setup time)
2. Do you have existing accounts on Gemini, Grok, and OpenRouter with API keys ready?
3. Should the tools page match the existing dark theme exactly, or can it be a lighter sub-page?
4. What is the signup/CTA URL the tools should point at? (`app.cvlift.me` or the main site?)
5. For the PDF formatter (Tool 15) — do you have a preferred resume template style, or should it
   match CVLift's existing ATS templates?
6. For the salary lookup (Tool 11) — are you targeting India-based salaries primarily, global, or both?
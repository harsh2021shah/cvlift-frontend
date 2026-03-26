# CVLift Free Tools — Project Plan

> **Goal:** Add a suite of free AI-powered resume tools to `cvlift.me` to drive organic traffic and funnel users into the core product. Zero backend infrastructure — stays fully static on GitHub Pages.

---

## Architecture Overview

### The core constraint

GitHub Pages is a pure static host. It cannot store secrets or run server-side code. Calling AI APIs directly from the browser would expose your API keys publicly — they would be scraped within days.

### The solution: Cloudflare Workers as a thin proxy

Deploy a **Cloudflare Worker** at `api.cvlift.me` that:

- Holds your API keys in environment variables (never in code or the browser)
- Receives tool requests from the browser
- Forwards them to Gemini / Grok / OpenRouter
- Returns the response to the frontend
- Enforces rate limiting by IP

**Why Cloudflare Workers:**
- Free tier: 100,000 requests/day
- Supports custom domains (you likely already use Cloudflare for `cvlift.me`)
- KV store (free tier) for IP-based rate limiting
- ~10 min setup once your domain is on Cloudflare
- No Docker, no Node server, no hosting bill

**GitHub Actions is not the right tool here.** Actions are for CI/CD build pipelines — they cannot serve real-time HTTP requests from users. The Worker is the right serverless layer for this.

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

---

## Phase 0 — Cloudflare Worker Setup

**Duration:** 1 day  
**Blocker for:** Everything else

### Tasks

- [ ] Confirm `cvlift.me` DNS is managed through Cloudflare (almost certain given your tunnel setup)
- [ ] Create a new Worker project (`wrangler init cvlift-tools-api`)
- [ ] Add API keys as Worker environment secrets:
  - `GEMINI_API_KEY`
  - `GROK_API_KEY`
  - `OPENROUTER_API_KEY`
- [ ] Configure KV namespace for rate limiting (`wrangler kv:namespace create RATE_LIMITS`)
- [ ] Set up custom domain routing: `api.cvlift.me → cvlift-tools-api.workers.dev`
- [ ] Deploy and smoke test with a curl request

### Worker responsibilities

```
POST /tool
Body: { "tool": "ats-checker", "input": "..." }

→ Validate origin (only allow cvlift.me)
→ Check IP rate limit (5 requests/hour via KV)
→ Route to correct AI provider
→ Return { "result": "..." }
```

### AI provider routing strategy

| Tool | Provider | Reason |
|---|---|---|
| ATS checker | Gemini Flash | Fast, generous free tier, good at structured output |
| Resume scorecard | Gemini Flash | Same |
| Bullet rewriter | Grok or OpenRouter | Good creative rewriting |
| LinkedIn headline | Gemini Flash | Fast turnaround needed |
| Skills gap | Gemini Flash | Structured comparison |

Use Gemini Flash as the primary provider. Fall back to OpenRouter free models if Gemini quota is hit. Grok is a secondary option where its strengths match.

---

## Phase 1 — `tools.html` Page Shell

**Duration:** 1–2 days  
**Depends on:** Phase 0

### Tasks

- [ ] Create `tools.html` in the repo root — matches the existing dark SaaS Bootstrap 5 theme
- [ ] Build a **tool selector grid**: cards for each tool at the top of the page
- [ ] Build a single **tool panel** below that swaps content on card click (no page reloads)
- [ ] Each tool panel contains:
  - Input area (textarea or structured fields)
  - "Run" button
  - Results display area
  - Subtle CTA at the bottom: *"Want your full resume done in 60 seconds? →"*
- [ ] Add deep-linkable URL hashes per tool (`/tools.html#ats-checker`)
- [ ] Add `tools.html` to the nav in `index.html` and the footer
- [ ] Add `<meta>` SEO tags targeting exact search queries per tool

### SEO meta tag targets

| Tool | Target query |
|---|---|
| ATS checker | `free ats resume checker` |
| Scorecard | `how to grade my resume` |
| Bullet rewriter | `improve resume bullet points free` |
| Headline gen | `linkedin headline generator free` |
| Skills gap | `resume skills gap checker` |

---

## Phase 2 — Build the First 3 Tools

**Duration:** 3–4 days  
**Depends on:** Phase 1

Build in this order — highest traffic potential first, simplest to validate.

### Tool 1: ATS Score Checker

**Input:** Resume text (paste) + target job title  
**Output:** Match score (0–100%), list of missing keywords, list of matched keywords

**Prompt strategy:** Send resume + job title to Gemini. Ask it to return JSON with `{ score, matched_keywords, missing_keywords, verdict }`. Parse and render in a visual score card with colour coding.

**Why first:** "Free ATS checker" is one of the most searched resume-related queries. High organic traffic ceiling.

---

### Tool 2: Resume Scorecard

**Input:** Resume text (paste)  
**Output:** A–F grade for 5 sections: Summary, Work Experience, Skills, Education, Formatting

**Prompt strategy:** Ask Gemini to return JSON with `{ summary: { grade, feedback }, experience: { grade, feedback }, ... }`. Render as a graded card grid.

**Why second:** Creates the clearest "aha moment" — users see their resume failing specific sections, and CVLift is the obvious fix.

---

### Tool 3: Before/After Bullet Rewriter

**Input:** One weak resume bullet point  
**Output:** 2–3 improved versions with action verbs and quantified impact

**Prompt strategy:** Ask for 3 rewrites in JSON array. Display as a before/after comparison with copy buttons.

**Why third:** This is the closest preview of what CVLift actually does. It's the strongest conversion driver.

---

## Phase 3 — Soft Gating + Conversion Layer

**Duration:** 1–2 days  
**Depends on:** Phase 2

No user accounts needed. Use a lightweight two-layer gate:

### Layer 1: `localStorage` usage counter (UX layer)

Track tool uses in `localStorage`. After **3 uses**, show a modal:

> *"You've used 3 free checks today. Sign up for CVLift to get unlimited access — plus build your full AI resume in 60 seconds."*
>
> `[Get started free]` `[Maybe later]`

This is a soft gate — savvy users can clear localStorage and bypass it, but most won't.

### Layer 2: Cloudflare Worker IP rate limit (enforcement layer)

The Worker enforces a hard limit of **5 requests per IP per hour** using KV. This is the real backstop. When the limit is hit, return a `429` response with a message prompting signup.

### Conversion CTA placement

- Bottom of every tool result (always visible)
- The rate-limit modal
- A sticky banner after first tool use
- `index.html` — add a "Free Tools" section linking to `tools.html`

---

## Phase 4 — SEO Polish + Remaining Tools

**Duration:** 2–3 days  
**Depends on:** Phase 3

### SEO tasks

- [ ] Add `sitemap.xml` including `tools.html` and hash URLs
- [ ] Ensure `robots.txt` allows crawling of the tools page
- [ ] Add structured data (`application/ld+json`) for tool pages
- [ ] Ensure the tool selector grid text is crawlable (not hidden in JS)

### Additional tools (build after v1 is live)

Once the first 3 tools are validated and driving traffic, add:

4. **LinkedIn Headline Generator** — role + industry → 3 headline options
5. **Skills Gap Analyser** — paste resume + job description → missing skills list
6. **Resume Length Checker** — paste resume → word count, page estimate, verdict
7. **Cold Email Generator** — target company + role → recruiter outreach draft

---

## File Changes Summary

| File | Change |
|---|---|
| `tools.html` | New page — tool hub |
| `index.html` | Add nav link + "Free Tools" section |
| `js/tools.js` | New — tool logic, API calls, localStorage gate |
| `css/tools.css` | New — tool-specific styles (or extend `style.css`) |
| `sitemap.xml` | New — include tools page |
| `CNAME` | No change |
| `.github/workflows/static.yml` | No change — Pages deploy stays the same |

**New Cloudflare Worker repo** (separate from the frontend repo):
```
cvlift-tools-api/
├── src/
│   └── index.js       # Worker entry point
├── wrangler.toml      # CF config, KV binding, env vars
└── package.json
```

---

## Build Order & Timeline

| Phase | What | Days | Depends on |
|---|---|---|---|
| 0 | Cloudflare Worker setup | 1 | — |
| 1 | `tools.html` page shell | 1–2 | Phase 0 |
| 2a | ATS checker + scorecard | 2 | Phase 1 |
| 2b | Bullet rewriter | 1 | Phase 2a |
| 3 | localStorage gate + modal | 1–2 | Phase 2 |
| 4 | SEO polish + extra tools | 2–3 | Phase 3 |

**Total to shippable v1 (3 tools live):** ~8–10 days

---

## Key Decisions & Rationale

| Decision | Rationale |
|---|---|
| Cloudflare Worker (not GitHub Actions) | Actions are CI/CD pipelines — they cannot handle real-time user HTTP requests |
| No user accounts for free tools | Removes all friction; `localStorage` + IP rate limiting is sufficient |
| Gemini Flash as primary AI | Generous free tier, fast response, good JSON structured output |
| 3 tools at v1, not all 7 | Ship fast, validate traffic, avoid over-building before proving demand |
| Single `tools.html` with JS routing | Simpler than separate pages; still SEO-linkable via hash URLs |
| Separate Worker repo | Keeps secrets, deploys, and rate-limit logic fully decoupled from the static frontend |

---

## Open Questions Before Starting

1. Is `cvlift.me` DNS currently managed through Cloudflare? (Determines Worker setup time)
2. Do you have existing accounts on Gemini, Grok, and OpenRouter? API keys ready?
3. Should the tools page match the existing dark theme exactly, or can it be a lighter sub-page?
4. Is there a preferred signup URL to point the CTAs at? (`app.cvlift.me`? or the main site?)
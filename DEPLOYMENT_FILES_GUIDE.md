# CVLift Tools API — Deployment Files Guide
This document indexes all deployment resources and explains how to use each.

---
Frontend (cvlift.me/free-tools/)
## Files Created

### 1. **WORKER_SOURCE_CODE.js** (Main Backend Code)
**Purpose:** The complete Cloudflare Worker that powers all 15 resume tools

**Contains:**
- CORS validation (only cvlift.me allowed)
- Rate limiting via Cloudflare KV (5 requests/hour per IP)
- Provider routing (Gemini → Grok → OpenRouter fallback)
- Tool-specific AI prompts optimized for JSON output
- Error handling and logging

**How to Use:**
1. Create directory: `mkdir src`
2. Copy file: `WORKER_SOURCE_CODE.js` → `src/index.js`
3. This becomes the entry point for `wrangler deploy`

**Key Functions:**
- `routeToolToProvider()` - Splits requests to best AI provider per tool
- `buildPromptForTool()` - Generates tool-specific system prompts
- `callGemini()` - Google Gemini API integration
- `callGrok()` - Grok API integration (creative tools)
- `callOpenRouter()` - OpenRouter fallback
- Rate limit middleware via KV namespace

---

### 2. **wrangler_template.toml** (Configuration Template)
**Purpose:** Wrangler configuration with KV namespace and environment setup

**Contains:**
- Project metadata (name, main entry, compatibility date)
- KV namespace binding `RATE_LIMITS`
- Production environment settings
- Route configuration (api.cvlift.me/tool)

**How to Use:**
1. Copy: `wrangler_template.toml` → `wrangler.toml`
2. Replace: `YOUR_KV_NAMESPACE_ID_HERE` with actual ID from `wrangler kv:namespace create RATE_LIMITS`
3. Save as-is; secrets added via `wrangler secret put` command

**Critical Fields to Update:**
- `id` under `[[kv_namespaces]]` - Your unique KV namespace ID
- `zone_name` - Should be "cvlift.me" (must match your domain)

---

### 3. **CLOUDFLARE_WORKER_SETUP.md** (Full Reference Guide)
**Purpose:** Comprehensive step-by-step deployment guide with context and explanations

**Contains:**
- 13 detailed setup steps (Prerequisites through verification)
- Wrangler CLI installation & authentication
- KV namespace creation & configuration
- API key management (Gemini, Grok, OpenRouter)
- Custom domain routing setup
- Smoke testing with curl
- Fallback configuration details
- Rate limit testing procedures

**How to Use:**
- Read this FIRST for complete understanding
- Reference while following WORKER_QUICK_START.md for step-by-step commands
- Use when you need context or reasoning behind each step

**Best For:** First-time users who want to understand the full architecture

---

### 4. **WORKER_QUICK_START.md** (5-Minute Guide)
**Purpose:** Quick reference with copy-paste commands to deploy in under 5 minutes

**Contains:**
- 8 numbered sections (Install → Test in Frontend)
- One or more copy-paste bash command per section
- Minimal explanations; assumes familiarity
- Direct pointers to each tool

**How to Use:**
- Read this IF you understand Cloudflare Workers basics
- Copy-paste each command section
- Cross-reference CLOUDFLARE_WORKER_SETUP.md if you get stuck

**Best For:** Experienced Cloudflare/Node.js users who want to move fast

---

### 5. **WORKER_TROUBLESHOOTING.md** (Problem-Solving Reference)
**Purpose:** 15 common deployment issues with diagnosis and solutions

**Contains:**
- Issue: Description + Cause
- Solution: Step-by-step fix with bash commands
- Covers: Installation, authentication, KV, secrets, rate limits, API calls, timeouts, local tools, gates
- Includes: Quick checklist, escalation paths, status page links

**How to Use:**
- Consult when you hit errors during deployment
- Search for error message or symptom
- Follow diagnosis and solution steps
- Check "Quick Checklist" if unsure what's wrong

**Best For:** Debugging deployment problems

---

### 6. **IMPLEMENTATION_CHECKLIST.md** (Progress Tracking)
**Purpose:** 14-phase checklist to track every deployment milestone

**Contains:**
- Prerequisites (node, git, Cloudflare account)
- Phase 1: Local setup (Wrangler install)
- Phase 2: Project setup (Copy files, create src/)
- Phase 3: KV configuration (namespace creation)
- Phase 4: API keys (Gemini, OpenRouter)
- Phase 5: Deployment (wrangler deploy)
- Phase 6: Domain routing (Cloudflare dashboard)
- Phase 7: Local testing (curl commands)
- Phase 8: Frontend testing (15 tool scenarios)
- Phase 9: Rate limit validation (6 request test)
- Phase 10: Daily usage gate validation
- Phase 11: Per-tool gate validation (Tier-3)
- Phase 12: SEO validation (sitemap, hash routing)
- Phase 13: Monitoring setup (wrangler tail)
- Phase 14: Production readiness checklist

**How to Use:**
- Print or open in side-by-side editor
- Check off item as you complete it
- Use as project timeline tracker
- Reference for validation procedures

**Best For:** Keeping organized and ensuring nothing is missed

---

## Recommended Reading Order

### For Quick Deployment:
1. WORKER_QUICK_START.md (5 min)
2. WORKER_TROUBLESHOOTING.md (reference as needed)
3. Verify with IMPLEMENTATION_CHECKLIST.md Phases 7-8

### For Thorough Understanding:
1. CLOUDFLARE_WORKER_SETUP.md (15 min)
2. WORKER_SOURCE_CODE.js (review comments, 5 min)
3. IMPLEMENTATION_CHECKLIST.md (execute all phases, 30-45 min)
4. WORKER_TROUBLESHOOTING.md (reference as needed)

### For Debugging:
1. Check your error message in WORKER_TROUBLESHOOTING.md
2. Follow diagnosis and solution
3. Re-verify using relevant IMPLEMENTATION_CHECKLIST phases

---

## Key Concepts

### Rate Limiting Strategy
- **Frontend Gate:** localStorage tracks 3 checks per day (soft limit)
- **Backend Gate:** Cloudflare KV tracks 5 requests per IP per hour (hard limit)
- **Per-Tool Gate:** GATE_KEY in localStorage tracks free runs for Tier-3 tools (1-3 per tool)

### Provider Fallback Chain
```
Tool Request
  ↓
Check Tool Type (Awareness/Engagement/Conversion)
  ↓
Try Primary Provider (Gemini for most, Grok for creative)
  ↓
If fails → Try Secondary (Grok, then Gemini)
  ↓
If fails → Try OpenRouter
  ↓
If all fail → Return "All providers down, try again later"
```

### Security Model
- API keys stored in Cloudflare Secrets (never in code)
- CORS restricts requests to cvlift.me origin
- Rate limit by IP prevents abuse
- All prompts validated before sending to AI

---

## Architecture Diagram

```
Frontend (cvlift.me/tools.html)
         ↓
js/tools.js POST to https://api.cvlift.me/tool
         ↓
Cloudflare Router
         ↓
cvlift-tools-api Worker (WORKER_SOURCE_CODE.js)
         ├─ Validate Origin (✓ cvlift.me)
         ├─ Check Rate Limit via KV (✓ < 5/hour per IP)
         ├─ Route to AI Provider:
         │  ├─ Gemini Flash API (primary)
         │  ├─ Grok API (secondary, creative tasks)
         │  └─ OpenRouter (fallback, free models)
         └─ Return JSON result
         ↓
Frontend result renderer
         ├─ Local tools (resume-length, etc) → Instant display
         └─ API tools → Show result or error
         ↓
Increment usage counters
         ├─ Daily usage (localStorage)
         ├─ Per-tool gate (localStorage)
         └─ Rate limit (Cloudflare KV)
```

---

## Deployment Timeline

| Phase | Task | Est. Time | Files Used |
|-------|------|-----------|-----------|
| 1 | Install Wrangler, log in | 5 min | WORKER_QUICK_START.md |
| 2 | Create src/, copy Worker code | 2 min | WORKER_SOURCE_CODE.js |
| 3 | Copy wrangler.toml, update configs | 5 min | wrangler_template.toml, CLOUDFLARE_WORKER_SETUP.md |
| 4 | Create KV namespace | 3 min | WORKER_QUICK_START.md #3 |
| 5 | Add API keys | 5 min | WORKER_QUICK_START.md #4 |
| 6 | Deploy Worker | 2 min | WORKER_QUICK_START.md #5 |
| 7 | Configure domain route | 3 min | CLOUDFLARE_WORKER_SETUP.md Step 11 |
| 8 | Local testing (curl) | 5 min | WORKER_QUICK_START.md #7 |
| 9 | Frontend testing | 10 min | IMPLEMENTATION_CHECKLIST.md Phase 8 |
| 10 | Rate limit validation | 5 min | IMPLEMENTATION_CHECKLIST.md Phase 9 |
| 11 | Gate validation | 5 min | IMPLEMENTATION_CHECKLIST.md Phase 10-11 |
| 12 | SEO validation | 3 min | IMPLEMENTATION_CHECKLIST.md Phase 12 |
| **Total** | **Full Deployment** | **~50 min** | All files |

---

## Success Indicators

✅ **After deployment**, verify:
- [ ] `wrangler deploy` completes without errors
- [ ] Route configured: api.cvlift.me/tool → cvlift-tools-api
- [ ] curl test returns valid JSON
- [ ] At least 1 local tool works (resume-length)
- [ ] At least 1 API tool returns result (ats-checker, resume-scorecard)
- [ ] Rate limit returns 429 on 6th request within 1 hour
- [ ] Daily gate modal appears after 3 uses
- [ ] Per-tool gates work for Tier-3 tools

---

## What To Do Next

1. **If first time:** Start with CLOUDFLARE_WORKER_SETUP.md (full guide)
2. **If experienced:** Use WORKER_QUICK_START.md (fast path)
3. **If stuck:** Check WORKER_TROUBLESHOOTING.md by error message
4. **If validating:** Follow IMPLEMENTATION_CHECKLIST.md phases

---

## Support Resources

| Need | Resource |
|------|----------|
| Wrangler docs | https://developers.cloudflare.com/workers/wrangler/cli-wrangler/ |
| Workers API | https://developers.cloudflare.com/workers/runtime-apis/web-crypto/ |
| KV storage | https://developers.cloudflare.com/workers/runtime-apis/kv/ |
| Gemini API docs | https://ai.google.dev/tutorials/python_quickstart |
| Cloudflare dashboard | https://dash.cloudflare.com |
| This project docs | See all `.md` files in this folder |

---

## Files Placement

```
cvlift-frontend/
├─ WORKER_SOURCE_CODE.js          ← Copy to src/index.js
├─ wrangler_template.toml         ← Copy to wrangler.toml
├─ CLOUDFLARE_WORKER_SETUP.md     ← Reference guide
├─ WORKER_QUICK_START.md          ← Quick reference
├─ WORKER_TROUBLESHOOTING.md      ← Debugging guide
├─ IMPLEMENTATION_CHECKLIST.md    ← Progress tracker
├─ DEPLOYMENT_FILES_GUIDE.md      ← This file
├─ src/
│  └─ index.js                    ← (Will be created as copy of WORKER_SOURCE_CODE.js)
├─ wrangler.toml                  ← (Will be created as copy of wrangler_template.toml)
├─ package.json                   ← npm init -y
├─ index.html
├─ tools.html
└─ ... (other frontend files)
```

---

## Last Update

**Date:** December 2024
**Frontend Status:** Fully deployed with 15 tools, layout fixed
**Backend Status:** Ready for deployment via files in this guide
**Next Step:** Execute WORKER_QUICK_START.md or CLOUDFLARE_WORKER_SETUP.md


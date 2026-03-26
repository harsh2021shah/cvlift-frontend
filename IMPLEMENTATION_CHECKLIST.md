# CVLift Tools API — Implementation Checklist

Check off tasks as you complete them. Use this to track deployment progress.

---

## Prerequisites (Do Before Starting)

- [ ] Node.js installed (`node --version` returns v16+)
- [ ] Git installed (`git --version`)
- [ ] Cloudflare account created
- [ ] cvlift.me domain added to Cloudflare account
- [ ] At least one AI API key obtained:
  - [ ] Google Gemini (free): https://aistudio.google.com/apikey
  - [ ] OpenRouter (free): https://openrouter.ai/keys
  - [ ] Optional: Grok API key

---

## Phase 1: Local Setup

- [ ] Read WORKER_QUICK_START.md (5 min overview)
- [ ] Read CLOUDFLARE_WORKER_SETUP.md (full reference)
- [ ] Install Wrangler: `npm install -g wrangler@latest`
- [ ] Verify install: `wrangler --version`
- [ ] Log in to Cloudflare: `wrangler login`
- [ ] Verify login: `wrangler whoami`

---

## Phase 2: Worker Project Setup

- [ ] Create `src` directory in project root
- [ ] Copy `WORKER_SOURCE_CODE.js` → `src/index.js`
- [ ] Copy `wrangler_template.toml` → `wrangler.toml`
- [ ] Create `package.json`: `npm init -y`
- [ ] Verify all files exist:
  - [ ] `wrangler.toml`
  - [ ] `src/index.js`
  - [ ] `package.json`

---

## Phase 3: KV Namespace Configuration

- [ ] Run: `wrangler kv:namespace create RATE_LIMITS`
- [ ] Copy the returned namespace ID (long hex string)
- [ ] Edit `wrangler.toml`:
  - [ ] Find line: `id = "YOUR_KV_NAMESPACE_ID_HERE"`
  - [ ] Replace `YOUR_KV_NAMESPACE_ID_HERE` with copied ID
- [ ] Verify namespace: `wrangler kv:namespace list`
- [ ] Confirm RATE_LIMITS is listed

---

## Phase 4: API Keys Configuration

- [ ] Obtain Google Gemini API key: https://aistudio.google.com/apikey
- [ ] Add Gemini key: `wrangler secret put GEMINI_API_KEY`
  - [ ] Paste key (won't echo), press Enter twice
- [ ] Optional - Add OpenRouter key: `wrangler secret put OPENROUTER_API_KEY`
- [ ] Optional - Add Grok key: `wrangler secret put GROK_API_KEY`
- [ ] Verify keys set: `wrangler secret list`
- [ ] Confirm all three keys listed (names only, not values)

---

## Phase 5: Worker Deployment

- [ ] Edit `wrangler.toml` and verify:
  - [ ] `name = "cvlift-tools-api"`
  - [ ] `main = "src/index.js"`
  - [ ] `compatibility_date = "2024-12-11"` or later
  - [ ] KV namespace ID is correct
- [ ] Deploy: `wrangler deploy`
- [ ] Verify deployment succeeded (no red errors)
- [ ] Note the deployment URL in output (e.g., `https://cvlift-tools-api.abc123.workers.dev`)

---

## Phase 6: Domain Routing

- [ ] Log in to Cloudflare Dashboard: https://dash.cloudflare.com
- [ ] Select domain: `cvlift.me`
- [ ] Navigate to: Workers & Pages → Routes
- [ ] Click: "Add Route"
- [ ] Set Route field: `api.cvlift.me/tool`
- [ ] Set Zone field: `cvlift.me` (or equivalent)
- [ ] Set Worker field: `cvlift-tools-api`
- [ ] Click: "Save"
- [ ] Verify route appears in list: `api.cvlift.me/tool → cvlift-tools-api`

---

## Phase 7: Local Testing

- [ ] Test rate limit KV:
  ```bash
  wrangler kv:key put RATE_LIMITS test-key "test-value"
  wrangler kv:key get RATE_LIMITS test-key
  ```
  - [ ] Output should echo: "test-value"

- [ ] Test Worker health (resume-length, no API call):
  ```bash
  curl -X POST https://api.cvlift.me/tool \
    -H "Content-Type: application/json" \
    -H "Origin: https://cvlift.me" \
    -d '{"tool":"resume-length","input":{"resumeText":"Software engineer with 5 years experience"}}'
  ```
  - [ ] Should return JSON: `{"result":{"word_count":...,"page_estimate":...,"verdict":"..."}}`

---

## Phase 8: Frontend Testing

- [ ] Go to: https://cvlift.me/free-tools/
- [ ] Verify page loads and all 15 tool cards visible:
  - [ ] Tier 1: ats-checker, keyword-density, resume-length, salary-lookup, subject-line-generator
  - [ ] Tier 2: resume-scorecard, headline-generator, skills-gap, jd-decoder, career-quiz
  - [ ] Tier 3: bullet-rewriter, resume-tailor-preview, cold-email-generator, interview-question-generator, pdf-formatter-preview

- **Test Local Tools (No API Required):**
  - [ ] Click "Resume Length Checker"
    - [ ] Paste sample resume text
    - [ ] Click "Analyze"
    - [ ] Verify result shows word count, page estimate, verdict
  - [ ] Click "Keyword Density Checker"
    - [ ] Paste resume + keywords
    - [ ] Click "Analyze"
    - [ ] Verify frequency chart appears
  - [ ] Click "Career Quiz"
    - [ ] Click "Analyze"
    - [ ] Verify 5 quiz questions appear
  - [ ] Click "PDF Formatter Preview"
    - [ ] Click "Analyze"
    - [ ] Verify sample PDF preview appears

- **Test API-Required Tools (1 sample from Tier 1, 1 from Tier 2):**
  - [ ] Click "ATS Checker"
    - [ ] Paste sample resume + job title
    - [ ] Click "Analyze"
    - [ ] Verify result appears (or graceful "API not ready" message)
  - [ ] Click "Resume Scorecard"
    - [ ] Paste sample resume
    - [ ] Click "Analyze"
    - [ ] Verify grades for 5 sections appear

- **Check Browser Console:**
  - [ ] Open DevTools (F12)
  - [ ] Go to Console tab
  - [ ] Should see NO red errors
  - [ ] Should see successful API responses in Network tab

---

## Phase 9: Rate Limiting Validation

- [ ] Open new Incognito window (bypasses localStorage)
- [ ] Go to: https://cvlift.me/free-tools/
- [ ] Submit 6 requests to same tool within 1 hour:
  - [ ] Requests 1-5 should return results
  - [ ] Request 6 should show: "Rate limit exceeded (5 requests per hour per IP)"
- [ ] Verify KV rate limit keys:
  ```bash
  wrangler kv:key list --namespace RATE_LIMITS --limit 10
  ```
  - [ ] Should show keys like: `ratelimit:192.168.1.1` (your IP)

---

## Phase 10: Daily Usage Gating Validation

- [ ] Clear browser localStorage: 
  ```javascript
  localStorage.clear()
  ```
- [ ] Go to: https://cvlift.me/free-tools/ats-checker/ (or any Tier 1/2 tool)
- [ ] Submit 3 tool requests (any Tier 1 or 2 tools):
  - [ ] Requests 1-3 should work
  - [ ] Request 4 should show modal: "You've used 3 free tools today. Sign up for unlimited access."
- [ ] Refresh page and verify modal gone (localStorage persists across refresh)
- [ ] Click "Upgrade to CVLift" in modal → should navigate toward sign-up

---

## Phase 11: Per-Tool Gate Validation (Tier-3 Only)

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Go to: https://cvlift.me/free-tools/bullet-rewriter/
- [ ] Submit 2 requests (bullet-rewriter has `freeRuns: 1`):
  - [ ] Request 1 should return result
  - [ ] Request 2 should show blurred overlay: "To use this tool unlimited..."
- [ ] Refresh and repeat for:
  - [ ] resume-tailor-preview (should show gate on 2nd use)
  - [ ] cold-email-generator (should show gate on 2nd use)
  - [ ] interview-question-generator (should allow unlimited)
  - [ ] pdf-formatter-preview (should allow unlimited)

---

## Phase 12: SEO Validation

- [ ] Check sitemap: https://cvlift.me/sitemap.xml
- [ ] Verify all 15 tool URLs listed:
  - [ ] `https://cvlift.me/free-tools/ats-checker/`
  - [ ] `https://cvlift.me/free-tools/keyword-density/`
  - [ ] `https://cvlift.me/free-tools/resume-length/`
  - [ ] ... (12 more)

- [ ] Test direct tool access:
  - [ ] Go to: https://cvlift.me/free-tools/keyword-density/
  - [ ] Page should load directly to Keyword Density Checker
  - [ ] Tool form and execution should be immediately available

---

## Phase 13: Monitoring Setup (Optional)

- [ ] Set up live Worker logs:
  ```bash
  wrangler tail --follow
  ```
  - [ ] Keep running in background during testing
  - [ ] Watch for errors in real-time

- [ ] Check Cloudflare Dashboard Worker Metrics:
  - [ ] Go to: cvlift.me > Workers & Pages > cvlift-tools-api
  - [ ] View: Requests, Errors, Duration graphs
  - [ ] Should show request volume after testing

---

## Phase 14: Production Readiness Checklist

**Security:**
- [ ] API keys stored as secrets, not in code ✅ (wrangler secret)
- [ ] CORS restricts to cvlift.me only ✅ (WORKER_SOURCE_CODE.js)
- [ ] Rate limiting enables hard gate ✅ (KV namespace)
- [ ] No sensitive data logged ✅ (console.error only for non-PII)

**Performance:**
- [ ] All 4 local tools respond < 100ms ✅
- [ ] API-required tools respond < 5 seconds ✅ (Gemini typical)
- [ ] Worker deployments instant ✅

**Functionality:**
- [ ] All 15 tools accessible on frontend ✅
- [ ] 4 local tools work without backend ✅
- [ ] At least 1 API tool tested end-to-end ✅
- [ ] Rate limiting prevents abuse ✅
- [ ] Daily gating controls free-tier usage ✅

---

## Deployment Sign-Off

When all items checked:

**Date:** _________________

**Deployed By:** _________________

**Production URLs:** https://cvlift.me/free-tools/ (hub) and https://cvlift.me/free-tools/{tool-name}/ (individual tools)

**API Endpoint:** https://api.cvlift.me/tool

**Status:** ✅ Ready for Organic Traffic

---

## Post-Deployment Maintenance

Track these on an ongoing basis:

- [ ] Monitor Worker error rate daily (target: < 1%)
- [ ] Check API quota usage weekly (prevent unexpected costs)
- [ ] Review user feedback on tool accuracy
- [ ] Update prompts if tool quality degrades
- [ ] Rotate API keys quarterly
- [ ] Monitor for spam/abuse patterns in rate limit KV

---

## Rollback Plan

If critical issue found:

1. Disable route: Cloudflare Dashboard > Workers Routes > Delete api.cvlift.me/tool
2. Frontend falls back to: "API not connected. Please try again later."
3. All local tools (4) still functional
4. Buy time to fix backend
5. Re-enable route once fixed: `wrangler deploy && update route in dashboard`

---

## Success Criteria

Project is successful when:

✅ All 15 tools load and display correctly
✅ At least 1 tool per tier returns valid results
✅ Rate limiting prevents > 5 requests/hour
✅ Daily gate caps free users at 3 checks/day
✅ Zero security warnings (no console errors)
✅ Response times < 5 seconds per request
✅ 100+ organic unique users/month after 30 days


# Cloudflare Worker Deployment — Troubleshooting Guide

This guide covers common issues when deploying the CVLift Tools API Worker and provides solutions.

---

## Issue 1: `wrangler: command not found`

**Cause:** Wrangler CLI is not installed or not in system PATH.

**Solution:**
```bash
# Install Wrangler globally
npm install -g wrangler@latest

# Verify installation
wrangler --version

# Should output: wrangler X.X.X (version number)
```

---

## Issue 2: `Error: Not authenticated. Please run 'wrangler login'`

**Cause:** You're not logged into your Cloudflare account.

**Solution:**
```bash
wrangler login
# Opens your browser to Cloudflare dashboard
# Click "Allow" to authenticate
# Return to terminal — you should see "Success!"

# Verify login
wrangler whoami
# Should display your Cloudflare account email
```

---

## Issue 3: `Error: Account ID is not set. Please run 'wrangler login' or 'wrangler deploy --account-id <ID>'`

**Cause:** Wrangler doesn't have your Cloudflare account ID configured.

**Solution:**
```bash
# Find your account ID
wrangler whoami

# If that doesn't work, get it from Cloudflare dashboard:
# 1. Go to https://dash.cloudflare.com
# 2. Click any domain
# 3. Look at URL: https://dash.cloudflare.com/ACCOUNT_ID/domain.com
# 4. Copy ACCOUNT_ID

# Add to wrangler.toml:
account_id = "your-account-id-here"

# Try deploy again
wrangler deploy
```

---

## Issue 4: `Error: Namespace not found. Run 'wrangler kv:namespace create RATE_LIMITS'`

**Cause:** KV namespace binding in wrangler.toml doesn't exist yet or ID is wrong.

**Solution:**
```bash
# Create the namespace
wrangler kv:namespace create RATE_LIMITS

# Output will show:
# Successfully created namespace with ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Copy the ID (long hex string)

# Update wrangler.toml:
# [[kv_namespaces]]
# binding = "RATE_LIMITS"
# id = "PASTE_ID_HERE"

# Verify
wrangler kv:key list --namespace RATE_LIMITS
# Should return empty, which is correct for new namespace
```

---

## Issue 5: `Error: Secret GEMINI_API_KEY not found`

**Cause:** API keys not added to Worker environment.

**Solution:**
```bash
# Set each API key
wrangler secret put GEMINI_API_KEY
# Paste your key, press ENTER twice

wrangler secret put GROK_API_KEY
wrangler secret put OPENROUTER_API_KEY

# Verify keys are set (names only, not values shown)
wrangler secret list

# Should show all three keys listed
```

**Where to get API keys:**
- **Gemini**: https://aistudio.google.com/apikey (free tier available)
- **Grok**: https://x.ai/api (requires X Premium)
- **OpenRouter**: https://openrouter.ai/keys (free tier available)

---

## Issue 6: `Error: Domain cvlift.me not found or not managed by your account`

**Cause:** cvlift.me is not added to your Cloudflare account or using different account.

**Solution:**
```bash
# 1. Go to https://dash.cloudflare.com
# 2. Verify cvlift.me is in your account
# 3. If not, add it:
#    - Click "Add a domain"
#    - Enter cvlift.me
#    - Complete nameserver setup

# 4. After domain is verified, try deploy again
wrangler deploy

# 5. Verify route created:
#    - Go to Cloudflare Dashboard > cvlift.me > Workers Routes
#    - Should show: api.cvlift.me/tool → cvlift-tools-api
```

---

## Issue 7: Worker deploys but returns `403 Forbidden`

**Cause:** Request origin not matching allowed origin in Worker code.

**Solution:**
```bash
# Check the Origin header being sent
# In browser console on cvlift.me/free-tools/:
console.log(document.location.origin)  // Should be https://cvlift.me

# If it matches, check Worker logs
wrangler tail

# Try a test request:
curl -X POST https://api.cvlift.me/tool \
  -H "Content-Type: application/json" \
  -H "Origin: https://cvlift.me" \
  -d '{"tool":"ats-checker","input":{"resumeText":"...","jobTitle":"..."}}'

# Should return JSON result, not 403
```

---

## Issue 8: Worker returns `400 Bad Request`

**Cause:** Request payload missing 'tool' or 'input' fields.

**Solution:**
```bash
# Verify frontend is sending correct JSON payload
# In browser developer tools (Network tab):
# 1. Go to cvlift.me/free-tools/ats-checker/ (or any tool)
# 2. Fill in some sample data
# 3. Click "Analyze" or submit button
# 5. In Network tab, find POST to api.cvlift.me/tool
# 6. Check "Request Payload" section
# 7. Should show:
# {
#   "tool": "ats-checker",
#   "input": { ... }
# }

# Also check js/tools.js callToolApi() function sends correct structure
```

---

## Issue 9: Worker returns `500 Server Error` with "GEMINI_API_KEY not configured"

**Cause:** API key is set but Worker can't access it.

**Solution:**
```bash
# 1. Verify secret was actually set
wrangler secret list
# Should show GEMINI_API_KEY

# 2. If missing, add it again
wrangler secret put GEMINI_API_KEY

# 3. Check wrangler.toml references the secret correctly
# (It should — the code reads from env.GEMINI_API_KEY)

# 4. Re-deploy after setting secret
wrangler deploy

# 5. Check logs for additional errors
wrangler tail
```

---

## Issue 10: Rate limit not working (no 429 responses)

**Cause:** KV namespace not properly bound or rate limit logic has bug.

**Solution:**
```bash
# 1. Test KV namespace directly
wrangler kv:key put RATE_LIMITS test-key "1"
wrangler kv:key get RATE_LIMITS test-key
# Should output: "1"

# 2. Check if namespace ID is correct in wrangler.toml
# Re-run: wrangler kv:namespace list
# Should show your namespace with matching ID

# 3. Submit 6+ tool requests from same IP within 1 hour
# Should see 429 on 6th request

# 4. View all KV keys for debugging
wrangler kv:key list --namespace RATE_LIMITS --limit 10
# Should show keys like: ratelimit:192.168.1.1 (request IP)
```

---

## Issue 11: Gemini API returns `invalid_argument` or `INVALID_ARGUMENT`

**Cause:** Prompt format or API quota limits exceeded.

**Solution:**
```bash
# 1. Check API key is valid
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "Hello"}]}]}' | jq

# 2. Check quota at: https://aistudio.google.com/app/usage
# Free tier has 60 requests/min limit

# 3. If quota exceeded, wait 1 hour or upgrade to paid

# 4. Check Worker logs for full error
wrangler tail --follow
```

---

## Issue 12: Tools page loads but API calls timeout

**Cause:** Worker is slow, API provider is unreachable, or request is stuck.

**Solution:**
```bash
# 1. Check Worker status
wrangler tail

# 2. Make a direct curl request to test latency
time curl -X POST https://api.cvlift.me/tool \
  -H "Content-Type: application/json" \
  -H "Origin: https://cvlift.me" \
  -d '{"tool":"resume-length","input":{"resumeText":"Software engineer with 5 years experience"}}'

# Should respond in < 2 seconds (or 5+ if using Gemini)

# 3. If timeout, check:
#    - Is cvlift.me firewall blocking api.cvlift.me?
#    - Is API endpoint URL correct in WORKER_SOURCE_CODE.js?
#    - Are AI providers up? Check their status pages

# 4. Increase timeout in js/tools.js if needed:
const response = await fetch(url, { 
  method: 'POST', 
  headers, 
  body, 
  cf: { timeout: 60 }  // seconds
});
```

---

## Issue 13: Resume-length, keyword-density, etc. local tools don't work

**Cause:** JavaScript not executing or client-side processors have bugs.

**Solution:**
```bash
# 1. Check browser console for errors
# DevTools > Console tab
# Should be no red errors

# 2. Verify js/tools.js is loaded
# In console: console.log(toolDefinitions)
# Should output 15 tools with their configs

# 3. Check local processor functions exist
# In console: console.log(typeof localResumeLength)
# Should output "function"

# 4. Test a local tool manually
# In console:
const payload = { resumeText: "Software engineer with 5 years experience" };
const result = localResumeLength(payload);
console.log(result);
# Should output JSON with word_count, page_estimate, verdict
```

---

## Issue 14: Frontend shows "Tool gated" but tool isn't in Tier-3

**Cause:** Per-tool gate state is incorrectly tracking free runs.

**Solution:**
```bash
# 1. Clear browser localStorage to reset gate state
localStorage.clear()
# Refresh page

# 2. Check toolDefinitions in js/tools.js
# Tier-3 tools should have freeRuns > 0:
// "bullet-rewriter": { ..., freeRuns: 1, ... },

# Tier-1 and Tier-2 should have NO freeRuns property:
// "ats-checker": { ..., /* no freeRuns */ ... },

# 3. If Tier-1 tool is gated, check daily usage gate
# localStorage getItem('usage')
# Should increment after each use; gate appears at 3 uses
```

---

## Issue 15: Can deploy locally but production Worker not working

**Cause:** Environment variables not synced, or wrong routes configured.

**Solution:**
```bash
# 1. Verify secrets are in production environment
wrangler secret list --env production

# 2. Check routes in Cloudflare Dashboard
# Go to: cvlift.me > Workers Routes
# Should show: api.cvlift.me/tool → cvlift-tools-api

# 3. Manually add route if missing:
wrangler publish --route "api.cvlift.me/tool" --zone-id ZONE_ID

# 4. Test production endpoint directly
curl https://api.cvlift.me/tool \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: https://cvlift.me" \
  -d '{"tool":"ats-checker","input":{"resumeText":"...","jobTitle":"..."}}'
```

---

## Quick Checklist for Full Deployment

- [ ] Wrangler installed and logged in (`wrangler whoami`)
- [ ] KV namespace created (`wrangler kv:namespace list`)
- [ ] wrangler.toml has correct namespace ID
- [ ] All 3 API keys set (`wrangler secret list`)
- [ ] cvlift.me domain in Cloudflare account
- [ ] Worker deployed without errors (`wrangler deploy`)
- [ ] Route created: api.cvlift.me/tool → cvlift-tools-api
- [ ] Tool pages load on cvlift.me/free-tools/ and individual tool URLs
- [ ] At least one local tool works (resume-length)
- [ ] At least one API tool returns result (ats-checker)
- [ ] Rate limit working (6th request returns 429)

---

## Support & Escalation

If issues persist after troubleshooting:

1. **Check Cloudflare Worker Docs:** https://developers.cloudflare.com/workers/
2. **View Live Logs:** `wrangler tail --follow --format json` (real-time worker logs)
3. **Test with cURL:** Use curl commands above to isolate frontend vs backend issues
4. **API Status Pages:**
   - Gemini: https://status.github.com/
   - Grok: https://status.x.ai/ (check if exists)
   - OpenRouter: https://status.openrouter.ai/
5. **Disable Rate Limiting (testing only):** Comment out rate limit check in WORKER_SOURCE_CODE.js

---

## Post-Deployment Validation

Once deployed, validate each tool category:

**Local Tools (No API required):**
- resume-length: Input any resume text → Should show word count, page estimate
- keyword-density: Input resume + keywords → Shows frequency chart
- career-quiz: No input → Shows 5 quiz questions
- pdf-formatter-preview: No input → Shows sample PDF preview

**API-Required Tools (Should return results or "Please try again"):**
- ats-checker: Input resume + job title → Shows ATS score
- resume-scorecard: Input resume → Shows 5 section grades
- bullet-rewriter: Input weak bullet → Shows 3 rewrites
- All others: Fill form fields → Click submit → Should see result or error message

If any tool returns `API not live` or `Not connected to backend`, check:
1. Is https://api.cvlift.me/tool accessible? (Test in browser)
2. Is Worker deployed? (`wrangler status`)
3. Are API keys set? (`wrangler secret list`)
4. Check Worker logs: `wrangler tail`


# CVLift Tools API Worker — Quick Start (5 min)

Copy-paste commands. This assumes you have Node.js and git installed.

---

## Step 1: Install Wrangler & Log In (1 min)

```bash
npm install -g wrangler@latest
wrangler login
# Opens browser, click Allow, return to terminal
```

---

## Step 2: Initialize Worker Project (1 min)

```bash
cd c:\Users\PC\Desktop\developments\cvlift-frontend

# Create src directory and copy Worker code
mkdir src
# Copy WORKER_SOURCE_CODE.js → src/index.js (or do manually)

# Copy wrangler template
# wrangler_template.toml → wrangler.toml

# Initialize package.json (if doesn't exist)
npm init -y
```

---

## Step 3: Create KV Namespace (1 min)

```bash
wrangler kv:namespace create RATE_LIMITS

# Output: Successfully created namespace with ID: abc123def456...
# Copy the ID (long hex string)

# Edit wrangler.toml:
# Find: id = "YOUR_KV_NAMESPACE_ID_HERE"
# Replace with your copied ID
```

---

## Step 4: Add API Keys (1 min)

Get free API keys from:
- Gemini: https://aistudio.google.com/apikey
- OpenRouter: https://openrouter.ai/keys

Then run:
```bash
# This will prompt you to paste your key
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENROUTER_API_KEY
```

---

## Step 5: Deploy (1 min)

```bash
wrangler deploy

# Output: Deployed to https://cvlift-tools-api.YOUR_ACCOUNT.workers.dev
```

---

## Step 6: Configure Domain Route (1 min)

1. Go to https://dash.cloudflare.com
2. Select cvlift.me domain
3. Click "Workers" → "Routes"
4. Click "Add Route"
5. Set:
   - Route: `api.cvlift.me/tool`
   - Worker: `cvlift-tools-api`
6. Save

---

## Step 7: Test (1 min)

```bash
# Test the API endpoint
curl -X POST https://api.cvlift.me/tool \
  -H "Content-Type: application/json" \
  -H "Origin: https://cvlift.me" \
  -d '{"tool":"resume-length","input":{"resumeText":"Software engineer with 5 years experience"}}'

# Should return JSON with word_count, page_estimate, verdict
```

---

## Step 8: Test in Frontend

1. Go to https://cvlift.me/free-tools/resume-length/ (or any tool at /free-tools/{tool-name}/)
2. Fill in sample data
3. Click "Analyze"
4. Should see result

---

## Done! ✅

The 15 resume tools are now live with:
- Rate limiting (5 requests per IP per hour)
- Daily usage limit (3 checks per user per day)
- API key security
- Automatic provider failover

---

## Troubleshooting Quick Fixes

**"command not found: wrangler"**
→ Install again: `npm install -g wrangler@latest`

**"Not authenticated"**
→ `wrangler login`

**"Namespace not found"**
→ Make sure KV namespace ID in wrangler.toml is correct

**"Secret not found"**
→ Re-run `wrangler secret put GEMINI_API_KEY` and redeploy

**API returns 403 Forbidden**
→ Make sure you're testing from https://cvlift.me (not http)

**Worker times out**
→ Check if Gemini API is up: https://status.google.com/ (if using Gemini)

For detailed fixes, see [WORKER_TROUBLESHOOTING.md](WORKER_TROUBLESHOOTING.md)


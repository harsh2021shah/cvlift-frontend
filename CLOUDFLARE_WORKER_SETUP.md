# Cloudflare Worker Setup Guide

This guide walks you through deploying the CVLift Tools API backend on Cloudflare Workers. This server proxies requests from the frontend to AI APIs while keeping your API keys secure.

---

## Prerequisites

1. **Cloudflare Account** with `cvlift.me` domain managed
2. **API Keys** for at least one provider:
   - Google Gemini API key ([get here](https://makersuite.google.com/app/apikey))
   - Grok API key ([get here](https://console.x.ai/)) *optional*
   - OpenRouter API key ([get here](https://openrouter.ai/keys)) *optional*
3. **Wrangler CLI** installed locally:
   ```bash
   npm install -g wrangler
   ```

---

## Step 1: Create Worker Project

```bash
# Create a new Cloudflare Workers project
wrangler init cvlift-tools-api
cd cvlift-tools-api

# This generates:
# - src/index.js (main Worker code)
# - wrangler.toml (configuration)
# - package.json
```

---

## Step 2: Configure `wrangler.toml`

Replace the generated `wrangler.toml` with:

```toml
name = "cvlift-tools-api"
main = "src/index.js"
compatibility_date = "2024-12-16"

# KV namespace binding for rate limiting
[[kv_namespaces]]
binding = "RATE_LIMITS"
id = "YOUR_KV_NAMESPACE_ID"  # You'll get this after creating the namespace

# Environment variables (add your actual API keys here for production)
[env.production]
vars = { ENVIRONMENT = "production" }

# Workers Routes
routes = [
  {
    pattern = "api.cvlift.me/*",
    zone_name = "cvlift.me"
  }
]
```

---

## Step 3: Create KV Namespace

```bash
# Create a KV namespace for rate limiting
wrangler kv:namespace create "RATE_LIMITS"
wrangler kv:namespace create "RATE_LIMITS" --preview

# Output will show your namespace ID — update wrangler.toml with it
```

---

## Step 4: Add API Keys as Worker Secrets

```bash
# Add your API keys as secrets (they won't be exposed in source code)
wrangler secret put GEMINI_API_KEY
# Paste your key when prompted

wrangler secret put GROK_API_KEY
# Paste your key (or press Enter to skip)

wrangler secret put OPENROUTER_API_KEY
# Paste your key (or press Enter to skip)
```

Verify secrets were set:
```bash
wrangler secret list
```

---

## Step 5: Deploy the Worker

```bash
# Test locally first (optional)
wrangler dev

# Then deploy to production
wrangler deploy
```

Output will show your live Worker URL: `https://cvlift-tools-api.ACCOUNT.workers.dev`

---

## Step 6: Route Custom Domain

In the Cloudflare Dashboard:

1. Go to **Workers > Routes**
2. Add a new route:
   - Pattern: `api.cvlift.me/*`
   - Zone: `cvlift.me`
   - Worker: `cvlift-tools-api`
3. Save

Now `https://api.cvlift.me/tool` will route to your Worker.

---

## Step 7: Smoke Test

```bash
# Test the Worker with a curl request
curl -X POST https://api.cvlift.me/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "ats-checker",
    "input": {
      "jobTitle": "Software Engineer",
      "resumeText": "Experienced developer with 5 years of Python and JavaScript."
    }
  }'

# Expected response (if Gemini works):
# {
#   "result": {
#     "score": "75",
#     "matched_keywords": ["developer", "Python", "JavaScript"],
#     "missing_keywords": ["system design", "leadership"],
#     "verdict": "Good match. Add system design and leadership keywords."
#   }
# }
```

---

## Monitoring & Logs

View real-time Worker logs:
```bash
wrangler tail
```

Or in the Cloudflare Dashboard > Workers > Logs tab.

---

## Environment Variables in Production

For production, use the Cloudflare Dashboard to set secrets:

1. Go to **Workers > Settings**
2. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `GROK_API_KEY`
   - `OPENROUTER_API_KEY`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| 401 Unauthorized | Check API keys; verify they're set correctly as secrets |
| 429 Too Many Requests | Your API quota is exceeded; check your account limits |
| CORS errors | Worker origin validation may be rejecting non-cvlift.me requests |
| KV errors | Ensure KV namespace ID in wrangler.toml is correct |

---

## Next Steps

Once deployed and tested:
1. Verify each tool endpoint works with API_ENDPOINT defaulting to `https://api.cvlift.me/tool`
2. Test each tool end-to-end
3. Monitor rate limiting and quota usage
4. Deploy full tool suite live

---

## Worker Cost Summary

- **Free tier:** 100,000 requests/day
- **KV storage:** 1 GB space, 1M read ops/day free
- If you exceed free tier, billing is ~$0.50 per 1M requests + storage overage

Monitor usage in the Cloudflare Dashboard under **Workers > Analytics**.

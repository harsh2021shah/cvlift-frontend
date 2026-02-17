# CVLift.me — Stunning Landing Page Rebuild
### Complete Agent Specification — Read Every Word Before Writing Code

---

## 🎯 Mission

Build a **world-class, visually stunning static landing page** for `cvlift.me` — an AI-powered resume & cover letter generator. Deploy target: **GitHub Pages** (pure static: HTML + CSS + JS, zero frameworks, zero build tools required).

This README is your complete specification. Execute it precisely and creatively.

---

## 🌐 Product Summary (CVLift.me)

CVLift is an **AI Resume & Cover Letter Generator** that:
- Takes any job posting URL (LinkedIn, Indeed, anywhere) and auto-generates a tailored resume + cover letter
- Offers 3 customization levels: **High** (freshers), **Medium** (balanced), **Low** (experienced)
- Produces **ATS-optimized** output with keyword matching to the job description
- Exports to **PDF, DOCX, TXT**
- Has **10 professional templates**, all ATS-friendly
- Starts **free** with 10 credits — no credit card required

**Key differentiator vs competitors:** Paste a job link → AI reads it → generates a perfectly tailored resume in seconds. No manual keyword stuffing.

---

## 🔗 CTA Links (Preserve Exactly — These Are Sacred)

| Action | URL |
|---|---|
| Primary CTA (Get Started Free, Login/Register) | `https://app.cvlift.me/auth` |
| Buy Credits (Pay As You Go) | `https://app.cvlift.me/dashboard/plan` |
| Help Center | `/help` |
| Terms & Conditions | `/terms` |
| Privacy Policy | `/privacy` |
| Cancellation & Refunds | `/refunds` |
| Twitter/X | `https://twitter.com/cvlift` |
| LinkedIn | `https://linkedin.com/company/cvlift` |

**All CTA buttons** (Get Started Free, Start Free, Get Started) → `https://app.cvlift.me/auth`
**Buy Credits button** → `https://app.cvlift.me/dashboard/plan`

---

## 📁 File Structure to Create

```
cvlift-landing/
├── index.html          ← Main landing page (single file, all sections)
├── styles.css          ← All styles (CSS variables, animations, layout)
├── main.js             ← Scroll animations, FAQ accordion, mobile nav, effects
├── icon.svg            ← Simple CVLift logo mark (create inline SVG)
├── CNAME               ← Contains: cvlift.me
├── .github/
│   └── workflows/
│       └── deploy.yml  ← GitHub Actions for Pages deployment
└── README.md           ← This file (keep it in repo)
```

---

## 🎨 Design Direction — "Dark Editorial Luxury"

### Aesthetic
**Dark, premium, editorial.** Think: Vercel meets Linear meets a high-end SaaS product. Dark background (#07070E base), electric accent colors, sharp typography, surgical whitespace. The kind of site that makes someone think "this product is serious."

This is NOT:
- Purple gradient on white (cliché AI startup look)
- Generic Inter font on gray cards
- Stock illustration style

This IS:
- Deep dark background with subtle texture/noise
- Electric teal/cyan as primary accent (`#00E5C8`)
- Warm white text (`#F0EDE8`)
- Sharp geometric elements, fine lines, grids
- Glassmorphism cards with subtle borders
- Smooth scroll-triggered entrance animations
- Micro-interactions on hover

### Color Palette (CSS Variables)
```css
:root {
  --bg-base: #07070E;
  --bg-surface: #0F0F1A;
  --bg-card: #131320;
  --border: rgba(255, 255, 255, 0.08);
  --border-bright: rgba(0, 229, 200, 0.3);

  --accent: #00E5C8;         /* Electric teal — primary CTA color */
  --accent-dim: #00B8A0;
  --accent-glow: rgba(0, 229, 200, 0.15);
  --purple: #7C3AED;

  --text-primary: #F0EDE8;
  --text-secondary: #8B8A9B;
  --text-muted: #4A4960;

  --gradient-hero: linear-gradient(135deg, #00E5C8 0%, #7C3AED 100%);
  --gradient-card: linear-gradient(180deg, rgba(19,19,32,0.9) 0%, rgba(7,7,14,0.9) 100%);
}
```

### Typography
```css
/* Load from Google Fonts — add to <head> */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

/* Usage */
h1, h2, h3, .logo       { font-family: 'Syne', sans-serif; }
body, p, a, button, span { font-family: 'DM Sans', sans-serif; }
.mono                    { font-family: 'JetBrains Mono', monospace; }
```

---

## 📐 Page Sections (Build All 9 In Order)

---

### SECTION 1 — NAVIGATION

**Behavior:** Fixed top. Transparent initially → frosted glass after 50px scroll.

**Frosted glass state (`.scrolled` class):**
```css
#navbar.scrolled {
  background: rgba(7, 7, 14, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
```

**Left:** `⚡ CVLift` wordmark — use the lightning bolt emoji or inline SVG, Syne font, `--accent` color.

**Center (desktop only):** `Features` | `Pricing` | `FAQ` — smooth scroll to `#features`, `#pricing`, `#faq`

**Right:**
- `Help` text link → `/help`
- `Login / Register` pill button → `https://app.cvlift.me/auth`
  - Style: teal border + teal text on transparent bg; fills solid teal on hover
  - Border-radius: 999px (full pill)

**Mobile hamburger:** Three-line icon. Opens a full-screen overlay with centered nav links + CTA button.

---

### SECTION 2 — HERO

**Layout:** Full viewport height (`min-height: 100vh`). Vertically + horizontally centered. Two-column on desktop (content left, mockup right), single column on mobile.

**Background layers (stack these with `position: absolute`):**
1. Base: `--bg-base` solid
2. Two animated gradient orbs (blurred circles, slow drift animation)
3. Subtle dot grid (CSS repeating-radial-gradient, very faint)
4. Optional: SVG noise filter overlay at ~3% opacity

**Orb animation:**
```css
@keyframes orbDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(40px, -30px) scale(1.08); }
  66%       { transform: translate(-25px, 20px) scale(0.94); }
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(0,229,200,0.18) 0%, transparent 70%);
  border-radius: 50%;
  position: absolute; top: -100px; left: -100px;
  animation: orbDrift 10s ease-in-out infinite;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
  border-radius: 50%;
  position: absolute; bottom: -50px; right: -50px;
  animation: orbDrift 13s ease-in-out infinite reverse;
  animation-delay: -4s;
}
```

**Left column — content:**

Badge pill (animate in first):
```html
<div class="hero-badge">✦ AI-Powered Resume Generator</div>
```
Style: small pill, dark teal bg (`rgba(0,229,200,0.1)`), teal border, `--accent` text, uppercase, letter-spacing, 12px.

H1 (animate in 150ms delay):
```
Stop Sending Resumes
That Get Ghosted.
```
- Font: Syne 800, 72-88px desktop / 42px mobile
- Line-height: 1.05
- "Ghosted." gets gradient text: `background: var(--gradient-hero); -webkit-background-clip: text; color: transparent;`

Subheadline (animate in 300ms delay):
```
Paste any job link. AI reads the role. You get a perfectly tailored,
ATS-optimized resume and cover letter — in under 60 seconds.
```
- DM Sans 400, 18-20px, `--text-secondary`, max-width: 520px

CTA group (animate in 450ms delay):
```html
<div class="hero-cta">
  <a href="https://app.cvlift.me/auth" class="btn-primary btn-lg">
    Get Started Free <span class="btn-arrow">→</span>
  </a>
  <p class="cta-note">10 free resume generations · No credit card required</p>
</div>
```

Social proof strip (animate in 600ms delay):
```html
<div class="social-proof">
  <div class="stars">★★★★★</div>
  <span>Join 1,000+ job seekers landing their dream jobs</span>
</div>
```

**Right column — Floating Resume Mockup (CSS-only, animate in 500ms):**

Build a visually compelling fake resume card entirely in HTML/CSS:
```html
<div class="resume-mockup">
  <div class="mockup-header">
    <div class="mockup-avatar"></div>
    <div class="mockup-name-block">
      <div class="fake-line wide dark"></div>
      <div class="fake-line medium"></div>
    </div>
  </div>
  <div class="mockup-section-label">EXPERIENCE</div>
  <div class="fake-line wide"></div>
  <div class="fake-line medium"></div>
  <div class="fake-line narrow"></div>
  <div class="mockup-section-label">SKILLS</div>
  <div class="mockup-tags">
    <span class="tag">Python</span>
    <span class="tag">React</span>
    <span class="tag">SQL</span>
  </div>
  <div class="mockup-ats-badge">
    <span class="ats-dot"></span> ATS SCORE: 97%
  </div>
</div>
```

Style the mockup card:
- Dark bg `--bg-card`, border `1px solid var(--border-bright)`, border-radius 16px
- Subtle teal glow behind it: `box-shadow: 0 0 80px rgba(0,229,200,0.12)`
- Float animation: `transform: translateY(-8px)` 3s ease-in-out infinite alternate
- `.fake-line` divs: thin colored divs (height 8px or 10px) with border-radius 4px, various widths, background `--border` or `rgba(255,255,255,0.06)`
- `.mockup-ats-badge`: pill in bottom-right, teal bg, dark text, `font-family: 'JetBrains Mono'`
- `.tag` spans: small rounded pills, teal border, teal text, font-size 11px

---

### SECTION 3 — HOW IT WORKS

**Above section title:** Small uppercase label: `HOW IT WORKS` in `--accent`, letter-spacing, 12px

**Section title:** `From Job Link to Interview in 3 Steps`
Syne 700, 44-52px, `--text-primary`

**Layout:** CSS grid, `grid-template-columns: repeat(3, 1fr)` on desktop. Stack on mobile.

**Connector line between cards:** Absolutely positioned horizontal dashed line, `border-top: 1px dashed var(--border)`, hidden on mobile.

**Step cards:** `data-animate` attribute for scroll reveal, stagger delay 0/100ms/200ms.

Card structure:
```html
<div class="step-card" data-animate>
  <div class="step-number">01</div>
  <div class="step-icon"><!-- SVG --></div>
  <h3>Paste Job Link</h3>
  <p>Drop any job posting URL from LinkedIn, Indeed, or any site. We extract everything automatically.</p>
</div>
```

Step number styling: Syne 800, 64px, `--text-muted`, positioned top-right or top-left of card, slightly overlapping.

Step icons (use these SVG paths):
- Step 1 (Link): `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>` viewBox="0 0 24 24"
- Step 2 (Sliders): vertical slider icon SVG
- Step 3 (Download arrow): `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>` viewBox="0 0 24 24"

Icon wrapper: 56px × 56px circle, `background: var(--accent-glow)`, `border: 1px solid var(--border-bright)`, icon stroke `--accent`.

Card hover: `border-color: var(--border-bright)`, `box-shadow: 0 0 30px var(--accent-glow)`, `transform: translateY(-4px)`

Steps content:
1. **Paste Job Link** — Drop any job posting URL from LinkedIn, Indeed, or any site. We extract everything automatically.
2. **Choose Your Style** — Select your AI customization level: High (freshers), Medium (balanced), or Low (experienced professionals).
3. **Download & Apply** — Get your ATS-optimized resume and cover letter. PDF, DOCX, or TXT. Apply with confidence.

---

### SECTION 4 — FEATURES (`id="features"`)

**Label:** `WHY CVLIFT`
**Title:** `Everything You Need to Land the Interview`
**Subtitle:** `Powered by AI, designed for success.`

**Layout:** 2×2 grid on desktop, 1 column on mobile.

**Feature cards (glassmorphism):**
```css
.feature-card {
  background: rgba(19, 19, 32, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-top: 3px solid transparent;
  border-image: var(--gradient-hero) 1;
  border-radius: 16px;
  padding: 36px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 229, 200, 0.08);
}
```

Note: CSS border-image doesn't work cleanly with border-radius. Use this workaround instead — add a pseudo-element `::before` with gradient background as the top border. Or simply use `border-top: 3px solid var(--accent)`.

**4 Feature cards:**

1. **Job-Perfect AI Matching** — Sparkles icon
   - "Paste a job link and our AI matches your resume to the exact keywords, tone, and skills the recruiter is scanning for. Every single time."

2. **Smart Customization Levels** — Sliders icon
   - "Fresh grad or seasoned pro? High AI rewrites aggressively. Low keeps your voice. You choose how much the AI touches your content."

3. **ATS-Optimized Templates** — Shield icon
   - "10 professionally designed templates built to clear Applicant Tracking Systems. No fancy tables or graphics that confuse the bots."

4. **Export Anywhere** — Download icon
   - "PDF. DOCX. TXT. Download in any format, compatible with every job board and application system on the planet."

**Bonus feature pills below grid (horizontal flex, wrap on mobile):**
```html
<div class="feature-pills">
  <div class="feature-pill">⚡ 60-Second Generation</div>
  <div class="feature-pill">🎯 Keyword Optimization</div>
  <div class="feature-pill">✉ Cover Letter Included</div>
  <div class="feature-pill">🔒 Your Data Stays Private</div>
</div>
```
Style: `background: var(--bg-card)`, `border: 1px solid var(--border)`, `border-left: 3px solid var(--accent)`, padding 12px 20px, border-radius 8px.

---

### SECTION 5 — PRICING (`id="pricing"`)

**Label:** `PRICING`
**Title:** `Simple Pricing. No Surprises.`
**Subtitle:** `Start free with 10 credits. Upgrade when you're ready.`

**Monthly/Yearly Toggle:**
```html
<div class="pricing-toggle">
  <span class="toggle-label" id="label-monthly">Monthly</span>
  <button class="toggle-switch" id="billingToggle" aria-label="Toggle billing period">
    <span class="toggle-thumb"></span>
  </button>
  <span class="toggle-label" id="label-yearly">
    Yearly <span class="save-badge">Save 20%</span>
  </span>
</div>
```

Toggle JS behavior: clicking switch adds `.yearly` class to `#pricing`. CSS selectors show/hide monthly vs yearly prices.

**4 Pricing cards layout:** `grid-template-columns: repeat(4, 1fr)` desktop, 2x2 tablet, 1 col mobile.

**Card data:**

| | Free Trial | Basic | Premium ⭐ | Pay As You Go |
|---|---|---|---|---|
| Monthly Price | $0 | $9/mo | $24/mo | $1/credit pack |
| Yearly Price | $0 | $7.20/mo | $19.20/mo | Same |
| Credits | 10 to start | 150/month | 500/month | 20 per $1 (min $3) |
| Tagline | Try CVLift | For moderate job seekers | For power users | Flexible option |
| CTA | Start Free | Get Started | Get Started | Buy Credits |
| CTA URL | /auth | /auth | /auth | /dashboard/plan |
| CTA base | `https://app.cvlift.me` | same | same | `https://app.cvlift.me` |

**All plans include:** All templates • ATS optimization • PDF, DOCX, TXT export • Email support

**Basic also:** Save 20% on yearly

**Premium also:** Priority support • Save 58% vs Pay As You Go • Save 20% on yearly

**PAYTG also:** No commitment • Credits never expire

**Premium card special styling:**
```css
.pricing-card.popular {
  border: 1px solid var(--accent);
  background: linear-gradient(180deg, rgba(0,229,200,0.07) 0%, var(--bg-card) 60%);
  box-shadow: 0 0 60px rgba(0,229,200,0.1);
  transform: scale(1.02);
  position: relative;
}
```

**Most Popular badge** floating above Premium card:
```html
<div class="popular-badge">Most Popular</div>
```
Style: absolute, top -16px, left 50%, transform translateX(-50%), teal gradient bg, dark text, border-radius 999px, padding 4px 16px, font-size 12px, font-weight 600.

---

### SECTION 6 — TESTIMONIALS

**Label:** `TESTIMONIALS`
**Title:** `Loved By Job Seekers`

**Layout:** 3 cards side by side on desktop, 1 column on mobile. All same height via CSS grid `align-items: stretch`.

**Card structure:**
```html
<div class="testimonial-card" data-animate>
  <div class="quote-mark">"</div>
  <div class="stars">★★★★★</div>
  <p class="quote-text">I honestly didn't expect an AI tool to write better than me. I filled in my info and it looked instantly professional.</p>
  <div class="testimonial-author">
    <div class="author-avatar">GM</div>
    <div>
      <div class="author-name">Georgette M.</div>
      <div class="author-title">Social Media Manager</div>
    </div>
  </div>
</div>
```

Quote mark: Syne 800, 80px, `--accent`, line-height 0.8, margin-bottom -8px (overlaps text slightly).

Stars: `--accent` color.

Author avatar: 40px circle, gradient bg (`--gradient-hero`), initials in dark text, font-weight 700, 14px.

Card bg: `--bg-card`, border `--border`, border-radius 16px, padding 32px.

**3 testimonials:**
1. Georgette M., Social Media Manager — "I honestly didn't expect an AI tool to write better than me. I filled in my info and it looked instantly professional."
2. Hiroshi Y., Graduate Project Manager — "Finally, a CV tool that doesn't feel like homework. The AI suggestions actually made sense, and the templates are way better than anything I could have made in Word."
3. Omar H., Sales Manager — "I tried three other CV builders before this. They all looked generic or outdated. CVLift's templates actually made my experience look impressive, not just listed."

---

### SECTION 7 — FAQ (`id="faq"`)

**Title:** `Frequently Asked Questions`
**Subtitle:** `Everything you need to know before you start.`

**Layout:** Single column, max-width 720px, centered.

**Accordion implementation:**
```javascript
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});
```

```css
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.3s ease;
}
.faq-item.open .faq-answer {
  max-height: 300px;
}
.faq-icon {
  transition: transform 0.3s ease;
}
.faq-item.open .faq-icon {
  transform: rotate(45deg); /* + becomes × */
}
```

**10 Q&A pairs:**

1. **How does CVLift work?** — Paste any job posting URL. Our AI reads the job description, extracts the key requirements, and generates a tailored resume and cover letter that matches what the recruiter is looking for — in under 60 seconds.

2. **What is the 3-level customization?** — High customization is ideal for freshers — AI rewrites and fills in content aggressively. Medium balances AI input with your experience. Low is best for senior professionals who want light polishing without changing their voice.

3. **Which job platforms does CVLift support?** — Any job posting with a URL — LinkedIn, Indeed, Glassdoor, Wellfound, company career pages, and more. If you can link to it, we can read it.

4. **What is ATS optimization?** — Applicant Tracking Systems (ATS) filter resumes before a human even sees them. CVLift ensures your resume uses the right keywords and clean formatting to pass these filters automatically.

5. **Can I edit the generated resume?** — Yes. After generation you can edit all content in the app, switch templates, and re-download as many times as you need within your credit allowance.

6. **What formats can I download?** — PDF, DOCX (Word), and TXT — all perfectly formatted and compatible with every major job portal.

7. **How many templates are available?** — 10 professionally designed, ATS-friendly templates included in all plans at no extra cost.

8. **Can I cancel my subscription anytime?** — Yes, cancel anytime from your dashboard. No lock-ins, no questions asked.

9. **What happens after I use my free credits?** — You can upgrade to a monthly plan (starting at $9/mo) or buy credit packs on a pay-as-you-go basis starting at $3.

10. **Is my data secure?** — Yes. We use industry-standard encryption and never sell your data. Your resume information is used only to generate your documents.

---

### SECTION 8 — FINAL CTA

**Background:** Same orb/glow effect as hero. Make it visually dramatic — the user should feel urgency and excitement.

**Headline:** `Ready to Land Your Dream Job?`
Syne 800, 56-72px, `--text-primary`

**Subtext:** `Join thousands of job seekers using AI to stand out from the crowd.`
DM Sans, 20px, `--text-secondary`

**CTA button:** `Get Started Free →` → `https://app.cvlift.me/auth`
- Larger than normal: padding 18px 48px, font-size 18px
- Add subtle CSS pulse animation to draw the eye

```css
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 229, 200, 0.4); }
  50%       { box-shadow: 0 0 0 16px rgba(0, 229, 200, 0); }
}
.btn-pulse { animation: pulse 2.5s ease-in-out infinite; }
```

**Below button:** `10 free resume generations · No credit card required` — `--text-muted`, 14px

---

### SECTION 9 — FOOTER

**Dark background:** `--bg-surface` or slightly lighter than page base.
**Top border:** `1px solid var(--border)`

**4-column grid on desktop (`grid-template-columns: 2fr 1fr 1fr 1fr`):**

**Column 1 — Brand:**
```html
<div class="footer-brand">
  <a href="/" class="logo">⚡ CVLift</a>
  <p>AI-powered resumes and cover letters that get you hired.</p>
  <div class="social-links">
    <a href="https://twitter.com/cvlift" target="_blank" rel="noopener" aria-label="Twitter">
      <!-- Twitter/X SVG icon -->
    </a>
    <a href="https://linkedin.com/company/cvlift" target="_blank" rel="noopener" aria-label="LinkedIn">
      <!-- LinkedIn SVG icon -->
    </a>
  </div>
</div>
```

**Column 2 — Product:**
- Features → `#features`
- Pricing → `#pricing`
- Help → `/help`

**Column 3 — Legal:**
- Terms & Conditions → `/terms`
- Privacy Policy → `/privacy`
- Cancellation & Refunds → `/refunds`

**Column 4 — Support:**
- Email: `support@cvlift.me` (with mail icon)
- Help Center → `/help`

**Bottom bar (border-top, flex space-between):**
- Left: `© 2026 CVLift. All rights reserved.`
- Right: `Built with ♥ for job seekers`

Social icon hover: opacity 0.6 → 1, color shifts to `--accent`.

---

## ✨ JavaScript (main.js) — Full Implementation

Write `main.js` to handle ALL of the following:

```javascript
// =============================================
// 1. NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// =============================================
// 2. MOBILE MENU
// =============================================
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// =============================================
// 3. SCROLL ANIMATIONS (Intersection Observer)
// =============================================
const animateElements = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animateElements.forEach(el => observer.observe(el));

// =============================================
// 4. HERO ENTRANCE (runs on page load)
// =============================================
// Elements with data-hero-animate animate in on load (not scroll)
// Add class 'hero-visible' with staggered timeouts
document.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('[data-hero-animate]');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('hero-visible'), i * 150);
  });
});

// =============================================
// 5. FAQ ACCORDION
// =============================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// =============================================
// 6. PRICING TOGGLE (Monthly / Yearly)
// =============================================
const billingToggle = document.getElementById('billingToggle');
let isYearly = false;

billingToggle.addEventListener('click', () => {
  isYearly = !isYearly;
  billingToggle.classList.toggle('active', isYearly);
  document.querySelectorAll('.price-monthly').forEach(el => {
    el.style.display = isYearly ? 'none' : 'block';
  });
  document.querySelectorAll('.price-yearly').forEach(el => {
    el.style.display = isYearly ? 'block' : 'none';
  });
  document.getElementById('label-yearly').classList.toggle('active', isYearly);
  document.getElementById('label-monthly').classList.toggle('active', !isYearly);
});

// =============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =============================================
// 8. PREFERS REDUCED MOTION
// =============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--animation-duration', '0.001ms');
}
```

---

## 🎨 CSS Architecture (styles.css)

Organize in this order:
1. `@import` Google Fonts
2. CSS custom properties (`:root`)
3. CSS Reset & base styles
4. Typography scale
5. Utility classes (`.btn-primary`, `.btn-outline`, `.section-label`, `.section-title`, etc.)
6. Layout helpers (`.container`, `.section`)
7. Component styles (navbar, hero, step-cards, feature-cards, pricing-cards, testimonials, faq, footer)
8. Animation keyframes
9. Scroll animation base states + `.is-visible` states
10. Hero animation base states + `.hero-visible` states
11. Media queries (mobile-first: sm, md, lg, xl)
12. `prefers-reduced-motion` override

**Base animation states:**
```css
[data-animate] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-hero-animate] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
[data-hero-animate].hero-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Button base styles:**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--accent);
  color: #07070E;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 40px rgba(0, 229, 200, 0.35);
}
.btn-lg {
  padding: 18px 40px;
  font-size: 18px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.btn-outline:hover {
  background: var(--accent);
  color: #07070E;
}
```

---

## 🚀 GitHub Actions Deploy File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 📄 CNAME File

Create a file named `CNAME` (no extension) in the root with this exact content:
```
cvlift.me
```

---

## 📋 icon.svg

Create `icon.svg` — a minimal upward arrow/lift logo in teal:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#00E5C8"/>
  <path d="M16 7L9 18h4.5v8h5v-8H23L16 7z" fill="#07070E"/>
</svg>
```

---

## ✅ Quality Checklist (Verify Before Marking Done)

**Functionality:**
- [ ] All 9 sections present in correct order
- [ ] All CTA URLs match the table exactly
- [ ] Navbar scroll → frosted glass effect works
- [ ] Mobile hamburger menu opens/closes
- [ ] FAQ accordion animates open/close
- [ ] Pricing monthly/yearly toggle switches prices
- [ ] Smooth scroll on anchor links
- [ ] All scroll animations trigger (Intersection Observer)
- [ ] Hero entrance animations stagger correctly on load
- [ ] Resume mockup floats continuously

**Files:**
- [ ] `index.html` — complete page
- [ ] `styles.css` — all styles
- [ ] `main.js` — all JavaScript
- [ ] `icon.svg` — logo mark
- [ ] `CNAME` — contains `cvlift.me`
- [ ] `.github/workflows/deploy.yml` — GitHub Actions

**Design:**
- [ ] Font: Syne (headings) + DM Sans (body) loading from Google Fonts
- [ ] Colors: dark base `#07070E`, accent teal `#00E5C8`
- [ ] Hero background orbs animate
- [ ] Feature cards have glassmorphism effect
- [ ] Premium pricing card is visually elevated
- [ ] No purple-gradient-on-white aesthetic anywhere

**Responsive:**
- [ ] 375px (iPhone SE) — all sections stack properly
- [ ] 768px (iPad) — two column layouts where appropriate
- [ ] 1440px (desktop) — full layouts
- [ ] No horizontal scroll at any breakpoint

**Performance/Accessibility:**
- [ ] `prefers-reduced-motion` handled
- [ ] All interactive elements have proper `aria-*` labels
- [ ] Color contrast ratio meets WCAG AA
- [ ] No console errors

---

## 🚫 Hard Constraints

1. **NO React, Vue, Angular, or any JavaScript framework**
2. **NO npm, no build step** — must work by opening `index.html` directly in a browser
3. **NO Tailwind, Bootstrap, or external CSS frameworks** — custom CSS only
4. **NO Inter or Roboto fonts** — use Syne + DM Sans only
5. **PRESERVE** all CTA URLs exactly — do not change any links
6. **DO NOT** use purple gradient on white — this is a dark site
7. **cdnjs or Google Fonts** are the only allowed external resources

---

*This README fully specifies the CVLift.me landing page rebuild for GitHub Pages. The output should be approximately 900-1200 lines of HTML, 700-1000 lines of CSS, and 150-250 lines of JavaScript, all hand-crafted without frameworks.*
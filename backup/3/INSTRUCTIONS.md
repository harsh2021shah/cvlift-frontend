Below is a complete `README.md` you can paste into Claude Code. It describes the new static CVLift landing page, keeps your existing CTAs, and targets GitHub Pages deployment.

```markdown
# CVLift Landing Page (Static, GitHub Pages)

Modern, high-converting, **static** marketing site for [cvlift.me](https://cvlift.me), promoting the AI-powered resume & cover letter generator and linking users into the existing app at `app.cvlift.me`.[file:1]

The goal is to:
- Make the landing page visually stunning and modern (glassmorphism, gradients, smooth micro-animations) while staying fast and lightweight.[web:2][web:5]
- Improve clarity of the value proposition and hero section to increase signups.[web:3][web:15]
- Keep **all key CTAs and URLs identical** to the current production site so the funnel does not break.[file:1]


---

## 1. Tech Stack & Constraints

**Requirements**

- Pure static front-end, no backend.
- Deployed on **GitHub Pages**.
- Easy to maintain and extend.

**Chosen stack**

- **Vite + React + TypeScript**
- **Tailwind CSS** for utility-first styling.
- Optional: **Framer Motion** for simple, declarative animations (fade/slide/scale on scroll and hover).

This combo gives:
- Very fast dev experience.
- Simple static build output (`dist/`) compatible with GitHub Pages.[web:7][web:10]
- Easy theming and modern visual effects (glassmorphism, gradients, responsive grid).[web:2][web:11]


---

## 2. Live URLs & CTAs (Must Match Current Site)

All buttons/links that lead into the web app or legal/support pages must use these exact URLs from the current site.[file:1]

**Primary product CTAs**

- **Get Started Free / Login / Register / Start Free / Get Started**
  - `https://app.cvlift.me/auth`[file:1]

- **Buy Credits**
  - `https://app.cvlift.me/dashboard/plan`[file:1]

**Informational / legal / support**

- Help Center: `/help` (relative, same domain – keep path the same).[file:1]
- Terms & Conditions: `/terms`.[file:1]
- Privacy Policy: `/privacy`.[file:1]
- Cancellation & Refunds: `/refunds`.[file:1]
- Support email links:
  - Footer support email (use the same `mailto:` that Cloudflare protects now, but hard-code as a normal `mailto:` in the static version – you can replace `[email protected]` with the actual address when known).[file:1]

**Social**

- Twitter/X: `https://twitter.com/cvlift`.[file:1]
- LinkedIn: `https://linkedin.com/company/cvlift`.[file:1]

**Anchors inside the page**

- `#how-it-works`
- `#features`
- `#pricing`
- `#faq`


---

## 3. Project Setup

Create a new Vite + React + TypeScript project and wire Tailwind.

```bash
# 1. Scaffold
npm create vite@latest cvlift-landing -- --template react-ts
cd cvlift-landing

# 2. Install deps
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Dev
npm run dev
```

Configure **Tailwind** (`tailwind.config.cjs`):

- Enable `./index.html`, `./src/**/*.{ts,tsx,jsx,js}` in `content`.
- Extend theme with custom colors (see Design System below).


---

## 4. GitHub Pages Deployment (Vite + React)

Implement GitHub Pages deploy via `gh-pages` as described in community guides for Vite/React.[web:7][web:10]

1. **Install `gh-pages`:**

```bash
npm install gh-pages --save-dev
```

2. **Set `homepage` and scripts in `package.json`:**

```jsonc
{
  "name": "cvlift-landing",
  "homepage": "https://<github-username>.github.io/<repo-name>",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Configure base path in `vite.config.ts`:**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/<repo-name>/", // replace with GitHub repo name
});
```

4. **Deploy:**

```bash
npm run deploy
```

This will build the site and publish `dist/` to the `gh-pages` branch, which GitHub Pages then serves.[web:7][web:10]


---

## 5. Design System

### 5.1 Brand & Colors

Use a modern SaaS palette with gradient accents and glassmorphism panels, inspired by current 2025–2026 UI trends.[web:2][web:5][web:11]

Suggested palette (can be tweaked):

- `primary`: `#6366F1` (indigo)
- `accent`: `#EC4899` (pink)
- `secondary`: `#0F172A` (slate-900 for footer/header background)
- `bg`: `#F9FAFB` (light background)
- `text-main`: `#020617`
- `success`: `#22C55E`

Add to `tailwind.config.cjs`:

```js
extend: {
  colors: {
    primary: "#6366F1",
    accent: "#EC4899",
    secondary: "#0F172A",
    success: "#22C55E",
  },
}
```

### 5.2 Typography

- Use a clean, geometric sans-serif:
  - Primary: `Inter` or `Plus Jakarta Sans` via Google Fonts.
- Headings: `font-bold`, tight leading.
- Body: `font-normal`, `leading-relaxed` for readability, especially on mobile.[web:12]

### 5.3 Layout & Visual Style

- **Glassmorphism cards** for hero preview, feature cards, pricing, and CTA panels:
  - Semi-transparent background (e.g., `bg-white/10`, `backdrop-blur-xl`, `border border-white/20`).[web:2][web:5]
- **Strong gradient backgrounds** in hero and final CTA:
  - `bg-gradient-to-br from-primary via-accent to-primary`.
- Rounded corners and soft shadows:
  - `rounded-2xl`, `shadow-xl`, `shadow-primary/20`.
- Use a subtle **radial dot grid** or gradient overlay in hero background to give depth.

### 5.4 Motion & Micro-interactions

- Section-level **fade-in + slight upward translate** when components enter viewport (once).
- Hover effects:
  - Cards: `hover:-translate-y-1 hover:shadow-2xl`.
  - CTAs: background gradient shift and small scale.
- Keep animations subtle and performant; no infinite loops or heavy parallax, to preserve load speed and Core Web Vitals.[web:12][web:15]


---

## 6. Page Structure & Components

Use a single-page layout with logical sections. The React components should map 1:1 to these sections for clarity.

**Top-level file:** `src/App.tsx`

```txt
src/
  components/
    Navbar.tsx
    Hero.tsx
    HowItWorks.tsx
    Features.tsx
    TemplatesPreview.tsx
    SocialProof.tsx
    Pricing.tsx
    FAQ.tsx
    FinalCTA.tsx
    Footer.tsx
  hooks/
    useScrollReveal.ts
  styles/
    (Tailwind via index.css)
```

### 6.1 `<Navbar />`

- **Layout:**
  - Fixed top, transparent over hero with background blur after scroll.
  - Left: logo text `CVLift`.
  - Center/right: nav links.
  - Right: primary CTA button.

- **Content:**
  - Logo: `CVLift` with gradient text.
  - Links (anchor scroll):
    - “How it works” → `#how-it-works`
    - “Features” → `#features`
    - “Pricing” → `#pricing`
    - “FAQ” → `#faq`
  - CTA button:
    - Label: `Login / Register`
    - URL: `https://app.cvlift.me/auth`.[file:1]

- **Mobile:**
  - Hamburger menu that expands a full-width dropdown with the same links and a CTA button.

### 6.2 `<Hero />`

Hero must **communicate the core outcome in 3–5 seconds**, target persona (job seekers), and provide a very clear CTA.[web:3][web:9][web:15]

- **Layout:**
  - Two-column on desktop:
    - Left: copy and CTAs.
    - Right: glassmorphism “app preview” card showing:
      - A fake job URL pasted.
      - A side-by-side view of “Job Description → Tailored Resume & Cover Letter”.

- **Copy (edit for tone but keep structure):**

  - Eyebrow: `AI-Powered Resumes & Cover Letters`
  - H1:  
    `Stop rewriting your resume for every job.`  
    Emphasize with gradient span: `Let AI do it in seconds.`
  - Subhead:  
    `Paste any job link and get a personalized, ATS-optimized resume and cover letter tailored to that exact role.`[file:1]
  - Bullets under subhead (3):
    - `✓ Works with LinkedIn, Indeed, and any job board URL`.[file:1]
    - `✓ Smart customization levels for freshers to senior pros`.[file:1]
    - `✓ Download in PDF, DOCX, or TXT and apply confidently`.[file:1]

- **CTAs:**
  - Primary button:
    - Label: `Get Started Free`
    - URL: `https://app.cvlift.me/auth`.[file:1]
    - Sub-label below button: `10 free resume generations • No credit card required`.[file:1]
  - Secondary text CTA:
    - Button or link: `See how it works`
    - Scrolls to `#how-it-works`.

- **Social proof strip under hero:**
  - Text: `Trusted by job seekers in tech, finance, and more`
  - Placeholder for logos or a text like `“1,000+ resumes generated”` (this can be generic unless you have exact numbers).

### 6.3 `<HowItWorks id="how-it-works" />`

Three-step explanation, based on current flow but with clearer copy.[file:1][web:12]

- Section title: `From job link to interview in 3 steps`.
- Steps (cards with icons):

  1. **Paste the job link**  
     `Drop any job posting URL from LinkedIn, Indeed, or any job board. CVLift extracts the requirements automatically.`[file:1]

  2. **Choose your customization level**  
     `Pick High, Medium, or Low customization depending on your experience and how much you want to rewrite.`[file:1]

  3. **Download & apply**  
     `Get an ATS-optimized resume and matching cover letter, then download in PDF, DOCX, or TXT and apply in minutes.`[file:1]

- Visual style:
  - Each card is a glassmorphism card with icon and short description.
  - On desktop, show a connecting gradient line between cards to indicate flow.

### 6.4 `<Features id="features" />`

Keep and refine your existing feature set, grouped into four key value props.[file:1]

- Section title: `Why job seekers choose CVLift`.
- Subtitle: `AI does the heavy lifting so you can focus on landing the interview.`

- Feature cards (4):

  1. **Smart Customization**  
     `AI tailors your resume to your experience level—whether you’re a fresh graduate or a senior professional.`[file:1]

  2. **Job-Perfect Matching**  
     `Every resume is aligned with the specific role, including keywords, skills, and tone that match the job description.`[file:1]

  3. **ATS-Optimized Templates**  
     `10 professional templates designed to pass Applicant Tracking Systems and stand out to recruiters.`[file:1]

  4. **Flexible Export Formats**  
     `Export your resume and cover letter as PDF, DOCX, or TXT for any job portal or application system.`[file:1]

- Each card:
  - Icon in gradient square.
  - Short paragraph (max 3 lines).
  - Hover lift and glow.

### 6.5 `<TemplatesPreview />` (Optional, but recommended)

Simple horizontal scroll or grid of 3–4 template thumbnails.

- Section title: `Professional templates recruiters actually read`.
- Content: show fake resume layouts with different visual styles (clean, modern, compact, creative).
- All static images; no dynamic selection required.

### 6.6 `<SocialProof />`

If you don’t have real logos/testimonials yet, use placeholders that can be swapped later.

- Layout:
  - Left: short stat.
  - Right: 2–3 short testimonial cards.

- Example content:

  - Stat: `“Tailor your resume for 10+ roles in a single evening.”`
  - Testimonials (placeholder text, generic but realistic).

Keep this section visually lighter so it doesn’t overpower hero/pricing.

### 6.7 `<Pricing id="pricing" />`

Recreate your existing plans with clearer layout and emphasis on the most popular plan.[file:1]

- Section title: `Simple, transparent pricing`.
- Subtitle: `Start free with 10 credits. Upgrade only when you’re ready.`[file:1]

- Plans (cards):

  1. **Free Trial**
     - Price: `$0`
     - Copy: `10 credits to get started`.[file:1]
     - Bullet points:
       - `10 credits to get started`
       - `All templates included`
       - `ATS optimization`
       - `PDF, DOCX, TXT export`
       - `Email support`.[file:1]
     - CTA: `Start Free` → `https://app.cvlift.me/auth`.[file:1]

  2. **Basic**
     - Price: `$9 / month`
     - Copy: `For moderate job seekers`.[file:1]
     - Bullets (keep from current site):
       - `150 credits per month`
       - `All templates included`
       - `ATS optimization`
       - `PDF, DOCX, TXT export`
       - `Email support`
       - `Save 20% on yearly plans`.[file:1]
     - CTA: `Get Started` → `https://app.cvlift.me/auth`.[file:1]

  3. **Premium (Most Popular)**
     - Highlight with badge `Most Popular`.
     - Price: `$24 / month`
     - Copy: `For power users`.[file:1]
     - Bullets:
       - `500 credits per month`
       - `All templates included`
       - `ATS optimization`
       - `All export formats`
       - `Priority support`
       - `Save 58% vs pay-as-you-go`
       - `Save 20% on yearly plans`.[file:1]
     - CTA: `Get Started` → `https://app.cvlift.me/auth`.[file:1]

  4. **Pay As You Go**
     - Price: `$1 / credit pack`
     - Copy: `Flexible option`.[file:1]
     - Bullets:
       - `20 credits per $1 spent`
       - `Minimum $3 purchase`
       - `No commitment required`
       - `All templates included`
       - `ATS optimization`
       - `All export formats`
       - `Credits never expire`.[file:1]
     - CTA: `Buy Credits` → `https://app.cvlift.me/dashboard/plan`.[file:1]

- Below grid, add a short, 3-column “Which plan is right for you?” summary as on the current site.[file:1]

### 6.8 `<FAQ id="faq" />`

Convert your existing FAQ questions into **collapsible accordions with full answers**.[file:1]

Questions (from current site):

1. How does CVLift work?
2. What is the 3-level customization?
3. Which job platforms does CVLift support?
4. What is ATS optimization?
5. Can I edit the generated resume?
6. What formats can I download?
7. How many templates are available?
8. Can I cancel my subscription anytime?
9. What happens after I use my free credits?
10. Is my data secure?[file:1]

Provide concise answers (2–4 sentences each), emphasizing:

- That CVLift parses job descriptions and tailors content dynamically.[file:1]
- The 3-level customization: High (more rewriting, great for freshers), Medium (balanced), Low (light tailoring, best for experienced pros).[file:1]
- Works with any public job URL (LinkedIn, Indeed, etc.).[file:1]
- ATS optimization = formatting and keyword structure that passes Applicant Tracking Systems.
- Users can edit the generated documents before downloading.
- All plans support PDF/DOCX/TXT.
- Subscription can be cancelled anytime via dashboard.
- Free credits lead to choosing a plan or pay-as-you-go.
- Data security basics (no public sharing, encrypted in transit, etc. – keep generic unless you have specific compliance).

### 6.9 `<FinalCTA />`

A strong closer section on a bold gradient background.

- Title: `Ready to land your next interview?`.[file:1]
- Subhead: `Use AI to customize your resume and cover letter for every job in minutes.`[file:1]
- CTA button:
  - Label: `Get Started Free`
  - URL: `https://app.cvlift.me/auth`.[file:1]
- Supporting text: `10 free resume generations • No credit card required`.[file:1]

### 6.10 `<Footer />`

Match the structure of your current footer but in a cleaner, static implementation.[file:1]

- Left:
  - Logo `CVLift`.
  - Text: `AI-powered resumes and cover letters`.[file:1]
  - Social icons:
    - Twitter → `https://twitter.com/cvlift`
    - LinkedIn → `https://linkedin.com/company/cvlift`.[file:1]

- Columns:
  - Product:
    - Features → `#features`
    - Pricing → `#pricing`
    - Help → `/help`.[file:1]
  - Legal:
    - Terms & Conditions → `/terms`
    - Privacy Policy → `/privacy`
    - Cancellation & Refunds → `/refunds`.[file:1]
  - Support:
    - Email (mailto link)
    - Help Center → `/help`.[file:1]

- Bottom bar:
  - Left: `© 2026 CVLift. All rights reserved.`.[file:1]
  - Right: `Built with Vite & React` (update from “Next.js” to reflect new stack).

---

## 7. Implementation Notes for the AI Code Agent

1. **Use semantic HTML** (`<header>`, `<main>`, `<section>`, `<footer>`).
2. Implement smooth scroll for anchor links.
3. Implement a small custom hook `useScrollReveal` (using `IntersectionObserver`) to add `opacity-0 translate-y-4` → `opacity-100 translate-y-0` transitions when sections enter viewport.
4. Ensure full **mobile-first responsiveness**:
   - Hero stacks vertically on small screens.
   - Pricing cards turn into horizontal scroll or vertical stack.
   - Navigation becomes hamburger menu.
5. Optimize for performance:
   - Use SVG icons (Lucide, Heroicons, or simple inline SVG).
   - Avoid heavy libraries beyond React, Tailwind, and optionally Framer Motion.
6. Keep all **URLs and CTAs exactly as listed above.** Do not introduce new flows.

This README describes everything needed for a full implementation of the new static CVLift landing page, ready to be generated and deployed by an AI coding agent.
```
# CVLift Frontend

Static marketing website for CVLift, an AI-powered resume and cover letter generator. This repository contains the public-facing landing pages, support page, and legal policy page used for the CVLift web presence.

## Overview

The site is a plain HTML, CSS, and JavaScript frontend with no build step. It is designed as a static website and is deployed through GitHub Pages.

Current public domain:

- `https://cvlift.me`

Primary product messaging on the site focuses on:

- AI-generated, ATS-optimized resumes
- Cover letter generation
- Job-specific resume customization from job posting URLs
- Credit-based pricing and subscription plans
- Support and legal information for users

## Pages

### `index.html`

Main landing page containing:

- Hero section with primary call to action
- Features section
- Free tools teaser section linking to the tools hub
- Pricing section with monthly and yearly toggle
- Pay-as-you-go pricing option
- Product statistics / trust metrics
- Benefits / service cards
- FAQ-style accordion section
- Testimonial slider
- Final call-to-action section
- Footer links to help and legal pages

### `help.html`

Support page containing:

- Contact email for support: `support@cvlift.me`
- Copy-to-clipboard email button
- Mailto action button
- FAQ accordion for common user questions

### `policy.html`

Legal page containing:

- Terms & Conditions
- Privacy Policy
- Cancellation & Refund Policy

### `tools.html`

Free tools hub containing:

- ATS score checker
- Resume scorecard
- Bullet rewriter
- LinkedIn headline generator
- Skills gap analyser
- Local usage gating modal and sticky conversion banner
- Frontend API integration point for a future Cloudflare Worker backend

## Tech Stack

This project uses a static frontend stack built around vendor CSS and JavaScript libraries.

### Core technologies

- HTML5
- CSS3
- JavaScript
- jQuery 3.6.0
- Bootstrap 5

### Frontend libraries included locally

- Bootstrap
- Slick Slider
- WOW.js
- GSAP
- ScrollTrigger
- SmoothScroll
- jQuery Parallax Scroll
- Animate.css
- Themify Icons

### External assets loaded from CDN

- Font Awesome 4.7.0
- Google Fonts used via CSS import in `css/style.css`

## Project Structure

```text
cvlift-frontend/
├── CNAME
├── index.html
├── help.html
├── policy.html
├── css/
│   ├── animate.css
│   ├── bootstrap.min.css
│   ├── font-awesome.min.css
│   ├── responsive.css
│   ├── slick-theme.css
│   ├── slick.css
│   ├── style.css
│   └── themify-icons.css
├── imgs/
├── js/
│   ├── bootstrap.min.js
│   ├── custom.js
│   ├── gsap.min.js
│   ├── jquery-3.6.0.min.js
│   ├── jquery.parallax-scroll.js
│   ├── popper.min.js
│   ├── ScrollTrigger.min.js
│   ├── slick.min.js
│   ├── SmoothScroll.js
│   ├── SplitText.js
│   └── wow.min.js
└── .github/
    └── workflows/
        └── static.yml
```

## Key Frontend Behavior

### Global behavior in `js/custom.js`

- Sticky navigation on scroll
- Mobile navigation dropdown handling
- Dynamic background colors/images via data attributes
- Slick testimonial sliders
- Accordion active-state behavior
- Tab switching and progress bar animation support
- GSAP-based feature scroll animation
- WOW.js reveal animation initialization

### Inline page-specific behavior

`index.html` includes a pricing toggle script that switches between monthly and yearly plan states.

`help.html` includes a small script to copy the support email address to the clipboard.

`tools.html` uses `js/tools.js` for tool switching, deep-linking via hash routes, local usage gating, and API calls to the external tools backend.

## Design and Styling

Styling is driven primarily by:

- `css/style.css` for main theme styles
- `css/responsive.css` for responsive adjustments
- Bootstrap utility and layout classes

The current visual direction is a dark SaaS-style marketing site with animated sections, sliders, and interactive pricing cards.

Tool-specific styling lives in `css/tools.css`.

## Local Development

There is no package manager, bundler, or build pipeline in this repository.

To preview locally, use any static file server. Examples:

### Option 1: VS Code Live Server

Open the project in VS Code and run a local live preview using a static server extension.

### Option 2: Python

If Python is installed:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 3: Node.js

If Node.js is installed:

```bash
npx serve .
```

## Deployment

Deployment is configured through GitHub Actions in `.github/workflows/static.yml`.

### Current deployment behavior

- Deploys on pushes to the `main` branch
- Supports manual execution through `workflow_dispatch`
- Uploads the repository root as the GitHub Pages artifact
- Publishes using the official GitHub Pages deployment actions

### Domain configuration

The `CNAME` file points the GitHub Pages deployment to:

- `cvlift.me`

## Free Tools Integration

The tools frontend is implemented in this repository, but live AI responses require a separate backend endpoint.

Expected API endpoint:

- `https://api.cvlift.me/tool`

Expected request shape:

```json
{
    "tool": "ats-checker",
    "input": {
        "jobTitle": "Senior Product Designer",
        "resumeText": "..."
    }
}
```

The static site is designed to fail gracefully until that endpoint exists.

## Content and Business Details Reflected in the Site

Based on the current page content, the site advertises:

- 10 free resume generations for new users
- Resume creation from pasted job posting URLs
- ATS-optimized templates
- Export formats including PDF, DOCX, and TXT
- Subscription tiers: Basic, Standard, Premium
- A pay-as-you-go credit model
- Support via `support@cvlift.me`

## Maintenance Notes

When editing this site, keep these points in mind:

- Asset paths are referenced directly from HTML, so file renames require manual updates.
- The site depends on vendor files committed into `css/` and `js/`.
- There is duplicated theme styling and third-party template code in `css/style.css` and `js/custom.js`, so changes should be tested across all pages.
- Pricing behavior is partly handled inline in `index.html`, not only in shared JavaScript.
- The favicon path is inconsistent between pages and may need cleanup if branding assets are reorganized.

## Recommended Improvements

- Add a proper favicon asset reference that is consistent across all pages
- Move inline scripts into dedicated JavaScript files for maintainability
- Add a real README section for branding, ownership, and change process if this repo is maintained by a team
- Audit unused vendor code from the original template to reduce payload size
- Add SEO and social sharing metadata if marketing performance matters

## License

No license file is currently present in this repository. If this project is intended for external use or collaboration, add an explicit license.
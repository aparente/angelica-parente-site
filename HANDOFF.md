# Angelica Parente Site - Development Log

## Site Overview
- **Owner**: Angelica Parente
- **Tagline**: "programming intelligence into immunity"
- **Live URL**: https://www.angelica-parente.com
- **Repo**: https://github.com/aparente/angelica-parente-site

## Current State (December 2024)

### Design System
- **Day/Night Theme**: Automatic based on Pacific timezone
  - Day: Light background, black nodes
  - Night: Dark background (#0a0a0f), red nodes (#b43c32), glowing red sun (Liu Guosong inspired)
- **Typography**: Inter font, uppercase headings, letter-spacing for elegance
- **Animation**: Neural network with flocking behavior and breathing motion

### Navigation Structure
```
Home
├── Being.html     → pages/Being.md
├── Thinking.html  → pages/Thinking.md
├── Fixating.html  → pages/Fixating.md
├── Research.html  → pages/research.md
├── Contact.html   → pages/contact.md
└── (hidden) life.html - Conway's Game of Life
```

### Content Management
All pages load markdown at runtime via `marked.js`:
- **Pages**: `public/pages/*.md`
- **Posts**: `public/posts/*.md` + `public/posts/index.json`

Edit markdown in Obsidian, push to deploy.

---

## Change Log

### 2024-12-27: Domain & Mobile Setup

**Custom Domain Configuration**
- Domain: www.angelica-parente.com (via Squarespace DNS)
- DNS: A records → GitHub Pages IPs, CNAME www → aparente.github.io
- HTTPS enforced
- Updated `vite.config.js` base from `/angelica-parente-site/` to `/`

**Mobile Responsive Styles**
- Added breakpoints at 768px and 600px
- Homepage: Scales h1, tagline, nav for smaller screens
- Nav wraps on mobile with reduced gaps
- Content pages: Adjusted padding, font sizes

**Network Animation Enhancement**
- Increased edge line weight: 0.5 → 1.5
- Increased edge opacity: 0.3 → 0.7
- Network connections now bold and visible

**Search Engine Blocking (temporary)**
- Added `robots.txt` blocking all crawlers
- Added `<meta name="robots" content="noindex, nofollow">` to index.html
- Remove when ready to launch publicly

### 2024-12-21: Site Structure Overhaul

**Page Restructure**
- Removed: Bio, Writing, Likes pages
- Added: Being, Thinking, Fixating pages
- All pages now load content from markdown files

**Markdown Runtime Rendering**
- Pages fetch from `public/pages/*.md`
- Posts fetch from `public/posts/*.md`
- Index managed via `public/posts/index.json`

**Contact Page**
- Email obfuscated via JavaScript (anti-spam)
- Links: Email, LinkedIn, Twitter/X

---

## Technical Details

### Build System
- Vite with vanilla JS
- Multi-page app (rollup inputs for each HTML file)
- Deploys via GitHub Actions to GitHub Pages

### Key Files
```
src/
├── main.js          # Canvas setup, animation loop, theme switching
├── style.css        # All styles including day/night themes
├── theme.js         # Pacific timezone day/night detection
└── dendrite/
    └── index.js     # Neural network animation (flocking + breathing)

public/
├── pages/           # Markdown content for pages
├── posts/           # Markdown blog posts + index.json
├── CNAME            # Custom domain config
├── robots.txt       # Search engine blocking
└── llms.txt         # LLM-readable site summary
```

### Animation Parameters (dendrite/index.js)
- Node count: 800
- Connection radius: 60px
- Edge line width: 1.5
- Edge opacity: alpha * 0.7
- Breathing: ±15% size oscillation, varied phases

---

## Page Naming Ideation (2025-01-08)

### Context
Angelica is a biotech operator + VC Operating Partner with a nontraditional background. The site should convey curiosity, playfulness, professionalism without being stuffy. Key tension: **legible** (has credentials) but **illegible** (path doesn't fit templates, accumulated oddly specific knowledge through a "directed random walk").

The neural network animation reflects how she thinks — "sees the whole graph at once."

### Content Categories Needed
1. **Who she is** — origin story, the path, identity
2. **Absorbing** — inputs (reading, listening, watching)
3. **Writing** — ideas, essays, sharing thoughts
4. **Obsessing** — fixations, music, art, things that should exist
5. **Building** — projects, companies

### Naming Options Explored

**Direction A: Lean into legible/illegible tension**
- Legible — the short version (credentials)
- Illegible — the real version (the weird path)
- Absorbing / Writing / Building

**Direction B: Signal/Noise metaphor**
- Source — origin
- Signal — inputs
- Noise — obsessions, tangents
- Output — building

**Direction C: Her language**
- The Graph — how she sees
- The Walk — the directed random path
- The Signal — inputs
- The Bet — what she's building

**Direction D: Simple gerunds**
- Source (breaks pattern, it's the foundation)
- Absorbing — inputs
- Writing — essays, ideas
- Obsessing — fixations
- Building — outputs

### Design Philosophy Note

**The Core Tension: Legible / Illegible**

Angelica exists in the tension between legible and illegible. Her CV has the credentials — the degrees, the roles, the companies. But her path doesn't fit templates. She was diagnosed by a patient advocate before a doctor. She relaxes by watching immunology talks. She's accumulated an "oddly specific set of knowledge, experience, and a network" through what she calls a "directed random walk through life."

The site should honor both. The legible version gets you in the door. The illegible version is why you stay.

**How She Thinks: The Whole Graph at Once**

Her ADHD brain defaults to seeing all the nodes and their connections simultaneously. This is literal — she thinks through model parameters, NPV calculations, regulatory pathways, patient journeys, and partnership dynamics as a connected system, not a checklist.

The neural network animation *is* how she thinks. It's not decoration. The nodes don't stay still. The connections form and dissolve. Patterns emerge from what looks like chaos. That's the inside of her head, rendered on screen.

**The Aesthetic: Subtlety, Not Shouting**

The neural network animation and ambient-alerts share the same design language: **information communicated through subtlety, not shouting**.

- Color shifts instead of alerts
- Breathing nodes instead of static dots
- Peripheral awareness instead of interruption
- Edges that strengthen and fade based on proximity

This is consistent across everything she builds. It's not minimalism for minimalism's sake — it's respect for attention. Information should be *available*, not *demanding*.

**Building as Translation**

Her definition of building generational companies: "turning the illegible into the legible." Making something only a few people can see visible to everyone else. The site itself should be that act — making *her* legible, on her own terms, to the right people.

**Finding Her Tribe**

The strongest trait she shares with the people she loves: "seeing what the world could be and funneling all of our stubbornness, curiosity, frustration, and hope into making it reality." The site should attract those people. It's not trying to appeal to everyone — it's a beacon for her tribe.

### Decision
TBD — nothing felt quite right yet. Needs to marinate.

---

## TODO / Future Work
- [ ] Finalize page naming structure
- [ ] Remove robots.txt and noindex when ready to launch
- [ ] Fill in page content
- [ ] Add actual blog posts
- [ ] Consider: favicon, Open Graph meta tags
